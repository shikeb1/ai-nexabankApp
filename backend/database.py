from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# SQLite for local dev — in production (K8s), swap to PostgreSQL via env var
DATABASE_URL = "sqlite:///./nexabank.db"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}  # SQLite-specific
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


# Dependency — inject DB session into route functions
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
