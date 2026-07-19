import React from 'react';
import { 
  Play, 
  ShieldAlert, 
  RotateCcw, 
  Layers
} from 'lucide-react';
import Tooltip from './Tooltip';

export default function ScenarioController({ 
  runSimulation, 
  executionState, 
  resetSimulation,
  activeScenario
}) {
  const isProcessing = executionState === 'processing';

  return (
    <div className="glass-panel rounded-2xl p-4 shadow-xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Left: Scenario Info & Label */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-indigo-400">
          <Layers className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            Threat Telemetry Simulation Controller
            <Tooltip 
              title="Interactive Replay Simulation" 
              text="Simulates real-world server logs so you can see how the AI system detects benign behavior vs active cyber attacks." 
              position="top"
            >
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 cursor-help">
                Interactive Replay
              </span>
            </Tooltip>
          </h2>
          <p className="text-xs text-slate-400">
            Select a telemetry profile below to trigger the 5-agent AI orchestrator pipeline
          </p>
        </div>
      </div>

      {/* Center/Right: Action Buttons */}
      <div className="flex items-center gap-3 flex-wrap justify-end w-full md:w-auto">
        <Tooltip 
          title="Normal Corporate Baseline" 
          text="Feeds standard everyday employee activity (workstation logins, Outlook email, file share access) during regular business hours into the AI pipeline." 
          position="top"
        >
          <button
            onClick={() => runSimulation('Standard_Corporate_Activity')}
            disabled={isProcessing}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer shadow-lg ${
              activeScenario === 'Standard_Corporate_Activity' && executionState === 'complete'
                ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/60 ring-2 ring-emerald-500/20'
                : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
            } disabled:opacity-50`}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            Normal Corporate Baseline
          </button>
        </Tooltip>

        <Tooltip 
          title="APT 2:00 AM Attack Infiltration" 
          text="Simulates a multi-stage cyber attack happening at 2:00 AM: rogue VPN login, PowerShell password memory theft, lateral database movement, and outbound file exfiltration." 
          position="top"
        >
          <button
            onClick={() => runSimulation('APT_Credential_Exfiltration_2AM')}
            disabled={isProcessing}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer shadow-lg ${
              activeScenario === 'APT_Credential_Exfiltration_2AM' && executionState === 'complete'
                ? 'bg-red-600/30 text-red-300 border border-red-500/60 ring-2 ring-red-500/20 glow-red'
                : 'bg-red-500/15 hover:bg-red-500/25 text-red-300 border border-red-500/40 animate-pulse'
            } disabled:opacity-50`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            APT 2:00 AM Attack Infiltration
          </button>
        </Tooltip>

        {executionState !== 'idle' && (
          <Tooltip 
            title="Reset Simulation" 
            text="Clears all current threat metrics, log streams, and executive reports so you can start a fresh simulation." 
            position="top"
          >
            <button
              onClick={resetSimulation}
              disabled={isProcessing}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </Tooltip>
        )}
      </div>
    </div>
  );
}
