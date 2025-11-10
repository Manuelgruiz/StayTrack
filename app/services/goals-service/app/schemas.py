from pydantic import BaseModel, Field

class GoalBase(BaseModel):
    kcal_per_day: float = Field(gt=0)
    protein_g: float = Field(ge=0)
    fat_g: float = Field(ge=0)
    carbs_g: float = Field(ge=0)
    exercise_min_per_week: int = Field(ge=0, default=150)
    target_weight: float | None = Field(default=None, gt=0)

class GoalUpsert(GoalBase): pass

class Goal(GoalBase):
    id: int
    user_id: int
    class Config: from_attributes = True
