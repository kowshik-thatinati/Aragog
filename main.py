from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from backend.rag_pipeline import generate_answer
from backend.auth import signup_user, login_user
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# Enable CORS for frontend communication
frontend_url = os.getenv("FRONTEND_URL", "*")
origins = [frontend_url] if frontend_url != "*" else ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Aragog API is live!"}

class Query(BaseModel):
    message: str

class SignupRequest(BaseModel):
    email: str
    username: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

@app.get("/health")
def health():
    return {"status": "ok", "message": "Backend is running"}

@app.post("/signup")
def signup(request: SignupRequest):
    try:
        result = signup_user(request.email, request.username, request.password)
        return result
    except ValueError as e:
        return {"success": False, "error": str(e)}
    except Exception as e:
        print(f"Signup error: {str(e)}")
        return {"success": False, "error": "An error occurred during signup"}

@app.post("/login")
def login(request: LoginRequest):
    try:
        result = login_user(request.email, request.password)
        return result
    except ValueError as e:
        return {"success": False, "error": str(e)}
    except Exception as e:
        print(f"Login error: {str(e)}")
        return {"success": False, "error": "An error occurred during login"}

@app.post("/chat")
def chat(query: Query):
    try:
        print(f"Processing query: {query.message}")
        result = generate_answer(query.message)
        
        # Ensure proper JSON serialization
        return {
            "response": {
                "question": str(result.get("question", "")),
                "answer": str(result.get("answer", "")),
                "similarity_score": float(result.get("similarity_score", 0.0))
            }
        }
    except Exception as e:
        print(f"Chat error: {str(e)}")
        import traceback
        traceback.print_exc()
        return {
            "response": {
                "question": query.message,
                "answer": f"Error: {str(e)}",
                "similarity_score": 0.0
            }
        }