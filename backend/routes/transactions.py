from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Account, Transaction, TransactionType
from schemas import (
    DepositRequest, WithdrawRequest, TransferRequest,
    TransactionResponse
)

router = APIRouter()


@router.post("/deposit", response_model=TransactionResponse)
def deposit(payload: DepositRequest, db: Session = Depends(get_db)):
    account = db.query(Account).filter(Account.id == payload.account_id).first()
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    if payload.amount <= 0:
        raise HTTPException(status_code=400, detail="Amount must be positive")

    account.balance += payload.amount
    txn = Transaction(
        account_id  = payload.account_id,
        type        = TransactionType.DEPOSIT,
        amount      = payload.amount,
        description = payload.description,
    )
    db.add(txn)
    db.commit()
    db.refresh(txn)
    return txn


@router.post("/withdraw", response_model=TransactionResponse)
def withdraw(payload: WithdrawRequest, db: Session = Depends(get_db)):
    account = db.query(Account).filter(Account.id == payload.account_id).first()
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    if payload.amount <= 0:
        raise HTTPException(status_code=400, detail="Amount must be positive")
    if account.balance < payload.amount:
        raise HTTPException(status_code=400, detail="Insufficient funds")

    account.balance -= payload.amount
    txn = Transaction(
        account_id  = payload.account_id,
        type        = TransactionType.WITHDRAWAL,
        amount      = payload.amount,
        description = payload.description,
    )
    db.add(txn)
    db.commit()
    db.refresh(txn)
    return txn


@router.post("/transfer", response_model=TransactionResponse)
def transfer(payload: TransferRequest, db: Session = Depends(get_db)):
    sender   = db.query(Account).filter(Account.id == payload.from_account_id).first()
    receiver = db.query(Account).filter(Account.id == payload.to_account_id).first()

    if not sender:
        raise HTTPException(status_code=404, detail="Sender account not found")
    if not receiver:
        raise HTTPException(status_code=404, detail="Receiver account not found")
    if payload.amount <= 0:
        raise HTTPException(status_code=400, detail="Amount must be positive")
    if sender.balance < payload.amount:
        raise HTTPException(status_code=400, detail="Insufficient funds")

    sender.balance   -= payload.amount
    receiver.balance += payload.amount

    txn = Transaction(
        account_id  = payload.from_account_id,
        type        = TransactionType.TRANSFER,
        amount      = payload.amount,
        description = f"Transfer to account #{payload.to_account_id}: {payload.description}",
    )
    db.add(txn)
    db.commit()
    db.refresh(txn)
    return txn


@router.get("/{account_id}", response_model=list[TransactionResponse])
def get_transactions(account_id: int, db: Session = Depends(get_db)):
    account = db.query(Account).filter(Account.id == account_id).first()
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    return (
        db.query(Transaction)
        .filter(Transaction.account_id == account_id)
        .order_by(Transaction.created_at.desc())
        .all()
    )
