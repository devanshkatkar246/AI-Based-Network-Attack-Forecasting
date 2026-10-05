from typing import Dict, Any

try:
    from app.services.report_engine import ThreatReportEngine
except ImportError:
    from backend.app.services.report_engine import ThreatReportEngine

class ReportEngine:
    """ Authoritative Threat Intelligence & Forensic Report Generator """

    @staticmethod
    def generate_report_data(orchestrator, tick_index: int = 0) -> Dict[str, Any]:
        return ThreatReportEngine.generate_report_data(orchestrator, tick_index=tick_index)
