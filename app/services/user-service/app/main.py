from fastapi import FastAPI
from .db import Base, engine
from .router import router

app = FastAPI(title="User Service")

@app.on_event("startup")
def init_db():
    Base.metadata.create_all(bind=engine)  # Alembic en prod

@app.get("/health")
def health():
    return {"status": "ok", "service": "users"}

app.include_router(router)
