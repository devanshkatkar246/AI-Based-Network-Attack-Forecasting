import traceback
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from .api.v1 import health, scenarios, network, forecast, explanation, attack, what_if

app = FastAPI(
    title="Temporal Network World Model for Early Network Attack Forecasting",
    description="SIH 26153 - Operational Phase 1 FastAPI Backend Engine",
    version="1.0.0-phase1"
)

# Enable CORS for local Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def api_health():
    return {"status": "ok"}

# Exception handlers ensuring clean structured error responses
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    print(f"Backend Exception on {request.url.path}: {exc}")
    traceback.print_exc()
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": "InternalServerError",
            "message": str(exc) or "An unexpected error occurred during backend processing.",
            "path": request.url.path
        }
    )

# Include API V1 routers
prefix = "/api/v1"
app.include_router(health.router, prefix=prefix, tags=["Health"])
app.include_router(scenarios.router, prefix=prefix, tags=["Scenarios"])
app.include_router(network.router, prefix=prefix, tags=["Network"])
app.include_router(forecast.router, prefix=prefix, tags=["Forecast"])
app.include_router(explanation.router, prefix=prefix, tags=["Explanation"])
app.include_router(attack.router, prefix=prefix, tags=["ATT&CK"])
app.include_router(what_if.router, prefix=prefix, tags=["What-If"])

@app.get("/")
def root():
    return {
        "message": "Temporal Network World Model API Backend (Phase 1)",
        "docs": "/docs",
        "health": "/api/health"
    }

