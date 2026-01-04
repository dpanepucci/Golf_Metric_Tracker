from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
from typing import List

from database import get_db
from models import User, GolfRound
from schemas import (
    UserCreate, UserResponse, UserLogin, Token,
    GolfRoundCreate, GolfRoundResponse, YearToDateStats
)
from auth import (
    verify_password, get_password_hash, create_access_token,
    verify_token, ACCESS_TOKEN_EXPIRE_MINUTES
)

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


# Dependency to get current user
async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    username = verify_token(token)
    if username is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user = db.query(User).filter(User.username == username).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user


# Auth Routes
@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    """Register a new user"""
    # Check if username exists
    if db.query(User).filter(User.username == user.username).first():
        raise HTTPException(status_code=400, detail="Username already registered")
    
    # Create new user
    hashed_password = get_password_hash(user.password)
    db_user = User(
        username=user.username,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


@router.post("/token", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """Login and get access token"""
    user = db.query(User).filter(User.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me", response_model=UserResponse)
def read_users_me(current_user: User = Depends(get_current_user)):
    """Get current user info"""
    return current_user


# Golf Round Routes
@router.post("/rounds", response_model=GolfRoundResponse, status_code=status.HTTP_201_CREATED)
def create_golf_round(
    round_data: GolfRoundCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Log a new golf round"""
    db_round = GolfRound(
        user_id=current_user.id,
        **round_data.model_dump()
    )
    db.add(db_round)
    db.commit()
    db.refresh(db_round)
    return db_round


@router.get("/rounds", response_model=List[GolfRoundResponse])
def get_golf_rounds(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100
):
    """Get all golf rounds for current user"""
    rounds = db.query(GolfRound).filter(
        GolfRound.user_id == current_user.id
    ).order_by(GolfRound.date.desc()).offset(skip).limit(limit).all()
    return rounds


@router.get("/rounds/{round_id}", response_model=GolfRoundResponse)
def get_golf_round(
    round_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific golf round"""
    round_data = db.query(GolfRound).filter(
        GolfRound.id == round_id,
        GolfRound.user_id == current_user.id
    ).first()
    
    if not round_data:
        raise HTTPException(status_code=404, detail="Round not found")
    return round_data


@router.delete("/rounds/{round_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_golf_round(
    round_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a specific golf round"""
    round_data = db.query(GolfRound).filter(
        GolfRound.id == round_id,
        GolfRound.user_id == current_user.id
    ).first()
    
    if not round_data:
        raise HTTPException(status_code=404, detail="Round not found")
    
    db.delete(round_data)
    db.commit()
    return None


@router.get("/stats/ytd", response_model=YearToDateStats)
def get_year_to_date_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get year-to-date statistics for current user"""
    from datetime import datetime
    from sqlalchemy import func
    
    current_year = datetime.now().year
    rounds = db.query(GolfRound).filter(
        GolfRound.user_id == current_user.id,
        func.strftime('%Y', GolfRound.date) == str(current_year)
    ).all()
    
    if not rounds:
        return YearToDateStats(
            fir_percentage=0.0,
            gir_percentage=0.0,
            average_putts=0.0,
            total_rounds=0
        )
    
    total_fairways_hit = sum(r.fairways_hit for r in rounds)
    total_fairways = sum(r.total_fairways for r in rounds)
    total_gir = sum(r.greens_in_regulation for r in rounds)
    total_greens = sum(r.total_greens for r in rounds)
    total_putts = sum(r.total_putts for r in rounds)
    
    fir_pct = (total_fairways_hit / total_fairways * 100) if total_fairways > 0 else 0
    gir_pct = (total_gir / total_greens * 100) if total_greens > 0 else 0
    avg_putts = total_putts / len(rounds) if rounds else 0
    
    return YearToDateStats(
        fir_percentage=round(float(fir_pct), 2),
        gir_percentage=round(float(gir_pct), 2),
        average_putts=round(float(avg_putts), 2),
        total_rounds=len(rounds)
    )