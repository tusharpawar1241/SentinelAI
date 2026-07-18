import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { 
  FileText, 
  CheckSquare, 
  ShieldCheck, 
  Lock, 
  Cpu, 
  ChevronRight 
} from 'lucide-react';

export default function AuditReport({ summary, auditTrail }) {
  const [activeTab, setActiveTab] = useState('brief'); // 'brief' or 'audit'

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 backdrop-blur-md shadow-xl flex flex-col h-full">
      {/* Header with Tab Buttons */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            Executive Audit & Report
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Non-Repudiable Audit Log & GenAI Summary</p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center p-1 bg-slate-950 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveTab('brief')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'brief'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Markdown Brief
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'audit'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Audit Log Trail ({auditTrail ? auditTrail.length : 0})
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto pr-1 max-h-[580px] custom-scrollbar">
        {activeTab === 'brief' ? (
          /* Markdown Brief Panel */
          summary ? (
            <div className="prose prose-invert prose-sm max-w-none text-slate-300 space-y-4 p-4 rounded-xl bg-slate-950/40 border border-slate-800/80 font-sans leading-relaxed">
              <ReactMarkdown>{summary}</ReactMarkdown>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-slate-500">
              <FileText className="w-10 h-10 mb-2 text-slate-700" />
              <p className="text-sm font-medium">No Executive Summary generated yet</p>
              <p className="text-xs text-slate-600 mt-1">Run an ingestion simulation to compile report</p>
            </div>
          )
        ) : (
          /* Immutable Audit Log Trail Panel */
          auditTrail && auditTrail.length > 0 ? (
            <div className="space-y-3">
              {auditTrail.map((step, index) => (
                <div key={index} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5" />
                      Step #{index + 1}: {step.agent_name}
                    </span>
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      Conf: {(step.confidence_score * 100).toFixed(0)}%
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-200 font-bold border border-slate-700">
                      {step.action_taken}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">
                      {step.timestamp}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-normal bg-slate-900/40 p-2.5 rounded border border-slate-800/50">
                    {step.reasoning_explanation}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-slate-500">
              <Lock className="w-10 h-10 mb-2 text-slate-700" />
              <p className="text-sm font-medium">Audit trail log empty</p>
              <p className="text-xs text-slate-600 mt-1">Agent decision steps will appear here in sequence</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
