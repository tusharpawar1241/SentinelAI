import React from 'react';
import { Crosshair, Sparkles, CheckCircle2 } from 'lucide-react';
import Tooltip from './Tooltip';

export default function MitreMatrixGrid({ mitreMappings, isThreatDetected }) {
  if (!mitreMappings || mitreMappings.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 shadow-xl flex flex-col items-center justify-center text-center h-full min-h-[220px]">
        <CheckCircle2 className="w-10 h-10 text-emerald-500/40 mb-2" />
        <h3 className="text-sm font-bold text-slate-300">No MITRE ATT&CK Threats Detected</h3>
        <p className="text-xs text-slate-500 max-w-sm mt-1">
          {isThreatDetected 
            ? 'Analyzing semantic log telemetry against official MITRE ATT&CK tactics...' 
            : 'All operational telemetry matches benign corporate activity standards.'}
        </p>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800 shadow-xl flex flex-col justify-between h-full">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
        <Tooltip 
          title="MITRE ATT&CK Matrix" 
          text="A industry-standard dictionary mapping real-world cyber attack tactics (like password stealing, lateral server movement, and data exfiltration)." 
          position="top"
        >
          <div className="flex items-center gap-2 cursor-help">
            <Crosshair className="w-4 h-4 text-red-400" />
            <h3 className="text-sm font-bold text-slate-100">MITRE ATT&CK Matrix Mapping</h3>
          </div>
        </Tooltip>

        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/40">
          {mitreMappings.length} TECHNIQUES MATCHED
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 flex-1 overflow-y-auto custom-scrollbar">
        {mitreMappings.map((item, idx) => {
          const isCritical = item.severity === 'CRITICAL';

          return (
            <Tooltip 
              key={idx}
              title={`Technique ${item.technique_id}: ${item.tactic_name}`}
              text={`Matched technique description: ${item.summary}`}
              position="top"
            >
              <div
                className={`p-3.5 rounded-xl border transition-all duration-200 flex flex-col justify-between cursor-help h-full ${
                  isCritical 
                    ? 'bg-red-950/20 border-red-500/40 hover:border-red-500/60 shadow-lg shadow-red-950/40' 
                    : 'bg-amber-950/20 border-amber-500/40 hover:border-amber-500/60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span className="text-xs font-mono font-black text-red-400 bg-red-500/20 px-2 py-0.5 rounded border border-red-500/30">
                      {item.technique_id}
                    </span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                      isCritical ? 'bg-red-500/30 text-red-200 border border-red-500/50' : 'bg-amber-500/30 text-amber-200 border border-amber-500/50'
                    }`}>
                      {item.severity}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-200 mb-1">
                    {item.tactic_name}
                  </h4>

                  <p className="text-[11px] text-slate-400 leading-snug">
                    {item.summary}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
                  <span>Semantic GenAI Match</span>
                  <Sparkles className="w-3 h-3 text-indigo-400" />
                </div>
              </div>
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
}
