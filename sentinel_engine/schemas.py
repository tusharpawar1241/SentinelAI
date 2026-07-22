from pydantic import BaseModel, Field
from typing import List, Optional

class SecurityLog(BaseModel):
    timestamp: str = Field(..., description="ISO 8601 formatted timestamp")
    source_system: str = Field(..., description="Name of the source system/infrastructure component")
    event_id: Optional[int] = Field(None, description="Optional Windows/Linux event ID")
    user_id: str = Field(..., description="User identity associated with the log")
    source_ip: str = Field(..., description="Originating IP address")
    destination_ip: Optional[str] = Field(None, description="Optional destination IP address")
    process_name: Optional[str] = Field(None, description="Optional name of the running process")
    command_line: Optional[str] = Field(None, description="Optional command line executable payload")
    description: str = Field(..., description="Human-readable event description")

class LogIngestionPayload(BaseModel):
    scenario_name: str = Field(..., description="Name of the ingestion scenario (e.g., normal activity vs 2am attack)")
    logs: List[SecurityLog] = Field(..., description="Collection array matching the SecurityLog template")

class AgentDecisionStep(BaseModel):
    agent_name: str = Field(..., description="Name of the agent (e.g. Behavior, Threat RAG, Prediction)")
    timestamp: str = Field(..., description="ISO 8601 timestamp of execution")
    action_taken: str = Field(..., description="Brief action taken description")
    confidence_score: float = Field(..., description="Scaled float value representing confidence (e.g., 0.0 - 1.0)")
    reasoning_explanation: str = Field(..., description="Detailed textual reasoning explanation")
