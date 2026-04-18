from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

from app.api.endpoints import auth, tasks
from app.db.session import engine, Base

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="FastAPI Task Manager")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(tasks.router, prefix="/api/tasks", tags=["tasks"])

# Serve frontend static files
frontend_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "frontend")
os.makedirs(frontend_dir, exist_ok=True)

app.mount("/", StaticFiles(directory=frontend_dir, html=True), name="static")
