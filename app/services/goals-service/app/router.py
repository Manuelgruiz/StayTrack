from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from . import schemas
from .db import get_db
from .service_goals import upsert_goals as svc_upsert_goals, get_goals as svc_get_goals

router = APIRouter(prefix="/v1/users/{user_id}/goals", tags=["goals"])

@router.put("", response_model=schemas.Goal, status_code=status.HTTP_200_OK)
def upsert_goals(user_id: int, body: schemas.GoalUpsert, db: Session = Depends(get_db)):
    return svc_upsert_goals(db, user_id, body)

@router.get("", response_model=schemas.Goal)
def get_goals(user_id: int, db: Session = Depends(get_db)):
    g = svc_get_goals(db, user_id)
    if not g:
        raise HTTPException(404, "Goals not set for this user")
    return g
