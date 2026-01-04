from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routes import router
import os

# Create database tables
Base.metadata.create_all(bind=engine)

# Create FastAPI app
app = FastAPI(
    title="Golf Tracker API",
    description="API for tracking golf rounds and statistics",
    version="1.0.0"
)

# Configure CORS - allow specific origins for credentials
allowed_origins = [
    "http://localhost:5173",  # Local development
    "http://localhost:4173",  # Local preview
    "https://golf-metric-tracker-1.onrender.com",  # Production frontend
]

# Add custom origin from environment variable if provided
custom_origin = os.getenv("FRONTEND_URL")
if custom_origin:
    allowed_origins.append(custom_origin)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(router, prefix="/api", tags=["golf"])


@app.get("/")
def read_root():
    return {"message": "Golf Tracker API is running"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)