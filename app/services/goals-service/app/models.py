from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Integer, Float, UniqueConstraint
from .db import Base

class Goal(Base):
    __tablename__ = "goals"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, index=True, nullable=False)
    kcal_per_day: Mapped[float] = mapped_column(nullable=False)
    protein_g: Mapped[float] = mapped_column(nullable=False)
    fat_g: Mapped[float] = mapped_column(nullable=False)
    carbs_g: Mapped[float] = mapped_column(nullable=False)
    exercise_min_per_week: Mapped[int] = mapped_column(Integer, nullable=False, default=150)
    target_weight: Mapped[float] = mapped_column(nullable=True)

    __table_args__ = (UniqueConstraint("user_id", name="uq_goals_user"),)
