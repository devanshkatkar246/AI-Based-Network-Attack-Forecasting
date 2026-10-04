from fastapi import APIRouter

router = APIRouter()

@router.get("/health")
def get_health():
    return {
        "status": "healthy",
        "service": "Temporal Network World Model Backend (Phase 1)",
        "engine": "Lightweight Forecast Engine",
        "version": "v1.0.0-phase1"
    }
