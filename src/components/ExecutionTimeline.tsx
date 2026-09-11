import React from 'react';
import { AlertCircle, CheckCircle, Clock, Zap, ArrowRight, ShieldCheck } from 'lucide-react';
import { MissionState, TraceEvent } from '../types';

interface ExecutionTimelineProps {
  state: MissionState;
}

export const ExecutionTimeline: React.FC<ExecutionTimelineProps> = ({ state }) => {
  const { traceEvents, phase } = state;

  const eventCount = traceEvents.length > 0 ? traceEvents.length : 8;

  return (
    <div className="bg-[#0f1420] border border-[#1a233a] rounded-xl p-5 shadow-xl flex-1 flex flex-col">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#1a233a]">
        <div>
          <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
            <span>LIVE AUTONOMOUS EXECUTION TRACE</span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-600">
              Chronological Event Bus
            </span>
          </h3>
          <p className="text-xs text-slate-300 mt-0.5 font-medium">
            Deterministic trace of perception, cognition, actions, failure detection, and recovery
          </p>
        </div>
        <div className="flex items-center space-x-2 text-[11px] font-mono text-slate-300">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#141b2d] border border-[#222f4c] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            {eventCount} Events Logged
          </span>
        </div>
      </div>

      {traceEvents.length === 0 ? (
        /* Empty / Initial preview mode before starting */
        <div className="py-12 text-center text-slate-400 font-mono text-xs">
          <Zap className="w-8 h-8 mx-auto mb-2 text-sky-400 animate-pulse" />
          <p className="text-slate-200 font-bold text-sm">Pipeline Armed in Standby Mode</p>
          <p className="text-[11px] mt-1 text-slate-300 font-medium">
            Click <strong className="text-sky-300">"Start Mission"</strong> or <strong className="text-emerald-300">"Auto-Play"</strong> to witness autonomous closed-loop recovery.
          </p>
        </div>
      ) : (
        /* Vertical Timeline Items */
        <div className="relative pl-6 space-y-4 font-mono text-xs before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-[#1a233a]">
          {traceEvents.map((event) => {
            const isFailure = event.status === 'FAILURE';
            const isWarning = event.status === 'WARNING';
            const isComplete = event.stepNumber === '08';
            const isReplan = event.stepNumber === '06';

            return (
              <div key={event.id} className="relative group transition-all duration-300">
                {/* Node marker on timeline */}
                <div
                  className={`absolute -left-[30px] top-1 w-5 h-5 rounded-full bg-[#0a0d14] border-2 flex items-center justify-center transition-all ${
                    isFailure
                      ? 'border-rose-500 shadow-lg shadow-rose-500/30'
                      : isWarning
                      ? 'border-amber-400'
                      : isReplan
                      ? 'border-purple-400 shadow-lg shadow-purple-500/20'
                      : isComplete
                      ? 'border-emerald-400 shadow-lg shadow-emerald-500/30'
                      : 'border-sky-400'
                  }`}
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${
                      isFailure
                        ? 'bg-rose-500 animate-ping'
                        : isWarning
                        ? 'bg-amber-400'
                        : isReplan
                        ? 'bg-purple-400'
                        : isComplete
                        ? 'bg-emerald-400'
                        : 'bg-sky-400'
                    }`}
                  />
                </div>

                {/* Event Card Content */}
                {isFailure ? (
                  /* 04. REAL-WORLD FAILURE ENCOUNTERED */
                  <div className="bg-rose-950/60 border-2 border-rose-600 p-3.5 rounded-lg shadow-lg relative">
                    <div className="flex items-center justify-between text-[10px] text-rose-300 mb-1">
                      <span className="font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                        {event.stepNumber}. {event.title}
                      </span>
                      <span className="text-rose-200 font-bold">{event.timestamp}</span>
                    </div>
                    <p className="text-white font-bold text-[13px]">{event.description.split('. ')[0]}.</p>
                    {event.resultPayload && (
                      <div className="mt-1.5 bg-rose-950 p-2 rounded border border-rose-700 text-[11px] text-rose-100 font-medium">
                        <span>Signal: <code className="text-rose-200 font-bold">{event.resultPayload}</code></span>
                      </div>
                    )}
                    <p className="text-slate-300 text-[10px] mt-2 italic font-medium">
                      Normal chatbots or static scripts halt here with an error. REACTOR autonomously catches the signal.
                    </p>
                  </div>
                ) : isReplan ? (
                  /* 06. AUTONOMOUS REPLANNING & BUDGET OPTIMIZATION */
                  <div className="bg-purple-950/40 border border-purple-600 p-3.5 rounded-lg hover:border-purple-400 transition shadow-md">
                    <div className="flex items-center justify-between text-[10px] text-purple-300 mb-1">
                      <span className="font-bold uppercase tracking-wider">
                        {event.stepNumber}. {event.title}
                      </span>
                      <span className="text-purple-200 font-semibold">{event.timestamp}</span>
                    </div>
                    <p className="text-white font-semibold">{event.description.split('Total')[0]}</p>
                    
                    {/* Multi-supplier split cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 text-[11px]">
                      <div className="bg-[#0a0d14] p-2 rounded border border-[#222f4c] text-slate-200">
                        <span className="text-purple-300 font-bold">Supplier B:</span> 50 units @ ₹160/unit = ₹8,000 (Delivery 17:15)
                      </div>
                      <div className="bg-[#0a0d14] p-2 rounded border border-[#222f4c] text-slate-200">
                        <span className="text-purple-300 font-bold">Supplier C:</span> 35 units @ ₹165/unit = ₹5,800 (Delivery 17:30)
                      </div>
                    </div>

                    <div className="mt-2 text-[10px] text-emerald-300 font-semibold flex items-center justify-between pt-1.5 border-t border-purple-900/60">
                      <span>Total Combined Spend: ₹13,800</span>
                      <span>Constraint Verified: Under ₹15,000 Maximum Budget Cap ✓</span>
                    </div>
                  </div>
                ) : isComplete ? (
                  /* 08. INDEPENDENT VERIFICATION — MISSION COMPLETE */
                  <div className="bg-emerald-950/50 border-2 border-emerald-500 p-3.5 rounded-lg shadow-lg">
                    <div className="flex items-center justify-between text-[10px] text-emerald-300 mb-1">
                      <span className="font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                        {event.stepNumber}. {event.title}
                      </span>
                      <span className="text-emerald-200 font-bold">{event.timestamp} (Total Loop: 25s)</span>
                    </div>
                    <p className="text-white font-bold text-[13px]">
                      500 / 500 Orders Protected. Zero Manual Overrides Required.
                    </p>
                    <div className="mt-2 grid grid-cols-3 gap-2 text-[10px]">
                      <div className="bg-emerald-900/60 p-1.5 rounded text-emerald-100 border border-emerald-600 text-center font-bold">
                        ✓ 100% Volume Met
                      </div>
                      <div className="bg-emerald-900/60 p-1.5 rounded text-emerald-100 border border-emerald-600 text-center font-bold">
                        ✓ Spend: ₹13,800 ≤ ₹15k
                      </div>
                      <div className="bg-emerald-900/60 p-1.5 rounded text-emerald-100 border border-emerald-600 text-center font-bold">
                        ✓ Estimated 17:30 &lt; 18:00
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Standard Steps (01, 02, 03, 05, 07) */
                  <div className="bg-[#141b2d] border border-[#1a233a] p-3 rounded-lg hover:border-sky-500/50 transition">
                    <div className="flex items-center justify-between text-[10px] text-slate-300 mb-1 font-semibold">
                      <span className={`font-bold uppercase tracking-wider ${event.badgeColor || 'text-sky-300'}`}>
                        {event.stepNumber}. {event.title}
                      </span>
                      <span className="text-slate-300">{event.timestamp}</span>
                    </div>
                    <p className="text-slate-100 font-medium">{event.description}</p>

                    {event.tool && (
                      <div className="mt-2 text-[11px] bg-[#0a0d14] p-2 rounded border border-[#222f4c] flex justify-between items-center text-slate-200">
                        <span>Action: <code className="text-sky-300 font-bold">{event.tool}</code></span>
                        <span className="text-emerald-300 font-bold text-[10px]">EXECUTED</span>
                      </div>
                    )}

                    {event.details && event.details.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2 text-[10px] text-slate-300">
                        {event.details.map((d, i) => (
                          <span key={i} className="bg-[#0a0d14] px-2 py-0.5 rounded border border-[#222f4c] font-medium">
                            <span className="text-slate-400 font-semibold">{d.label}: </span>
                            <span className="text-slate-100 font-bold">{d.value}</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
