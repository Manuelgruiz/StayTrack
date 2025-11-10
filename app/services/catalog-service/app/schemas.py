from pydantic import BaseModel, Field

class FoodBase(BaseModel):
    name: str
    kcal_100g: float = Field(ge=0)
    protein_100g: float = Field(ge=0)
    fat_100g: float = Field(ge=0)
    carbs_100g: float = Field(ge=0)

class FoodCreate(FoodBase): pass

class Food(FoodBase):
    id: int
    class Config: from_attributes = True

class ServingBase(BaseModel):
    label: str
    grams: float = Field(gt=0)

class ServingCreate(ServingBase): pass

class Serving(ServingBase):
    id: int
    food_id: int
    class Config: from_attributes = True
