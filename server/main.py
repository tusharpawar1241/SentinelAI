import os
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, Any

# Load environment variables from .env file if present
load_dotenv()

from .schemas import LogIngestionPayload
from .orchestrator import SentinelAgentState

# Import multi-agent execution nodes
from .agents.behavior import behavior_anomaly_agent
from .agents.threat_rag import threat_intelligence_agent
from .agents.prediction import attack_path_prediction_agent
from .agents.response import soar_response_agent
from .agents.report import report_compiler_agent

app = FastAPI(
    title="SentinelAI: Autonomous Multi-Agent Cyber Resilience Platform",
    description="Backend Graph Engine for CNI Cyber Defense Orchestration"
)

# Enable CORS for React frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for the hackathon environment
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "ONLINE", "message": "SentinelAI Backend Engine active."}

@app.post("/api/analyze-telemetry", response_model=Dict[str, Any])
def analyze_telemetry(payload: LogIngestionPayload):
    """
    POST endpoint to ingest infrastructure logs, process them through the multi-agent graph,
    and return the final orchestrated system state context.
    """
    try:
        # Convert raw SecurityLog list into a list of dicts for the graph state
        logs_list = [log.model_dump() for log in payload.logs]
        
        # Initialize LangGraph Central State
        state = SentinelAgentState(
            raw_logs=logs_list,
            anomaly_score=0.0,
            is_threat_detected=False,
            mitre_mappings=[],
            predicted_next_moves=[],
            remediation_actions=[],
            audit_trail=[],
            final_executive_summary=""
        )
        
        # Execute unified multi-agent orchestrator chain sequentially
        # 1. Behavioral Anomaly Engine (Isolation Forest)
        state.update(behavior_anomaly_agent(state))
        
        # 2. Semantic Threat Intel RAG (Gemini)
        state.update(threat_intelligence_agent(state))
        
        # 3. Proactive Path Predictor
        state.update(attack_path_prediction_agent(state))
        
        # 4. Automated SOAR Response containment
        state.update(soar_response_agent(state))
        
        # 5. Final Report & Audit trail compiler
        state.update(report_compiler_agent(state))
        
        # Return complete processed state to caller
        return dict(state)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Pipeline execution failure: {str(e)}")
