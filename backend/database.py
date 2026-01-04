from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from pathlib import Path


# Use absolute path for database to ensure consistency
BASE_DIR = Path(__file__).resolve().parent
DEFAULT_DB_PATH = f"sqlite:///{BASE_DIR}/golf_tracker.db"
DATABASE_URL = os.getenv("DATABASE_URL", DEFAULT_DB_PATH)

# Create SQLite engine
# For SQLite, we need check_same_thread=False
# For PostgreSQL, we don't need this parameter
if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False}
    )
else:
    # PostgreSQL or other databases
    engine = create_engine(DATABASE_URL)

# Create SessionLocal class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create Base class for models
Base = declarative_base()


# Dependency to get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()