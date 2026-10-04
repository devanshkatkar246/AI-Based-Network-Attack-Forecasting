from enum import Enum
from typing import Dict, Any

class BehaviorTaxonomy(str, Enum):
    BENIGN = "BENIGN"
    RECONNAISSANCE = "RECONNAISSANCE"
    DISCOVERY = "DISCOVERY"
    CREDENTIAL_ACCESS = "CREDENTIAL_ACCESS"
    PRIVILEGE_ESCALATION = "PRIVILEGE_ESCALATION"
    LATERAL_MOVEMENT = "LATERAL_MOVEMENT"
    COMMAND_AND_CONTROL = "COMMAND_AND_CONTROL"
    EXFILTRATION = "EXFILTRATION"
    IMPACT = "IMPACT"
    UNKNOWN = "UNKNOWN"

RAW_TO_TAXONOMY_MAP: Dict[str, BehaviorTaxonomy] = {
    "BASELINE": BehaviorTaxonomy.BENIGN,
    "BENIGN": BehaviorTaxonomy.BENIGN,
    "NORMAL": BehaviorTaxonomy.BENIGN,
    "RECON": BehaviorTaxonomy.RECONNAISSANCE,
    "RECONNAISSANCE": BehaviorTaxonomy.RECONNAISSANCE,
    "PORTSCAN": BehaviorTaxonomy.RECONNAISSANCE,
    "SERVICESCAN": BehaviorTaxonomy.RECONNAISSANCE,
    "DISCOVERY": BehaviorTaxonomy.DISCOVERY,
    "ACCOUNT_DISCOVERY": BehaviorTaxonomy.DISCOVERY,
    "DOMAIN_DISCOVERY": BehaviorTaxonomy.DISCOVERY,
    "BRUTE_FORCE": BehaviorTaxonomy.CREDENTIAL_ACCESS,
    "CREDENTIAL_ACCESS": BehaviorTaxonomy.CREDENTIAL_ACCESS,
    "PRIVILEGE_ACCESS": BehaviorTaxonomy.CREDENTIAL_ACCESS,
    "PRIVILEGE_ESCALATION": BehaviorTaxonomy.PRIVILEGE_ESCALATION,
    "LATERAL_MOVEMENT": BehaviorTaxonomy.LATERAL_MOVEMENT,
    "SMB_EXEC": BehaviorTaxonomy.LATERAL_MOVEMENT,
    "PSEXEC": BehaviorTaxonomy.LATERAL_MOVEMENT,
    "COMMAND_AND_CONTROL": BehaviorTaxonomy.COMMAND_AND_CONTROL,
    "C2": BehaviorTaxonomy.COMMAND_AND_CONTROL,
    "BEACON": BehaviorTaxonomy.COMMAND_AND_CONTROL,
    "EXFILTRATION": BehaviorTaxonomy.EXFILTRATION,
    "DATA_DUMP": BehaviorTaxonomy.EXFILTRATION,
    "IMPACT": BehaviorTaxonomy.IMPACT,
    "RANSOMWARE": BehaviorTaxonomy.IMPACT
}

class BehaviorTaxonomyService:
    @staticmethod
    def normalize_behavior(raw_label: str) -> BehaviorTaxonomy:
        if not raw_label:
            return BehaviorTaxonomy.UNKNOWN
        
        clean = raw_label.strip().upper().replace(" ", "_")
        if clean in RAW_TO_TAXONOMY_MAP:
            return RAW_TO_TAXONOMY_MAP[clean]
        
        # Check substring matches if defensible
        if "RECON" in clean or "SCAN" in clean:
            return BehaviorTaxonomy.RECONNAISSANCE
        if "DISCOV" in clean:
            return BehaviorTaxonomy.DISCOVERY
        if "CRED" in clean or "BRUTE" in clean or "LSASS" in clean:
            return BehaviorTaxonomy.CREDENTIAL_ACCESS
        if "LATERAL" in clean or "SMB" in clean or "PSEXEC" in clean:
            return BehaviorTaxonomy.LATERAL_MOVEMENT
        if "C2" in clean or "COMMAND" in clean or "BEACON" in clean or "WEB" in clean or "ENCRYPTED" in clean:
            return BehaviorTaxonomy.COMMAND_AND_CONTROL
        if "EXFIL" in clean or "S3" in clean:
            return BehaviorTaxonomy.EXFILTRATION
        if "BASE" in clean or "BENIGN" in clean:
            return BehaviorTaxonomy.BENIGN

        # Do NOT invent mappings for unrecognised terms
        return BehaviorTaxonomy.UNKNOWN
