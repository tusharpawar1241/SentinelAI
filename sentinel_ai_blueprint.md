# PRODUCT REQUIREMENTS DOCUMENT: SENTINELAI
## System Reference: Autonomous Multi-Agent Cyber Resilience Platform for CNI
## Target Platform: Economic Times AI Hackathon 2.0 (Problem Statement 7)

---

## SECTION 1: SYSTEM OVERVIEW & PHACED INTERFACE ARCHITECTURE
SentinelAI is an autonomous multi-agent cyber defense orchestration platform designed to protect Critical National Infrastructure (CNI) like AIIMS and CBSE. It ingests infrastructure telemetry logs via API, handles behavioral anomalies, maps techniques to the MITRE ATT&CK framework, predicts threat trajectories, and executes automated network containment actions while maintaining a permanent, non-repudiable transaction audit log graph for judges.

### The UI Dashboard Wireframe (React + Tailwind CSS)
To satisfy the **User Experience (15%)** criteria, the interface is split cleanly into a balanced column grid layout:
1. **Top Metrics Bar:** System health states, active network isolation alerts, overall infrastructure threat indexes (Low, Medium, High).
2. **Left Column Component (PipelineFlow):** Visual progress flow representing the 5 backend agents. Displays active execution states (`Idle`, `Processing`, `Complete`) along with real-time confidence readout metrics.
3. **Center Column Component (IncidentFeed):** Dynamic chronological alert list highlighting logs turning from normal operational levels into high-risk security alerts.
4. **Right Column Component (AuditReport):** Clean Markdown output window rendering the final generated executive summary alongside the step-by-step immutable validation log trail.

---

## SECTION 2: WORKSPACE FILE STRUCTURE LAYOUT
The target codebase directory matrix must follow this layout pattern exactly:
```text
sentinel-ai-core/
├── server/
│   ├── __init__.py
│   ├── main.py            # FastAPI Entry Point and Router Handlers
│   ├── schemas.py         # Data Validation Models (Pydantic Core Structures)
│   ├── orchestrator.py    # Shared LangGraph Engine State Machine Layout
│   ├── simulator.py       # Simulated Ingestion Scenarios (Normal vs 2AM Attack logs)
│   └── agents/
│       ├── __init__.py
│       ├── behavior.py    # Machine Learning Feature Scoring Logic
│       ├── threat_rag.py  # GenAI LLM Semantic Parsing Pipeline
│       ├── prediction.py  # Predictive Path Evaluation Rules Engine
│       ├── response.py    # Mock SOAR Network Action Execution Handler
│       └── report.py      # Final Markdown Audit Trail Compiler
├── client/
│   ├── index.html
│   ├── src/
│   │   ├── App.jsx        # Main Dashboard Layout Orchestrator
│   │   ├── index.css      # Core Tailwind CSS Injection Layer
│   │   └── components/
│   │       ├── PipelineFlow.jsx   # Graph Engine Visual Matrix View
│   │       ├── IncidentFeed.jsx   # Chronological Incident Alert Lists
│   │       └── AuditReport.jsx    # Explainable Markdown Document Panel
└── package.json