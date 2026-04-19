from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Account
from schemas import AccountCreate, AccountResponse
import random
import string

router = APIRouter()


def generate_account_no():
    """Generate a random 10-digit account number"""
    return "NX" + "".join(random.choices(string.digits, k=10))


@router.post("/", response_model=AccountResponse)
def create_account(payload: AccountCreate, db: Session = Depends(get_db)):
    # Check duplicate email
    existing = db.query(Account).filter(Account.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    account = Account(
        name       = payload.name,
        email      = payload.email,
        balance    = payload.initial_deposit,
        account_no = generate_account_no(),
    )
    db.add(account)
    db.commit()
    db.refresh(account)
    return account


@router.get("/{account_id}", response_model=AccountResponse)
def get_account(account_id: int, db: Session = Depends(get_db)):
    account = db.query(Account).filter(Account.id == account_id).first()
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    return account


@router.get("/", response_model=list[AccountResponse])
def list_accounts(db: Session = Depends(get_db)):
    return db.query(Account).all()
