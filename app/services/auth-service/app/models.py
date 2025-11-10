from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Integer, String, UniqueConstraint
from .db import Base

class Account(Base):
    __tablename__ = "accounts"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(Integer, index=True, nullable=False)
    email: Mapped[str] = mapped_column(String(200), unique=True, index=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(200), nullable=False)

    __table_args__ = (UniqueConstraint("email", name="uq_accounts_email"),)
