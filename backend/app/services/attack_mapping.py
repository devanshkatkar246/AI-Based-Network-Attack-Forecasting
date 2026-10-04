import json
import os
from typing import Dict, Any, Optional, List
from ..models.schemas import MitreTechnique

class AttackMappingService:
    def __init__(self, kb_path: Optional[str] = None):
        if kb_path is None:
            base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
            kb_path = os.path.join(base_dir, "data", "attack", "mitre_attack_kb.json")
        
        self.kb_path = kb_path
        self.kb_data: Dict[str, Any] = self._load_kb()

    def _load_kb(self) -> Dict[str, Any]:
        if os.path.exists(self.kb_path):
            with open(self.kb_path, "r", encoding="utf-8") as f:
                return json.load(f)
        return {"techniques": {}, "tactic_order": []}

    def get_technique(self, technique_id: str) -> Optional[MitreTechnique]:
        tech_dict = self.kb_data.get("techniques", {}).get(technique_id)
        if tech_dict:
            return MitreTechnique(**tech_dict)
        return None

    def map_behavior_to_technique(self, behavior_name: str) -> Optional[MitreTechnique]:
        behavior_lower = behavior_name.lower()
        for tech_id, tech in self.kb_data.get("techniques", {}).items():
            if tech["technique_name"].lower() in behavior_lower or tech_id.lower() in behavior_lower:
                return MitreTechnique(**tech)
            if "recon" in behavior_lower and tech["tactic"] == "Reconnaissance":
                return MitreTechnique(**tech)
            if "psexec" in behavior_lower or "smb" in behavior_lower or "lateral" in behavior_lower:
                if tech["technique_id"] == "T1021.002":
                    return MitreTechnique(**tech)
            if "discovery" in behavior_lower and tech["technique_id"] == "T1087.002":
                return MitreTechnique(**tech)
            if "c2" in behavior_lower or "egress" in behavior_lower:
                if tech["technique_id"] == "T1071.001":
                    return MitreTechnique(**tech)
        return None

    def get_all_techniques(self) -> List[MitreTechnique]:
        return [MitreTechnique(**t) for t in self.kb_data.get("techniques", {}).values()]
