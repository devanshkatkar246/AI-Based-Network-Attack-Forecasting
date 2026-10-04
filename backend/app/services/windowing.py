from typing import List, Dict
from datetime import datetime, timedelta
from ..models.schemas import FlowTelemetry

class TemporalWindow:
    def __init__(self, window_id: int, start_time: datetime, end_time: datetime):
        self.window_id = window_id
        self.start_time = start_time
        self.end_time = end_time
        self.records: List[FlowTelemetry] = []

class WindowingService:
    @staticmethod
    def slice_into_windows(
        records: List[FlowTelemetry],
        window_size_seconds: float = 10.0
    ) -> List[TemporalWindow]:
        if not records:
            return []

        # Sort records by timestamp
        sorted_records = sorted(records, key=lambda x: x.timestamp)
        first_time = sorted_records[0].timestamp
        last_time = sorted_records[-1].timestamp

        windows: List[TemporalWindow] = []
        current_start = first_time
        window_id = 0

        while current_start <= last_time:
            current_end = current_start + timedelta(seconds=window_size_seconds)
            window = TemporalWindow(window_id=window_id, start_time=current_start, end_time=current_end)
            
            # Find records in range [current_start, current_end)
            for r in sorted_records:
                if current_start <= r.timestamp < current_end:
                    window.records.append(r)

            windows.append(window)
            window_id += 1
            current_start = current_end

        return windows
