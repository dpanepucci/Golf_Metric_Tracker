from pydantic import BaseModel
from datetime import datetime
from typing import Optional


# User Schemas
class UserCreate(BaseModel):
    username: str
    password: str


class UserLogin(BaseModel):
    username: str
    password: str


class UserResponse(BaseModel):
    id: int
    username: str
    created_at: datetime
    
    class Config:
        from_attributes = True


# Golf Round Schemas
class GolfRoundCreate(BaseModel):
    course_name: str
    score: int
    fairways_hit: int
    total_fairways: int = 14
    greens_in_regulation: int
    total_greens: int = 18
    total_putts: int
    date: Optional[datetime] = None


class GolfRoundResponse(BaseModel):
    id: int
    user_id: int
    course_name: str
    score: int
    fairways_hit: int
    total_fairways: int
    greens_in_regulation: int
    total_greens: int
    total_putts: int
    date: datetime
    
    class Config:
        from_attributes = True


# Token Schema
class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None


# Stats Schema
class YearToDateStats(BaseModel):
    fir_percentage: float
    gir_percentage: float
    average_putts: float
    total_rounds: int