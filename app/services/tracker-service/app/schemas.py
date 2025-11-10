from pydantic import BaseModel, Field
from datetime import date

class FoodLogBase(BaseModel):
    date: date
    food_name: str
    calories: float = Field(ge=0)
    protein: float = Field(ge=0)
    fat: float = Field(ge=0)
    carbs: float = Field(ge=0)

class FoodLogCreate(FoodLogBase): pass

class FoodLog(FoodLogBase):
    id: int
    user_id: int
    class Config: from_attributes = True

class ExerciseLogBase(BaseModel):
    date: date
    exercise_name: str
    duration_min: float = Field(ge=0)
    calories_burned: float = Field(ge=0)

class ExerciseLogCreate(ExerciseLogBase): pass

class ExerciseLog(ExerciseLogBase):
    id: int
    user_id: int
    class Config: from_attributes = True
