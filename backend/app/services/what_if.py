from typing import List
from ..models.schemas import WhatIfRequest, WhatIfResponse, WhatIfStep, RiskComparisonItem

class WhatIfSimulationService:
    @staticmethod
    def simulate_intervention(request: WhatIfRequest) -> WhatIfResponse:
        host = request.host
        intervention = request.intervention.lower()

        baseline_trajectory = [
            WhatIfStep(stage="Initial Access", status="OBSERVED", time="T-90s"),
            WhatIfStep(stage="Cloud / Net Discovery", status="OBSERVED", time="NOW", isCurrent=True),
            WhatIfStep(stage="Lateral Movement / Escalation", status="FORECAST", time="+30s", probability=92),
            WhatIfStep(stage="Exfiltration / Egress", status="FORECAST", time="+60s", probability=86)
        ]

        if "isolate" in intervention or "block" in intervention:
            intervention_trajectory = [
                WhatIfStep(stage="Initial Access", status="OBSERVED", time="T-90s"),
                WhatIfStep(stage="Cloud / Net Discovery", status="OBSERVED", time="NOW", isCurrent=True),
                WhatIfStep(stage=f"[INTERVENTION: Host {host} Isolated]", status="INTERVENTION", time="INTERVENTION", isInterventionPoint=True),
                WhatIfStep(stage="Lateral Movement Blocked", status="CONTAINED", time="+30s", probability=5),
                WhatIfStep(stage="Egress Neutralized", status="CONTAINED", time="+60s", probability=1)
            ]
            risk_comparison = [
                RiskComparisonItem(stage="Lateral Movement", baselineProb=92, interventionProb=5),
                RiskComparisonItem(stage="Exfiltration / Egress", baselineProb=86, interventionProb=1)
            ]
        else: # e.g. credential revocation
            intervention_trajectory = [
                WhatIfStep(stage="Initial Access", status="OBSERVED", time="T-90s"),
                WhatIfStep(stage="Cloud / Net Discovery", status="OBSERVED", time="NOW", isCurrent=True),
                WhatIfStep(stage="[INTERVENTION: Credentials Revoked]", status="INTERVENTION", time="INTERVENTION", isInterventionPoint=True),
                WhatIfStep(stage="Auth Challenge Failed", status="CONTAINED", time="+30s", probability=8),
                WhatIfStep(stage="Access Denied", status="CONTAINED", time="+60s", probability=2)
            ]
            risk_comparison = [
                RiskComparisonItem(stage="Lateral Movement", baselineProb=92, interventionProb=8),
                RiskComparisonItem(stage="Exfiltration / Egress", baselineProb=86, interventionProb=2)
            ]

        return WhatIfResponse(
            targetHost=host,
            targetIp=host,
            compromisedHost="10.0.2.45 (Workstation-302)",
            baselineTrajectory=baseline_trajectory,
            interventionTrajectory=intervention_trajectory,
            riskComparison=risk_comparison,
            simulatedDivergenceNotice="Simulated / modelled projection (Phase 1)"
        )
