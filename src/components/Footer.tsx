import React from 'react';

interface FooterProps {
  onOpenPitchGuide: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPitchGuide }) => {
  return (
    <footer className="border-t border-[#1a233a] bg-[#0f1420] px-4 sm:px-6 py-2.5 text-xs font-mono text-slate-300 font-medium flex flex-wrap items-center justify-between gap-4 mt-auto">
      <div className="flex items-center flex-wrap gap-x-4 gap-y-1">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>
            Event Relay: <strong className="text-white font-semibold">Express API (Local)</strong>
          </span>
        </span>
        <span className="hidden md:inline text-slate-500">|</span>
        <span className="hidden md:inline">
          Inference: <strong className="text-white font-semibold">Gemini-assisted reasoning</strong>
        </span>
        <span className="hidden md:inline text-slate-500">|</span>
        <span className="hidden md:inline">
          State Engine: <strong className="text-white font-semibold">In-memory deterministic state machine</strong>
        </span>
      </div>

      <div className="flex items-center space-x-3 text-[11px]">
        <button
          onClick={onOpenPitchGuide}
          className="bg-[#141b2d] hover:bg-[#1a233a] border border-sky-800/60 px-2.5 py-0.5 rounded text-sky-300 hover:text-white transition cursor-pointer font-semibold"
        >
          Demo Ready: 3m Pitch Mode
        </button>
        <span className="text-sky-300 font-bold">REACTOR Recovery Engine</span>
      </div>
    </footer>
  );
};
