from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routes import accounts, transactions, ai_advisor

# Create all tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="NexaBank AI API",
    description="AI-Powered Banking Backend — built to learn DevSecOps",
    version="1.0.0"
)

import os

# CORS — allows React frontend to talk to this backend
allowed_origins = [
    "http://localhost:3000",
    "http://localhost:8000",
    os.getenv("FRONTEND_URL", "http://localhost:8000")
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register route modules
app.include_router(accounts.router,     prefix="/api/accounts",     tags=["Accounts"])
app.include_router(transactions.router, prefix="/api/transactions",  tags=["Transactions"])
app.include_router(ai_advisor.router,   prefix="/api/ai",            tags=["AI Advisor"])


@app.get("/")
def root():
    return {"message": "NexaBank AI is running 🚀", "version": "1.0.0"}


@app.get("/health")
def health():
    """Health check endpoint — used by Docker, K8s liveness probes"""
    return {"status": "healthy", "service": "nexabank-backend"}
