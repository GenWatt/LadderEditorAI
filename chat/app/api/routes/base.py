from fastapi import APIRouter
import time

router = APIRouter()

@router.get("/")
async def root():
    return {"message": "Welcome to Object Tracker RAG API"}

@router.get("/health")
async def health_check():
    return {"status": "healthy", "time": time.time()}