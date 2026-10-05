from typing import List, Optional, Dict, Any
from datetime import datetime
from ..models.schemas import NetworkState
from .behavior_taxonomy import BehaviorTaxonomyService, BehaviorTaxonomy

class WarningLeadTimeEngine:
    """
    Engine to calculate empirical and forecast-driven warning lead time.
    Calculates lead time from the earliest actionable future forecast event:
    leadTime = forecast.timestamp - current.timestamp (or horizon_seconds).
    
    Explicit Warning States:
    - NO_FORECAST
    - FORECAST_AVAILABLE
    - WARNING_AVAILABLE
    - WARNING_RESOLVED
    - MODEL_NOT_READY
    """
    @staticmethod
    def calculate_lead_time(
        forecast_timestamp_str: str,
        predicted_behavior: Optional[str],
        predictions: Optional[List[Dict[str, Any]]] = None,
        future_state_history: Optional[List[NetworkState]] = None,
        window_size_seconds: float = 10.0,
        ground_truth_onset: Optional[datetime] = None,
        current_phase: Optional[str] = "BASELINE",
        target_asset: Optional[str] = None
    ) -> Dict[str, Any]:
        if not predicted_behavior and (not predictions or len(predictions) == 0):
            return {
                "available": False,
                "status": "NO_FORECAST",
                "lead_time_seconds": None,
                "reason": "No actionable forecast available."
            }

        # 1. Search for earliest actionable future security transition in predictions
        actionable_prediction = None
        if predictions and len(predictions) > 0:
            # First look for high-risk / attack-relevant transition (non-benign)
            for p in predictions:
                p_beh = p.get("behavior", "")
                norm = BehaviorTaxonomyService.normalize_behavior(p_beh)
                if norm not in [BehaviorTaxonomy.BENIGN, BehaviorTaxonomy.UNKNOWN]:
                    actionable_prediction = p
                    break
            # Fallback to first future prediction if none is strictly malicious
            if actionable_prediction is None:
                actionable_prediction = predictions[0]

        pred_beh = (actionable_prediction.get("behavior") if actionable_prediction else predicted_behavior) or "Threat Transition"
        pred_tech = actionable_prediction.get("technique_id") if actionable_prediction else None
        horizon_sec = actionable_prediction.get("horizon_seconds") if actionable_prediction else int(window_size_seconds)

        norm_pred = BehaviorTaxonomyService.normalize_behavior(pred_beh)
        norm_cur = BehaviorTaxonomyService.normalize_behavior(current_phase)

        # 2. Check explicit ground truth onset timestamp first if provided
        if ground_truth_onset is not None and forecast_timestamp_str:
            try:
                clean_ts = forecast_timestamp_str.replace(" UTC", "")
                fc_dt = datetime.strptime(clean_ts, "%H:%M:%S")
                gt_dt = datetime.strptime(ground_truth_onset.strftime("%H:%M:%S"), "%H:%M:%S")
                elapsed = (gt_dt - fc_dt).total_seconds()
                if elapsed > 0:
                    is_attack = norm_pred not in [BehaviorTaxonomy.BENIGN, BehaviorTaxonomy.UNKNOWN]
                    return {
                        "available": True,
                        "status": "WARNING_AVAILABLE" if is_attack else "FORECAST_AVAILABLE",
                        "lead_time_seconds": round(elapsed, 1),
                        "horizon_label": f"{int(elapsed)}s Defender Lead Time",
                        "predicted_behavior": pred_beh,
                        "predicted_technique": pred_tech,
                        "target_asset": target_asset,
                        "is_resolved": False,
                        "threat_level": "CRITICAL" if is_attack else "LOW"
                    }
            except Exception:
                pass

        # 3. Check if the predicted event has already occurred (Resolved)
        if norm_pred != BehaviorTaxonomy.BENIGN and norm_cur == norm_pred:
            return {
                "available": True,
                "status": "WARNING_RESOLVED",
                "lead_time_seconds": 0.0,
                "horizon_label": "Forecast Resolved / Outcome Observed",
                "predicted_behavior": pred_beh,
                "predicted_technique": pred_tech,
                "target_asset": target_asset,
                "is_resolved": True,
                "threat_level": "RESOLVED"
            }

        # 4. Calculate exact lead time in seconds from model forecast horizon
        lead_time = float(horizon_sec)

        # Parse timestamps if available to verify exact offset
        if forecast_timestamp_str:
            try:
                clean_ts = forecast_timestamp_str.replace(" UTC", "")
                # If ground truth onset is supplied
                if ground_truth_onset is not None:
                    fc_dt = datetime.strptime(clean_ts, "%H:%M:%S")
                    gt_dt = datetime.strptime(ground_truth_onset.strftime("%H:%M:%S"), "%H:%M:%S")
                    elapsed = (gt_dt - fc_dt).total_seconds()
                    if elapsed > 0:
                        lead_time = elapsed
            except Exception:
                pass

        if lead_time > 0:
            is_attack = norm_pred not in [BehaviorTaxonomy.BENIGN, BehaviorTaxonomy.UNKNOWN]
            return {
                "available": True,
                "status": "WARNING_AVAILABLE" if is_attack else "FORECAST_AVAILABLE",
                "lead_time_seconds": round(lead_time, 1),
                "horizon_label": f"{int(lead_time)}s Defender Lead Time",
                "predicted_behavior": pred_beh,
                "predicted_technique": pred_tech,
                "target_asset": target_asset,
                "is_resolved": False,
                "threat_level": "CRITICAL" if is_attack else "LOW"
            }

        return {
            "available": False,
            "status": "WARNING_RESOLVED",
            "lead_time_seconds": 0.0,
            "horizon_label": "Forecast Resolved",
            "predicted_behavior": pred_beh,
            "predicted_technique": pred_tech,
            "target_asset": target_asset,
            "is_resolved": True,
            "threat_level": "RESOLVED"
        }
