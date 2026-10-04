from fastapi import APIRouter
from ...models.schemas import WhatIfRequest, WhatIfResponse
from ...services.counterfactual_rollout import CounterfactualRolloutService
from ...services.what_if import WhatIfSimulationService
from .scenarios import get_or_create_orchestrator

router = APIRouter()

@router.post("/what-if", response_model=WhatIfResponse)
def simulate_what_if(request: WhatIfRequest):
    orch = get_or_create_orchestrator(request.scenario_id)
    if orch.world_model_engine.loaded and orch.world_model_engine.model is not None:
        return CounterfactualRolloutService.simulate_counterfactual_rollout(
            model=orch.world_model_engine.model,
            scaler_mean=orch.world_model_engine.scaler_mean,
            scaler_std=orch.world_model_engine.scaler_std,
            state_history=orch.state_history,
            request=request
        )
    return WhatIfSimulationService.simulate_intervention(request)
