from sqlalchemy.orm import Session
from . import models, schemas
from .logger import logger

def upsert_goals(db: Session, user_id: int, body: schemas.GoalUpsert) -> models.Goal:
    goal = db.query(models.Goal).filter(models.Goal.user_id == user_id).first()

    if goal:
        logger.info("Updating existing goals", extra={"user_id": user_id})
        for k, v in body.model_dump().items():
            setattr(goal, k, v)
    else:
        logger.info("Creating new goals", extra={"user_id": user_id})
        goal = models.Goal(user_id=user_id, **body.model_dump())
        db.add(goal)

    db.commit()
    db.refresh(goal)
    logger.info("Goal saved", extra={"user_id": user_id, "goal_id": goal.id})
    return goal


def get_goals(db: Session, user_id: int) -> models.Goal | None:
    goal = db.query(models.Goal).filter(models.Goal.user_id == user_id).first()
    logger.info("Fetching goals", extra={"user_id": user_id, "exists": bool(goal)})
    return goal
