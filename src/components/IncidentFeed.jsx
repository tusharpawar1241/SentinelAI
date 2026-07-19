import React, { useState, useMemo } from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  Terminal, 
  Server, 
  User, 
  Globe, 
  Clock, 
  Lock, 
  ShieldCheck,
  Search,
  Code
} from 'lucide-react';

export default function IncidentFeed({ logs, mitreMappings, isThreatDetected }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('ALL'); // 'ALL', 'ANOMALY', 'NORMAL'

  const isSuspiciousLog = (log) => {
    const cmd = log.command_line || '';
    const ip = log.source_ip || '';
    return (
      cmd.includes('dump_lsass') ||
      cmd.includes('Bypass') ||
      cmd.includes('curl') ||
      cmd.includes('net use') ||
      (!ip.startsWith('10.') && !ip.startsWith('192.168.')) ||
      log.event_id === 5038
    );
  };

  const filteredLogs = useMemo(() => {
    if (!logs) return [];
    return logs.filter((log) => {
      const matchesSearch = 
        !searchTerm ||
        log.source_system?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.user_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.source_ip?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.command_line?.toLowerCase().includes(searchTerm.toLowerCase());

      const suspicious = isSuspiciousLog(log);
      const matchesSeverity = 
        filterSeverity === 'ALL' ||
        (filterSeverity === 'ANOMALY' && suspicious) ||
        (filterSeverity === 'NORMAL' && !suspicious);

      return matchesSearch && matchesSeverity;
    });
  }, [logs, searchTerm, filterSeverity]);

  if (!logs || logs.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-8 border border-slate-800 shadow-xl flex flex-col items-center justify-center text-center h-full min-h-[450px]">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-slate-600 mb-3">
          <ShieldCheck className="w-12 h-12 text-slate-700" />
        </div>
        <h3 className="text-base font-bold text-slate-300">No Active Telemetry Feed Loaded</h3>
        <p className="text-xs text-slate-500 max-w-sm mt-1 mb-4">
          Select a simulation profile from the header controls to stream live security telemetry logs into the multi-agent engine.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800 shadow-xl flex flex-col h-full space-y-4">
      {/* Header with Search & Filter Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Terminal className="w-5 h-5 text-cyan-400" />
            Telemetry Incident Feed Explorer
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Chronological Infrastructure Telemetry Stream ({filteredLogs.length} of {logs.length} logs matched)
          </p>
        </div>

        {/* Threat Status Badge */}
        {isThreatDetected ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full bg-red-500/20 text-red-300 border border-red-500/40 glow-red animate-pulse">
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

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search IP, host, command line, event ID..."
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500/60"
          />
        </div>

        {/* Filter tags */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto bg-slate-950/80 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setFilterSeverity('ALL')}
            className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all ${
              filterSeverity === 'ALL'
                ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Logs ({logs.length})
          </button>

          <button
            onClick={() => setFilterSeverity('ANOMALY')}
            className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all ${
              filterSeverity === 'ANOMALY'
                ? 'bg-red-600/30 text-red-300 border border-red-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Anomalies
          </button>

          <button
            onClick={() => setFilterSeverity('NORMAL')}
            className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all ${
              filterSeverity === 'NORMAL'
                ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Benign
          </button>
        </div>
      </div>

      {/* MITRE ATT&CK Matrix Banner */}
      {mitreMappings && mitreMappings.length > 0 && (
        <div className="p-3.5 rounded-xl bg-red-950/30 border border-red-500/30 flex flex-col gap-2">
          <h3 className="text-xs font-bold text-red-300 uppercase tracking-wider flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
            Mapped MITRE ATT&CK Threat Vectors ({mitreMappings.length}):
          </h3>
          <div className="flex flex-wrap gap-2">
            {mitreMappings.map((m, idx) => (
              <span key={idx} className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-bold rounded-lg bg-red-500/20 text-red-200 border border-red-500/40 shadow">
                <span className="text-red-400">{m.technique_id}</span>
                <span className="text-slate-300 font-sans">• {m.tactic_name}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Log Feed Stream List */}
      <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 max-h-[580px] custom-scrollbar">
        {filteredLogs.map((log, index) => {
          const suspicious = isSuspiciousLog(log);
          const isExternal = log.source_ip && !log.source_ip.startsWith('10.') && !log.source_ip.startsWith('192.168.');

          return (
            <div 
              key={index}
              className={`p-4 rounded-xl border transition-all duration-200 ${
                suspicious 
                  ? 'bg-red-950/20 border-red-500/40 shadow-lg shadow-red-950/40 hover:border-red-500/70' 
                  : 'bg-slate-950/50 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              {/* Card Header Row */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    {log.timestamp}
                  </span>
                  {log.event_id && (
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      EVT #{log.event_id}
                    </span>
                  )}
                </div>

                {suspicious ? (
                  <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full bg-red-500/20 text-red-300 border border-red-500/40 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-red-400" />
                    High Risk Anomaly
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                    Benign Activity
                  </span>
                )}
              </div>

              {/* Event Description */}
              <p className="text-xs font-semibold text-slate-100 mb-3 leading-relaxed">
                {log.description}
              </p>

              {/* Grid of Key Technical Attributes */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono mb-3">
                <div className="flex items-center gap-1.5 text-slate-300 bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                  <Server className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span className="truncate" title={log.source_system}>{log.source_system}</span>
                </div>

                <div className="flex items-center gap-1.5 text-slate-300 bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                  <User className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  <span className="truncate" title={log.user_id}>{log.user_id}</span>
                </div>

                <div className={`flex items-center gap-1.5 p-2 rounded-lg border ${
                  isExternal 
                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 font-bold shadow' 
                    : 'bg-slate-900/80 border-slate-800 text-slate-300'
                }`}>
                  <Globe className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <span className="truncate">Src: {log.source_ip}</span>
                </div>

                <div className="flex items-center gap-1.5 text-slate-300 bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                  <Lock className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span className="truncate">Dst: {log.destination_ip || 'N/A'}</span>
                </div>
              </div>

              {/* Command Line Box */}
              {log.command_line && (
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/90 font-mono text-xs text-slate-200 break-all flex items-start gap-2 shadow-inner">
                  <Code className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Process Execution Command</span>
                    <span className={log.command_line.includes('dump_lsass') || log.command_line.includes('Bypass') ? 'text-red-400 font-bold' : 'text-cyan-200'}>
                      {log.command_line}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
