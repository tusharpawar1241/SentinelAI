import React, { useState } from 'react';
import { 
  Activity, 
  Search, 
  Zap, 
  ShieldAlert, 
  FileText, 
  CheckCircle2, 
  Loader2, 
  CircleDot,
  Cpu
} from 'lucide-react';

const AGENTS = [
  {
    id: 'behavior',
    name: 'Behavioral Anomaly Engine',
    role: 'ML Feature Scoring & Outlier Detection',
    tech: 'scikit-learn Isolation Forest',
    icon: Activity,
    color: 'from-emerald-500 to-teal-600',
    description: 'Evaluates multi-dimensional telemetry vectors without malware signatures to detect baseline anomalies.'
  },
  {
    id: 'threat_rag',
    name: 'Semantic Threat Intel RAG',
    role: 'Semantic Parsing & MITRE Mapping',
    tech: 'Google GenAI SDK (Gemini 3.5 Flash)',
    icon: Search,
    color: 'from-cyan-500 to-blue-600',
    description: 'Cross-examines raw log commands against MITRE ATT&CK tactics (e.g., LSASS dumping, credential access).'
  },
  {
    id: 'prediction',
    name: 'Proactive Path Predictor',
    role: 'Attack Vector Trajectory Graph Engine',
    tech: 'Path Graph Trajectory Algorithm',
    icon: Zap,
    color: 'from-indigo-500 to-purple-600',
    description: 'Calculates imminent next-stage threat actor lateral moves with likelihood percentages.'
  },
  {
    id: 'response',
    name: 'SOAR Response Orchestrator',
    role: 'Autonomous Containment Playbooks',
    tech: 'Pre-approved Containment Safety Guard',
    icon: ShieldAlert,
    color: 'from-amber-500 to-red-600',
    description: 'Evaluates threat confidence against an 85% safety threshold and executes firewall & host isolation rules.'
  },
  {
    id: 'report',
    name: 'Cryptographic Audit Archiver',
    role: 'Non-Repudiable Brief & Audit Compiler',
    tech: 'Gemini Markdown Executive Compiler',
    icon: FileText,
    color: 'from-purple-500 to-pink-600',
    description: 'Compiles the full multi-agent state into an executive Markdown brief and non-repudiable audit log.'
  },
];

