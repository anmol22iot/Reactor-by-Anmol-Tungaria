/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { GoalCard } from './components/GoalCard';
import { TelemetryCard } from './components/TelemetryCard';
import { SafetyGuardrailCard } from './components/SafetyGuardrailCard';
import { MetricsBar } from './components/MetricsBar';
import { RecoveryHighlightCard } from './components/RecoveryHighlightCard';
import { ExecutionTimeline } from './components/ExecutionTimeline';
import { AuditTrailCard } from './components/AuditTrailCard';
import { VerificationCard } from './components/VerificationCard';
import { HumanApprovalModal } from './components/HumanApprovalModal';
import { PitchModeModal } from './components/PitchModeModal';
import { Footer } from './components/Footer';
import {
  advanceMissionStep,
  approveHumanOverride,
  getFullDemoState,
  getInitialStateForChaos,
} from './engine/reactorEngine';
import { ChaosMode, MissionState } from './types';

export default function App() {
  // Start with full verified state matching the Stitch demo design
  const [missionState, setMissionState] = useState<MissionState>(() => getFullDemoState());
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState<boolean>(false);
  const [isPitchGuideOpen, setIsPitchGuideOpen] = useState<boolean>(false);

  // Sync state to backend if available
  const syncToBackend = async (endpoint: string, payload?: any) => {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload ? JSON.stringify(payload) : undefined,
      });
      if (res.ok) {
        const data = await res.json();
        if (data.state) {
          setMissionState(data.state);
        }
      }
    } catch {
      // Offline fallback: client state machine works completely self-contained
    }
  };

  // Step advancement
  const handleStartOrStep = () => {
    setMissionState((prev) => {
      const next = advanceMissionStep(prev);
      if (next.phase === 'AWAITING_APPROVAL') {
        setIsApprovalModalOpen(true);
        setIsAutoPlaying(false);
      }
      return next;
    });
    syncToBackend('/api/mission/step');
  };

  // Reset to initial clean state
  const handleReset = () => {
    setIsAutoPlaying(false);
    setIsApprovalModalOpen(false);
    const fresh = getInitialStateForChaos(missionState.chaosMode);
    setMissionState(fresh);
    syncToBackend('/api/mission/reset', { chaosMode: missionState.chaosMode });
  };

  // Re-run demo from start with autoplay
  const handleReRunDemo = () => {
    setIsApprovalModalOpen(false);
    const fresh = getInitialStateForChaos(missionState.chaosMode);
    setMissionState(fresh);
    syncToBackend('/api/mission/reset', { chaosMode: missionState.chaosMode });
    // Start autoplay after brief reset pause
    setTimeout(() => {
      setIsAutoPlaying(true);
    }, 200);
  };

  // Chaos mode change
  const handleChaosChange = (mode: ChaosMode) => {
    setIsAutoPlaying(false);
    setIsApprovalModalOpen(false);
    const fresh = getInitialStateForChaos(mode);
    setMissionState(fresh);
    syncToBackend('/api/mission/chaos', { chaosMode: mode });
  };

  // Chaos mode simulate
  const handleSimulateChaos = () => {
    setIsApprovalModalOpen(false);
    const fresh = getInitialStateForChaos(missionState.chaosMode);
    setMissionState(fresh);
    syncToBackend('/api/mission/chaos', { chaosMode: missionState.chaosMode });
    setTimeout(() => {
      setIsAutoPlaying(true);
    }, 250);
  };

  // Supervisor human-in-the-loop approval
  const handleApproveOverride = () => {
    setMissionState((prev) => approveHumanOverride(prev));
    setIsApprovalModalOpen(false);
    syncToBackend('/api/mission/approve');
  };

  const handleRejectOverride = () => {
    setIsApprovalModalOpen(false);
    setIsAutoPlaying(false);
  };

  // Auto-play timer
  useEffect(() => {
    if (!isAutoPlaying) return;

    if (missionState.phase === 'MISSION_COMPLETE' || missionState.phase === 'AWAITING_APPROVAL') {
      setIsAutoPlaying(false);
      return;
    }

    const timer = setTimeout(() => {
      handleStartOrStep();
    }, 1600);

    return () => clearTimeout(timer);
  }, [isAutoPlaying, missionState.phase]);

  // Open approval modal if awaiting approval
  useEffect(() => {
    if (missionState.phase === 'AWAITING_APPROVAL') {
      setIsApprovalModalOpen(true);
      setIsAutoPlaying(false);
    }
  }, [missionState.phase]);

  return (
    <div className="min-h-screen bg-[#0a0d14] text-slate-200 font-sans antialiased flex flex-col selection:bg-sky-500 selection:text-white">
      {/* Top Header / Telemetry & Controls */}
      <Header
        phase={missionState.phase}
        chaosMode={missionState.chaosMode}
        onChaosChange={handleChaosChange}
        onSimulateChaos={handleSimulateChaos}
        onStartOrStep={handleStartOrStep}
        onReset={handleReset}
        isAutoPlaying={isAutoPlaying}
        onToggleAutoPlay={() => setIsAutoPlaying(!isAutoPlaying)}
        onOpenPitchGuide={() => setIsPitchGuideOpen(true)}
      />

      {/* Main Viewport Grid matching Stitch Operations Center layout */}
      <main className="flex-1 p-4 sm:p-5 grid grid-cols-12 gap-5 max-w-[1800px] mx-auto w-full">
        {/* LEFT COLUMN: Mission Objective, Telemetry & Guardrail (4 COLS) */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-5">
          <GoalCard state={missionState} />
          <TelemetryCard state={missionState} />
          <SafetyGuardrailCard
            state={missionState}
            onOpenApproval={() => setIsApprovalModalOpen(true)}
          />
        </div>

        {/* CENTER & RIGHT COLUMN: Execution Trace & Recovery Cascade (8 COLS) */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-5">
          {/* Top 4 Quick Metric Cards */}
          <MetricsBar state={missionState} />

          {/* Dedicated Recovery Highlight Card (#REC-01) */}
          <RecoveryHighlightCard state={missionState} />

          {/* Main Chronological Execution Timeline */}
          <ExecutionTimeline state={missionState} />

          {/* Tool Audit Ledger & Independent Verification Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <AuditTrailCard records={missionState.auditRecords} />
            <VerificationCard state={missionState} />
          </div>
        </div>
      </main>

      {/* Bottom Status Dock */}
      <Footer onOpenPitchGuide={() => setIsPitchGuideOpen(true)} />

      {/* Human-in-the-Loop Safety Modal */}
      <HumanApprovalModal
        isOpen={isApprovalModalOpen}
        state={missionState}
        onApprove={handleApproveOverride}
        onReject={handleRejectOverride}
        onClose={() => setIsApprovalModalOpen(false)}
      />

      {/* 3-Minute Hackathon Pitch Guide Modal */}
      <PitchModeModal
        isOpen={isPitchGuideOpen}
        onClose={() => setIsPitchGuideOpen(false)}
        onRunDemo={handleReRunDemo}
      />
    </div>
  );
}
