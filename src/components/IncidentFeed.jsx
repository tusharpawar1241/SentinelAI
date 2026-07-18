import React from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  Terminal, 
  Server, 
  User, 
  Globe, 
  Clock, 
  Lock, 
  ShieldCheck 
} from 'lucide-react';

export default function IncidentFeed({ logs, mitreMappings, isThreatDetected }) {
  if (!logs || logs.length === 0) {
    return (
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 backdrop-blur-md shadow-xl flex flex-col h-full items-center justify-center text-slate-500">
        <ShieldCheck className="w-12 h-12 mb-2 text-slate-700" />
        <p className="text-sm font-medium">No active telemetry logs loaded</p>
        <p className="text-xs text-slate-600 mt-1">Select a profile above to execute simulation replay</p>
      </div>
    );
  }

  // Helper to check if log has suspicious characteristics
  const isSuspiciousLog = (log) => {
    const cmd = log.command_line || '';
    const desc = log.description || '';
    const ip = log.source_ip || '';
    return (
      cmd.includes('dump_lsass') ||
      cmd.includes('Bypass') ||
      cmd.includes('curl') ||
      cmd.includes('net use') ||
      (!ip.startsWith('10.') && !ip.startsWith('192.168.')) ||
      log.event_id === 4688 ||
      log.event_id === 5038
    );
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 backdrop-blur-md shadow-xl flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Terminal className="w-5 h-5 text-indigo-400" />
            Telemetry Incident Feed
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Chronological CNI Telemetry Alert Stream ({logs.length} logs)</p>
        </div>
        
        {/* Threat Status Badge */}
        {isThreatDetected ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full bg-red-500/15 text-red-400 border border-red-500/30 animate-pulse">
            <ShieldAlert className="w-3.5 h-3.5" />
            APT THREAT DETECTED
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            BENIGN OPERATIONAL
          </span>
        )}
      </div>

      {/* MITRE ATT&CK Badges (if mapped) */}
      {mitreMappings && mitreMappings.length > 0 && (
        <div className="mb-4 p-3 rounded-lg bg-red-950/40 border border-red-800/50">
          <h3 className="text-xs font-bold text-red-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            Matched MITRE ATT&CK Matrix Techniques:
          </h3>
          <div className="flex flex-wrap gap-2">
            {mitreMappings.map((m, idx) => (
              <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-mono font-bold rounded bg-red-500/20 text-red-200 border border-red-500/40">
                <span className="text-red-400">{m.technique_id}</span> - {m.tactic_name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Log Feed Items */}
      <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 max-h-[560px] custom-scrollbar">
        {logs.map((log, index) => {
          const suspicious = isSuspiciousLog(log);
          const isExternal = log.source_ip && !log.source_ip.startsWith('10.') && !log.source_ip.startsWith('192.168.');

          return (
            <div 
              key={index}
              className={`p-4 rounded-xl border transition-all duration-200 ${
                suspicious 
                  ? 'bg-red-950/20 border-red-500/40 shadow-md shadow-red-950/50 hover:border-red-500/60' 
                  : 'bg-slate-950/50 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    {log.timestamp}
                  </span>
                  {log.event_id && (
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                      EVT #{log.event_id}
                    </span>
                  )}
                </div>

                {suspicious ? (
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-red-500/20 text-red-400 border border-red-500/30">
                    High Risk Alert
                  </span>
                ) : (
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-slate-800 text-slate-400">
                    Normal Log
                  </span>
                )}
              </div>

              {/* Event Description */}
              <p className="text-sm font-medium text-slate-200 mb-2.5">
                {log.description}
              </p>

              {/* Technical Attributes Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono mb-2.5">
                <div className="flex items-center gap-1.5 text-slate-400 bg-slate-900/60 p-2 rounded border border-slate-800">
                  <Server className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span className="truncate">{log.source_system}</span>
                </div>

                <div className="flex items-center gap-1.5 text-slate-400 bg-slate-900/60 p-2 rounded border border-slate-800">
                  <User className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  <span className="truncate">{log.user_id}</span>
                </div>

                <div className={`flex items-center gap-1.5 p-2 rounded border ${
                  isExternal ? 'bg-amber-500/10 border-amber-500/30 text-amber-300 font-bold' : 'bg-slate-900/60 border-slate-800 text-slate-400'
                }`}>
                  <Globe className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <span className="truncate">Src: {log.source_ip}</span>
                </div>

                <div className="flex items-center gap-1.5 text-slate-400 bg-slate-900/60 p-2 rounded border border-slate-800">
                  <Lock className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span className="truncate">Dst: {log.destination_ip || 'Internal'}</span>
                </div>
              </div>

              {/* Command Line Payload */}
              {log.command_line && (
                <div className="p-2.5 rounded-lg bg-black/60 border border-slate-800 font-mono text-xs text-slate-300 break-all flex items-start gap-2">
                  <span className="text-indigo-400 shrink-0 select-none">$</span>
                  <span className={log.command_line.includes('dump_lsass') ? 'text-red-400 font-bold' : 'text-slate-300'}>
                    {log.command_line}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
