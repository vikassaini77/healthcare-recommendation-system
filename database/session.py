from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy.pool import QueuePool
import os
from dotenv import load_dotenv

load_dotenv()

# We expect a DATABASE_URL in .env (e.g., postgresql://user:password@localhost:5432/healthcare)
# Fallback to sqlite for initial testing if no URL is provided, to prevent crashes
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./healthcare.db")

# For SQLite, we need connect_args={"check_same_thread": False}
connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine_args = {}
if not DATABASE_URL.startswith("sqlite"):
    engine_args["poolclass"] = QueuePool
    engine_args["pool_size"] = 5
    engine_args["max_overflow"] = 10

engine = create_engine(
    DATABASE_URL, 
    connect_args=connect_args,
    **engine_args
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
