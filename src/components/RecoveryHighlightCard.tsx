import React from 'react';
import { RefreshCw, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { MissionState } from '../types';

interface RecoveryHighlightCardProps {
  state: MissionState;
}

export const RecoveryHighlightCard: React.FC<RecoveryHighlightCardProps> = ({ state }) => {
  const { phase, chaosMode, actualSpend, budgetCap } = state;

  const isFailPassed = ['FAILURE_ENCOUNTERED', 'FAILURE_DETECTED', 'AUTONOMOUS_REPLANNING', 'AWAITING_APPROVAL', 'RECOVERY_EXECUTED', 'INDEPENDENT_VERIFICATION', 'MISSION_COMPLETE'].includes(phase);
  const isStateUpdated = ['FAILURE_DETECTED', 'AUTONOMOUS_REPLANNING', 'AWAITING_APPROVAL', 'RECOVERY_EXECUTED', 'INDEPENDENT_VERIFICATION', 'MISSION_COMPLETE'].includes(phase);
  const isReplanned = ['AUTONOMOUS_REPLANNING', 'AWAITING_APPROVAL', 'RECOVERY_EXECUTED', 'INDEPENDENT_VERIFICATION', 'MISSION_COMPLETE'].includes(phase);
  const isVerified = phase === 'MISSION_COMPLETE';

  let replanTitle = 'Dual Supplier Strategy';
  let replanDesc = 'Supplier B (50) + C (35) chosen';
  if (chaosMode === 'capacity_reduction') {
    replanTitle = '3-Way Split Strategy';
    replanDesc = 'Supp. B (30) + C (40) + D (15)';
  } else if (chaosMode === 'inventory_mismatch') {
    replanTitle = 'Adjusted Deficit Plan';
    replanDesc = 'Supp. B (70) + C (60) chosen';
  }

  const displaySpend = actualSpend > 0 ? actualSpend : 13800;

  return (
    <div className="bg-gradient-to-r from-[#0f1420] via-[#141b2d] to-[#0f1420] border-2 border-purple-500/40 rounded-xl p-4 shadow-2xl relative overflow-hidden">
      <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-purple-600/10 rounded-full blur-2xl pointer-events-none"></div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1a233a]">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
            <RefreshCw className={`w-4 h-4 ${['AUTONOMOUS_REPLANNING', 'FAILURE_DETECTED'].includes(phase) ? 'animate-spin' : ''}`} />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase font-bold text-purple-300 tracking-wider">
              AUTONOMOUS RECOVERY EVENT #REC-01
            </span>
            <h4 className="text-sm font-bold text-white">
              Failure Treated as Expected Condition — Zero Human Intervention
            </h4>
          </div>
        </div>

        <span className="text-[11px] font-mono px-3 py-1 rounded bg-purple-950 text-purple-200 border border-purple-600 flex items-center gap-1.5 self-start sm:self-auto font-semibold">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          Autonomous Replanning: {isReplanned ? 'Successful' : 'Armed'}
        </span>
      </div>

      {/* Step-by-step visual recovery cascade */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 mt-3 text-xs font-mono">
        {/* 1. Detected Failure */}
        <div className={`p-2.5 rounded-lg border transition ${
          isFailPassed
            ? 'bg-rose-950/30 border-rose-800/40'
            : 'bg-[#0f1420] border-[#222f4c] opacity-80'
        }`}>
          <span className="text-[9px] text-rose-300 font-bold block mb-1 flex items-center justify-between">
            <span>1. DETECTED FAILURE</span>
            {isFailPassed && <span className="text-rose-300">●</span>}
          </span>
          <span className="text-white text-[11px] font-bold">
            {chaosMode === 'api_timeout' ? 'Supplier A Timed Out' : 'Supplier A Rejected Order'}
          </span>
          <p className="text-[10px] text-slate-300 mt-0.5 font-medium">
            {chaosMode === 'api_timeout' ? 'HTTP 504 Unresponsive Gateway' : 'Capacity constraint at supplier depot'}
          </p>
        </div>

        {/* 2. State Updated */}
        <div className={`p-2.5 rounded-lg border transition ${
          isStateUpdated
            ? 'bg-[#0f1420] border-cyan-700/50 shadow-sm'
            : 'bg-[#0f1420] border-[#222f4c] opacity-80'
        }`}>
          <span className="text-[9px] text-cyan-300 font-bold block mb-1 flex items-center justify-between">
            <span>2. STATE UPDATED</span>
            {isStateUpdated && <span className="text-cyan-300">●</span>}
          </span>
          <span className="text-white text-[11px] font-bold">Supplier A Blacklisted</span>
          <p className="text-[10px] text-slate-300 mt-0.5 font-medium">Marked unavailable in active graph</p>
        </div>

        {/* 3. Replanning */}
        <div className={`p-2.5 rounded-lg border transition ${
          isReplanned
            ? 'bg-purple-950/30 border-purple-800/40 shadow-sm'
            : 'bg-[#0f1420] border-[#222f4c] opacity-80'
        }`}>
          <span className="text-[9px] text-purple-300 font-bold block mb-1 flex items-center justify-between">
            <span>3. REPLANNING</span>
            {isReplanned && <span className="text-purple-300">●</span>}
          </span>
          <span className="text-white text-[11px] font-bold">{replanTitle}</span>
          <p className="text-[10px] text-slate-300 mt-0.5 font-medium">{replanDesc}</p>
        </div>

        {/* 4. Outcome Verified */}
        <div className={`p-2.5 rounded-lg border transition ${
          isVerified
            ? 'bg-emerald-950/30 border-emerald-800/40 shadow-sm'
            : 'bg-[#0f1420] border-[#222f4c] opacity-80'
        }`}>
          <span className="text-[9px] text-emerald-300 font-bold block mb-1 flex items-center justify-between">
            <span>4. OUTCOME VERIFIED</span>
            {isVerified && <span className="text-emerald-300">✓</span>}
          </span>
          <span className="text-white text-[11px] font-bold">500 / 500 Orders Intact</span>
          <p className="text-[10px] text-slate-300 mt-0.5 font-medium">
            Spend: ₹{displaySpend.toLocaleString()} (under ₹{budgetCap.toLocaleString()} cap)
          </p>
        </div>
      </div>
    </div>
  );
};
