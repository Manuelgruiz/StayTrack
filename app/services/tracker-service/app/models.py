from datetime import date as date_type
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Integer, String, Date, Float, Index
from .db import Base

class FoodLog(Base):
    __tablename__ = "food_logs"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, index=True, nullable=False) 
    date: Mapped[date_type] = mapped_column(Date, index=True, nullable=False)
    food_name: Mapped[str] = mapped_column(String(200), nullable=False)
    calories: Mapped[float] = mapped_column(Float, nullable=False)
    protein:  Mapped[float] = mapped_column(Float, nullable=False)
    fat:      Mapped[float] = mapped_column(Float, nullable=False)
    carbs:    Mapped[float] = mapped_column(Float, nullable=False)
    __table_args__ = (Index("ix_food_user_date", "user_id", "date"),)

class ExerciseLog(Base):
    __tablename__ = "exercise_logs"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, index=True, nullable=False)
    date: Mapped[date_type] = mapped_column(Date, index=True, nullable=False)
    exercise_name: Mapped[str] = mapped_column(String(200), nullable=False)
    duration_min: Mapped[float] = mapped_column(Float, nullable=False)
    calories_burned: Mapped[float] = mapped_column(Float, nullable=False)
