from pydantic import BaseModel, EmailStr, Field
from datetime import date
from typing import List

# ---------- Food ----------
class FoodLogBase(BaseModel):
    date: date
    food_name: str = Field(examples=["Broccoli"])
    calories: float
    protein: float
    fat: float
    carbs: float

class FoodLogCreate(FoodLogBase):
    pass

class FoodLog(FoodLogBase):
    id: int
    class Config:
        from_attributes = True

# ---------- Exercise ----------
class ExerciseLogBase(BaseModel):
    date: date
    exercise_name: str = Field(examples=["Running"])
    duration_min: float
    calories_burned: float

class ExerciseLogCreate(ExerciseLogBase):
    pass

class ExerciseLog(ExerciseLogBase):
    id: int
    class Config:
        from_attributes = True

# ---------- User ----------
class UserBase(BaseModel):
    name: str
    email: EmailStr
    age: int
    weight: float
    height: float

class UserCreate(UserBase):
    pass

class User(UserBase):
    id: int
    foods: List[FoodLog] = []
    exercises: List[ExerciseLog] = []
    class Config:
        from_attributes = True
