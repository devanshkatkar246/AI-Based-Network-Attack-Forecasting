# Routers package
from .health import router as health_router
from .scenarios import router as scenarios_router
from .forecast import router as forecast_router
from .topology import router as topology_router
from .evidence import router as evidence_router
from .reports import router as reports_router
from .what_if import router as what_if_router

__all__ = [
    "health_router",
    "scenarios_router",
    "forecast_router",
    "topology_router",
    "evidence_router",
    "reports_router",
    "what_if_router"
]
