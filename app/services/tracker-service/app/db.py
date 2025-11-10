from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
import os
from dotenv import load_dotenv

load_dotenv()

def _build_url() -> str:
    host = os.getenv("DB_HOST", "localhost")
    port = os.getenv("DB_PORT", "5432")
    user = os.getenv("DB_USER", "master")
    pwd  = os.getenv("DB_PASSWORD", "master")
    name = os.getenv("DB_NAME", "staytrack_db")
    return f"postgresql+psycopg://{user}:{pwd}@{host}:{port}/{name}"

DATABASE_URL = os.getenv("TRACKER_DATABASE_URL") or _build_url()

class Base(DeclarativeBase):
    pass

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    future=True,
)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
