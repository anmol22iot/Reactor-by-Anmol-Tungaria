import React from 'react';
import { X, Play, Shield, Zap, RefreshCw, AlertTriangle } from 'lucide-react';

interface PitchModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRunDemo: () => void;
}

export const PitchModeModal: React.FC<PitchModeModalProps> = ({
  isOpen,
  onClose,
  onRunDemo,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a0d14]/85 backdrop-blur-md animate-fade-in font-mono">
      <div className="bg-[#0f1420] border-2 border-sky-500/50 rounded-2xl max-w-2xl w-full p-6 shadow-2xl shadow-sky-500/10 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-[#1a233a]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 p-0.5 flex items-center justify-center text-white shadow-lg shadow-sky-500/30">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">3-MINUTE HACKATHON PITCH GUIDE</h3>
              <p className="text-xs text-sky-400 font-semibold">How to Present REACTOR to Hackathon Judges</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-[#141b2d] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-5 space-y-4 text-xs leading-relaxed">
          {/* Section 1 */}
          <div className="bg-[#141b2d] p-3.5 rounded-xl border border-[#222f4c]">
            <div className="flex items-center gap-2 text-sky-400 font-bold text-sm mb-1">
              <span className="w-5 h-5 rounded-full bg-sky-500/20 flex items-center justify-center text-xs">1</span>
              Minute 1: The Critical Mission & Fragile Optimism
            </div>
            <p className="text-slate-300">
              Show the Active Operational Goal: <strong>"Fulfill 500 orders by 6:00 PM with ₹15,000 budget."</strong> The engine scans the warehouse, finds 415 units (83%), detects an 85-unit shortage, and places an order with Supplier A for ₹9,200. Everything looks standard until...
            </p>
          </div>

          {/* Section 2 */}
          <div className="bg-rose-950/20 p-3.5 rounded-xl border border-rose-800/40">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-sm mb-1">
              <span className="w-5 h-5 rounded-full bg-rose-500/20 flex items-center justify-center text-xs">2</span>
              Minute 2: Real-World Failure & Autonomous Resilience
            </div>
            <p className="text-slate-300">
              <strong>Supplier A REJECTS the PO (HTTP 422 capacity constraint).</strong> Emphasize to the judges: <em>"A static script or conventional chatbot crashes here and alerts humans. REACTOR treats failure as an expected state condition."</em> In under 3 seconds, it blacklists Supplier A, recomputes an optimal multi-supplier split (Supplier B: 50u @ ₹8,000 + Supplier C: 35u @ ₹5,800 = ₹13,800 &lt; ₹15,000 cap), and executes parallel orders automatically with 0s human lag!
            </p>
          </div>

          {/* Section 3 */}
          <div className="bg-emerald-950/20 p-3.5 rounded-xl border border-emerald-800/40">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-1">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-xs">3</span>
              Minute 3: Independent Outcome Verification
            </div>
            <p className="text-slate-300">
              Point to the <strong>Independent Outcome Verification card</strong>. <em>"REACTOR does not grade its own homework."</em> An isolated verifier independently validates external ERP database truth: 500/500 orders protected, spend ledger verified at ₹13,800, carrier SLA arrival 17:30 &lt; 18:00 cutoff.
            </p>
          </div>

          {/* Section 4 */}
          <div className="bg-amber-950/20 p-3.5 rounded-xl border border-amber-800/40">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm mb-1">
              <AlertTriangle className="w-4 h-4" />
              Bonus: Chaos Mode & Human-in-the-Loop Safety
            </div>
            <p className="text-slate-300">
              Show the <strong>Chaos Mode selector</strong>: switch to <strong>"Budget Cap Tightening (₹12k)"</strong> to prove that when an autonomous action exceeds authorized spending thresholds, REACTOR automatically pauses for human supervisor authorization!
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between pt-4 border-t border-[#1a233a]">
          <span className="text-[11px] text-slate-400 font-mono">
            Key Metric: <strong className="text-emerald-400">100% Volume Protected · ₹1,200 Surplus</strong>
          </span>
          <div className="flex space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#141b2d] hover:bg-[#1a233a] text-slate-300 text-xs transition cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onRunDemo();
              }}
              className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition shadow-lg shadow-sky-600/30 flex items-center gap-1.5 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Run 3-Minute Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
