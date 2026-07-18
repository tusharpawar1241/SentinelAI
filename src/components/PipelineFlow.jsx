import React from 'react';
import { 
  Activity, 
  Search, 
  Zap, 
  ShieldAlert, 
  FileText, 
  CheckCircle2, 
  Loader2, 
  CircleDot 
} from 'lucide-react';

const AGENTS = [
  {
    id: 'behavior',
    name: 'Behavioral Anomaly Engine',
    subtitle: 'ML Feature Scoring (Isolation Forest)',
    icon: Activity,
  },
  {
    id: 'threat_rag',
    name: 'Semantic Threat Intel RAG',
    subtitle: 'GenAI LLM Semantic Parser',
    icon: Search,
  },
  {
    id: 'prediction',
    name: 'Proactive Path Predictor',
    subtitle: 'Threat Vector Trajectory Engine',
    icon: Zap,
  },
  {
    id: 'response',
    name: 'SOAR Response Orchestrator',
    subtitle: 'Mock SOAR Action Execution Handler',
    icon: ShieldAlert,
  },
  {
    id: 'report',
    name: 'Cryptographic Audit Archiver',
    subtitle: 'Markdown Audit Brief Compiler',
    icon: FileText,
  },
];

export default function PipelineFlow({ executionState, activeStep, stateData }) {
  // Determine node status
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
          ? `Score: ${(stateData.anomaly_score * 100).toFixed(0)}% (${stateData.is_threat_detected ? 'ANOMALY' : 'BENIGN'})`
          : null;
      case 'threat_rag':
        return stateData.mitre_mappings
          ? `Mapped: ${stateData.mitre_mappings.length} technique(s)`
          : null;
      case 'prediction':
        return stateData.predicted_next_moves
          ? `Predicted: ${stateData.predicted_next_moves.length} vector(s)`
          : null;
      case 'response':
        return stateData.remediation_actions
          ? `Actions: ${stateData.remediation_actions.length} executed`
          : null;
      case 'report':
        return stateData.final_executive_summary ? 'Brief Compiled' : null;
      default:
        return null;
    }
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 backdrop-blur-md shadow-xl flex flex-col h-full">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${executionState === 'processing' ? 'bg-amber-400' : 'bg-emerald-400'} opacity-75`}></span>
              <span className={`relative inline-flex rounded-full h-3 w-3 ${executionState === 'processing' ? 'bg-amber-500' : executionState === 'complete' ? 'bg-emerald-500' : 'bg-slate-500'}`}></span>
            </span>
            Pipeline Execution Flow
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">5-Agent Sequential State Machine</p>
        </div>
        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${
          executionState === 'processing' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
          executionState === 'complete' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
          'bg-slate-800 text-slate-400 border-slate-700'
        }`}>
          {executionState.toUpperCase()}
        </span>
      </div>

      <div className="flex-1 space-y-4">
        {AGENTS.map((agent, index) => {
          const Icon = agent.icon;
          const status = getStepStatus(index);
          const readout = getMetricReadout(agent.id);

          return (
            <div key={agent.id} className="relative">
              {/* Vertical connecting line */}
              {index < AGENTS.length - 1 && (
                <div className={`absolute left-5 top-10 w-0.5 h-8 -mb-2 transition-colors duration-300 ${
                  status === 'complete' ? 'bg-emerald-500/50' : 'bg-slate-800'
                }`} />
              )}

              <div className={`flex items-start gap-3 p-3.5 rounded-lg border transition-all duration-300 ${
                status === 'processing' 
                  ? 'bg-amber-500/10 border-amber-500/40 shadow-lg shadow-amber-500/5 scale-[1.02]' 
                  : status === 'complete'
                  ? 'bg-slate-800/60 border-emerald-500/30 text-slate-200'
                  : 'bg-slate-950/40 border-slate-800/80 text-slate-500'
              }`}>
                {/* Status Indicator Icon */}
                <div className={`p-2 rounded-lg flex items-center justify-center shrink-0 ${
                  status === 'processing' ? 'bg-amber-500/20 text-amber-400 animate-pulse' :
                  status === 'complete' ? 'bg-emerald-500/20 text-emerald-400' :
                  'bg-slate-800 text-slate-600'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>

                {/* Node Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className={`text-sm font-semibold truncate ${
                      status === 'processing' ? 'text-amber-300' :
                      status === 'complete' ? 'text-slate-100' : 'text-slate-400'
                    }`}>
                      {agent.name}
                    </h3>
                    
                    {/* Status Badge */}
                    {status === 'processing' && <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />}
                    {status === 'complete' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    {status === 'idle' && <CircleDot className="w-4 h-4 text-slate-700" />}
                  </div>

                  <p className="text-xs text-slate-400 mt-0.5 truncate">{agent.subtitle}</p>

                  {/* Real-time Confidence Readout Metric */}
                  {readout && (
                    <div className="mt-2 text-xs inline-block px-2 py-0.5 rounded bg-slate-900/90 border border-slate-700 text-slate-300 font-mono">
                      {readout}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
