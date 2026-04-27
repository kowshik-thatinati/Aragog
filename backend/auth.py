import os
from pymongo import MongoClient
from pymongo.errors import PyMongoError
from bcrypt import hashpw, checkpw, gensalt
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
if not MONGO_URI:
    raise ValueError("MONGO_URI environment variable not set")

# Initialize MongoDB connection lazily
_client = None
_db = None
_users_collection = None

def get_db():
    global _client, _db, _users_collection
    
    if _client is None:
        try:
            print("Connecting to MongoDB...")
            _client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000, connectTimeoutMS=5000)
            _client.admin.command('ping')
            _db = _client.get_default_database()
            _users_collection = _db["users"]
            print("✓ MongoDB connected successfully")
        except PyMongoError as e:
            print(f"✗ MongoDB connection failed: {e}")
            _client = None
            raise ValueError(f"Database connection error: {str(e)}")
        except Exception as e:
            print(f"✗ Unexpected error: {e}")
            _client = None
            raise ValueError("An error occurred connecting to the database")
    
    return _users_collection

def hash_password(password: str) -> str:
    """Hash a password using bcrypt"""
    salt = gensalt()
    return hashpw(password.encode('utf-8'), salt).decode('utf-8')

def verify_password(password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    return checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))

def signup_user(email: str, username: str, password: str) -> dict:
    """Register a new user"""
    try:
        if not email or not username or not password:
            raise ValueError("Email, username, and password are required")
        
        users_collection = get_db()
        
        # Check if user already exists
        existing_user = users_collection.find_one({"email": email})
        if existing_user:
            raise ValueError("Email already registered")
        
        # Hash password
        hashed_password = hash_password(password)
        
        # Insert user
        user_doc = {
            "email": email,
            "username": username,
            "password": hashed_password
        }
        result = users_collection.insert_one(user_doc)
        
        return {
            "success": True,
            "message": "User registered successfully",
            "user_id": str(result.inserted_id)
        }
    except ValueError as e:
        raise e
    except Exception as e:
        raise ValueError(f"Signup failed: {str(e)}")

def login_user(email: str, password: str) -> dict:
    """Authenticate a user"""
    try:
        if not email or not password:
            raise ValueError("Email and password are required")
        
        users_collection = get_db()
        
        # Find user
        user = users_collection.find_one({"email": email})
        if not user:
            raise ValueError("Invalid email or password")
        
        # Verify password
        if not verify_password(password, user["password"]):
            raise ValueError("Invalid email or password")
        
        return {
            "success": True,
            "message": "Login successful",
            "user": {
                "email": user["email"],
                "username": user["username"]
            }
        }
    except ValueError as e:
        raise e
    except Exception as e:
        raise ValueError(f"Login failed: {str(e)}")
