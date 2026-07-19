import React from 'react';
import { Target, ArrowRight, ShieldAlert, CheckCircle2 } from 'lucide-react';
import Tooltip from './Tooltip';

export default function PredictiveTrajectoryCard({ predictedMoves }) {
  if (!predictedMoves || predictedMoves.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 shadow-xl flex flex-col items-center justify-center text-center h-full min-h-[180px]">
        <CheckCircle2 className="w-9 h-9 text-slate-700 mb-2" />
        <h3 className="text-sm font-bold text-slate-400">No Attack Trajectory Predicted</h3>
        <p className="text-xs text-slate-500 mt-1">Attack path prediction engine evaluates graph trajectories when anomalous vectors emerge.</p>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800 shadow-xl flex flex-col justify-between h-full">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
        <Tooltip 
          title="Proactive Path Predictor" 
          text="Graph trajectory engine that calculates the attacker's most likely next target server and attack technique before it happens." 
          position="top"
        >
          <div className="flex items-center gap-2 cursor-help">
            <Target className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-slate-100">Proactive Attack Path Predictions</h3>
          </div>
        </Tooltip>

        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
          GRAPH TRAJECTORY ENGINE
        </span>
      </div>

      <div className="space-y-3">
        {predictedMoves.map((item, idx) => {
          const likelihoodPct = Math.round((item.likelihood || 0.95) * 100);

          return (
            <Tooltip 
              key={idx}
              title={`Predicted Trajectory: ${item.target_node}`}
              text={`Likelihood ${likelihoodPct}%: ${item.justification}`}
              position="top"
            >
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 cursor-help">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-red-400" />
                    <h4 className="text-xs font-bold text-slate-200">
                      Target Node: <span className="text-cyan-300 font-mono">{item.target_node}</span>
                    </h4>
                  </div>
                  <span className="text-xs font-mono font-bold text-cyan-400">
                    {likelihoodPct}% Likelihood
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-2.5">
                  <div 
                    className="bg-linear-to-r from-cyan-500 via-indigo-500 to-red-500 h-full rounded-full transition-all duration-700"
                    style={{ width: `${likelihoodPct}%` }}
                  />
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-300 mb-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="font-mono font-semibold text-cyan-200">{item.predicted_technique}</span>
                </div>

                <p className="text-[11px] text-slate-400 bg-slate-900/60 p-2.5 rounded border border-slate-800/60">
                  {item.justification}
                </p>
              </div>
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
}
