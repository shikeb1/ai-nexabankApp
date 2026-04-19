from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from models import TransactionType


# ─── Account Schemas ──────────────────────────────────────────────────────────

class AccountCreate(BaseModel):
    name:  str
    email: EmailStr
    initial_deposit: float = 0.0


class AccountResponse(BaseModel):
    id:         int
    name:       str
    email:      str
    balance:    float
    account_no: str
    created_at: datetime

    class Config:
        from_attributes = True


# ─── Transaction Schemas ──────────────────────────────────────────────────────

class DepositRequest(BaseModel):
    account_id:  int
    amount:      float
    description: Optional[str] = "Deposit"


class WithdrawRequest(BaseModel):
    account_id:  int
    amount:      float
    description: Optional[str] = "Withdrawal"


class TransferRequest(BaseModel):
    from_account_id: int
    to_account_id:   int
    amount:          float
    description:     Optional[str] = "Transfer"


class TransactionResponse(BaseModel):
    id:          int
    account_id:  int
    type:        TransactionType
    amount:      float
    description: str
    created_at:  datetime

    class Config:
        from_attributes = True


# ─── AI Advisor Schemas ───────────────────────────────────────────────────────

class AIQuery(BaseModel):
    account_id: int
    question:   str


class AIResponse(BaseModel):
    answer:     str
    model_used: str
