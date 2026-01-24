from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationship to golf rounds
    golf_rounds = relationship("GolfRound", back_populates="user")


class GolfRound(Base):
    __tablename__ = "golf_rounds"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    date = Column(DateTime, default=datetime.utcnow)
    course_name = Column(String, nullable=False)
    score = Column(Integer, nullable=False)
    fairways_hit = Column(Integer, default=0)
    total_fairways = Column(Integer, default=14)  # Typical 18-hole course
    greens_in_regulation = Column(Integer, default=0)
    total_greens = Column(Integer, default=18)
    total_putts = Column(Integer, default=0)

    # Relationship to user
    user = relationship("User", back_populates="golf_rounds")