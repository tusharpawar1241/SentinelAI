# SentinelAI: Autonomous Multi-Agent Cyber Resilience Platform

Target Platform: Economic Times AI Hackathon 2.0 (Problem Statement 7: AI-Driven Cyber Resilience for Critical National Infrastructure)  
Target Environment: Critical National Infrastructure (CNI), Government Public Sector Networks, and Enterprise IT/OT Architectures.

---

## What is SentinelAI?

SentinelAI is an autonomous multi-agent cyber defense orchestration platform designed to protect Critical National Infrastructure (such as CBSE examination databases, AIIMS healthcare systems, power grids, and smart cities) from low-and-slow Advanced Persistent Threats (APTs).

### The Problem It Solves
Traditional security relies on known malware signatures. However, sophisticated cyber actors operate using low-and-slow techniques (such as stolen admin credentials or living-off-the-land PowerShell commands). By the time a signature exists, the attack has already succeeded. 

SentinelAI introduces an Unsupervised Behavioral Intelligence Layer. It detects anomalies based on how systems normally behave—compressing the time from initial compromise to detection and response from weeks down to seconds.

---

## Frequently Asked Questions

### Who is this platform built for?
SentinelAI is designed for large-scale enterprise architectures and public sector networks. It is used by CNI operators, security analysts, and IT administrators to protect interconnected servers, databases, domain controllers, and VPN gateways.

### Does it secure a personal laptop?
* As a standalone personal antivirus app? No. SentinelAI is not a desktop consumer antivirus.
* As part of an enterprise/government network? YES. Laptops connect to the organization as Endpoint Nodes. SentinelAI ingests telemetry logs from laptops, domain controllers, and servers simultaneously. If a breach occurs on an endpoint at 2:00 AM, SentinelAI detects the abnormal behavior on that node and isolates it from the network before the attacker can reach sensitive core databases.

---

## 5-Agent Architecture

SentinelAI replaces manual SOC monitoring with a 5-node sequential multi-agent graph chain:

```text
[Telemetry Ingestion Payload]
           │
           ▼
1. Behavioral Anomaly Engine
           │
           ▼
2. Semantic Threat Intel RAG
           │
           ▼
3. Attack Path Predictor
           │
           ▼
4. SOAR Response Orchestrator
           │
           ▼
5. Cryptographic Audit Archiver
           │
           ▼
[React Cockpit UI Dashboard]
```

| Agent Node | Technology | Core Function |
| :--- | :--- | :--- |
| 1. Behavioral Anomaly Engine | scikit-learn Isolation Forest | Evaluates log vectors (`hour_of_day`, `command_line_length`, `is_external_ip`) without needing malware signatures to flag abnormal behavior. |
| 2. Semantic Threat Intel RAG | Google GenAI SDK (`gemini-3.5-flash`) | Maps flagged log anomalies to official MITRE ATT&CK techniques (e.g. `T1003 Credential Dumping`, `T1021 Lateral Movement`, `T1048 Exfiltration`). |
| 3. Proactive Path Predictor | Rules & Graph Trajectory Engine | Calculates imminent next-stage threat actor moves with likelihood percentages (e.g., predicting 95% exfiltration probability). |
| 4. SOAR Response Orchestrator | Automated Security Playbooks | Evaluates threat confidence against a pre-approved safety threshold (85%). Executes reactive containment (`BLOCK_IP: 198.51.100.72`, `ISOLATE_HOST`). |
| 5. Cryptographic Audit Archiver | Gemini GenAI Markdown Compiler | Compiles a step-by-step non-repudiable audit log trail and an executive Markdown security brief for security teams. |

---

## User Interface & Telemetry Replay Engine

Built with React 19 and Tailwind CSS, the interface provides a dark-mode cockpit split into a balanced 3-column grid layout:

1. Top Metrics Bar: Displays real-time System Health (`ONLINE`), Active Isolation Alerts, and overall Infrastructure Threat Index (`LOW` vs `CRITICAL / APT THREAT`).
2. Left Column (`PipelineFlow`): Displays visual progress for the 5 agents (`Idle`, `Processing`, `Complete`) with real-time confidence readouts.
3. Center Column (`IncidentFeed`): Displays chronological log telemetry cards, highlighting rogue IPs (`198.51.100.72`), suspicious commands (`dump_lsass.ps1`), and MITRE ATT&CK badges (`T1003`, `T1021`, `T1048`).
4. Right Column (`AuditReport`): Renders the Executive Security Brief in clean Markdown alongside an immutable step-by-step transaction validation log trail.
5. Interactive Replay Controls:
   * Run Normal Activity Profile: Replays benign daytime intranet traffic (`0%` threat index).
   * Execute 2:00 AM Attack Infiltration Simulation: Replays a 4-stage APT attack timeline (Admin login from rogue IP -> PowerShell LSASS dump -> Database share mapping -> Outbound POST spike), activating all 5 agents and executing autonomous SOAR containment within seconds.

