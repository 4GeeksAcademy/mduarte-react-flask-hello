from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, DateTime,ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime


db = SQLAlchemy() 
    
class Users(db.Model):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    first_name: Mapped[str] = mapped_column(String(50), nullable=True)
    last_name: Mapped[str] = mapped_column(String(50), nullable=True)
    email: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(80), nullable=False)
    subscription_date: Mapped[datetime] = mapped_column(DateTime, nullable=False)

    favorites: Mapped[list["Favorites"]] = relationship(
        "Favorites",
        back_populates="user",
        cascade="all, delete-orphan"
    )

    def serialize(self):
        return {
            "id": self.id,
            "name": self.first_name,
            "email": self.email
        }

    def all_user_favorites(self):
        results_favorites = [fav.serialize() for fav in self.favorites]
        return {
            "id": self.id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "email": self.email,
            "favorites": results_favorites
        } 
    
class Favorites(db.Model):
    __tablename__ = "favorites"
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)

    user: Mapped["Users"] = relationship("Users", back_populates="favorites")

    def serialize(self):
        result = {
            "id": self.id
        }
        return result

