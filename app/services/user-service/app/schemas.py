from pydantic import BaseModel, EmailStr, Field

class UserBase(BaseModel):
    name: str
    email: EmailStr
    age: int = Field(ge=0)
    weight: float = Field(gt=0)
    height: float = Field(gt=0)

class UserCreate(UserBase):
    pass

class User(BaseModel):
    id: int
    name: str
    email: EmailStr
    age: int
    weight: float
    height: float
    class Config:
        from_attributes = True
