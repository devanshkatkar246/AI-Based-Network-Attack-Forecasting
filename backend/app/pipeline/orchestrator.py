import os
from typing import List, Dict, Any, Optional
from ..models.schemas import NetworkState, DataQualityReport
from ..models.forecast_result import ForecastResult, ModelNotReadyResult
from ..services.ingestion import TelemetryIngestionService
from ..services.validation import DataValidationService
from ..services.windowing import WindowingService, TemporalWindow
from ..services.state_builder import StateBuilderService
from ..services.forecasting import LightweightForecastEngine
from ..services.world_model_engine import TemporalWorldModelEngine

class PipelineOrchestrator:
    def __init__(self, scenario_id: str = "enterprise-lateral-movement-01"):
        self.scenario_id = scenario_id
        self.raw_records = []
        self.quality_report: Optional[DataQualityReport] = None
        self.windows: List[TemporalWindow] = []
        self.state_history: List[NetworkState] = []
        
        # Primary Phase 2 Engine with Fallback
        self.world_model_engine = TemporalWorldModelEngine()
        self.lightweight_engine = LightweightForecastEngine()
        self.loaded = False

    def load_and_process_scenario(self, file_path: Optional[str] = None):
        if file_path is None:
            base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
            if self.scenario_id in ["tech-pirates-mvp-demo", "tech_pirates_mvp_demo"]:
                file_path = os.path.join(base_dir, "data", "demo", "tech_pirates_mvp_demo.csv")
            else:
                file_path = os.path.join(base_dir, "data", "demo", "enterprise_lateral_movement_01.csv")

        # 1. Ingestion
        records, raw_cols, invalid_rows = TelemetryIngestionService.load_from_csv(file_path)
        self.raw_records = records

        # 2. Validation
        self.quality_report = DataValidationService.validate_telemetry(records, raw_cols, invalid_rows)

        # 3. Temporal Windowing (10-second windows)
        self.windows = WindowingService.slice_into_windows(records, window_size_seconds=10.0)

        # 4. Network State Construction
        self.state_history = []
        prev_edges = None
        total_w = len(self.windows)

        for idx, win in enumerate(self.windows):
            t_label = f"T-{(total_w - 1 - idx)*10}s" if idx < total_w - 1 else "NOW"
            st, prev_edges = StateBuilderService.build_network_state(win, prev_edges, time_label=t_label)
            self.state_history.append(st)

        self.loaded = True

    def get_replay_state(self, tick_index: int = 0) -> Dict[str, Any]:
        if not self.loaded:
            self.load_and_process_scenario()

        if not self.state_history:
            return {"error": "No states built"}

        idx = max(0, min(tick_index, len(self.state_history) - 1))
        current_state = self.state_history[idx]
        history_slice = self.state_history[:idx + 1]  # Leakage protection: inputs <= t
        future_slice = self.state_history[idx + 1:]   # Ground truth future for evaluation

        forecast_res = self.world_model_engine.forecast(history_slice, future_state_history=future_slice)
        if getattr(forecast_res, "status", None) == "model_not_ready":
            forecast_res = self.lightweight_engine.forecast(history_slice, future_state_history=future_slice)

        return {
            "tickIndex": idx,
            "totalTicks": len(self.state_history),
            "current_state": current_state,
            "state_history": history_slice,
            "forecast": forecast_res,
            "quality_report": self.quality_report
        }

    def get_canonical_scenario_state(self, tick_index: int = 0) -> Dict[str, Any]:
        replay_dict = self.get_replay_state(tick_index=tick_index)
        if "error" in replay_dict:
            return replay_dict

        idx = replay_dict["tickIndex"]
        total_ticks = replay_dict["totalTicks"]
        current_state = replay_dict["current_state"]
        history_slice = replay_dict["state_history"]
        forecast_obj = replay_dict["forecast"]

        # 1. Trajectory construction
        trajectory_steps = []
        if hasattr(forecast_obj, "trajectory") and forecast_obj.trajectory:
            for s in forecast_obj.trajectory:
                trajectory_steps.append(s.model_dump() if hasattr(s, "model_dump") else (s if isinstance(s, dict) else dict(s)))
        else:
            # Fallback to current state representation
            trajectory_steps.append({
                "id": "step-current",
                "stage": current_state.phase.title(),
                "techniqueId": "T1046",
                "techniqueName": "Network Service Discovery",
                "status": "CURRENT",
                "semanticState": "current",
                "timestamp": current_state.timestamp,
                "estimatedTime": "NOW",
                "sourceHost": current_state.topology.nodes[0].ip if current_state.topology and current_state.topology.nodes else "Monitored Subnet",
                "targetHost": current_state.topology.nodes[1].ip if current_state.topology and len(current_state.topology.nodes) > 1 else "Target Host",
                "details": f"Observed state in window #{current_state.window_id}",
                "confidence": 1.0,
                "isCurrent": True
            })

        # 2. Mathematical Warning Lead Time
        raw_lead = getattr(forecast_obj, "warning_lead_time_seconds", None)
        pred_beh = getattr(forecast_obj, "predicted_behavior", None)
        pred_tech = getattr(forecast_obj, "predicted_technique", None)
        target_host = getattr(forecast_obj, "target_host", None)
        if not target_host and current_state.topology and len(current_state.topology.nodes) > 1:
            target_host = f"{current_state.topology.nodes[1].ip} ({current_state.topology.nodes[1].label})"
        elif not target_host:
            target_host = "Target Subnet"

        calibrated_conf = None
        if hasattr(forecast_obj, "uncertainty") and forecast_obj.uncertainty:
            calibrated_conf = getattr(forecast_obj.uncertainty, "calibrated_confidence", None)

        if raw_lead is not None and raw_lead > 0:
            warning_state = {
                "available": True,
                "leadTimeSeconds": float(raw_lead),
                "status": "active",
                "horizonLabel": f"{int(raw_lead)}s Defender Lead Time",
                "predictedBehavior": pred_beh or "Threat Activity",
                "predictedTechnique": pred_tech,
                "targetAsset": target_host,
                "recommendedAction": f"Isolate target asset {target_host} and block lateral traffic.",
                "confidenceScore": calibrated_conf,
                "threatLevel": "CRITICAL",
                "isResolved": False
            }
        elif raw_lead == 0 or (idx > 0 and current_state.phase.upper() == (pred_beh or "").upper()):
            warning_state = {
                "available": True,
                "leadTimeSeconds": 0.0,
                "status": "resolved",
                "horizonLabel": "Forecast Resolved / Outcome Observed",
                "predictedBehavior": pred_beh or current_state.phase,
                "predictedTechnique": pred_tech,
                "targetAsset": target_host,
                "recommendedAction": f"Verify containment status of {target_host}",
                "confidenceScore": calibrated_conf,
                "threatLevel": "RESOLVED",
                "isResolved": True
            }
        else:
            warning_state = {
                "available": False,
                "leadTimeSeconds": None,
                "status": "none",
                "horizonLabel": "Lead Time Unavailable",
                "predictedBehavior": pred_beh,
                "predictedTechnique": pred_tech,
                "targetAsset": target_host,
                "recommendedAction": "Continuous temporal flow monitoring",
                "confidenceScore": calibrated_conf,
                "threatLevel": "LOW",
                "isResolved": False
            }

        # 3. Evidence items
        evidence_list = []
        if hasattr(forecast_obj, "evidence") and forecast_obj.evidence:
            for ev in forecast_obj.evidence:
                evidence_list.append(ev.model_dump() if hasattr(ev, "model_dump") else (ev if isinstance(ev, dict) else dict(ev)))

        # 4. MITRE ATT&CK Interpretations
        mitre_list = []
        mapper = self.world_model_engine.attack_mapper if hasattr(self.world_model_engine, "attack_mapper") else self.lightweight_engine.baseline_engine.attack_mapper
        for s in trajectory_steps:
            stage_name = s.get("stage", "")
            mapped_tech = mapper.map_behavior_to_technique(stage_name)
            if mapped_tech:
                mitre_list.append(mapped_tech.model_dump() if hasattr(mapped_tech, "model_dump") else dict(mapped_tech))

        # 5. Timeline metadata
        timeline_meta = {
            "totalTicks": total_ticks,
            "currentTick": idx,
            "tickLabels": [st.time_label for st in self.state_history],
            "timestamps": [st.timestamp for st in self.state_history],
            "timeRange": {
                "start": self.state_history[0].timestamp if self.state_history else "00:00:00 UTC",
                "end": self.state_history[-1].timestamp if self.state_history else "00:00:00 UTC"
            }
        }

        # 6. What-If Baseline & Modelled Counterfactual
        from ..services.what_if import WhatIfSimulationService
        from ..models.schemas import WhatIfRequest
        what_if_res = WhatIfSimulationService.simulate_intervention(WhatIfRequest(
            scenario_id=self.scenario_id,
            intervention="isolate_host",
            host=target_host.split(" ")[0] if target_host else "10.0.2.45",
            tick=idx
        ))

        forecast_dump = forecast_obj.model_dump() if hasattr(forecast_obj, "model_dump") else (forecast_obj if isinstance(forecast_obj, dict) else dict(forecast_obj or {}))

        q_rep = self.quality_report.model_dump() if hasattr(self.quality_report, "model_dump") else (self.quality_report if isinstance(self.quality_report, dict) else dict(self.quality_report or {}))

        return {
            "scenarioId": self.scenario_id,
            "scenarioName": self.scenario_id.replace("-", " ").replace("_", " ").title(),
            "category": "USER UPLOADED" if "upload" in self.scenario_id else "BENCHMARK SCENARIO",
            "datasetMetadata": {
                "source_dataset": f"{self.scenario_id}.csv",
                "total_flows": len(self.raw_records),
                "total_windows": total_ticks,
                "quality_report": q_rep
            },
            "timeline": timeline_meta,
            "replayPosition": idx,
            "currentState": current_state.model_dump() if hasattr(current_state, "model_dump") else (current_state if isinstance(current_state, dict) else dict(current_state)),
            "forecast": forecast_dump,
            "forecastTrajectory": trajectory_steps,
            "warning": warning_state,
            "topology": current_state.topology.model_dump() if hasattr(current_state.topology, "model_dump") else (current_state.topology if isinstance(current_state.topology, dict) else dict(current_state.topology)),
            "evidence": evidence_list,
            "mitreInterpretation": mitre_list,
            "whatIf": what_if_res.model_dump() if hasattr(what_if_res, "model_dump") else dict(what_if_res),
            "threatSummary": {
                "currentPhase": current_state.phase,
                "targetAsset": target_host,
                "leadTimeSeconds": warning_state.get("leadTimeSeconds"),
                "threatLevel": warning_state.get("threatLevel")
            }
        }


