import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { 
  FileText, 
  Lock, 
  Cpu, 
  Copy,
  Check,
  Download,
  Clock
} from 'lucide-react';

export default function AuditReport({ summary, auditTrail }) {
  const [activeSubTab, setActiveSubTab] = useState('brief'); // 'brief' or 'audit'
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
    <div className="glass-panel rounded-2xl p-5 border border-slate-800 shadow-xl flex flex-col h-full space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            Executive Security Brief & Cryptographic Audit
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Non-Repudiable Multi-Agent Audit Log & GenAI Report Compiler
          </p>
        </div>

        {/* Tab & Action Controls */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <div className="flex items-center p-1 bg-slate-950 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveSubTab('brief')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeSubTab === 'brief'
                  ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Executive Brief
            </button>

            <button
              onClick={() => setActiveSubTab('audit')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeSubTab === 'audit'
                  ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Audit Trail ({auditTrail ? auditTrail.length : 0})
            </button>
          </div>

          {activeSubTab === 'brief' && summary && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleCopy}
                className="p-2 rounded-xl bg-slate-950/80 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-bold transition-all"
                title="Copy Markdown Brief"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
              </button>

              <button
                onClick={handleDownload}
                className="p-2 rounded-xl bg-slate-950/80 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-bold transition-all"
                title="Download Brief (.md)"
              >
                <Download className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pr-1 max-h-[600px] custom-scrollbar">
        {activeSubTab === 'brief' ? (
          summary ? (
            <div className="prose prose-invert prose-sm max-w-none text-slate-200 p-6 rounded-2xl bg-slate-950/70 border border-slate-800/90 font-sans leading-relaxed shadow-inner">
              <ReactMarkdown>{summary}</ReactMarkdown>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center text-slate-500">
              <FileText className="w-12 h-12 mb-3 text-slate-700" />
              <p className="text-sm font-bold text-slate-400">No Executive Brief Generated</p>
              <p className="text-xs text-slate-600 mt-1 max-w-xs">
                Trigger a telemetry replay simulation to compile an executive security brief using Gemini GenAI.
              </p>
            </div>
          )
        ) : (
          auditTrail && auditTrail.length > 0 ? (
            <div className="space-y-3">
              {auditTrail.map((step, index) => (
                <div key={index} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 shadow-md">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-emerald-400" />
                      Step #{index + 1}: {step.agent_name}
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      Confidence: {((step.confidence_score || 0.95) * 100).toFixed(0)}%
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-2.5">
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
