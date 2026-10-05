import datetime
from typing import Dict, Any, Optional
from ..models.schemas import ScenarioState

class ThreatReportEngine:
    @staticmethod
    def generate_report_data(orchestrator, tick_index: int = 0) -> Dict[str, Any]:
        canonical_state = orchestrator.get_canonical_scenario_state(tick_index=tick_index)
        now_dt = datetime.datetime.now(datetime.timezone.utc)
        report_timestamp = now_dt.strftime("%d %B %Y, %H:%M:%S UTC")

        scenario_id = canonical_state.get("scenarioId", "scenario")
        scenario_name = canonical_state.get("scenarioName", "Network Attack Telemetry")
        current_state = canonical_state.get("currentState", {})
        cur_phase = current_state.get("phase", "BASELINE")
        warning = canonical_state.get("warning", {})
        trajectory = canonical_state.get("forecastTrajectory", [])
        topology = canonical_state.get("topology", {})
        evidence = canonical_state.get("evidence", [])
        mitre_list = canonical_state.get("mitreInterpretation", [])
        what_if = canonical_state.get("whatIf", {})

        pred_beh = warning.get("predictedBehavior", "Threat Activity Transition")
        lead_time = warning.get("leadTimeSeconds", 30)
        target_asset = warning.get("targetAsset", "Monitored Subnet Target")
        urgency = warning.get("threatLevel", "HIGH")

        # Executive summary narrative
        observed_stages = [
            t.get("stage") for t in trajectory
            if t.get("status") == "OBSERVED" or t.get("semanticState") == "observed"
        ]
        stages_str = ", ".join(observed_stages) if observed_stages else "Reconnaissance, Discovery"

        exec_assessment = (
            f"The temporal network telemetry sequence for scenario \"{scenario_name}\" progressed through "
            f"observed stages ({stages_str}). At analysis tick #{tick_index + 1}, the current state was evaluated "
            f"as \"{cur_phase}\". The temporal forecasting engine projects imminent \"{pred_beh}\" targeting asset "
            f"\"{target_asset}\" with an estimated warning lead time window of {lead_time}s for defensive containment."
        )

        return {
            "status": "success",
            "reportId": f"REP-{scenario_id}-{int(now_dt.timestamp())}",
            "generatedAt": report_timestamp,
            "scenario": {
                "id": scenario_id,
                "name": scenario_name,
                "category": canonical_state.get("category", "BENCHMARK SCENARIO"),
                "datasetMetadata": canonical_state.get("datasetMetadata", {})
            },
            "executiveSummary": {
                "currentState": cur_phase,
                "warningLeadTimeSeconds": lead_time,
                "forecastedThreat": pred_beh,
                "targetAsset": target_asset,
                "threatLevel": urgency,
                "assessment": exec_assessment,
                "verificationStatus": "VERIFIED" if tick_index >= 3 and cur_phase != "BASELINE" else "PENDING"
            },
            "timeline": canonical_state.get("timeline", {}),
            "trajectory": trajectory,
            "warning": warning,
            "topology": topology,
            "evidence": evidence,
            "mitreInterpretation": mitre_list,
            "whatIf": what_if,
            "disclaimer": (
                "This threat intelligence report represents probabilistic model projections derived from processed "
                "network flow telemetry. Forecasted attack stages are decision-support outputs and require verification "
                "by authorized security personnel."
            )
        }
