from pydantic import BaseModel, EmailStr

class Register(BaseModel):
    name: str
    email: EmailStr
    password: str
    age: int
    weight: float
    height: float

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class Login(BaseModel):
    email: EmailStr
    password: str
