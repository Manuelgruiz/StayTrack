from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import schemas, crud
from ..database import get_db

router = APIRouter(prefix="/users/{user_id}/foods", tags=["foods"])

@router.post("/", response_model=schemas.FoodLog)
def add_food(user_id: int, food: schemas.FoodLogCreate, db: Session = Depends(get_db)):
    # opcional: validar usuario existe
    return crud.add_food(db, user_id, food)

@router.get("/", response_model=list[schemas.FoodLog])
def list_foods(user_id: int, db: Session = Depends(get_db)):
    return crud.list_foods(db, user_id)
