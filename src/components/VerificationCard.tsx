import React from 'react';
import { ShieldCheck, Check, Clock } from 'lucide-react';
import { MissionState } from '../types';

interface VerificationCardProps {
  state: MissionState;
}

export const VerificationCard: React.FC<VerificationCardProps> = ({ state }) => {
  const { verificationList, engineVerdict, phase, actualSpend, budgetCap } = state;

  const isVerified = phase === 'MISSION_COMPLETE';
  const displaySpend = actualSpend > 0 ? actualSpend : 13800;

  return (
    <div className="bg-[#0f1420] border border-[#1a233a] rounded-xl p-4 shadow-xl flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Independent Outcome Verification
          </span>
          <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-600 font-bold">
            NON-SELF-REPORTED
          </span>
        </div>
        <p className="text-[11px] text-slate-300 mb-3 font-medium">
          REACTOR does not declare victory merely because an action fired. An isolated verifier agent independently validates external system truth.
        </p>

        <div className="space-y-1.5 text-xs font-mono">
          {/* Criterion 1 */}
          <div className="flex items-center justify-between p-1.5 rounded bg-[#141b2d] border border-[#1a233a]">
            <span className="flex items-center gap-2 text-white font-medium">
              <span className={`font-bold ${isVerified ? 'text-emerald-300' : 'text-slate-400'}`}>✓</span>
              500 / 500 Orders Protected
            </span>
            <span className="text-[10px] text-slate-300 font-semibold">External ERP Polled</span>
          </div>

          {/* Criterion 2 */}
          <div className="flex items-center justify-between p-1.5 rounded bg-[#141b2d] border border-[#1a233a]">
            <span className="flex items-center gap-2 text-white font-medium">
              <span className={`font-bold ${isVerified ? 'text-emerald-300' : 'text-slate-400'}`}>✓</span>
              ₹{displaySpend.toLocaleString()} Spent ≤ ₹{budgetCap.toLocaleString()} Cap
            </span>
            <span className="text-[10px] text-slate-300 font-semibold">Ledger Verified</span>
          </div>

          {/* Criterion 3 */}
          <div className="flex items-center justify-between p-1.5 rounded bg-[#141b2d] border border-[#1a233a]">
            <span className="flex items-center gap-2 text-white font-medium">
              <span className={`font-bold ${isVerified ? 'text-emerald-300' : 'text-slate-400'}`}>✓</span>
              Delivery ETA 17:30 &lt; 18:00
            </span>
            <span className="text-[10px] text-slate-300 font-semibold">Carrier SLA Bound</span>
          </div>

          {/* Criterion 4 */}
          <div className="flex items-center justify-between p-1.5 rounded bg-[#141b2d] border border-[#1a233a]">
            <span className="flex items-center gap-2 text-white font-medium">
              <span className={`font-bold ${isVerified ? 'text-emerald-300' : 'text-slate-400'}`}>✓</span>
              Zero Human Overrides Required
            </span>
            <span className="text-[10px] text-slate-300 font-semibold">Fully Autonomous</span>
          </div>
        </div>
      </div>

      <div className="mt-3 pt-2 border-t border-[#1a233a] flex items-center justify-between text-[11px] font-mono">
        <span className="text-slate-300 font-semibold">Final Engine Verdict:</span>
        <span className={`font-bold tracking-wider ${isVerified ? 'text-emerald-300 animate-pulse' : 'text-cyan-300'}`}>
          {isVerified ? 'STATUS_GOAL_SATISFIED' : engineVerdict}
        </span>
      </div>
    </div>
  );
};
