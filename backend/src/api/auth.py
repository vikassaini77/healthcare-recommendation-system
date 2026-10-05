from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import secrets

router = APIRouter(prefix="/auth", tags=["Auth"])

# In-memory "Database" for presentation purposes
users_db = {}

class SignupRequest(BaseModel):
    full_name: str
    email: str
    password: str
    role: str

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/signup")
def signup(user: SignupRequest):
    if user.email in users_db:
        raise HTTPException(status_code=400, detail="User already exists")
    
    users_db[user.email] = {
        "full_name": user.full_name,
        "password": user.password, # Plain text for presentation mock
        "role": user.role
    }
    return {"message": "Account created successfully."}

@router.post("/login")
def login(user: LoginRequest):
    if user.email not in users_db:
        raise HTTPException(status_code=401, detail="Invalid credentials")
        
    if users_db[user.email]["password"] != user.password:
        raise HTTPException(status_code=401, detail="Invalid credentials")
        
    # Generate mock JWT token
    token = secrets.token_hex(32)
    return {"access_token": token, "token_type": "bearer"}
