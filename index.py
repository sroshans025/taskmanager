import sys
import os

# Add backend directory to Python path so absolute imports like 'from app.api' work
sys.path.append(os.path.join(os.path.dirname(os.path.dirname(__file__)), "backend"))

from app.main import app
