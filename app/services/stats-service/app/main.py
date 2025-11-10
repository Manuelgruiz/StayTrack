from fastapi import FastAPI
from .router import router

app = FastAPI(title="Stats Service")

@app.get("/health")
def health(): return {"status":"ok","service":"stats"}

app.include_router(router)
