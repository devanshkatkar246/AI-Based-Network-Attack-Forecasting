import sys
import os

# Re-export app from backend/main.py
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from main import app
