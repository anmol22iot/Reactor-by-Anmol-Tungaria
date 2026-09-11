import React from 'react';
import { Clock, ShieldCheck, AlertCircle, Activity } from 'lucide-react';
import { MissionPhase, MissionState } from '../types';

interface GoalCardProps {
  state: MissionState;
}

export const GoalCard: React.FC<GoalCardProps> = ({ state }) => {
  const {
    goal,
    targetUnits,
    currentUnitsProtected,
    warehouseOnHand,
    deficitUnits,
    budgetCap,
    actualSpend,
    phase,
    selectedSuppliers,
  } = state;

  const isVerified = phase === 'MISSION_COMPLETE';
  const isRecovering = ['FAILURE_DETECTED', 'AUTONOMOUS_REPLANNING', 'AWAITING_APPROVAL', 'RECOVERY_EXECUTED'].includes(phase);
  const isFailure = phase === 'FAILURE_ENCOUNTERED';

  const surplus = Math.max(0, budgetCap - actualSpend);
  const coveragePercent = Math.min(100, Math.round((currentUnitsProtected / targetUnits) * 100));

  return (
    <div className="bg-[#0f1420] border border-[#1a233a] rounded-xl p-5 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex items-start justify-between mb-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-300 font-semibold">
            ACTIVE OPERATIONAL GOAL
          </span>
          <h2 className="text-lg font-bold text-white tracking-tight mt-0.5 font-sans">
            Fulfill 500 orders by 6:00 PM
          </h2>
        </div>

        {/* Dynamic Status Badge */}
        {isVerified ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-600 shadow-sm animate-pulse-subtle">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            OUTCOME VERIFIED
          </span>
        ) : isFailure ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-rose-950 text-rose-200 border border-rose-600 shadow-sm animate-pulse">
            <AlertCircle className="w-3.5 h-3.5" />
            ANOMALY DETECTED
          </span>
        ) : isRecovering ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-purple-950 text-purple-200 border border-purple-600 shadow-sm">
            <Activity className="w-3 h-3 animate-spin" />
            REPLANNING HEDGE
          </span>
        ) : phase === 'IDLE' ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-[#141b2d] text-slate-200 border border-[#222f4c]">
            STANDBY
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-sky-950 text-sky-300 border border-sky-600">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
            IN PROGRESS
          </span>
        )}
      </div>

      {/* Progress bar & key figures */}
      <div className="space-y-3">
        <div className="flex justify-between items-baseline text-xs font-mono">
          <span className="text-slate-300 font-medium">Order Protection Target</span>
          <span className="text-emerald-300 font-bold text-sm">
            {currentUnitsProtected}{' '}
            <span className="text-slate-400 font-normal">/ {targetUnits} units</span> ({coveragePercent}%)
          </span>
        </div>

        {/* Visual Multi-Layer Fulfillment Progress Bar */}
        <div className="w-full bg-[#141b2d] h-4 rounded-full p-0.5 border border-[#222f4c] overflow-hidden flex relative">
          {/* Warehouse on-hand baseline segment (415 units = ~83%) */}
          {warehouseOnHand > 0 && (
            <div
              className="bg-sky-500 h-full rounded-l-full flex items-center justify-center text-[9px] font-mono font-bold text-slate-950 transition-all duration-500"
              style={{ width: `${(warehouseOnHand / targetUnits) * 100}%` }}
              title={`Warehouse On-Hand: ${warehouseOnHand} units`}
            >
              {warehouseOnHand} (Warehouse)
            </div>
          )}

          {/* Sourced recovery orders */}
          {currentUnitsProtected > warehouseOnHand && (
            <>
              {/* Supplier B share */}
              <div
                className="bg-purple-500 h-full flex items-center justify-center text-[9px] font-mono font-bold text-white border-l border-[#0a0d14] transition-all duration-500"
                style={{ width: `${(50 / targetUnits) * 100}%` }}
                title="Supplier B: 50 units"
              >
                50 (Supp. B)
              </div>
              {/* Supplier C share */}
              <div
                className="bg-indigo-500 h-full rounded-r-full flex items-center justify-center text-[9px] font-mono font-bold text-white border-l border-[#0a0d14] transition-all duration-500"
                style={{ width: `${(35 / targetUnits) * 100}%` }}
                title="Supplier C: 35 units"
              >
                35 (Supp. C)
              </div>
            </>
          )}

          {/* Empty deficit indicator if not yet protected */}
          {currentUnitsProtected < targetUnits && (
            <div
              className="bg-rose-950/40 h-full flex items-center justify-center text-[9px] font-mono text-rose-200 font-semibold italic border-l border-rose-800/30"
              style={{ width: `${((targetUnits - currentUnitsProtected) / targetUnits) * 100}%` }}
            >
              {targetUnits - currentUnitsProtected > 0 ? `${targetUnits - currentUnitsProtected} deficit` : ''}
            </div>
          )}
        </div>

        {/* Target Metrics Grid */}
        <div className="grid grid-cols-3 gap-2.5 pt-2 text-xs font-mono">
          <div className="bg-[#141b2d]/80 border border-[#1a233a] p-2.5 rounded-lg">
            <span className="text-[10px] text-slate-300 block font-semibold">BUDGET CAP</span>
            <span className="text-white font-bold text-sm">₹{budgetCap.toLocaleString()}</span>
          </div>
          <div className="bg-[#141b2d]/80 border border-[#1a233a] p-2.5 rounded-lg">
            <span className="text-[10px] text-slate-300 block font-semibold">ACTUAL SPEND</span>
            <span className={`font-bold text-sm ${actualSpend > budgetCap ? 'text-rose-300' : 'text-emerald-300'}`}>
              ₹{actualSpend.toLocaleString()}
            </span>
          </div>
          <div className="bg-[#141b2d]/80 border border-[#1a233a] p-2.5 rounded-lg">
            <span className="text-[10px] text-slate-300 block font-semibold">SURPLUS SAVED</span>
            <span className="text-cyan-300 font-bold text-sm">₹{surplus.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-[#1a233a]/70 flex items-center justify-between text-xs font-mono text-slate-300">
        <span className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          Deadline: <strong className="text-white">Today 18:00 IST</strong>
        </span>
        <span className="text-emerald-300 font-bold">T - 1h 42m remaining</span>
      </div>
    </div>
  );
};
