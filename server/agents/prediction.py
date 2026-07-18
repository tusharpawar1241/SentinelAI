import datetime
from typing import Dict, Any, List

from ..orchestrator import SentinelAgentState
from ..schemas import AgentDecisionStep

def attack_path_prediction_agent(state: SentinelAgentState) -> Dict[str, Any]:
    """
    Agent Node: Proactive Attack Chain Path Prediction
    Analyzes existing MITRE ATT&CK mappings to predict subsequent steps in the attack campaign.
    """
    mitre_mappings = state.get("mitre_mappings", [])
    predictions: List[Dict[str, Any]] = []
    
    # Extract mapped technique IDs
    technique_ids = {m.get("technique_id") for m in mitre_mappings}
    
    if not technique_ids:
        # No techniques mapped yet, normal baseline state
        decision = AgentDecisionStep(
            agent_name="Proactive Path Predictor",
            timestamp=datetime.datetime.utcnow().isoformat() + "Z",
            action_taken="NO_ATTACK_PATH_PREDICTED",
            confidence_score=1.0,
            reasoning_explanation="No active threat techniques have been identified. Internal network infrastructure is stable."
        )
        current_audit = list(state.get("audit_trail", []))
        current_audit.append(decision.model_dump())
        return {
            "predicted_next_moves": [],
            "audit_trail": current_audit
        }
        
    # Analyze techniques and project trajectory
    justifications = []
    
    # 1. If Credential Dumping (T1003) is detected, project Lateral Movement (T1021)
    if "T1003" in technique_ids and "T1021" not in technique_ids:
        predictions.append({
            "target_node": "Database-Server-CNI / Domain Controller",
            "predicted_technique": "T1021 (Lateral Movement)",
            "likelihood": 0.90,
            "justification": "Credential dumping on the gateway provides authentication hashes. The threat actor is highly likely to attempt remote service connections to sensitive database elements next."
        })
        justifications.append("Credential Dumping (T1003) -> Imminent Lateral Movement projected.")
        
    # 2. If Lateral Movement (T1021) is detected, project Data Exfiltration (T1048)
    if "T1021" in technique_ids and "T1048" not in technique_ids:
        predictions.append({
            "target_node": "External Command & Control Server",
            "predicted_technique": "T1048 (Exfiltration Over Alternative Protocol)",
            "likelihood": 0.95,
            "justification": "Threat actor successfully mapped administrative database layers. Imminent exfiltration of CNI critical records via encrypted network egress channels is expected."
        })
        justifications.append("Lateral Movement (T1021) -> Imminent Exfiltration projected.")
        
    # 3. If Exfiltration (T1048) is detected, project Impact / Clean up / C2 Persistence
    if "T1048" in technique_ids:
        predictions.append({
            "target_node": "CNI Subnet Gateway Workstations",
            "predicted_technique": "T1078 (Valid Accounts / Persistence)",
            "likelihood": 0.85,
            "justification": "Exfiltration phase complete. Threat actor likely has backdoor persistence or will initiate log wiping mechanisms."
        })
        justifications.append("Exfiltration (T1048) -> Command & Control Persistence projected.")

    summary_explanation = "Proactive threat trajectory compiled: " + " | ".join(justifications)
    
    decision = AgentDecisionStep(
        agent_name="Proactive Path Predictor",
        timestamp=datetime.datetime.utcnow().isoformat() + "Z",
        action_taken="PREDICTED_ATTACK_TRAJECTORY",
        confidence_score=0.92,
        reasoning_explanation=summary_explanation
    )
    
    current_audit = list(state.get("audit_trail", []))
    current_audit.append(decision.model_dump())
    
    return {
        "predicted_next_moves": predictions,
        "audit_trail": current_audit
    }
