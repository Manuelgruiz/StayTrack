from sqlalchemy.orm import Session, noload
from . import models, schemas

# ---------- Users ----------
def create_user(db: Session, user: schemas.UserCreate) -> models.User:
    db_user = models.User(**user.model_dump())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def list_users(db: Session) -> list[models.User]:
    return (
        db.query(models.User)
        .options(
            noload(models.User.foods),
            noload(models.User.exercises)
        )
        .all()
    )


def get_user(db: Session, user_id: int) -> models.User | None:
    return db.query(models.User).filter(models.User.id == user_id).first()

# ---------- Food ----------
def add_food(db: Session, user_id: int, food: schemas.FoodLogCreate) -> models.FoodLog:
    db_food = models.FoodLog(user_id=user_id, **food.model_dump())
    db.add(db_food)
    db.commit()
    db.refresh(db_food)
    return db_food

def list_foods(db: Session, user_id: int) -> list[models.FoodLog]:
    return db.query(models.FoodLog).filter(models.FoodLog.user_id == user_id).order_by(models.FoodLog.date.desc()).all()

# ---------- Exercise ----------
def add_exercise(db: Session, user_id: int, ex: schemas.ExerciseLogCreate) -> models.ExerciseLog:
    db_ex = models.ExerciseLog(user_id=user_id, **ex.model_dump())
    db.add(db_ex)
    db.commit()
    db.refresh(db_ex)
    return db_ex

def list_exercises(db: Session, user_id: int) -> list[models.ExerciseLog]:
    return db.query(models.ExerciseLog).filter(models.ExerciseLog.user_id == user_id).order_by(models.ExerciseLog.date.desc()).all()
