from typing import List, Optional, Dict, Any
from datetime import datetime
from ..models.schemas import NetworkState
from .behavior_taxonomy import BehaviorTaxonomyService, BehaviorTaxonomy

class WarningLeadTimeEngine:
    """
    Engine to calculate empirical warning lead time based on model predictions
    and future ground-truth network states in the scenario timeline.
    Strictly avoids fabricating lead time values.
    """
    @staticmethod
    def calculate_lead_time(
        forecast_timestamp_str: str,
        predicted_behavior: str,
        future_state_history: List[NetworkState],
        window_size_seconds: float = 10.0,
        ground_truth_onset: Optional[datetime] = None
    ) -> Dict[str, Any]:
        if ground_truth_onset is not None:
            try:
                clean_ts = forecast_timestamp_str.replace(" UTC", "")
                fc_dt = datetime.strptime(clean_ts, "%H:%M:%S")
                # Normalize ground_truth_onset to same day time comparison if date component differs
                gt_time_dt = datetime.strptime(ground_truth_onset.strftime("%H:%M:%S"), "%H:%M:%S")
                elapsed = (gt_time_dt - fc_dt).total_seconds()
                if elapsed > 0:
                    return {
                        "available": True,
                        "lead_time_seconds": round(elapsed, 1),
                        "predicted_behavior": predicted_behavior
                    }
                else:
                    return {
                        "available": False,
                        "reason": "Invalid warning lead time (forecast timestamp occurred after or at ground truth onset)."
                    }
            except Exception:
                pass

        if not future_state_history or not predicted_behavior:
            return {
                "available": False,
                "reason": "Insufficient future temporal ground truth to evaluate lead time."
            }

        norm_predicted = BehaviorTaxonomyService.normalize_behavior(predicted_behavior)
        if norm_predicted == BehaviorTaxonomy.BENIGN or norm_predicted == BehaviorTaxonomy.UNKNOWN:
            return {
                "available": False,
                "reason": f"Predicted behavior ({predicted_behavior}) does not constitute a high-risk attack onset."
            }

        # Search future states for first occurrence of matching ground-truth behavior
        match_window_idx: Optional[int] = None
        match_state: Optional[NetworkState] = None

        for idx, fut_state in enumerate(future_state_history):
            fut_norm = BehaviorTaxonomyService.normalize_behavior(fut_state.phase)
            if fut_norm == norm_predicted or fut_state.phase.upper() == predicted_behavior.upper():
                match_window_idx = idx + 1
                match_state = fut_state
                break

        if match_state is None or match_window_idx is None:
            return {
                "available": False,
                "reason": f"Predicted behavior '{predicted_behavior}' was not observed in subsequent temporal replay timeline."
            }

        # Lead time calculation
        lead_time_sec = match_window_idx * window_size_seconds

        # Parse timestamps if possible for exact elapsed seconds
        try:
            fc_dt = datetime.strptime(forecast_timestamp_str.replace(" UTC", ""), "%H:%M:%S")
            ev_dt = datetime.strptime(match_state.timestamp.replace(" UTC", ""), "%H:%M:%S")
            elapsed = (ev_dt - fc_dt).total_seconds()
            if elapsed > 0:
                lead_time_sec = elapsed
            elif elapsed <= 0:
                return {
                    "available": False,
                    "reason": "Invalid warning lead time (forecast timestamp occurred after or at ground truth onset)."
                }
        except Exception:
            pass

        return {
            "available": True,
            "lead_time_seconds": round(lead_time_sec, 1),
            "predicted_behavior": predicted_behavior,
            "target_state_window": match_state.window_id,
            "target_state_timestamp": match_state.timestamp
        }
