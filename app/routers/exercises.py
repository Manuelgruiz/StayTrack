from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .. import schemas, crud
from ..database import get_db

router = APIRouter(prefix="/users/{user_id}/exercises", tags=["exercises"])

@router.post("/", response_model=schemas.ExerciseLog)
def add_exercise(user_id: int, exercise: schemas.ExerciseLogCreate, db: Session = Depends(get_db)):
    return crud.add_exercise(db, user_id, exercise)

@router.get("/", response_model=list[schemas.ExerciseLog])
def list_exercises(user_id: int, db: Session = Depends(get_db)):
    return crud.list_exercises(db, user_id)
