import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { 
  FileText, 
  Lock, 
  Cpu, 
  Copy, 
  Check, 
  Download, 
  Clock, 
  ShieldAlert, 
  ShieldCheck, 
  Zap, 
  Crosshair, 
  Activity,
  Code
} from 'lucide-react';

export default function AuditReport({ summary, auditTrail, mitreMappings = [], predictedMoves = [], soarActions = [], isThreatDetected = false, anomalyScore = 0 }) {
  const [activeSubTab, setActiveSubTab] = useState('executive'); // 'executive', 'raw', 'audit'
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!summary) return;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!summary) return;
    const blob = new Blob([summary], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SentinelAI_Executive_Brief_${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800 shadow-2xl flex flex-col h-full space-y-4 bg-slate-900/90 backdrop-blur-xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400 shrink-0" />
            Executive Audit & Report Hub
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Non-Repudiable Audit Log & GenAI Executive Security Synthesis
          </p>
        </div>

        {/* Action Controls & Sub-tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center p-1 bg-slate-950 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveSubTab('executive')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeSubTab === 'executive'
                  ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Executive Overview
            </button>

            <button
              onClick={() => setActiveSubTab('raw')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeSubTab === 'raw'
                  ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Raw Markdown
            </button>

            <button
              onClick={() => setActiveSubTab('audit')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeSubTab === 'audit'
                  ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Audit Trail ({auditTrail ? auditTrail.length : 0})
            </button>
          </div>

          {summary && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleCopy}
                className="p-2 rounded-xl bg-slate-950/80 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-bold transition-all"
                title="Copy Brief"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
              </button>

              <button
                onClick={handleDownload}
                className="p-2 rounded-xl bg-slate-950/80 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-bold transition-all"
                title="Download Markdown"
              >
                <Download className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area - Bounded height with custom scrollbar */}
      <div className="flex-1 overflow-y-auto pr-1 max-h-130 min-h-95 custom-scrollbar">
        {/* SUBTAB 1: Structured Executive Overview */}
        {activeSubTab === 'executive' && (
          summary ? (
            <div className="space-y-4">
              {/* Security Status Banner */}
              <div className={`p-4 rounded-xl border flex items-center justify-between gap-4 ${
                isThreatDetected 
                  ? 'bg-red-950/30 border-red-500/40 shadow-lg shadow-red-950/30' 
                  : 'bg-emerald-950/30 border-emerald-500/40 shadow-lg shadow-emerald-950/30'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${
                    isThreatDetected ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    {isThreatDetected ? <ShieldAlert className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
                      {isThreatDetected ? 'CRITICAL THREAT DETECTED' : 'SYSTEM STABLE & SAFE'}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {isThreatDetected 
                        ? 'Multi-stage intrusion active. Autonomous containment policies engaged.' 
                        : 'All telemetry logs align within standard corporate operating baselines.'}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Global Anomaly Risk</span>
                  <span className={`text-lg font-mono font-black ${isThreatDetected ? 'text-red-400' : 'text-emerald-400'}`}>
                    {(anomalyScore * 100).toFixed(0)}%
                  </span>
                </div>
              </div>

              {/* Grid of Key Takeaway Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">MITRE Techniques</span>
                    <span className="text-sm font-bold font-mono text-slate-200">{mitreMappings.length} Mapped</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                    <Crosshair className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Predicted Moves</span>
                    <span className="text-sm font-bold font-mono text-slate-200">{predictedMoves.length} Trajectories</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">SOAR Actions</span>
                    <span className="text-sm font-bold font-mono text-slate-200">{soarActions.length} Executed</span>
                  </div>
                </div>
              </div>

              {/* MITRE ATT&CK Breakdown Section */}
              {mitreMappings.length > 0 && (
                <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/80 space-y-3">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <Activity className="w-4 h-4 text-indigo-400" />
                    Matched MITRE ATT&CK Matrix Techniques
                  </h4>
                  <div className="space-y-2">
                    {mitreMappings.map((m, i) => (
                      <div key={i} className="p-3 rounded-lg bg-slate-900/70 border border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30 shrink-0">
                            {m.technique_id}
                          </span>
                          <span className="text-xs font-bold text-slate-200">{m.tactic_name}</span>
                        </div>
                        <p className="text-xs text-slate-400 line-clamp-1">{m.summary}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Trajectory Predictions Section */}
              {predictedMoves.length > 0 && (
                <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/80 space-y-3">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <Crosshair className="w-4 h-4 text-amber-400" />
                    Proactive Attack Path Trajectories
                  </h4>
                  <div className="space-y-2">
                    {predictedMoves.map((p, i) => (
                      <div key={i} className="p-3 rounded-lg bg-slate-900/70 border border-slate-800/60 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-amber-300">{p.predicted_technique}</span>
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-200 border border-amber-500/30">
                            Likelihood: {((p.likelihood || 0.9) * 100).toFixed(0)}%
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">{p.justification}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SOAR Containment Section */}
              {soarActions.length > 0 && (
                <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/80 space-y-3">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <Zap className="w-4 h-4 text-emerald-400" />
                    Executed SOAR Network Containment Actions
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {soarActions.map((act, i) => (
                      <div key={i} className="px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-xs font-mono font-bold text-emerald-300 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        {act.action}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center text-slate-500">
              <FileText className="w-12 h-12 mb-3 text-slate-700" />
              <p className="text-sm font-bold text-slate-400">No Executive Brief Generated</p>
              <p className="text-xs text-slate-600 mt-1 max-w-xs">
                Trigger a telemetry replay simulation to compile an executive security brief.
              </p>
            </div>
          )
        )}

        {/* SUBTAB 2: Raw Markdown View */}
        {activeSubTab === 'raw' && (
          summary ? (
            <div className="prose prose-invert prose-sm max-w-none text-slate-200 p-5 rounded-xl bg-slate-950/70 border border-slate-800/90 font-sans leading-relaxed shadow-inner">
              <ReactMarkdown>{summary}</ReactMarkdown>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center text-slate-500">
              <Code className="w-12 h-12 mb-3 text-slate-700" />
              <p className="text-sm font-bold text-slate-400">No Markdown Text Available</p>
            </div>
          )
        )}

        {/* SUBTAB 3: Immutable Audit Trail Log */}
        {activeSubTab === 'audit' && (
          auditTrail && auditTrail.length > 0 ? (
            <div className="space-y-3">
              {auditTrail.map((step, index) => (
                <div key={index} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 shadow-md space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-emerald-400" />
                      Step #{index + 1}: {step.agent_name}
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      Confidence: {((step.confidence_score || 0.95) * 100).toFixed(0)}%
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-slate-900 text-cyan-300 border border-slate-700">
                      {step.action_taken}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {step.timestamp}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-normal bg-slate-900/60 p-3 rounded-lg border border-slate-800/60">
                    {step.reasoning_explanation}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center text-slate-500">
              <Lock className="w-12 h-12 mb-3 text-slate-700" />
              <p className="text-sm font-bold text-slate-400">Audit Log Trail Empty</p>
              <p className="text-xs text-slate-600 mt-1 max-w-xs">
                Sequential agent decision steps will record non-repudiable audit logs during pipeline execution.
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
