import faiss
import json
import numpy as np
import os
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer, CrossEncoder
from rank_bm25 import BM25Okapi
from groq import Groq

# -----------------------------
# ENV
# -----------------------------
load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not GROQ_API_KEY:
    raise ValueError("GROQ_API_KEY missing")

# -----------------------------
# MODELS
# -----------------------------
embed_model = SentenceTransformer("all-MiniLM-L6-v2")
reranker = CrossEncoder("cross-encoder/ms-marco-MiniLM-L-6-v2")
client = Groq(api_key=GROQ_API_KEY)

# -----------------------------
# LOAD DATA
# -----------------------------
index = faiss.read_index("faiss_index.index")

with open("chunks_structured.json", "r", encoding="utf-8") as f:
    chunks = json.load(f)

# -----------------------------
# BM25 SETUP
# -----------------------------
tokenized_chunks = [chunk.lower().split() for chunk in chunks]
bm25 = BM25Okapi(tokenized_chunks)

# -----------------------------
# CLEAN TEXT
# -----------------------------
def clean_text(text):
    lines = text.split("\n")
    cleaned = []

    for line in lines:
        line = line.strip()

        if line.lower().startswith("question"):
            continue

        if "Answer:" in line:
            line = line.replace("Answer:", "").strip()

        if line:
            cleaned.append(line)

    return " ".join(cleaned)

# -----------------------------
# FAISS SEARCH
# -----------------------------
def faiss_search(query, k=10):
    query_embedding = embed_model.encode([query]).astype("float32")
    _, indices = index.search(query_embedding, k)

    return [chunks[i] for i in indices[0] if i < len(chunks)]

# -----------------------------
# BM25 SEARCH
# -----------------------------
def bm25_search(query, k=10):
    tokenized_query = query.lower().split()
    scores = bm25.get_scores(tokenized_query)

    top_indices = np.argsort(scores)[::-1][:k]

    return [chunks[i] for i in top_indices]

# -----------------------------
# HYBRID RETRIEVAL
# -----------------------------
def retrieve_candidates(query):
    faiss_results = faiss_search(query, k=10)
    bm25_results = bm25_search(query, k=10)

    # merge + remove duplicates
    combined = list(dict.fromkeys(faiss_results + bm25_results))

    return combined

# -----------------------------
# RERANK
# -----------------------------
def rerank(query, candidates, top_n=3):
    pairs = [(query, doc) for doc in candidates]
    scores = reranker.predict(pairs)

    ranked = sorted(zip(candidates, scores), key=lambda x: x[1], reverse=True)

    return [doc for doc, _ in ranked[:top_n]]

# -----------------------------
# FINAL CONTEXT
# -----------------------------
def retrieve_context(query):
    candidates = retrieve_candidates(query)
    top_docs = rerank(query, candidates, top_n=5)

    # remove duplicates again
    unique_docs = list(dict.fromkeys(top_docs))

    cleaned_docs = [clean_text(doc)[:400] for doc in unique_docs[:3]]

    return "\n\n".join(cleaned_docs)

# -----------------------------
# GENERATION
# -----------------------------
def generate_answer(query):

    context = retrieve_context(query)

    prompt = f"""
You are a medical expert.

Using the context below, answer the question in your own words.

Rules:
- Do NOT copy sentences from the context
- Combine information if multiple parts are relevant
- Keep answer clear and concise (2–3 sentences)
- If not found, say: "I don't know"

Context:
{context}

Question:
{query}

Answer:
"""

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "system", "content": "You are a precise and professional medical assistant."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.3
    )

    return {
        "question": query,
        "context_used": context,
        "answer": response.choices[0].message.content
    }