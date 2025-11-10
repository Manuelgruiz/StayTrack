from pydantic import BaseModel
from datetime import date

class DailyStat(BaseModel):
    date: date
    kcal_in: float
    protein: float
    fat: float
    carbs: float
    kcal_out: float
    exercise_min: float
