from fastapi import FastAPI
from .routers import users, foods, exercises
from .database import Base, engine

Base.metadata.create_all(bind=engine)

app = FastAPI(title="StayTrack API", version="0.1.0")

app.include_router(users.router)
app.include_router(foods.router)
app.include_router(exercises.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to StayTrack!"}

@app.get("/health")
def health_check():
    return {"status": "ok"}
