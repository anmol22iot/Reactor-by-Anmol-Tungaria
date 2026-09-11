import React from 'react';
import { Play, Pause, RotateCcw, Zap, SkipForward, AlertTriangle, HelpCircle, CheckCircle2 } from 'lucide-react';
import { ChaosMode, MissionPhase } from '../types';

interface HeaderProps {
  phase: MissionPhase;
  chaosMode: ChaosMode;
  onChaosChange: (mode: ChaosMode) => void;
  onSimulateChaos: () => void;
  onStartOrStep: () => void;
  onReset: () => void;
  isAutoPlaying: boolean;
  onToggleAutoPlay: () => void;
  onOpenPitchGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  phase,
  chaosMode,
  onChaosChange,
  onSimulateChaos,
  onStartOrStep,
  onReset,
  isAutoPlaying,
  onToggleAutoPlay,
  onOpenPitchGuide,
}) => {
  const isComplete = phase === 'MISSION_COMPLETE';
  const isIdle = phase === 'IDLE';

  // Pipeline stage active detection
  const isGoalActive = phase !== 'IDLE';
  const isPlanActive = ['PLANNING_ACTION', 'FAILURE_ENCOUNTERED', 'FAILURE_DETECTED', 'AUTONOMOUS_REPLANNING', 'AWAITING_APPROVAL', 'RECOVERY_EXECUTED', 'INDEPENDENT_VERIFICATION', 'MISSION_COMPLETE'].includes(phase);
  const isActionActive = ['PLANNING_ACTION', 'FAILURE_ENCOUNTERED', 'FAILURE_DETECTED', 'AUTONOMOUS_REPLANNING', 'AWAITING_APPROVAL', 'RECOVERY_EXECUTED', 'INDEPENDENT_VERIFICATION', 'MISSION_COMPLETE'].includes(phase);
  const isFailActive = ['FAILURE_ENCOUNTERED', 'FAILURE_DETECTED', 'AUTONOMOUS_REPLANNING', 'AWAITING_APPROVAL', 'RECOVERY_EXECUTED', 'INDEPENDENT_VERIFICATION', 'MISSION_COMPLETE'].includes(phase);
  const isReplanActive = ['AUTONOMOUS_REPLANNING', 'AWAITING_APPROVAL', 'RECOVERY_EXECUTED', 'INDEPENDENT_VERIFICATION', 'MISSION_COMPLETE'].includes(phase);
  const isExecActive = ['RECOVERY_EXECUTED', 'INDEPENDENT_VERIFICATION', 'MISSION_COMPLETE'].includes(phase);
  const isVerifyActive = phase === 'MISSION_COMPLETE';

  return (
    <header className="border-b border-[#1a233a] bg-[#0f1420]/95 backdrop-blur sticky top-0 z-40">
      <div className="px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Logo & System ID */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="flex items-center space-x-3">
            <div className="relative w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 p-0.5 shadow-lg shadow-cyan-500/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-extrabold tracking-wider text-base text-white font-mono flex items-center gap-1.5">
                  REACTOR
                  <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-400 border border-sky-500/30">
                    v2.4 Autonomous
                  </span>
                </h1>
              </div>
              <p className="text-xs text-slate-400 font-medium">Autonomous Operational Recovery Engine</p>
            </div>
          </div>

          <div className="hidden lg:block h-6 w-[1px] bg-[#222f4c]"></div>

          {/* Mission ID & System State Badges */}
          <div className="hidden lg:flex items-center space-x-3 text-xs font-mono">
            <div className="bg-[#141b2d] border border-[#222f4c] px-2.5 py-1 rounded flex items-center gap-1.5">
              <span className="text-slate-500">MISSION:</span>
              <span className="text-cyan-400 font-semibold tracking-wide">MSN-ORD-8821</span>
            </div>
            <div className="bg-[#141b2d] border border-[#222f4c] px-2.5 py-1 rounded flex items-center gap-1.5">
              <span className="text-slate-500">LOOP:</span>
              <span className="text-slate-300 font-semibold">CLOSED_LOOP_ACTIVE</span>
            </div>
            <div className="bg-[#141b2d] border border-[#222f4c] px-2.5 py-1 rounded flex items-center gap-1.5">
              <span className="text-slate-500">ENGINE:</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> ONLINE
              </span>
            </div>
          </div>
        </div>

        {/* Center Telemetry: Autonomous Loop Sequence Tracker */}
        <div className="hidden xl:flex items-center space-x-1.5 bg-[#0a0d14]/80 px-3 py-1.5 rounded-full border border-[#1a233a] text-[11px] font-mono">
          <span className="text-slate-400 font-medium">PIPELINE:</span>
          <span className={isGoalActive ? 'text-cyan-300 font-bold' : 'text-slate-500'}>GOAL</span>
          <span className="text-slate-600">→</span>
          <span className={isPlanActive ? 'text-blue-300 font-bold' : 'text-slate-500'}>PLAN</span>
          <span className="text-slate-600">→</span>
          <span className={isActionActive ? 'text-sky-300 font-bold' : 'text-slate-500'}>ACTION</span>
          <span className="text-slate-600">→</span>
          <span className={`px-1.5 py-0.5 rounded font-bold transition ${
            isFailActive ? 'bg-rose-950/80 text-rose-300 border border-rose-700/60' : 'text-slate-600'
          }`}>
            FAIL
          </span>
          <span className="text-slate-600">→</span>
          <span className={`px-1.5 py-0.5 rounded font-bold transition ${
            isReplanActive ? 'bg-purple-950/80 text-purple-300 border border-purple-700/60' : 'text-slate-600'
          }`}>
            REPLAN
          </span>
          <span className="text-slate-600">→</span>
          <span className={isExecActive ? 'text-cyan-300 font-bold' : 'text-slate-500'}>EXEC</span>
          <span className="text-slate-600">→</span>
          <span className={`px-1.5 py-0.5 rounded font-bold transition flex items-center gap-1 ${
            isVerifyActive ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/60' : 'text-slate-600'
          }`}>
            VERIFY {isVerifyActive ? '✓' : ''}
          </span>
        </div>

        {/* Right Controls & Chaos Mode Trigger */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Chaos Mode Selector */}
          <div className="flex items-center bg-[#141b2d] border border-rose-900/40 rounded-lg p-1 space-x-1.5">
            <div className="flex items-center space-x-1 px-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
              <span className="text-[11px] font-mono font-bold text-rose-300 tracking-wider">CHAOS</span>
            </div>
            <select
              value={chaosMode}
              onChange={(e) => onChaosChange(e.target.value as ChaosMode)}
              className="bg-[#0a0d14] text-slate-200 border border-[#222f4c] text-xs rounded px-2 py-1 font-mono focus:outline-none focus:border-rose-500 cursor-pointer"
            >
              <option value="supplier_failure">Supplier A Failure (Core Demo)</option>
              <option value="capacity_reduction">Delivery Capacity -40%</option>
              <option value="budget_tightening">Budget Cap Tightening (₹12k)</option>
              <option value="inventory_mismatch">Inventory Scan Mismatch (370u)</option>
              <option value="api_timeout">API 504 Gateway Timeout</option>
            </select>
            <button
              onClick={onSimulateChaos}
              title="Apply Chaos Setting & Reset"
              className="bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-semibold px-2 py-1 rounded transition flex items-center gap-1 shadow-sm cursor-pointer"
            >
              <AlertTriangle className="w-3 h-3" />
              SIMULATE
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-1.5">
            <button
              onClick={onReset}
              className="bg-[#1a233a] hover:bg-[#222f4c] text-slate-300 text-xs font-mono px-2.5 py-1.5 rounded-lg border border-[#273657] transition flex items-center gap-1.5 cursor-pointer"
              title="Reset state machine to initial conditions"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Reset</span>
            </button>

            {/* Auto-Play Toggle */}
            <button
              onClick={onToggleAutoPlay}
              disabled={isComplete}
              className={`text-xs font-mono px-3 py-1.5 rounded-lg border transition flex items-center gap-1.5 cursor-pointer ${
                isAutoPlaying
                  ? 'bg-amber-600 hover:bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-600/30'
                  : 'bg-[#1a233a] hover:bg-[#222f4c] text-slate-200 border-[#273657]'
              } ${isComplete ? 'opacity-50 cursor-not-allowed' : ''}`}
              title={isAutoPlaying ? 'Pause automatic progression' : 'Play autonomous recovery pipeline'}
            >
              {isAutoPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span className="hidden sm:inline">Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current text-emerald-400" />
                  <span className="hidden sm:inline">Auto-Play</span>
                </>
              )}
            </button>

            {/* Single Step or Start Mission */}
            <button
              onClick={onStartOrStep}
              disabled={isComplete || isAutoPlaying}
              className={`text-xs font-mono font-semibold px-3 py-1.5 rounded-lg transition shadow-lg flex items-center gap-1.5 cursor-pointer ${
                isIdle
                  ? 'bg-sky-600 hover:bg-sky-500 text-white shadow-sky-600/30'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
              } ${isComplete || isAutoPlaying ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isIdle ? (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  Start Mission
                </>
              ) : (
                <>
                  <SkipForward className="w-3.5 h-3.5" />
                  Next Step
                </>
              )}
            </button>

            {/* Hackathon Pitch Guide modal toggle */}
            <button
              onClick={onOpenPitchGuide}
              className="bg-[#141b2d] hover:bg-[#1a233a] text-cyan-400 p-1.5 rounded-lg border border-[#222f4c] transition cursor-pointer"
              title="3-Minute Hackathon Demo Pitch Guide"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
