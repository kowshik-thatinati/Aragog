import faiss
import json
import numpy as np
import os
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer, CrossEncoder
from rank_bm25 import BM25Okapi
from groq import Groq

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")

# -----------------------------
# ENV SETUP
# -----------------------------
load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not GROQ_API_KEY:
    raise ValueError("GROQ_API_KEY missing")

# -----------------------------
# GLOBALS (LAZY LOAD)
# -----------------------------
embed_model = None
reranker = None
client = None
index = None
chunks = None
bm25 = None
_initialized = False

# -----------------------------
# INITIALIZATION
# -----------------------------
def initialize_models():
    global embed_model, reranker, client, index, chunks, bm25, _initialized

    if _initialized:
        return

    print("🚀 Initializing RAG system...")

    embed_model = SentenceTransformer("all-MiniLM-L6-v2")
    reranker = CrossEncoder("cross-encoder/ms-marco-MiniLM-L-6-v2")
    client = Groq(api_key=GROQ_API_KEY)

    index = faiss.read_index(os.path.join(DATA_DIR, "faiss_index.index"))

    with open(os.path.join(DATA_DIR, "chunks_structured.json"), "r", encoding="utf-8") as f:
        chunks = json.load(f)

    tokenized_chunks = [chunk.lower().split() for chunk in chunks]
    bm25 = BM25Okapi(tokenized_chunks)

    _initialized = True
    print("✅ System ready")

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
    combined = list(dict.fromkeys(faiss_results + bm25_results))
    return combined

# -----------------------------
# RERANK
# -----------------------------
def rerank(query, candidates, top_n=5):
    pairs = [(query, doc) for doc in candidates]
    scores = reranker.predict(pairs)
    ranked = sorted(zip(candidates, scores), key=lambda x: x[1], reverse=True)
    return [doc for doc, _ in ranked[:top_n]]

# -----------------------------
# SEMANTIC RELEVANCE CHECK 🔥
def is_relevant_context(query, docs, threshold=0.45):
    try:
        if not docs or len(docs) == 0:
            return False, 0.0
        
        query_emb = embed_model.encode(query)
        doc_embs = embed_model.encode(docs)

        if len(doc_embs.shape) == 1:
            doc_embs = doc_embs.reshape(1, -1)

        scores = np.dot(doc_embs, query_emb) / (
            np.linalg.norm(doc_embs, axis=1) * np.linalg.norm(query_emb)
        )

        max_score = np.max(scores)

        return max_score >= threshold, float(max_score)
    except Exception as e:
        print(f"Relevance check error: {e}")
        return True, 0.5

# -----------------------------
# FINAL CONTEXT
# -----------------------------
def retrieve_context(query):
    candidates = retrieve_candidates(query)
    top_docs = rerank(query, candidates, top_n=5)

    unique_docs = list(dict.fromkeys(top_docs))

    cleaned_docs = [clean_text(doc)[:400] for doc in unique_docs[:3]]

    return cleaned_docs  # list

# -----------------------------
# GENERATION
# -----------------------------
def generate_answer(query):
    initialize_models()

    docs = retrieve_context(query)

    # 🔥 RELEVANCE FILTER
    is_relevant, score = is_relevant_context(query, docs)

    if not is_relevant:
        return {
            "question": query,
            "similarity_score": float(score),
            "context_used": None,
            "answer": "I can only answer medical-related questions based on my knowledge base."
        }

    context = "\n\n".join(docs)

    prompt = f"""You are a medical expert AI.

Rules:
- Answer ONLY using the given context
- Do NOT use outside knowledge
- If answer not in context → say "I don't know"
- Keep it clear and 2–3 sentences

Context:
{context}

Question:
{query}

Answer:
"""

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "system", "content": "You answer strictly from medical context."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.2
    )

    return {
        "question": query,
        "similarity_score": float(score),
        "context_used": context,
        "answer": response.choices[0].message.content
    }