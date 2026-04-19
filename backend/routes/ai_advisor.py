from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Account, Transaction
from schemas import AIQuery, AIResponse
import httpx
import json

router = APIRouter()

OLLAMA_URL   = "http://localhost:11434/api/generate"
OLLAMA_MODEL = "nexabot"   # Using the custom light-weight agent defined in our Ollama Dockerfile


def build_prompt(account: Account, transactions: list, question: str) -> str:
    """Build a context-aware prompt with user's financial data"""
    recent = transactions[:5]
    history_text = "\n".join(
        f"  - {t.type.value}: ₹{t.amount:.2f} on {t.created_at.strftime('%b %d')} ({t.description})"
        for t in recent
    ) or "  No recent transactions."

    return f"""You are NexaBank AI — a friendly, smart financial advisor.
The customer's data:
  Name:    {account.name}
  Balance: ₹{account.balance:.2f}
  Recent Transactions:
{history_text}

Customer Question: {question}

Give a concise, helpful, and actionable financial answer in 3-4 sentences.
Do NOT make up numbers. Only reference the data given above."""


@router.post("/ask", response_model=AIResponse)
async def ask_ai(payload: AIQuery, db: Session = Depends(get_db)):
    account = db.query(Account).filter(Account.id == payload.account_id).first()
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")

    transactions = (
        db.query(Transaction)
        .filter(Transaction.account_id == payload.account_id)
        .order_by(Transaction.created_at.desc())
        .limit(10)
        .all()
    )

    prompt = build_prompt(account, transactions, payload.question)

    # Try Ollama first — fallback to smart mock if Ollama not running
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                OLLAMA_URL,
                json={"model": OLLAMA_MODEL, "prompt": prompt, "stream": False}
            )
            data = response.json()
            return AIResponse(
                answer     = data.get("response", "No response from model."),
                model_used = OLLAMA_MODEL
            )
    except Exception:
        # Fallback: rule-based mock response when Ollama is not running
        balance = account.balance
        if "save" in payload.question.lower() or "saving" in payload.question.lower():
            answer = (
                f"Based on your current balance of ₹{balance:.2f}, I recommend setting aside "
                f"at least 20% (₹{balance * 0.2:.2f}) in a savings account. "
                f"This follows the 50/30/20 rule — 50% needs, 30% wants, 20% savings. "
                f"Consider automating this transfer on your salary date."
            )
        elif "spend" in payload.question.lower() or "budget" in payload.question.lower():
            answer = (
                f"Your balance is ₹{balance:.2f}. For healthy budgeting, cap discretionary "
                f"spending at ₹{balance * 0.3:.2f} this month. "
                f"Review your last {len(transactions)} transactions to identify patterns. "
                f"Start with tracking your top 3 spending categories."
            )
        elif "invest" in payload.question.lower():
            answer = (
                f"With ₹{balance:.2f} available, you could start with index funds or SIPs "
                f"with as little as ₹500/month. Ensure you have 3-6 months of emergency fund "
                f"(₹{balance * 0.3:.2f}) before investing. Start with low-risk instruments."
            )
        else:
            answer = (
                f"Hello {account.name}! Your current balance is ₹{balance:.2f}. "
                f"I'm here to help with budgeting, saving, and investment queries. "
                f"Ask me anything about managing your finances! "
                f"(Note: Connect Ollama locally for full AI responses.)"
            )
        return AIResponse(answer=answer, model_used="nexabank-fallback-v1")