---

## Installation & Setup Guide

### Prerequisites
* Python 3.10+
* Node.js 18+ & npm

---

### Step 1: Clone the Repository
```powershell
git clone https://github.com/tusharpawar1241/SentinelAI.git
cd SentinelAI
```

---

### Step 2: Initialize Python Virtual Environment & Dependencies
```powershell
# Create Python virtual environment
python -m venv .venv

# Activate environment (Windows PowerShell)
.\.venv\Scripts\Activate.ps1

# Install backend Python dependencies
.\.venv\Scripts\pip install -r requirements.txt
```

---

### Step 3: Install Node.js Frontend Dependencies
```powershell
npm install
```

---

### Step 4: (Optional) Configure Gemini API Key
SentinelAI includes built-in offline fallback heuristics so you can run and test everything out of the box. To enable live GenAI RAG mapping with Gemini:
```powershell
# Windows PowerShell
$env:GEMINI_API_KEY="your-google-gemini-api-key"
```

---

### Step 5: Launch the Servers

#### 1. Start the FastAPI Backend Server:
```powershell
.\.venv\Scripts\python -m uvicorn server.main:app --reload --port 8000
```
Backend API will run at `http://127.0.0.1:8000/`.

#### 2. Start the React Frontend Cockpit:
In a new terminal window, run:
```powershell
npm run dev
```
Frontend UI will run at `http://localhost:5173/`.

Open `http://localhost:5173/` in your web browser to view and interact with the SentinelAI dashboard.

---

## Codebase Directory Layout Matrix

```text
sentinel-ai-core/
├── server/
│   ├── __init__.py
│   ├── main.py            # FastAPI Application & Router Endpoints (/api/analyze-telemetry)
│   ├── schemas.py         # Pydantic Core Models (SecurityLog, LogIngestionPayload, AgentDecisionStep)
│   ├── orchestrator.py    # Shared LangGraph Engine State Machine (SentinelAgentState)
│   ├── simulator.py       # Simulated Ingestion Scenarios (Normal vs 2AM Attack logs)
│   └── agents/
│       ├── __init__.py
│       ├── behavior.py    # Behavioral Anomaly Engine (Unsupervised Isolation Forest)
│       ├── threat_rag.py  # Semantic Threat Intel RAG (Gemini API + MITRE ATT&CK Mapping)
│       ├── prediction.py  # Proactive Attack Path Predictor
│       ├── response.py    # Mock SOAR Network Action Execution Handler
│       └── report.py      # Markdown Audit Trail Brief Compiler
├── src/
│   ├── App.jsx            # Main Cockpit Dashboard Layout Orchestrator & Controls
│   ├── index.css          # Core Tailwind CSS & Glassmorphism Styling
│   └── components/
│       ├── PipelineFlow.jsx   # 5-Agent Execution State Matrix View
│       ├── IncidentFeed.jsx   # Chronological Incident Alert Lists & MITRE Badges
│       └── AuditReport.jsx    # Executive Markdown Brief & Immutable Audit Log Trail
├── requirements.txt       # Pinned Python Dependencies
└── package.json           # Front-End Node.js Dependencies
```

---

## Hackathon Evaluation Matrix

| Judging Criteria (Weight) | Fulfillment in SentinelAI |
| :--- | :--- |
| Technical Excellence (25%) | 5-agent LangGraph sequential state machine combining unsupervised Isolation Forest ML with Gemini GenAI LLM RAG. |
| Business Impact (25%) | Compresses Mean Time To Detect (MTTD) and Respond (MTTR) from weeks to seconds via autonomous SOAR containment. |
| Scalability (20%) | Pydantic strict data validation, FastAPI async web router, and modular agent boundaries preventing context drift. |
| User Experience (15%) | React 19 + Tailwind CSS dark cockpit interface with Top Metrics Bar, Pipeline Flow, Incident Feed, and Audit Report. |
| Innovation (15%) | Proactive attack trajectory prediction paired with an immutable audit log trail for non-repudiable inspection. |
