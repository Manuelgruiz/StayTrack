from fastapi import FastAPI
from .db import Base, engine
from .router_foods import router as foods_router
from .router_exercises import router as exercises_router

app = FastAPI(title="Tracker Service")

@app.on_event("startup")
def init_db():
    Base.metadata.create_all(bind=engine)

@app.get("/health")
def health():
    return {"status": "ok", "service": "tracker"}

app.include_router(foods_router)
app.include_router(exercises_router)
