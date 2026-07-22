import datetime
from typing import Dict, Any, List

from ..orchestrator import SentinelAgentState
from ..schemas import AgentDecisionStep

def soar_response_agent(state: SentinelAgentState) -> Dict[str, Any]:
    """
    Agent Node: Mock SOAR Network Action Execution Handler
    Evaluates computed threat confidence against threshold and triggers containment actions.
    """
    anomaly_score = state.get("anomaly_score", 0.0)
    is_threat_detected = state.get("is_threat_detected", False)
    raw_logs = state.get("raw_logs", [])
    
    remediation_actions: List[Dict[str, Any]] = []
    confidence = anomaly_score
    
    # Pre-approved threshold for autonomous intervention: 85% (0.85)
    THRESHOLD = 0.85
    
    if is_threat_detected and confidence >= THRESHOLD:
        # Extract external source IPs and internal systems to contain
        external_ips = set()
        compromised_systems = set()
        
        for log in raw_logs:
            ip = log.get("source_ip", "")
            system = log.get("source_system", "")
            # Identify external rogue IPs (not 10.x or 192.168.x)
            if ip and not (ip.startswith("10.") or ip.startswith("192.168.")):
                external_ips.add(ip)
            # Identify compromised internal CNI systems
            if system and "DomainController" not in system and "ActiveDirectory" not in system:
                compromised_systems.add(system)
                
        actions = []
        for ext_ip in external_ips:
            actions.append(f"BLOCK_IP: {ext_ip}")
        for system in compromised_systems:
            actions.append(f"ISOLATE_HOST: {system}")
            
        # Map actions to dictionary output
        remediation_actions = [
            {"action": act, "status": "EXECUTED", "timestamp": datetime.datetime.utcnow().isoformat() + "Z"}
            for act in actions
        ]
        
        reasoning = (
            f"Autonomous containment threshold of {THRESHOLD*100}% exceeded (Threat Confidence: {confidence*100:.1f}%). "
            f"Executed reactive network containment policies: Blocked {len(external_ips)} rogue IP(s) and isolated {len(compromised_systems)} internal system(s)."
        )
        action_taken = "CONTAINMENT_TRIGGERED"
        
    else:
        reasoning = (
            f"Threat confidence score ({confidence*100:.1f}%) below autonomous safety threshold of {THRESHOLD*100}%. "
            "No reactive network isolation actions executed."
        )
        action_taken = "MONITORING_SAFE_STATE"
        
    decision = AgentDecisionStep(
        agent_name="SOAR Response Orchestrator",
        timestamp=datetime.datetime.utcnow().isoformat() + "Z",
        action_taken=action_taken,
        confidence_score=float(confidence),
        reasoning_explanation=reasoning
    )
    
    current_audit = list(state.get("audit_trail", []))
    current_audit.append(decision.model_dump())
    
    return {
        "remediation_actions": remediation_actions,
        "audit_trail": current_audit
    }
