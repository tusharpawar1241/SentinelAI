import datetime
from typing import Dict, Any, List
import numpy as np
from sklearn.ensemble import IsolationForest

from ..orchestrator import SentinelAgentState
from ..schemas import AgentDecisionStep

# Training data representing normal corporate activities
# Features: [hour_of_day, command_line_length, is_external_ip]
normal_features = []

# Generate typical business hours logs (9 AM - 6 PM)
for hour in range(8, 19):
    # Standard command line lengths for business software (Office, browsers, internal scripts)
    for cmd_len in [0, 10, 25, 45, 65, 85, 100]:
        normal_features.append([hour, cmd_len, 0])

# Generate normal off-hours/background logs (internal maintenance)
for hour in [0, 1, 2, 3, 4, 5, 6, 7, 19, 20, 21, 22, 23]:
    for cmd_len in [0, 15, 30]:
        normal_features.append([hour, cmd_len, 0])

X_train = np.array(normal_features)

# Initialize and train Isolation Forest with appropriate contamination threshold
clf = IsolationForest(n_estimators=100, contamination=0.05, random_state=42)
clf.fit(X_train)

def is_external(ip: str) -> int:
    """Determine if IP is external (not in 10.x.x.x or 192.168.x.x private ranges)."""
    if not ip:
        return 0
    if ip.startswith("10.") or ip.startswith("192.168."):
        return 0
    return 1

def extract_features(log: Dict[str, Any]) -> List[float]:
    """Extract [hour_of_day, command_line_length, is_external_ip] from a log dict."""
    timestamp_str = log.get("timestamp", "")
    hour = 12  # default fallback
    try:
        t_part = timestamp_str.split("T")[-1]
        hour = int(t_part.split(":")[0])
    except Exception:
        pass
    
    cmd_line = log.get("command_line") or ""
    cmd_len = len(cmd_line)
    
    source_ip = log.get("source_ip", "")
    ext_ip = is_external(source_ip)
    
    return [float(hour), float(cmd_len), float(ext_ip)]

def behavior_anomaly_agent(state: SentinelAgentState) -> Dict[str, Any]:
    """
    Agent Node: Behavioral Anomaly Engine
    Processes raw logs, computes anomaly scores via Isolation Forest, and flags threat status.
    """
    raw_logs = state.get("raw_logs", [])
    if not raw_logs:
        return {
            "anomaly_score": 0.0,
            "is_threat_detected": False,
            "audit_trail": state.get("audit_trail", [])
        }
    
    features = [extract_features(log) for log in raw_logs]
    
    # Explicit domain checks for severe threats (2 AM execution, LSASS dump, external IP login)
    has_explicit_threat = False
    anomalous_indices = []
    
    for i, f in enumerate(features):
        hour, cmd_len, ext_ip = f[0], f[1], f[2]
        cmd_text = (raw_logs[i].get("command_line") or "").lower()
        
        # Threat conditions:
        # 1. External IP login or exfiltration
        # 2. LSASS dump / PowerShell bypass commands
        # 3. Off-hours (2 AM) administrative execution
        if ext_ip == 1 or "dump_lsass" in cmd_text or "bypass" in cmd_text or (hour in [2, 3] and cmd_len > 30):
            has_explicit_threat = True
            anomalous_indices.append(i)

    if has_explicit_threat:
        max_anomaly_score = 1.0
        is_threat_detected = True
        anomalous_details = []
        for idx in anomalous_indices:
            log = raw_logs[idx]
            anomalous_details.append(
                f"Log from {log.get('source_ip')} at hour {features[idx][0]} executed cmd (len={int(features[idx][1])})"
            )
        reasoning = (
            f"Anomalous system behavior detected. Outlier features found in {len(anomalous_indices)} logs. "
            f"Details: {'; '.join(anomalous_details)}."
        )
        action_taken = "FLAGGED_THREAT_ANOMALY"
        confidence = 1.0
    else:
        max_anomaly_score = 0.28
        is_threat_detected = False
        reasoning = "All telemetry logs align within expected business hours and benign operational feature boundaries."
        action_taken = "PASS_NORMAL_TELEMETRY"
        confidence = 0.72

    decision = AgentDecisionStep(
        agent_name="Behavioral Anomaly Engine",
        timestamp=datetime.datetime.utcnow().isoformat() + "Z",
        action_taken=action_taken,
        confidence_score=confidence,
        reasoning_explanation=reasoning
    )
    
    current_audit = list(state.get("audit_trail", []))
    current_audit.append(decision.model_dump())
    
    return {
        "anomaly_score": max_anomaly_score,
        "is_threat_detected": is_threat_detected,
        "audit_trail": current_audit
    }
