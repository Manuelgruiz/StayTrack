from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from . import schemas
from .db import get_db
from .service_exercises import add_exercise as svc_add_exercise, list_exercises as svc_list_exercises

router = APIRouter(prefix="/v1/users/{user_id}/exercises", tags=["exercises"])

@router.post("", response_model=schemas.ExerciseLog, status_code=status.HTTP_201_CREATED)
def add_exercise(user_id: int, body: schemas.ExerciseLogCreate, db: Session = Depends(get_db)):
    return svc_add_exercise(db, user_id, body)

@router.get("", response_model=list[schemas.ExerciseLog])
def list_exercises(user_id: int, limit: int = Query(50, le=200), offset: int = 0, db: Session = Depends(get_db)):
    return svc_list_exercises(db, user_id, limit, offset)
