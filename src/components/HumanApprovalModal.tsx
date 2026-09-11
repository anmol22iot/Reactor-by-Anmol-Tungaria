import React from 'react';
import { AlertOctagon, CheckCircle, XCircle, ShieldAlert } from 'lucide-react';
import { MissionState } from '../types';

interface HumanApprovalModalProps {
  isOpen: boolean;
  state: MissionState;
  onApprove: () => void;
  onReject: () => void;
  onClose: () => void;
}

export const HumanApprovalModal: React.FC<HumanApprovalModalProps> = ({
  isOpen,
  state,
  onApprove,
  onReject,
  onClose,
}) => {
  if (!isOpen) return null;

  const { actualSpend, budgetCap, selectedSuppliers, deficitUnits } = state;
  const overdraft = Math.max(0, actualSpend - budgetCap);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a0d14]/80 backdrop-blur-sm animate-fade-in font-mono">
      <div className="bg-[#0f1420] border-2 border-amber-500/60 rounded-xl max-w-lg w-full p-6 shadow-2xl shadow-amber-500/10">
        <div className="flex items-center space-x-3 pb-4 border-b border-[#1a233a]">
          <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">HUMAN-IN-THE-LOOP SAFETY GATEWAY</h3>
            <p className="text-xs text-amber-300 font-semibold">Autonomous Spending Ceiling Reached</p>
          </div>
        </div>

        <div className="mt-4 space-y-3 text-xs">
          <p className="text-slate-200 font-medium leading-relaxed">
            REACTOR paused execution because the calculated recovery spend exceeds the autonomous authority limit.
          </p>

          <div className="bg-[#141b2d] p-3 rounded-lg border border-[#222f4c] space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-300 font-semibold">Authorized Autonomous Cap:</span>
              <span className="text-white font-bold">₹{budgetCap.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300 font-semibold">Replan Estimated Spend:</span>
              <span className="text-rose-200 font-bold">₹{actualSpend.toLocaleString()}</span>
            </div>
            <div className="flex justify-between pt-1.5 border-t border-[#1a233a]">
              <span className="text-amber-300 font-bold">Required Emergency Overdraft:</span>
              <span className="text-amber-200 font-bold">+₹{overdraft.toLocaleString()}</span>
            </div>
          </div>

          <div className="bg-[#141b2d] p-3 rounded-lg border border-[#1a233a]">
            <span className="text-[10px] text-slate-300 block uppercase mb-1 font-bold">Proposed Multi-Supplier Basket:</span>
            <ul className="space-y-1 text-slate-200">
              {selectedSuppliers.map((s, idx) => (
                <li key={idx} className="flex justify-between">
                  <span>{s.supplier} ({s.units} units @ ETA {s.eta})</span>
                  <span className="font-bold text-white">₹{s.spend.toLocaleString()}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-[11px] text-slate-300 italic font-medium">
            "Zero false positives. If rejected, orders will hard-stop at current inventory coverage (83%). If authorized, orders will be dispatched immediately."
          </p>
        </div>

        <div className="mt-6 flex items-center justify-end space-x-3 pt-3 border-t border-[#1a233a]">
          <button
            onClick={onReject}
            className="px-4 py-2 rounded-lg bg-[#141b2d] hover:bg-[#1a233a] text-slate-200 text-xs font-bold border border-[#222f4c] transition cursor-pointer flex items-center gap-1.5"
          >
            <XCircle className="w-4 h-4 text-rose-400" />
            Reject & Enforce Stop
          </button>
          <button
            onClick={onApprove}
            className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition shadow-lg shadow-amber-600/30 cursor-pointer flex items-center gap-1.5"
          >
            <CheckCircle className="w-4 h-4" />
            Authorize Autonomous PO
          </button>
        </div>
      </div>
    </div>
  );
};
