from sqlalchemy.orm import Session
from . import models, schemas
from .logger import logger

def add_exercise(db: Session, user_id: int, body: schemas.ExerciseLogCreate) -> models.ExerciseLog:
    obj = models.ExerciseLog(user_id=user_id, **body.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    logger.info("exercise_created", extra={"user_id": user_id, "exercise_id": obj.id, "date": str(obj.date)})
    return obj

def list_exercises(db: Session, user_id: int, limit: int, offset: int) -> list[models.ExerciseLog]:
    q = (db.query(models.ExerciseLog)
           .filter(models.ExerciseLog.user_id == user_id)
           .order_by(models.ExerciseLog.date.desc()))
    items = q.limit(limit).offset(offset).all()
    logger.info("exercises_listed", extra={"user_id": user_id, "count": len(items), "limit": limit, "offset": offset})
    return items
