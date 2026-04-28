import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routes import accounts, transactions, ai_advisor

# Create all tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="NexaBank AI API",
    description="AI-Powered Banking Backend — built to learn DevSecOps",
    version="1.0.0"
)

# CORS — allow all localhost ports so frontend works on any mapped port
# FRONTEND_URL env var is injected by Kubernetes ConfigMap
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:8088")

allowed_origins = [
    "http://localhost:3000",
    "http://localhost:8000",
    "http://localhost:8080",
    "http://localhost:8088",
    FRONTEND_URL,
]
# Deduplicate
allowed_origins = list(set(allowed_origins))

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
