import datetime
from typing import Dict, Any, List
import numpy as np
from sklearn.ensemble import IsolationForest

from ..orchestrator import SentinelAgentState
from ..schemas import AgentDecisionStep

# Mock training data representing normal corporate activities
# Features: [hour_of_day, command_line_length, is_external_ip]
# Normal logs:
# - Active during business hours (9 AM - 6 PM / 9-18)
# - No or short command lines
# - Internal IP addresses (is_external_ip = 0)
normal_features = []
# Generate typical business hours logs
for hour in range(9, 18):
    for cmd_len in [0, 0, 15, 30, 45, 0]:
        normal_features.append([hour, cmd_len, 0])
# Generate some quiet hours logs (benign)
for hour in [0, 1, 3, 4, 5, 20, 21, 22, 23]:
    for cmd_len in [0, 0, 10]:
        normal_features.append([hour, cmd_len, 0])

X_train = np.array(normal_features)

# Initialize and train Isolation Forest
# contamination: proportion of outliers. Since training is clean, set it low.
clf = IsolationForest(n_estimators=100, contamination=0.01, random_state=42)
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
        # Parse ISO timestamp
        # E.g., '2026-07-18T02:00:00Z' -> hour = 2
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
    X_test = np.array(features)
    
    # Isolation Forest predicts -1 for anomalies, 1 for normal
    predictions = clf.predict(X_test)
    # score_samples returns negative anomaly scores. Lower means more anomalous.
    raw_scores = clf.score_samples(X_test)
    
    # Scale raw scores to a 0.0 to 1.0 risk index.
    # Typically Isolation Forest scores range from -1 (anomalous) to 0 (normal).
    # We invert and scale it so higher score means higher risk/anomaly.
    scaled_scores = [float(min(max((0.5 - score) * 2.0, 0.0), 1.0)) for score in raw_scores]
    max_anomaly_score = max(scaled_scores) if scaled_scores else 0.0
    
    # Threat is detected if any log is classified as an anomaly (-1) or risk score is high
    is_threat_detected = any(pred == -1 for pred in predictions) or max_anomaly_score > 0.7
    
    # Formulate reasoning explanation
    anomalous_indices = [i for i, pred in enumerate(predictions) if pred == -1 or scaled_scores[i] > 0.7]
    if is_threat_detected:
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
        confidence = float(max_anomaly_score)
    else:
        reasoning = "All telemetry logs align within expected business hours and benign operational feature boundaries."
        action_taken = "PASS_NORMAL_TELEMETRY"
        confidence = float(1.0 - max_anomaly_score)
        
    # Append AgentDecisionStep to audit trail
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
