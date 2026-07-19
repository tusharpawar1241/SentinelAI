import os
import datetime
from typing import Dict, Any
import google.generativeai as genai

from ..orchestrator import SentinelAgentState
from ..schemas import AgentDecisionStep

# Configure Gemini API key dynamically
def get_api_key():
    return os.environ.get("GEMINI_API_KEY")

SYSTEM_INSTRUCTION = """
You are the SentinelAI Cryptographic Audit Archiver and Reporting Agent.
Your task is to compile the full multi-agent security analysis state into a professional, clean, and comprehensive Executive Security Brief structured in Markdown syntax.
Structure the report clearly with:
- Executive Summary (including overall Threat Index/Anomalous Risk score)
- Incident Details & MITRE ATT&CK Mapping
- Proactive Path Predictions
- Autonomous SOAR Remediation Network Containment Actions
- Immutable Validation Trail Log (Audit Log steps)

Maintain a highly professional, clinical, and reassuring tone.
"""

def report_compiler_agent(state: SentinelAgentState) -> Dict[str, Any]:
    """
    Agent Node: Final Markdown Audit Trail Compiler
    Generates a comprehensive executive security report in Markdown.
    """
    raw_logs = state.get("raw_logs", [])
    anomaly_score = state.get("anomaly_score", 0.0)
    is_threat_detected = state.get("is_threat_detected", False)
    mitre_mappings = state.get("mitre_mappings", [])
    predicted_next_moves = state.get("predicted_next_moves", [])
    remediation_actions = state.get("remediation_actions", [])
    audit_trail = state.get("audit_trail", [])
    
    # Construct the input prompt for reporting
    prompt = (
        f"Generate an Executive Security Brief based on the following multi-agent security state metrics:\n\n"
        f"1. Overall Threat Score: {anomaly_score*100:.1f}% (Threat Detected: {is_threat_detected})\n"
        f"2. Log Raw telemetry count: {len(raw_logs)}\n"
        f"3. MITRE ATT&CK Mappings: {mitre_mappings}\n"
        f"4. Proactive Path Predictions: {predicted_next_moves}\n"
        f"5. SOAR Containment Actions Executed: {remediation_actions}\n"
        f"6. Immutable System Audit Steps: {audit_trail}\n"
    )
    
    summary_md = ""
    confidence = 0.95
    reasoning = ""
    
    api_key = get_api_key()
    model_name = os.environ.get("GEMINI_MODEL", "gemini-3.5-flash")
    if api_key:
        try:
            genai.configure(api_key=api_key)
            model = genai.GenerativeModel(
                model_name=model_name,
                system_instruction=SYSTEM_INSTRUCTION
            )
            response = model.generate_content(prompt)
            summary_md = response.text
            reasoning = "Successfully compiled executive brief via Gemini GenAI reporting interface."
        except Exception as e:
            reasoning = f"Gemini GenAI reporting call failed: {str(e)}. Defaulting to heuristic compiler."
            summary_md = get_fallback_markdown(state)
            confidence = 0.5
    else:
        reasoning = "GEMINI_API_KEY environment variable not set. Generated fallback system brief locally."
        summary_md = get_fallback_markdown(state)
        confidence = 0.85

    decision = AgentDecisionStep(
        agent_name="Audit Archiver Agent",
        timestamp=datetime.datetime.utcnow().isoformat() + "Z",
        action_taken="COMPILED_EXECUTIVE_BRIEF",
        confidence_score=confidence,
        reasoning_explanation=reasoning
    )

    current_audit = list(audit_trail)
    current_audit.append(decision.model_dump())

    return {
        "final_executive_summary": summary_md,
        "audit_trail": current_audit
    }

def get_fallback_markdown(state: SentinelAgentState) -> str:
    """Offline heuristic to build a beautiful executive summary brief in clean Markdown."""
    anomaly_score = state.get("anomaly_score", 0.0)
    is_threat = state.get("is_threat_detected", False)
    mappings = state.get("mitre_mappings", [])
    predictions = state.get("predicted_next_moves", [])
    actions = state.get("remediation_actions", [])
    audit = state.get("audit_trail", [])
    
    status_text = "CRITICAL THREAT DETECTED" if is_threat else "SYSTEM STABLE & SAFE"
    
    md = f"""# SentinelAI Executive Security Brief
Generated: {datetime.datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')} UTC

## 1. System Security Index
*   **Security Status:** **{status_text}**
*   **Global Anomaly Score:** `{anomaly_score*100:.1f}%`
*   **Active Isolation Alerts:** `{len(actions)}`

---

## 2. Telemetry Threat Evaluation & MITRE ATT&CK Mappings
"""
    if not mappings:
        md += "No security threats or MITRE techniques matched standard intrusion indicators.\n"
    else:
        for m in mappings:
            md += f"- **[{m.get('technique_id')}] {m.get('tactic_name')}** (Severity: `{m.get('severity')}`)\n"
            md += f"  *Detail:* {m.get('summary')}\n\n"

    md += "\n--- \n\n## 3. Attack Chain Path Predictions\n"
    if not predictions:
        md += "No subsequent hostile actions or lateral movements predicted at this time.\n"
    else:
        for p in predictions:
            md += f"- **Target Node:** `{p.get('target_node')}` -> **{p.get('predicted_technique')}** (Likelihood: `{p.get('likelihood')*100:.0f}%`)\n"
            md += f"  *Justification:* {p.get('justification')}\n\n"

    md += "\n--- \n\n## 4. Autonomous SOAR Response Containment Actions\n"
    if not actions:
        md += "No network containment actions were triggered. Passive monitoring remains active.\n"
    else:
        for a in actions:
            md += f"- `[{a.get('status')}]` **{a.get('action')}** at `{a.get('timestamp')}`\n"

    md += "\n--- \n\n## 5. Non-Repudiable System Validation Log (Audit Trail)\n"
    for idx, step in enumerate(audit):
        md += f"{idx+1}. **{step.get('agent_name')}** - `[{step.get('action_taken')}]` (Conf: `{step.get('confidence_score')*100:.0f}%`)\n"
        md += f"   *Reasoning:* {step.get('reasoning_explanation')}\n\n"
        
    return md
