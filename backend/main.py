import os
import sys
import traceback
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

# Ensure backend root is on Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.api.v1 import (
    health,
    scenarios,
    network,
    forecast,
    explanation,
    attack,
    what_if,
    topology,
    trajectory,
    evidence,
    reports
)

app = FastAPI(
    title="THE FORECASTER — Temporal Network Intelligence",
    description="SIH 2026 Problem Statement 26153 — AI-Based Network Attack Forecasting Backend Engine",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def api_health():
    return {
        "status": "ok",
        "service": "the-forecaster-backend"
    }

@app.get("/health")
def root_health():
    return {
        "status": "ok",
        "service": "the-forecaster-backend"
    }

@app.get("/")
def root():
    return {
        "message": "THE FORECASTER — Temporal Network Intelligence Backend",
        "status": "online",
        "health": "/api/health",
        "docs": "/docs"
    }

# Exception handlers ensuring clean structured error responses
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    print(f"[Backend Exception] on {request.url.path}: {exc}")
    traceback.print_exc()
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": "InternalServerError",
            "message": str(exc) or "An unexpected error occurred during backend processing.",
            "path": request.url.path
        }
    )

# Register routers under /api (Canonical Vercel Service standard)
app.include_router(health.router, prefix="/api", tags=["Health"])
app.include_router(scenarios.router, prefix="/api", tags=["Scenarios"])
app.include_router(forecast.router, prefix="/api", tags=["Forecast"])
app.include_router(network.router, prefix="/api", tags=["Network"])
app.include_router(topology.router, prefix="/api", tags=["Topology"])
app.include_router(trajectory.router, prefix="/api", tags=["Trajectory"])
app.include_router(evidence.router, prefix="/api", tags=["Evidence"])
app.include_router(what_if.router, prefix="/api", tags=["What-If"])
app.include_router(reports.router, prefix="/api", tags=["Reports"])
app.include_router(explanation.router, prefix="/api", tags=["Explanation"])
app.include_router(attack.router, prefix="/api", tags=["ATT&CK"])

# Register routers under /api/v1 (Backward compatibility)
app.include_router(health.router, prefix="/api/v1", tags=["Health v1"])
app.include_router(scenarios.router, prefix="/api/v1", tags=["Scenarios v1"])
app.include_router(forecast.router, prefix="/api/v1", tags=["Forecast v1"])
app.include_router(network.router, prefix="/api/v1", tags=["Network v1"])
app.include_router(topology.router, prefix="/api/v1", tags=["Topology v1"])
app.include_router(trajectory.router, prefix="/api/v1", tags=["Trajectory v1"])
app.include_router(evidence.router, prefix="/api/v1", tags=["Evidence v1"])
app.include_router(what_if.router, prefix="/api/v1", tags=["What-If v1"])
app.include_router(reports.router, prefix="/api/v1", tags=["Reports v1"])
app.include_router(explanation.router, prefix="/api/v1", tags=["Explanation v1"])
app.include_router(attack.router, prefix="/api/v1", tags=["ATT&CK v1"])