export default function PipelineFlow({ executionState, activeStep, stateData }) {
  const [selectedAgentId, setSelectedAgentId] = useState('behavior');

  const getStepStatus = (index) => {
    if (executionState === 'idle') return 'idle';
    if (executionState === 'complete') return 'complete';
    if (executionState === 'processing') {
      if (index < activeStep) return 'complete';
      if (index === activeStep) return 'processing';
      return 'idle';
    }
    return 'idle';
  };

  const getMetricReadout = (agentId) => {
    if (!stateData || executionState === 'idle') return null;
    switch (agentId) {
      case 'behavior':
        return stateData.anomaly_score !== undefined
          ? `Anomaly Score: ${(stateData.anomaly_score * 100).toFixed(0)}%`
          : null;
      case 'threat_rag':
        return stateData.mitre_mappings
          ? `Mapped ${stateData.mitre_mappings.length} MITRE Technique(s)`
          : null;
      case 'prediction':
        return stateData.predicted_next_moves
          ? `Predicted ${stateData.predicted_next_moves.length} Attack Path(s)`
          : null;
      case 'response':
        return stateData.remediation_actions
          ? `${stateData.remediation_actions.length} Containment Action(s) Executed`
          : null;
      case 'report':
        return stateData.final_executive_summary ? 'Executive Report Compiled' : null;
      default:
        return null;
    }
  };

  const getAgentAuditStep = (agentName) => {
    if (!stateData || !stateData.audit_trail) return null;
    return stateData.audit_trail.find((s) => s.agent_name?.toLowerCase().includes(agentName.toLowerCase().split(' ')[0]));
  };

  const selectedAgent = AGENTS.find((a) => a.id === selectedAgentId) || AGENTS[0];
  const selectedAuditStep = getAgentAuditStep(selectedAgent.name);

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800 shadow-xl flex flex-col h-full space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-indigo-400" />
            Multi-Agent Autonomous LangGraph Flow
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            5-Node Sequential Execution & Decision Inspector
          </p>
        </div>

        <span className={`px-3 py-1 text-xs font-mono font-bold rounded-full border ${
          executionState === 'processing' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse' :
          executionState === 'complete' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' :
          'bg-slate-800 text-slate-400 border-slate-700'
        }`}>
          {executionState === 'processing' ? `EXECUTING AGENT ${activeStep + 1}/5` : executionState.toUpperCase()}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 min-h-[520px]">
        {/* Left Col: Interactive Node Stack */}
        <div className="lg:col-span-5 space-y-3.5">
          {AGENTS.map((agent, index) => {
            const Icon = agent.icon;
            const status = getStepStatus(index);
            const readout = getMetricReadout(agent.id);
            const isSelected = selectedAgentId === agent.id;

            return (
              <div 
                key={agent.id} 
                onClick={() => setSelectedAgentId(agent.id)}
                className={`relative p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                  isSelected 
                    ? 'bg-linear-to-r from-slate-900 to-slate-800/90 border-indigo-500/60 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500/30' 
                    : 'bg-slate-950/50 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                {/* Connector Line */}
                {index < AGENTS.length - 1 && (
                  <div className={`absolute left-7 bottom-[-14px] w-0.5 h-3.5 z-10 ${
                    status === 'complete' ? 'bg-emerald-500' : 'bg-slate-800'
                  }`} />
                )}

                <div className="flex items-start gap-3.5">
                  <div className={`p-2.5 rounded-xl text-white bg-linear-to-br ${agent.color} shadow-md shrink-0`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-slate-100 truncate">
                        {agent.name}
                      </h3>
                      
                      {status === 'processing' && <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />}
                      {status === 'complete' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                      {status === 'idle' && <CircleDot className="w-4 h-4 text-slate-700" />}
                    </div>

                    <p className="text-[11px] text-slate-400 mt-0.5 truncate">{agent.role}</p>

                    {readout && (
                      <div className="mt-2 text-[10px] font-mono inline-block px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-cyan-300 font-bold">
                        {readout}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Col: Deep Node Inspector */}
        <div className="lg:col-span-7 bg-slate-950/70 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 pb-3 border-b border-slate-800 mb-4">
              <div className={`p-2 rounded-xl text-white bg-linear-to-br ${selectedAgent.color}`}>
                {React.createElement(selectedAgent.icon, { className: 'w-5 h-5' })}
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">Agent Node Inspector</span>
                <h3 className="text-sm font-bold text-slate-100">{selectedAgent.name}</h3>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Architecture & Technology</span>
                <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-500/10 px-2.5 py-1 rounded border border-cyan-500/20 inline-block">
                  {selectedAgent.tech}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Core Function & Responsibilities</span>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-800/80">
                  {selectedAgent.description}
                </p>
              </div>

              {/* Live Decision Step Inspector */}
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Latest Execution Decision</span>
                {selectedAuditStep ? (
                  <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="font-bold text-emerald-400">Action: {selectedAuditStep.action_taken}</span>
                      <span className="text-slate-400">Conf: {((selectedAuditStep.confidence_score || 0.95) * 100).toFixed(0)}%</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-normal font-sans">
                      {selectedAuditStep.reasoning_explanation}
                    </p>
                  </div>
                ) : (
                  <div className="p-4 rounded-lg bg-slate-900/40 border border-slate-800/60 text-slate-500 text-xs text-center">
                    Run simulation to view real-time decision steps for this agent node.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>LangGraph Node ID: {selectedAgent.id}</span>
            <span>State Sync: Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
