from pydantic import BaseModel, EmailStr, Field
from datetime import date as DateType
from typing import Annotated

# ========== Auth Schemas ==========
class Register(BaseModel):
    """Schema for user registration"""
    name: str = Field(..., description="User's full name")
    email: EmailStr = Field(..., description="User's email address")
    password: str = Field(..., min_length=6, description="User's password (min 6 characters)")
    age: int = Field(..., ge=0, description="User's age")
    weight: float = Field(..., gt=0, description="User's weight in kg")
    height: float = Field(..., gt=0, description="User's height in cm")

class Login(BaseModel):
    """Schema for user login"""
    email: EmailStr = Field(..., description="User's email address")
    password: str = Field(..., description="User's password")

class Token(BaseModel):
    """Schema for authentication token response"""
    access_token: str
    token_type: str = "bearer"

# ========== User Schemas ==========
class UserCreate(BaseModel):
    """Schema for creating a new user"""
    name: str = Field(..., description="User's full name")
    email: EmailStr = Field(..., description="User's email address")
    age: int = Field(..., ge=0, description="User's age")
    weight: float = Field(..., gt=0, description="User's weight in kg")
    height: float = Field(..., gt=0, description="User's height in cm")

class User(BaseModel):
    """Schema for user data"""
    id: int
    name: str
    email: EmailStr
    age: int
    weight: float
    height: float
    class Config:
        from_attributes = True

# ========== Food Tracker Schemas ==========
class FoodLogCreate(BaseModel):
    """Schema for creating a food log entry"""
    date: DateType = Field(..., description="Date of the food log (YYYY-MM-DD)")
    food_name: str = Field(..., description="Name of the food consumed")
    calories: float = Field(..., ge=0, description="Calories consumed")
    protein: float = Field(..., ge=0, description="Protein in grams")
    fat: float = Field(..., ge=0, description="Fat in grams")
    carbs: float = Field(..., ge=0, description="Carbs in grams")

class FoodLog(FoodLogCreate):
    """Schema for food log response"""
    id: int
    user_id: int
    class Config:
        from_attributes = True

class ExerciseLogCreate(BaseModel):
    """Schema for creating an exercise log entry"""
    date: DateType = Field(..., description="Date of the exercise (YYYY-MM-DD)")
    exercise_name: str = Field(..., description="Name of the exercise")
    duration_min: float = Field(..., ge=0, description="Duration in minutes")
    calories_burned: float = Field(..., ge=0, description="Calories burned")

class ExerciseLog(ExerciseLogCreate):
    """Schema for exercise log response"""
    id: int
    user_id: int
    class Config:
        from_attributes = True

# ========== Goals Schemas ==========
class GoalUpsert(BaseModel):
    """Schema for creating or updating user goals"""
    kcal_per_day: float = Field(..., gt=0, description="Daily calorie target")
    protein_g: float = Field(..., ge=0, description="Daily protein target in grams")
    fat_g: float = Field(..., ge=0, description="Daily fat target in grams")
    carbs_g: float = Field(..., ge=0, description="Daily carbs target in grams")
    exercise_min_per_week: int = Field(150, ge=0, description="Weekly exercise target in minutes")
    target_weight: float | None = Field(None, gt=0, description="Target weight in kg (optional)")

class Goal(GoalUpsert):
    """Schema for goal response"""
    id: int
    user_id: int
    class Config:
        from_attributes = True

# ========== Food Catalog Schemas ==========
class FoodCreate(BaseModel):
    """Schema for creating a food in the catalog"""
    name: str = Field(..., description="Name of the food")
    kcal_100g: float = Field(..., ge=0, description="Calories per 100g")
    protein_100g: float = Field(..., ge=0, description="Protein per 100g")
    fat_100g: float = Field(..., ge=0, description="Fat per 100g")
    carbs_100g: float = Field(..., ge=0, description="Carbs per 100g")

class Food(FoodCreate):
    """Schema for food catalog response"""
    id: int
    class Config:
        from_attributes = True
