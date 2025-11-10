from fastapi import FastAPI
from .db import Base, engine
from .router import router

app = FastAPI(title="Auth Service")

@app.on_event("startup")
def init_db():
    Base.metadata.create_all(bind=engine)

@app.get("/health")
def health(): return {"status":"ok","service":"auth"}

app.include_router(router)
