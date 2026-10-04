from fastapi import APIRouter
from ...services.attack_mapping import AttackMappingService

router = APIRouter()
attack_service = AttackMappingService()

@router.get("/attack/mapping")
def get_attack_mapping():
    return {
        "source": "Local MITRE ATT&CK KB",
        "techniques": attack_service.get_all_techniques()
    }
