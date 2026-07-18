from typing import TypedDict, List, Dict, Any

class SentinelAgentState(TypedDict):
    raw_logs: List[Dict[str, Any]]
    anomaly_score: float
    is_threat_detected: bool
    mitre_mappings: List[Dict[str, Any]]
    predicted_next_moves: List[Dict[str, Any]]
    remediation_actions: List[Dict[str, Any]]
    audit_trail: List[Dict[str, Any]]
    final_executive_summary: str
