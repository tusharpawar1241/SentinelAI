import React from 'react';
import { ShieldCheck, Zap, Server, Globe } from 'lucide-react';
import Tooltip from './Tooltip';

export default function SoarActionsHub({ remediationActions }) {
  if (!remediationActions || remediationActions.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 shadow-xl flex flex-col items-center justify-center text-center h-full min-h-45">
        <ShieldCheck className="w-9 h-9 text-slate-700 mb-2" />
        <h3 className="text-sm font-bold text-slate-400">No Containment Actions Triggered</h3>
        <p className="text-xs text-slate-500 mt-1">SOAR playbooks execute automatically when threat index exceeds 85% safety threshold.</p>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800 shadow-xl flex flex-col justify-between h-full">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
        <Tooltip 
          title="Automated SOAR Containment" 
          text="Security Orchestration, Automation, & Response: Automated firewall blocks and server network isolations executed instantly by AI without waiting for human intervention." 
          position="top"
        >
          <div className="flex items-center gap-2 cursor-help">
            <Zap className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-slate-100">Automated SOAR Containment Hub</h3>
          </div>
        </Tooltip>

        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
          {remediationActions.length} CONTAINMENT ACTIONS EXECUTED
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 flex-1 overflow-y-auto custom-scrollbar">
        {remediationActions.map((action, idx) => {
          const actionText = action.action || action;
          const isIpBlock = actionText.includes('BLOCK_IP');

          return (
            <Tooltip 
              key={idx}
              title={isIpBlock ? "Firewall IP Block" : "Host System Isolation"}
              text={isIpBlock ? "Automated firewall rule added to drop all network traffic to/from this malicious IP address." : "Automated network isolation applied to disconnect this server from the internal network."}
              position="top"
            >
              <div 
                className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between hover:border-amber-500/40 transition-all space-y-3 cursor-help h-full"
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2.5 rounded-xl shrink-0 ${isIpBlock ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'}`}>
                    {isIpBlock ? <Globe className="w-4 h-4" /> : <Server className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] uppercase font-extrabold text-slate-400 tracking-wider block mb-0.5">
                      {isIpBlock ? 'Firewall Rule' : 'Host Isolation'}
                    </span>
                    <h4 className="text-xs font-mono font-bold text-slate-100 leading-snug break-all">
                      {actionText}
                    </h4>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[10px] font-mono">
                  <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    [EXECUTED]
                  </span>
                  <span className="text-slate-500">Latency: &lt;12ms</span>
                </div>
              </div>
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
}
