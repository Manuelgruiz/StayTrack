from sqlalchemy import Column, Integer, String, Float, ForeignKey, Date
from sqlalchemy.orm import relationship, Mapped, mapped_column
from .database import Base

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(120))
    email: Mapped[str] = mapped_column(String(200), unique=True, index=True)
    age: Mapped[int] = mapped_column(Integer)
    weight: Mapped[float] = mapped_column(Float)  # kg
    height: Mapped[float] = mapped_column(Float)  # cm

    foods: Mapped[list["FoodLog"]] = relationship("FoodLog", back_populates="user", cascade="all, delete-orphan")
    exercises: Mapped[list["ExerciseLog"]] = relationship("ExerciseLog", back_populates="user", cascade="all, delete-orphan")


class FoodLog(Base):
    __tablename__ = "food_logs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    date: Mapped[Date] = mapped_column(Date, index=True)
    food_name: Mapped[str] = mapped_column(String(200))
    calories: Mapped[float] = mapped_column(Float)  # por porción indicada
    protein: Mapped[float] = mapped_column(Float)
    fat: Mapped[float] = mapped_column(Float)
    carbs: Mapped[float] = mapped_column(Float)

    user: Mapped["User"] = relationship("User", back_populates="foods")


class ExerciseLog(Base):
    __tablename__ = "exercise_logs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    date: Mapped[Date] = mapped_column(Date, index=True)
    exercise_name: Mapped[str] = mapped_column(String(200))
    duration_min: Mapped[float] = mapped_column(Float)
    calories_burned: Mapped[float] = mapped_column(Float)

    user: Mapped["User"] = relationship("User", back_populates="exercises")
