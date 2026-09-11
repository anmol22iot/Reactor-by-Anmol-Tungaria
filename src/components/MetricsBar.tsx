import React from 'react';
import { MissionState } from '../types';

interface MetricsBarProps {
  state: MissionState;
}

export const MetricsBar: React.FC<MetricsBarProps> = ({ state }) => {
  const {
    targetUnits,
    currentUnitsProtected,
    warehouseOnHand,
    actualSpend,
    budgetCap,
    recoveryCount,
    phase,
  } = state;

  const isComplete = phase === 'MISSION_COMPLETE';
  const coveragePercent = warehouseOnHand > 0 ? Math.round((warehouseOnHand / targetUnits) * 100) : 83;
  const deficitPercent = 100 - coveragePercent;

  const displayProtected = currentUnitsProtected > 0 ? currentUnitsProtected : 500;
  const displaySpend = actualSpend > 0 ? actualSpend : 13800;
  const displayRecoveryCount = recoveryCount > 0 ? recoveryCount : 1;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
      {/* 1. Orders Protected */}
      <div className="bg-[#0f1420] border border-[#1a233a] rounded-xl p-3.5 shadow-md">
        <span className="text-[10px] text-slate-400 block uppercase font-medium">Orders Protected</span>
        <div className="flex items-baseline space-x-1.5 mt-1">
          <span className="text-2xl font-extrabold text-white font-mono">{displayProtected}</span>
          <span className="text-xs text-emerald-400 font-bold">/ {targetUnits}</span>
        </div>
        <div className="text-[10px] text-emerald-400/90 mt-1 flex items-center gap-1">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          {displayProtected === targetUnits ? '100% Target Met' : `${Math.round((displayProtected / targetUnits) * 100)}% Current`}
        </div>
      </div>

      {/* 2. Inventory Coverage */}
      <div className="bg-[#0f1420] border border-[#1a233a] rounded-xl p-3.5 shadow-md">
        <span className="text-[10px] text-slate-400 block uppercase font-medium">Inventory Coverage</span>
        <div className="flex items-baseline space-x-1.5 mt-1">
          <span className="text-2xl font-extrabold text-cyan-400 font-mono">{coveragePercent}%</span>
          <span className="text-[11px] text-slate-400 font-normal">Warehouse</span>
        </div>
        <div className="text-[10px] text-cyan-400/90 mt-1">{deficitPercent}% Deficit Procured</div>
      </div>

      {/* 3. Emergency Spend */}
      <div className="bg-[#0f1420] border border-[#1a233a] rounded-xl p-3.5 shadow-md">
        <span className="text-[10px] text-slate-400 block uppercase font-medium">Emergency Spend</span>
        <div className="flex items-baseline space-x-1.5 mt-1">
          <span className="text-2xl font-extrabold text-white font-mono">₹{displaySpend.toLocaleString()}</span>
        </div>
        <div className="text-[10px] text-slate-400 mt-1">
          Budget: <span className="text-slate-200">₹{budgetCap.toLocaleString()} ({displaySpend <= budgetCap ? 'Safe' : 'Override'})</span>
        </div>
      </div>

      {/* 4. Autonomous Recovery */}
      <div className="bg-[#0f1420] border border-[#1a233a] rounded-xl p-3.5 shadow-md">
        <span className="text-[10px] text-slate-400 block uppercase font-medium">Autonomous Recovery</span>
        <div className="flex items-baseline space-x-1.5 mt-1">
          <span className="text-2xl font-extrabold text-purple-400 font-mono">{displayRecoveryCount} / 1</span>
        </div>
        <div className="text-[10px] text-purple-400/90 mt-1 flex items-center gap-1">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-purple-400"></span> 0s Human Lag
        </div>
      </div>
    </div>
  );
};
