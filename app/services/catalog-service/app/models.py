from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Integer, String, Float, ForeignKey
from .db import Base

class Food(Base):
    __tablename__ = "catalog_foods"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(200), unique=True, index=True, nullable=False)
    kcal_100g: Mapped[float] = mapped_column(Float, nullable=False)
    protein_100g: Mapped[float] = mapped_column(Float, nullable=False)
    fat_100g: Mapped[float] = mapped_column(Float, nullable=False)
    carbs_100g: Mapped[float] = mapped_column(Float, nullable=False)

class Serving(Base):
    __tablename__ = "catalog_servings"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    food_id: Mapped[int] = mapped_column(Integer, ForeignKey("catalog_foods.id", ondelete="CASCADE"), index=True, nullable=False)
    label: Mapped[str] = mapped_column(String(50), nullable=False)
    grams: Mapped[float] = mapped_column(Float, nullable=False)
