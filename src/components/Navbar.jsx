import React from 'react';
import { 
  ShieldAlert, 
  Activity, 
  Lock, 
  Server,
  LayoutDashboard,
  Terminal,
  Cpu,
  FileText,
  ShieldCheck
} from 'lucide-react';
import Tooltip from './Tooltip';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  stateData, 
  executionState 
}) {
  const getThreatBadge = () => {
    if (executionState === 'idle') {
      return { 
        label: 'NOMINAL / MONITORED', 
        color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
      };
    }
    if (!stateData.is_threat_detected) {
      return { 
        label: 'LOW / BENIGN', 
        color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
      };
    }
    return { 
      label: 'CRITICAL / APT THREAT', 
      color: 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse glow-red' 
    };
  };

  const threatBadge = getThreatBadge();
  const soarCount = stateData.remediation_actions ? stateData.remediation_actions.length : 0;
  const mitreCount = stateData.mitre_mappings ? stateData.mitre_mappings.length : 0;

  const tabs = [
    { 
      id: 'cockpit', 
      label: 'Security Cockpit', 
      icon: LayoutDashboard, 
      badge: mitreCount > 0 ? mitreCount : null,
      tooltipTitle: 'Security Cockpit',
      tooltipText: 'Main visual dashboard summarizing risk score, hacker techniques, firewall actions, and predicted next moves.'
    },
    { 
      id: 'telemetry', 
      label: 'Telemetry Explorer', 
      icon: Terminal, 
      badge: stateData.raw_logs ? stateData.raw_logs.length : null,
      tooltipTitle: 'Telemetry Explorer',
      tooltipText: 'Searchable live stream of system logs, user logins, server events, and network commands.'
    },
    { 
      id: 'agents', 
      label: 'Multi-Agent Network', 
      icon: Cpu, 
      badge: null,
      tooltipTitle: 'Multi-Agent AI Network',
      tooltipText: 'Interactive flow diagram showing 5 specialized AI agents analyzing data step-by-step.'
    },
    { 
      id: 'report', 
      label: 'Executive Brief & Audit', 
      icon: FileText, 
      badge: null,
      tooltipTitle: 'Executive Report & Audit',
      tooltipText: 'AI-generated executive security summary and step-by-step record of AI decision history.'
    }
  ];

  return (
    <header className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-2xl backdrop-blur-xl flex flex-col gap-4 relative z-30">
      {/* Top Header Row */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Logo and Tagline */}
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-linear-to-br from-indigo-500 via-purple-600 to-cyan-500 shadow-lg shadow-indigo-500/20 ring-1 ring-white/20">
            <ShieldAlert className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-1.5">
                SENTINEL<span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-indigo-400">AI</span>
              </h1>
              <Tooltip 
                title="CNI SOC Platform" 
                text="Critical National Infrastructure Security Operations Center powered by autonomous AI agents." 
                position="bottom"
              >
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 uppercase tracking-wider cursor-help">
                  CNI SOC v2.5
                </span>
              </Tooltip>
            </div>
            <p className="text-xs text-slate-400 font-medium">Autonomous Multi-Agent Cyber Defense & Threat Intelligence Platform</p>
          </div>
        </div>

        {/* Real-time System Telemetry Badges */}
        <div className="flex items-center gap-3 flex-wrap justify-center">
          <Tooltip 
            title="System Engine Status: 100% Operational" 
            text="All backend services, graph orchestrator nodes, and Gemini AI models are fully operational with 100% health." 
            position="bottom"
          >
            <div className="px-3.5 py-2 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center gap-2.5 shadow-inner cursor-help">
              <Server className="w-4 h-4 text-emerald-400" />
              <div>
                <div className="text-[9px] uppercase text-slate-500 font-bold tracking-wider">System Engine</div>
                <div className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block"></span>
                  ONLINE (100% HEALTHY)
                </div>
              </div>
            </div>
          </Tooltip>

          <Tooltip 
            title="Active SOAR Actions" 
            text="SOAR = Security Orchestration, Automation, & Response. Automated firewall IP blocks & computer isolations executed by AI to stop attacks." 
            position="bottom"
          >
            <div className="px-3.5 py-2 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center gap-2.5 shadow-inner cursor-help">
              <Lock className={`w-4 h-4 ${soarCount > 0 ? 'text-amber-400' : 'text-slate-500'}`} />
              <div>
                <div className="text-[9px] uppercase text-slate-500 font-bold tracking-wider">Active SOAR Actions</div>
                <div className={`text-xs font-bold ${soarCount > 0 ? 'text-amber-300' : 'text-slate-400'}`}>
                  {soarCount} Remediations Executed
                </div>
              </div>
            </div>
          </Tooltip>

          <Tooltip 
            title="Threat Index" 
            text="Overall AI risk level evaluating whether system telemetry is normal or under an active cyber attack." 
            position="bottom"
          >
            <div className="px-3.5 py-2 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center gap-2.5 shadow-inner cursor-help">
              <Activity className="w-4 h-4 text-indigo-400" />
              <div>
                <div className="text-[9px] uppercase text-slate-500 font-bold tracking-wider">Threat Index</div>
                <div className={`text-[11px] font-bold px-2 py-0.5 rounded border mt-0.5 ${threatBadge.color}`}>
                  {threatBadge.label}
                </div>
              </div>
            </div>
          </Tooltip>
        </div>
      </div>

      {/* View Selector Tabs Navigation */}
      <nav className="flex items-center justify-between border-t border-slate-800/80 pt-3 gap-2 overflow-x-auto custom-scrollbar">
        <div className="flex items-center gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <Tooltip 
                key={tab.id} 
                title={tab.tooltipTitle} 
                text={tab.tooltipText} 
                position="bottom"
              >
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer whitespace-nowrap ${
                    isActive 
                      ? 'bg-linear-to-r from-indigo-600/30 to-purple-600/30 text-white border border-indigo-500/50 shadow-lg shadow-indigo-500/10'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                  {tab.label}
                  {tab.badge !== null && tab.badge > 0 && (
                    <span className={`px-1.5 py-0.2 text-[10px] font-mono rounded-full ${
                      tab.id === 'cockpit' && stateData.is_threat_detected 
                        ? 'bg-red-500/20 text-red-300 border border-red-500/40' 
                        : 'bg-slate-800 text-slate-300'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              </Tooltip>
            );
          })}
        </div>

        {/* Quick Help Status */}
        <Tooltip 
          title="Multi-Agent LangGraph Node Engine" 
          text="LangGraph is an AI orchestration framework where 5 specialized agents pass data to each other in sequence." 
          position="bottom"
        >
          <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 font-medium cursor-help">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Multi-Agent LangGraph Node Engine</span>
          </div>
        </Tooltip>
      </nav>
    </header>
  );
}
