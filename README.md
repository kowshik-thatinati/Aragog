# 🧠 ARAGOG — Medical RAG Assistant

ARAGOG is a domain-restricted AI system that answers **only medical queries** using Retrieval-Augmented Generation (RAG).

It combines hybrid retrieval (FAISS + BM25), cross-encoder reranking, and semantic relevance filtering to ensure accurate, context-grounded responses while preventing hallucinations outside the medical domain.

---

## 🎯 Why This Project

Traditional chatbots often hallucinate or answer unrelated queries.

ARAGOG addresses this by:
- Restricting answers strictly to a curated medical dataset
- Using semantic similarity to validate relevance
- Rejecting non-medical or unsupported queries

This makes the system more reliable for domain-specific use cases.

---

## 🚀 Features

- User authentication (Signup/Login with MongoDB)
- Secure password hashing (bcrypt)
- Medical-only chatbot using RAG
- Hybrid retrieval:
  - FAISS (semantic search)
  - BM25 (keyword search)
- Cross-encoder reranking for improved relevance
- Semantic filtering to block non-medical queries
- Clean React-based chat interface with loading states

---

## 🧠 System Architecture

User Query  
→ FAISS (semantic search) + BM25 (keyword search)  
→ Candidate Merge  
→ Cross-Encoder Reranking  
→ Semantic Relevance Check  
→ Groq LLM Response  

If relevance score is low → system rejects the query.

---

## ⚡ Engineering Highlights

- Hybrid retrieval improves recall over single-method search
- Cross-encoder reranking improves answer precision
- Semantic filtering reduces hallucinations
- Lazy model loading improves startup performance

---

## 🧪 Example Queries

### ✅ Valid
- What is acne?
- Symptoms of psoriasis
- Causes of heart attack

### ❌ Rejected
- Who is Bahubali?
- What is the Arabian Sea?
- How to fix a laptop?

Non-medical queries are blocked using semantic filtering.

---

## 🏗️ Tech Stack

### Backend
- Python
- FastAPI
- Uvicorn
- PyMongo
- bcrypt
- sentence-transformers
- FAISS
- rank-bm25
- Groq API

### Frontend
- React
- Vite
- JavaScript (JSX)

### Data
- MongoDB Atlas
- Precomputed FAISS index and chunk dataset

---

## 📂 Project Structure

```text
xyz/
│
├── backend/
│ ├── __init__.py
│ ├── auth.py
│ ├── rag_pipeline.py
│ ├── data/
│ │ ├── chunks.json
│ │ ├── chunks_structured.json
│ │ └── faiss_index.index
│
├── frontend/
│ ├── package.json
│ ├── vite.config.js
│ ├── index.html
│ └── src/
│ ├── App.jsx
│ ├── main.jsx
│ ├── context/
│ └── components/
│
├── main.py
├── requirements.txt
├── .env
└── README.md
```

---

## 📦 Included Assets

- FAISS index (~30MB)
- Processed chunks dataset (~22MB)

These are included so the project runs instantly without preprocessing.

---

## ⚙️ Prerequisites

- Python 3.10+
- Node.js 18+
- MongoDB Atlas account
- Groq API key

---

## 🔑 Environment Variables

Create a `.env` file:

```env
MONGO_URI=your_mongodb_connection_string
GROQ_API_KEY=your_groq_api_key
```


⚠️ Do NOT commit `.env`

---

## 📥 Installation

### Backend

```bash
pip install -r requirements.txt
```


### Frontend

```bash
cd frontend
npm install
```


---

## ▶️ Running the Application

Open two terminals.

### Terminal 1 — Backend

```bash
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```


Backend: http://127.0.0.1:8000

---

### Terminal 2 — Frontend

```bash
cd frontend
npm run dev
```


Frontend URL will be shown (usually http://localhost:5173)

---

## 🔌 API Endpoints

### GET `/health`

```json
{
"status": "ok",
"message": "Backend is running"
}

```


---

### POST `/signup`

```json
{
"email": "user@example.com",
"username": "user1",
"password": "password"
}

```


---

### POST `/login`

```json
{
"email": "user@example.com",
"password": "password"
}

```


---

### POST `/chat`

```json
{
"message": "What is hypertension?"
}

```


Response:

```json
{
"response": {
"question": "What is hypertension?",
"answer": "...",
"similarity_score": 0.81
}
}

```


---

## 🛠️ Troubleshooting

### Backend not starting
- Check Python version and dependencies
- Verify `.env` variables
- Ensure port 8000 is free

### MongoDB issues
- Check Atlas network access
- Verify connection string

### Chat not working
- Ensure FAISS and chunks exist in `/backend/data`
- Check backend logs

### Frontend cannot connect
- Verify backend URL
- Check CORS settings

---

## 🚀 Future Improvements

- Fix chat persistence (state reset issue)
- Improve routing (duplicate home page)
- Add JWT/session-based authentication
- Deploy backend and frontend
- Add logging, monitoring, and testing

---

## 📌 Final Note

This project demonstrates a **production-style RAG system** with domain restriction and semantic validation, focusing on reducing hallucinations and improving answer reliability.
