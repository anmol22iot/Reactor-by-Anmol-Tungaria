import React, { useState } from 'react';
import { Cpu, Sparkles, Loader2, RefreshCw } from 'lucide-react';
import { MissionState } from '../types';

interface TelemetryCardProps {
  state: MissionState;
}

export const TelemetryCard: React.FC<TelemetryCardProps> = ({ state }) => {
  const {
    phase,
    activePlanSummary,
    triggeringAnomaly,
    selectedSuppliers,
    isCompleted,
    deficitUnits,
  } = state;

  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiSource, setAiSource] = useState<string | null>(null);

  const requestGeminiAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/mission/gemini-reason', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          state,
          prompt: 'Synthesize the autonomous recovery cognition and state resilience graph.',
        }),
      });
      const data = await res.json();
      if (data.analysis) {
        setAiAnalysis(data.analysis);
        setAiSource(data.source || 'gemini-3.8-flash');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Compose dynamic engine state badge
  let engineStateBadge = 'INITIALIZING';
  let engineStateClass = 'bg-slate-850 text-slate-100 border border-slate-600';
  let engineStateDesc = activePlanSummary;

  if (phase === 'IDLE') {
    engineStateBadge = 'STANDBY';
    engineStateClass = 'bg-[#141b2d] text-slate-200 border border-[#222f4c] font-semibold';
  } else if (phase === 'FAILURE_ENCOUNTERED') {
    engineStateBadge = 'FAULT_INTERRUPT';
    engineStateClass = 'bg-rose-950 text-rose-200 border border-rose-600 font-bold';
  } else if (['FAILURE_DETECTED', 'AUTONOMOUS_REPLANNING', 'AWAITING_APPROVAL'].includes(phase)) {
    engineStateBadge = 'REPLANNING_GRAPH';
    engineStateClass = 'bg-purple-950 text-purple-200 border border-purple-600 font-bold';
  } else if (phase === 'RECOVERY_EXECUTED') {
    engineStateBadge = 'EXECUTING_HEDGE';
    engineStateClass = 'bg-cyan-950 text-cyan-200 border border-cyan-500 font-bold';
  } else if (isCompleted) {
    engineStateBadge = 'AUTO-RECOVERY COMPLETE';
    engineStateClass = 'bg-purple-950 text-purple-200 border border-purple-500 font-bold';
    engineStateDesc = 'Post-failure replanning executed. Dual-supplier hedge operational.';
  }

  // Active Plan Composition
  let planCompositionText = 'Pending initial supplier evaluation.';
  if (selectedSuppliers.length > 0) {
    planCompositionText = selectedSuppliers
      .map(s => `${s.supplier} (${s.units}u @ ₹${s.spend.toLocaleString()})`)
      .join(' + ');
  } else if (phase === 'PLANNING_ACTION') {
    planCompositionText = `Primary: Supplier A (${deficitUnits}u @ 45m SLA)`;
  } else if (isCompleted) {
    planCompositionText = 'Split Fulfillment: Supplier B (60%) + Supplier C (40%)';
  }

  return (
    <div className="bg-[#0f1420] border border-[#1a233a] rounded-xl p-5 shadow-xl flex-1 flex flex-col">
      <div className="flex items-center justify-between pb-3 border-b border-[#1a233a]">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/30">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              AI AGENT STATE TELEMETRY
            </h3>
            <p className="text-[10px] text-slate-300 font-medium">Real-time internal cognition & decision policy</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={requestGeminiAnalysis}
            disabled={isAnalyzing}
            className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950/70 hover:bg-indigo-900/90 text-indigo-300 border border-indigo-700/50 transition flex items-center gap-1 cursor-pointer"
            title="Query Gemini reasoning model"
          >
            {isAnalyzing ? (
              <Loader2 className="w-2.5 h-2.5 animate-spin" />
            ) : (
              <Sparkles className="w-2.5 h-2.5 text-indigo-400" />
            )}
            <span>AI Reasoning</span>
          </button>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1a233a] text-slate-200 border border-[#222f4c] font-medium">
            Autonomous
          </span>
        </div>
      </div>

      {/* Telemetry Key-Value Matrix */}
      <div className="mt-4 space-y-3 font-mono text-xs flex-1">
        <div className="bg-[#141b2d]/60 p-3 rounded-lg border border-[#1a233a]">
          <div className="text-[10px] text-slate-300 font-semibold uppercase tracking-wider mb-1">
            Current Objective
          </div>
          <div className="text-white font-semibold">
            Protect & dispatch 500 critical orders prior to 18:00 cutoff
          </div>
        </div>

        <div className="bg-purple-950/20 p-3 rounded-lg border border-purple-800/30">
          <div className="text-[10px] text-purple-300 font-bold uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Current Engine State</span>
            <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] ${engineStateClass}`}>
              {engineStateBadge}
            </span>
          </div>
          <div className="text-purple-100 font-medium text-[11px] leading-relaxed">
            {engineStateDesc}
          </div>
        </div>

        <div className="bg-[#141b2d]/60 p-3 rounded-lg border border-[#1a233a]">
          <div className="text-[10px] text-slate-300 font-semibold uppercase tracking-wider mb-1">
            Active Plan Composition
          </div>
          <div className="text-slate-100 font-medium flex items-center justify-between text-[11px]">
            <span>{planCompositionText}</span>
          </div>
        </div>

        {triggeringAnomaly && (
          <div className="bg-rose-950/20 p-3 rounded-lg border border-rose-900/30">
            <div className="text-[10px] text-rose-300 font-bold uppercase tracking-wider mb-1">
              Triggering Anomaly
            </div>
            <div className="text-rose-100 font-medium text-[11px] leading-relaxed">
              {triggeringAnomaly}
            </div>
          </div>
        )}

        <div className="bg-emerald-950/20 p-3 rounded-lg border border-emerald-900/30">
          <div className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider mb-1">
            Verification Status
          </div>
          <div className="text-emerald-100 font-medium text-[11px]">
            {isCompleted
              ? 'Consignment dispatches confirmed with tracking tokens #TRK-9902 & #TRK-9903. 100% order volume satisfied.'
              : phase === 'IDLE'
              ? 'Standby for mission initiation.'
              : 'Continuous healthcheck validation active.'}
          </div>
        </div>

        {/* Gemini AI Cognition Insight Callout if queried */}
        {aiAnalysis && (
          <div className="bg-indigo-950/30 border border-indigo-600/40 p-3 rounded-lg text-indigo-200 text-[11px] leading-relaxed">
            <div className="flex items-center justify-between mb-1 text-[10px] font-bold text-indigo-300 uppercase tracking-wider">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Gemini Cognitive Reasoning ({aiSource})
              </span>
              <button
                onClick={() => setAiAnalysis(null)}
                className="text-slate-300 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>
            <p className="whitespace-pre-line text-slate-100">{aiAnalysis}</p>
          </div>
        )}
      </div>

      {/* System Heartbeat indicator */}
      <div className="mt-4 pt-3 border-t border-[#1a233a] flex items-center justify-between text-[11px] font-mono text-slate-400 font-medium">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
          <span>Policy: Adaptive Constraint Optimization</span>
        </div>
        <span>Latency: 420ms</span>
      </div>
    </div>
  );
};
