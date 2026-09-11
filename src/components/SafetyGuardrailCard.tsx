import React from 'react';
import { ShieldAlert, AlertOctagon, CheckCircle } from 'lucide-react';
import { MissionState } from '../types';

interface SafetyGuardrailCardProps {
  state: MissionState;
  onOpenApproval: () => void;
}

export const SafetyGuardrailCard: React.FC<SafetyGuardrailCardProps> = ({
  state,
  onOpenApproval,
}) => {
  const { budgetCap, actualSpend, isPausedForApproval, humanOverridesPending } = state;

  const isHighRisk = isPausedForApproval || actualSpend > budgetCap;

  return (
    <div className="bg-[#0f1420] border border-[#1a233a] rounded-xl p-4 shadow-xl">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center space-x-2">
          <span className="p-1 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <ShieldAlert className="w-3.5 h-3.5" />
          </span>
          <span className="text-xs font-mono font-bold text-amber-300 uppercase tracking-wider">
            SAFETY & AUDIT GUARDRAIL
          </span>
        </div>
        <span className="text-[10px] font-mono text-slate-400 bg-[#141b2d] px-2 py-0.5 rounded border border-[#222f4c]">
          Autonomous Tier: L3
        </span>
      </div>

      <div className="bg-[#0a0d14] border border-amber-900/30 rounded-lg p-3 text-xs font-mono">
        <div className="flex justify-between items-start mb-1.5">
          <span className="text-slate-300 font-semibold">Active Risk Assessment:</span>
          {isHighRisk ? (
            <span className="text-rose-400 font-bold text-[10px] bg-rose-950/80 px-2 py-0.5 rounded border border-rose-700/60 animate-pulse flex items-center gap-1">
              <AlertOctagon className="w-3 h-3" />
              HIGH RISK (₹{(actualSpend / 1000).toFixed(1)}k &gt; ₹{(budgetCap / 1000).toFixed(1)}k cap)
            </span>
          ) : (
            <span className="text-emerald-400 font-bold text-[10px] bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/40">
              LOW RISK (₹{(actualSpend > 0 ? (actualSpend / 1000).toFixed(1) : '13.8')}k &lt; ₹{(budgetCap / 1000).toFixed(1)}k cap)
            </span>
          )}
        </div>

        <p className="text-slate-400 text-[11px] leading-relaxed mb-3">
          Autonomous procurement executed automatically within pre-authorized emergency bounds. If expenditure had exceeded ₹{budgetCap.toLocaleString()} or required expedited air-freight (&gt;₹80,000), execution would instantly pause for supervisor authorization.
        </p>

        {isPausedForApproval && (
          <div className="mb-3 p-2.5 rounded bg-rose-950/50 border border-rose-700/60 flex items-center justify-between">
            <span className="text-rose-200 text-xs font-semibold">
              Action Required: Emergency Spend Authorization
            </span>
            <button
              onClick={onOpenApproval}
              className="bg-amber-600 hover:bg-amber-500 text-white text-[11px] font-bold px-2.5 py-1 rounded transition cursor-pointer shadow-md"
            >
              Review & Authorize
            </button>
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-[#141b2d] text-[10px] text-slate-500">
          <span>Threshold: ₹{budgetCap.toLocaleString()} Max</span>
          <span className={humanOverridesPending > 0 ? 'text-amber-400 font-bold' : 'text-slate-400'}>
            {humanOverridesPending} Overrides Pending
          </span>
        </div>
      </div>
    </div>
  );
};
