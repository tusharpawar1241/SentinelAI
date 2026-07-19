import React from 'react';
import { ShieldAlert, ShieldCheck, Activity } from 'lucide-react';
import Tooltip from './Tooltip';

export default function RiskGaugeCard({ anomalyScore, isThreatDetected, executionState }) {
  const percentage = Math.min(100, Math.max(0, Math.round(anomalyScore * 100)));
  const strokeDashoffset = 251.2 - (251.2 * percentage) / 100;

  const getRiskColor = () => {
    if (executionState === 'idle') return { stroke: '#10b981', text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' };
    if (!isThreatDetected) return { stroke: '#10b981', text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' };
    return { stroke: '#ef4444', text: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30' };
  };

  const colors = getRiskColor();

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800 shadow-xl flex flex-col justify-between h-full">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <Tooltip 
          title="Behavioral Risk Index" 
          text="Machine learning score measuring how strange current system activity is compared to normal business operations." 
          position="top"
        >
          <div className="flex items-center gap-2 cursor-help">
            <Activity className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-slate-100">Behavioral Risk Index</h3>
          </div>
        </Tooltip>

        <Tooltip 
          title="ML Isolation Forest Algorithm" 
          text="An unsupervised Machine Learning model that isolates unusual log events without relying on known virus signatures." 
          position="top"
        >
          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${colors.bg} ${colors.text} ${colors.border} cursor-help`}>
            ML ISOLATION FOREST
          </span>
        </Tooltip>
      </div>

      <div className="flex items-center justify-around py-4 my-auto">
        {/* Radial SVG Meter */}
        <Tooltip 
          title="Threat Score Gauge" 
          text={`Current threat calculation: ${percentage}%. Scores above 50% indicate suspicious activities.`} 
          position="right"
        >
          <div className="relative w-32 h-32 flex items-center justify-center cursor-help">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                className="text-slate-800"
                strokeWidth="8"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                strokeWidth="8"
                strokeDasharray="251.2"
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke={colors.stroke}
                fill="transparent"
                className="transition-all duration-700 ease-out"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className={`text-2xl font-black font-mono ${colors.text}`}>
                {percentage}%
              </span>
              <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">
                Threat Score
              </span>
            </div>
          </div>
        </Tooltip>

        {/* Risk Level Description */}
        <div className="flex flex-col gap-2 max-w-[150px]">
          <div className="text-[10px] uppercase font-bold text-slate-400">Risk Assessment</div>
          <div className="flex items-center gap-1.5">
            {isThreatDetected ? (
              <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 animate-bounce" />
            ) : (
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            )}
            <span className={`text-xs font-bold leading-tight ${colors.text}`}>
              {executionState === 'idle' ? 'Nominal Baseline' : isThreatDetected ? 'CRITICAL ANOMALY' : 'BENIGN ACTIVITY'}
            </span>
          </div>

          <p className="text-[11px] text-slate-400 leading-normal">
            {executionState === 'idle'
              ? 'Awaiting telemetry stream to compute feature score.'
              : isThreatDetected
              ? 'Severe statistical outlier detected across 2:00 AM telemetry logs.'
              : 'Log feature vectors sit within standard corporate shift boundaries.'}
          </p>
        </div>
      </div>

      {/* Footer Metrics */}
      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-800/80 text-[11px] font-mono">
        <Tooltip 
          title="ML Model Confidence" 
          text="How confident the Machine Learning algorithm is in its calculation." 
          position="top"
        >
          <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80 flex flex-col cursor-help">
            <span className="text-[9px] text-slate-500 font-sans font-semibold">Model Confidence</span>
            <span className="text-slate-200 font-bold">{isThreatDetected ? '99.4%' : '94.2%'}</span>
          </div>
        </Tooltip>

        <Tooltip 
          title="Anomalous Feature Vectors" 
          text="The number of log properties (like unusual time, strange command length, or non-internal IP) that tripped security alerts." 
          position="top"
        >
          <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80 flex flex-col cursor-help">
            <span className="text-[9px] text-slate-500 font-sans font-semibold">Anomalous Vector</span>
            <span className={isThreatDetected ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>
              {isThreatDetected ? '4 Features Flagged' : '0 Outliers'}
            </span>
          </div>
        </Tooltip>
      </div>
    </div>
  );
}
