# ARAGOG - Medical RAG Assistant

ARAGOG is a full-stack medical question-answering application that combines:
- a FastAPI backend for authentication and chat APIs,
- a React + Vite frontend for the user interface,
- a Retrieval-Augmented Generation (RAG) pipeline using FAISS, BM25, reranking, and Groq LLM responses.

The system is designed to answer medical queries from a curated knowledge base and includes user signup/login with MongoDB.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [RAG Pipeline Flow](#rag-pipeline-flow)
- [Frontend Notes](#frontend-notes)
- [Troubleshooting](#troubleshooting)
- [Production Recommendations](#production-recommendations)

## Features
- User registration and login with MongoDB
- Password hashing with bcrypt
- Medical chat endpoint powered by RAG
- Hybrid retrieval:
  - FAISS dense retrieval
  - BM25 lexical retrieval
- Cross-encoder reranking for relevance
- Context relevance filtering before generation
- Frontend chat experience with loading-state animation and stage indicators

## Tech Stack

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

### Data and Services
- MongoDB Atlas
- Local FAISS index and chunk dataset

## Project Structure

```text
xyz/
|-- backend/
|   |-- __init__.py
|   |-- auth.py
|   |-- rag_pipeline.py
|   `-- data/
|       |-- chunks.json
|       `-- faiss_index.index
|-- frontend/
|   |-- package.json
|   |-- vite.config.js
|   |-- index.html
|   `-- src/
|       |-- App.jsx
|       |-- main.jsx
|       |-- context/
|       `-- components/
|-- main.py
|-- requirements.txt
|-- .env
`-- README.md
```

## Prerequisites
- Python 3.10+
- Node.js 18+ and npm
- MongoDB Atlas connection string
- Groq API key

## Environment Variables
Create a `.env` file in the project root:

```env
MONGO_URI=your_mongodb_connection_string
GROQ_API_KEY=your_groq_api_key
```

Notes:
- Do not commit `.env` to version control.
- Keep secrets private and rotate keys if exposed.

## Installation

### 1) Backend dependencies

```bash
pip install -r requirements.txt
```

### 2) Frontend dependencies

```bash
cd frontend
npm install
```

## Running the Application

Open two terminals.

### Terminal 1 - Backend
From the project root:

```bash
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

Backend URL: `http://127.0.0.1:8000`

### Terminal 2 - Frontend
From `frontend`:

```bash
npm run dev
```

Frontend URL is printed by Vite (commonly `http://localhost:5173` or next available port).

## API Endpoints

Base URL: `http://127.0.0.1:8000`

### GET `/health`
Health check endpoint.

Response example:

```json
{
  "status": "ok",
  "message": "Backend is running"
}
```

### POST `/signup`
Register a new user.

Request body:

```json
{
  "email": "user@example.com",
  "username": "user1",
  "password": "your_password"
}
```

### POST `/login`
Authenticate user.

Request body:

```json
{
  "email": "user@example.com",
  "password": "your_password"
}
```

### POST `/chat`
Ask a medical question.

Request body:

```json
{
  "message": "What is hypertension?"
}
```

Response shape:

```json
{
  "response": {
    "question": "What is hypertension?",
    "answer": "...",
    "similarity_score": 0.81
  }
}
```

## RAG Pipeline Flow
1. Receive user query from `/chat`.
2. Retrieve candidates using:
   - FAISS semantic search
   - BM25 keyword search
3. Merge and deduplicate candidates.
4. Rerank candidates with cross-encoder.
5. Build compact context from top chunks.
6. Run context relevance check.
7. Generate final answer with Groq model.

## Frontend Notes
- Frontend authentication state is managed in React context.
- Chat UI shows a loading state with stage transitions.
- Backend communication is performed via `fetch` to `http://127.0.0.1:8000`.

## Troubleshooting

### Backend does not start
- Confirm Python environment and dependencies are installed.
- Ensure `MONGO_URI` and `GROQ_API_KEY` exist in `.env`.
- Check whether port 8000 is already in use.

### Login or signup fails
- Verify MongoDB Atlas IP/network access settings.
- Confirm database credentials in `MONGO_URI` are correct.

### Chat request fails
- Confirm backend is running and reachable.
- Verify `backend/data/chunks.json` and `backend/data/faiss_index.index` exist.
- Check terminal logs for traceback details.

### Frontend cannot connect to backend
- Verify backend URL is `http://127.0.0.1:8000`.
- Confirm CORS middleware is active in backend.

## Production Recommendations
- Use JWT/session-based auth instead of local-only state.
- Restrict CORS to known frontend origins.
- Add request validation and rate limiting.
- Add structured logging and monitoring.
- Containerize backend/frontend with Docker.
- Add unit/integration tests and CI pipeline.

---

If you want, I can also generate:
- a production-grade `.gitignore`,
- backend and frontend run scripts,
- a deployment README section for Render/Vercel/Railway.
