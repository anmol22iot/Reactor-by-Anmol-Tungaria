import {
  AuditRecord,
  ChaosMode,
  MissionPhase,
  MissionState,
  TraceEvent,
  VerificationCriterion,
} from '../types';

export const INITIAL_MISSION_STATE: MissionState = {
  missionId: 'MSN-ORD-8821',
  goal: 'Fulfill 500 orders by 6:00 PM with maximum emergency budget ₹15,000',
  targetUnits: 500,
  currentUnitsProtected: 0,
  warehouseOnHand: 0,
  deficitUnits: 0,
  budgetCap: 15000,
  actualSpend: 0,
  deadlineTime: '18:00:00 IST',
  phase: 'IDLE',
  chaosMode: 'supplier_failure',
  recoveryCount: 0,
  humanOverridesPending: 0,
  isPausedForApproval: false,
  isCompleted: false,
  activePlanSummary: 'System standby. Click "Start Mission" to initiate autonomous closed-loop execution.',
  triggeringAnomaly: null,
  selectedSuppliers: [],
  traceEvents: [],
  auditRecords: [],
  verificationList: [
    {
      id: 'v1',
      label: '500 / 500 Orders Protected',
      source: 'External ERP Polled',
      verified: false,
      value: 'Pending scan',
    },
    {
      id: 'v2',
      label: 'Spend ≤ Budget Cap',
      source: 'Ledger Verified',
      verified: false,
      value: '₹0 / ₹15,000',
    },
    {
      id: 'v3',
      label: 'Delivery ETA < 18:00 Cutoff',
      source: 'Carrier SLA Bound',
      verified: false,
      value: 'Unscheduled',
    },
    {
      id: 'v4',
      label: 'Zero Human Overrides Required',
      source: 'Fully Autonomous Policy',
      verified: false,
      value: 'Policy Enforced',
    },
  ],
  engineVerdict: 'STANDBY',
};

export function getInitialStateForChaos(mode: ChaosMode): MissionState {
  const budget = mode === 'budget_tightening' ? 12000 : 15000;
  return {
    ...INITIAL_MISSION_STATE,
    chaosMode: mode,
    budgetCap: budget,
    goal: `Fulfill 500 orders by 6:00 PM with maximum emergency budget ₹${budget.toLocaleString()}`,
    verificationList: [
      {
        id: 'v1',
        label: '500 / 500 Orders Protected',
        source: 'External ERP Polled',
        verified: false,
        value: 'Pending scan',
      },
      {
        id: 'v2',
        label: `Spend ≤ ₹${budget.toLocaleString()} Cap`,
        source: 'Ledger Verified',
        verified: false,
        value: `₹0 / ₹${budget.toLocaleString()}`,
      },
      {
        id: 'v3',
        label: 'Delivery ETA < 18:00 Cutoff',
        source: 'Carrier SLA Bound',
        verified: false,
        value: 'Unscheduled',
      },
      {
        id: 'v4',
        label: 'Zero Human Overrides Required',
        source: 'Fully Autonomous Policy',
        verified: false,
        value: 'Policy Enforced',
      },
    ],
  };
}

export function getFullDemoState(mode: ChaosMode = 'supplier_failure'): MissionState {
  let s = getInitialStateForChaos(mode);
  while (s.phase !== 'MISSION_COMPLETE') {
    if (s.phase === 'AWAITING_APPROVAL') {
      s = approveHumanOverride(s);
    } else {
      s = advanceMissionStep(s);
    }
  }
  return s;
}

export function advanceMissionStep(currentState: MissionState): MissionState {
  const nowTime = (offsetSec: number = 0) => {
    const base = new Date('2026-09-09T16:02:10Z');
    base.setSeconds(base.getSeconds() + offsetSec);
    const hh = String(base.getUTCHours()).padStart(2, '0');
    const mm = String(base.getUTCMinutes()).padStart(2, '0');
    const ss = String(base.getUTCSeconds()).padStart(2, '0');
    return `${hh}:${mm}:${ss} IST`;
  };

  const { phase, chaosMode, budgetCap } = currentState;

  switch (phase) {
    case 'IDLE': {
      // Step 1: GOAL RECEIVED
      const event: TraceEvent = {
        id: 'evt-01',
        stepNumber: '01',
        phase: 'GOAL_RECEIVED',
        timestamp: nowTime(0),
        title: 'GOAL RECEIVED',
        description: `Mission initialized: "${currentState.goal}"`,
        status: 'INFO',
        badgeColor: 'text-brand-400',
        details: [
          { label: 'Constraint', value: `Budget ≤ ₹${budgetCap.toLocaleString()}` },
          { label: 'Cutoff', value: '18:00:00 IST' },
          { label: 'Target', value: '500 Order Units' },
        ],
      };

      return {
        ...currentState,
        phase: 'GOAL_RECEIVED',
        activePlanSummary: 'Mission objective ingested. Scheduling real-time warehouse inventory scan.',
        traceEvents: [event],
        engineVerdict: 'EXECUTING',
      };
    }

    case 'GOAL_RECEIVED': {
      // Step 2: OBSERVATION (Inventory scan)
      const onHand = chaosMode === 'inventory_mismatch' ? 370 : 415;
      const target = 500;
      const deficit = target - onHand;
      const coveragePct = Math.round((onHand / target) * 100);

      const event: TraceEvent = {
        id: 'evt-02',
        stepNumber: '02',
        phase: 'OBSERVATION',
        timestamp: nowTime(2),
        title: 'OBSERVATION',
        tool: 'warehouse_inventory_scan()',
        description: `Tool execution: warehouse_inventory_scan() completed. Current on-hand stock covers ${onHand} / ${target} units (${coveragePct}% coverage). ${deficit} units deficit detected.`,
        status: 'INFO',
        badgeColor: 'text-cyan-400',
        details: [
          { label: 'Stock On-Hand', value: `${onHand} units` },
          { label: 'Coverage', value: `${coveragePct}%` },
          { label: 'Deficit Shortage', value: `${deficit} units` },
        ],
      };

      const audit: AuditRecord = {
        id: 'aud-01',
        time: nowTime(2).slice(0, 8),
        tool: 'check_inventory',
        result: `${coveragePct}% (${onHand} un.)`,
        status: 'SUCCESS',
        latencyMs: 120,
      };

      return {
        ...currentState,
        phase: 'OBSERVATION',
        warehouseOnHand: onHand,
        currentUnitsProtected: onHand,
        deficitUnits: deficit,
        activePlanSummary: `Inventory scan confirmed ${onHand} units on hand. Active shortage: ${deficit} units requiring autonomous sourcing.`,
        traceEvents: [...currentState.traceEvents, event],
        auditRecords: [...currentState.auditRecords, audit],
      };
    }

    case 'OBSERVATION': {
      // Step 3: PLANNING & ACTION (Select initial supplier)
      const deficit = currentState.deficitUnits;
      const spend = deficit === 85 ? 9200 : deficit * 110;

      const event: TraceEvent = {
        id: 'evt-03',
        stepNumber: '03',
        phase: 'PLANNING_ACTION',
        timestamp: nowTime(5),
        title: 'PLANNING & ACTION',
        tool: 'submit_po(supplier="Supplier A")',
        description: `Evaluated 4 registered suppliers. Selected Supplier A (Best unit economics + promised 45m dispatch). Dispatched order for ${deficit} units @ ₹${spend.toLocaleString()}.`,
        status: 'INFO',
        badgeColor: 'text-blue-400',
        inputPayload: JSON.stringify({ supplier: 'Supplier A', qty: deficit, max_spend: spend }),
        resultPayload: 'PO_STATUS: PENDING_ACKNOWLEDGEMENT (SLA 45m)',
        details: [
          { label: 'Selected Vendor', value: 'Supplier A (Tier 1)' },
          { label: 'Ordered Qty', value: `${deficit} units` },
          { label: 'Quoted Spend', value: `₹${spend.toLocaleString()}` },
          { label: 'Target ETA', value: '16:50:00 IST' },
        ],
      };

      const audit: AuditRecord = {
        id: 'aud-02',
        time: nowTime(5).slice(0, 8),
        tool: 'select_supplier',
        result: 'Supplier A',
        status: 'SUCCESS',
        latencyMs: 180,
      };

      return {
        ...currentState,
        phase: 'PLANNING_ACTION',
        actualSpend: spend,
        activePlanSummary: `Initial order submitted to Supplier A for ${deficit} units. Awaiting automated gateway ACK.`,
        traceEvents: [...currentState.traceEvents, event],
        auditRecords: [...currentState.auditRecords, audit],
      };
    }

    case 'PLANNING_ACTION': {
      // Step 4: REAL-WORLD FAILURE ENCOUNTERED
      let failureTitle = 'REAL-WORLD FAILURE ENCOUNTERED';
      let errorMsg = 'Supplier A REJECTED the procurement request.';
      let signal = 'HTTP 422 Unprocessable Entity - "Regional Depot At Capacity - Cannot Guarantee 18:00 Cutoff"';

      if (chaosMode === 'api_timeout') {
        failureTitle = 'API TIMEOUT ENCOUNTERED';
        errorMsg = 'Supplier A API Gateway timed out after 3 connection attempts.';
        signal = 'HTTP 504 Gateway Timeout - "Remote Vendor Endpoint Unresponsive (>15,000ms)"';
      }

      const event: TraceEvent = {
        id: 'evt-04',
        stepNumber: '04',
        phase: 'FAILURE_ENCOUNTERED',
        timestamp: nowTime(12),
        title: failureTitle,
        description: `${errorMsg} Signal: ${signal}. Normal chatbots or static scripts halt here with an unhandled exception. REACTOR's closed-loop supervisor catches the fault.`,
        status: 'FAILURE',
        badgeColor: 'text-rose-400',
        resultPayload: signal,
        details: [
          { label: 'Fault Code', value: chaosMode === 'api_timeout' ? 'ERR_GATEWAY_TIMEOUT' : 'ERR_CAPACITY_REJECTED' },
          { label: 'Vendor Status', value: 'UNAVAILABLE' },
          { label: 'Orders at Risk', value: `${currentState.deficitUnits} units` },
        ],
      };

      const audit: AuditRecord = {
        id: 'aud-03',
        time: nowTime(12).slice(0, 8),
        tool: 'place_order',
        result: chaosMode === 'api_timeout' ? 'TIMEOUT_504' : 'CAPACITY_REJECT',
        status: 'FAILURE',
        latencyMs: 450,
      };

      return {
        ...currentState,
        phase: 'FAILURE_ENCOUNTERED',
        triggeringAnomaly: `Supplier A API returned ${chaosMode === 'api_timeout' ? 'ERR_GATEWAY_TIMEOUT' : 'ERR_CAPACITY_REJECTED'}. Immediate autonomous blacklisting & replanning engaged.`,
        activePlanSummary: 'Anomaly detected: Primary supplier failed. Invoking failure assessment module and active state graph mutation.',
        traceEvents: [...currentState.traceEvents, event],
        auditRecords: [...currentState.auditRecords, audit],
        engineVerdict: 'REPLANNING_IN_PROGRESS',
      };
    }

    case 'FAILURE_ENCOUNTERED': {
      // Step 5: FAILURE DETECTED & STATE UPDATED
      const event: TraceEvent = {
        id: 'evt-05',
        stepNumber: '05',
        phase: 'FAILURE_DETECTED',
        timestamp: nowTime(13),
        title: 'FAILURE DETECTED & STATE UPDATED',
        tool: 'eval_failure()',
        description: 'REACTOR recognized rejection signal via healthcheck validator. State mutation applied: Supplier A status set to INELIGIBLE in active planning memory. Goal deficit reset to 85 orders.',
        status: 'WARNING',
        badgeColor: 'text-amber-400',
        details: [
          { label: 'State Mutation', value: 'Supplier A → BLACKLISTED' },
          { label: 'Active Deficit', value: `${currentState.deficitUnits} units` },
          { label: 'Replanning Trigger', value: 'Automatic (0s Human Lag)' },
        ],
      };

      const audit: AuditRecord = {
        id: 'aud-04',
        time: nowTime(13).slice(0, 8),
        tool: 'eval_failure',
        result: 'Confirmed',
        status: 'SUCCESS',
        latencyMs: 90,
      };

      return {
        ...currentState,
        phase: 'FAILURE_DETECTED',
        actualSpend: 0, // Reset tentative spend from rejected supplier
        recoveryCount: 1,
        activePlanSummary: 'Supplier A blacklisted in state graph. Activating combinatorial replanning optimizer.',
        traceEvents: [...currentState.traceEvents, event],
        auditRecords: [...currentState.auditRecords, audit],
      };
    }

    case 'FAILURE_DETECTED': {
      // Step 6: AUTONOMOUS REPLANNING & BUDGET OPTIMIZATION
      let planSuppliers: {
        supplier: string;
        units: number;
        spend: number;
        eta: string;
        ackToken?: string;
      }[] = [];

      let planDescription = '';
      let totalReplanSpend = 13800;

      if (chaosMode === 'capacity_reduction') {
        // Supplier B capacity reduced to 30 units -> 3-way split: B(30) + C(40) + D(15) = 85 units
        planSuppliers = [
          { supplier: 'Supplier B', units: 30, spend: 4800, eta: '17:15 IST' },
          { supplier: 'Supplier C', units: 40, spend: 6600, eta: '17:30 IST' },
          { supplier: 'Supplier D', units: 15, spend: 2700, eta: '17:40 IST' },
        ];
        totalReplanSpend = 14100;
        planDescription = `Multi-Supplier 3-Way Hedge Formulation: Supplier B (30 un @ ₹160 = ₹4,800), Supplier C (40 un @ ₹165 = ₹6,600), Supplier D (15 un @ ₹180 = ₹2,700). Total: 85 units @ ₹14,100.`;
      } else if (chaosMode === 'inventory_mismatch') {
        // Shortage is 130 units: B (70 un @ ₹11,200) + C (60 un @ ₹9,900) wait, cap is ₹15,000!
        // Let's do B (50 un @ ₹7,500) + C (45 un @ ₹6,750) = 95 units deficit covered with high efficiency
        planSuppliers = [
          { supplier: 'Supplier B', units: 70, spend: 9800, eta: '17:20 IST' },
          { supplier: 'Supplier C', units: 60, spend: 4800, eta: '17:35 IST' },
        ];
        totalReplanSpend = 14600;
        planDescription = `Multi-Supplier Adjusted Deficit Formulation: Supplier B (70 un @ ₹140 = ₹9,800) + Supplier C (60 un @ ₹80 = ₹4,800). Total: 130 units @ ₹14,600.`;
      } else {
        // Standard core demo:
        // Supplier B for 50 units at ₹8,000 (160/unit)
        // Supplier C for 35 units at ₹5,800 (165/unit)
        // Total = 85 units, ₹13,800
        planSuppliers = [
          { supplier: 'Supplier B', units: 50, spend: 8000, eta: '17:15 IST' },
          { supplier: 'Supplier C', units: 35, spend: 5800, eta: '17:30 IST' },
        ];
        totalReplanSpend = 13800;
        planDescription = `Re-evaluated alternatives with Multi-Supplier Split Formulation: Supplier B: 50 units @ ₹160/unit = ₹8,000 (Delivery 17:15) + Supplier C: 35 units @ ₹165/unit = ₹5,800 (Delivery 17:30). Total: 85 units @ ₹13,800.`;
      }

      // Check if Safety Guardrail should pause for human-in-the-loop approval
      const exceedsBudget = totalReplanSpend > budgetCap;

      const event: TraceEvent = {
        id: 'evt-06',
        stepNumber: '06',
        phase: 'AUTONOMOUS_REPLANNING',
        timestamp: nowTime(15),
        title: 'AUTONOMOUS REPLANNING & BUDGET OPTIMIZATION',
        tool: 'replan_optimizer()',
        description: `${planDescription} Total Combined Spend: ₹${totalReplanSpend.toLocaleString()}. Constraint Verified: ${
          exceedsBudget
            ? `EXCEEDS Budget Cap of ₹${budgetCap.toLocaleString()}! Safety Guardrail activated.`
            : `Under ₹${budgetCap.toLocaleString()} Maximum Budget Cap ✓`
        }`,
        status: exceedsBudget ? 'WARNING' : 'REPLANNING',
        badgeColor: 'text-purple-400',
        details: [
          { label: 'Formulation', value: 'Dual/Multi Supplier Hedge' },
          { label: 'Planned Spend', value: `₹${totalReplanSpend.toLocaleString()}` },
          { label: 'Budget Headroom', value: exceedsBudget ? `-₹${(totalReplanSpend - budgetCap).toLocaleString()} (OVER)` : `+₹${(budgetCap - totalReplanSpend).toLocaleString()} Surplus` },
          { label: 'Max Delivery SLA', value: '17:30 IST (< 18:00 Cutoff)' },
        ],
      };

      const audit: AuditRecord = {
        id: 'aud-05',
        time: nowTime(15).slice(0, 8),
        tool: 'replan_optimizer',
        result: planSuppliers.map(s => s.supplier.replace('Supplier ', 'Supp. ')).join(' + '),
        status: 'SUCCESS',
        latencyMs: 310,
      };

      if (exceedsBudget) {
        return {
          ...currentState,
          phase: 'AWAITING_APPROVAL',
          actualSpend: totalReplanSpend,
          selectedSuppliers: planSuppliers,
          isPausedForApproval: true,
          humanOverridesPending: 1,
          activePlanSummary: `Safety Gate Triggered: Replan spend ₹${totalReplanSpend.toLocaleString()} exceeds emergency budget cap of ₹${budgetCap.toLocaleString()}. Execution paused for supervisor authorization.`,
          traceEvents: [...currentState.traceEvents, event],
          auditRecords: [...currentState.auditRecords, audit],
          engineVerdict: 'PAUSED_SAFETY_GATEWAY',
        };
      }

      return {
        ...currentState,
        phase: 'AUTONOMOUS_REPLANNING',
        actualSpend: totalReplanSpend,
        selectedSuppliers: planSuppliers,
        activePlanSummary: `Replanning formulated: ${planSuppliers.map(s => `${s.supplier} (${s.units}u)`).join(' + ')}. Budget & SLA constraints mathematically verified.`,
        traceEvents: [...currentState.traceEvents, event],
        auditRecords: [...currentState.auditRecords, audit],
      };
    }

    case 'AUTONOMOUS_REPLANNING': {
      // Step 7: RECOVERY ACTION EXECUTED
      const suppliersWithAcks = currentState.selectedSuppliers.map((s, idx) => ({
        ...s,
        ackToken: `ACK-88${19 + idx}`,
      }));

      const event: TraceEvent = {
        id: 'evt-07',
        stepNumber: '07',
        phase: 'RECOVERY_EXECUTED',
        timestamp: nowTime(18),
        title: 'RECOVERY ACTION EXECUTED',
        tool: 'execute_orders()',
        description: `Parallel PO submission executed via autonomous supplier connectors: ${suppliersWithAcks
          .map(s => `PO-${s.supplier.replace('Supplier ', 'SUP-')}: Accepted (${s.ackToken})`)
          .join(', ')}. Dispatches confirmed on carrier network.`,
        status: 'SUCCESS',
        badgeColor: 'text-cyan-400',
        details: suppliersWithAcks.map(s => ({
          label: s.supplier,
          value: `${s.units} units @ ₹${s.spend.toLocaleString()} (ETA ${s.eta}, ${s.ackToken})`,
        })),
      };

      const audit: AuditRecord = {
        id: 'aud-06',
        time: nowTime(18).slice(0, 8),
        tool: 'execute_orders',
        result: suppliersWithAcks.map(s => s.ackToken).join('/'),
        status: 'SUCCESS',
        latencyMs: 240,
      };

      return {
        ...currentState,
        phase: 'RECOVERY_EXECUTED',
        selectedSuppliers: suppliersWithAcks,
        currentUnitsProtected: 500,
        activePlanSummary: 'Recovery purchase orders acknowledged by vendor networks. Carrier tracking active. Initiating independent verification audit.',
        traceEvents: [...currentState.traceEvents, event],
        auditRecords: [...currentState.auditRecords, audit],
      };
    }

    case 'AWAITING_APPROVAL': {
      // If still paused, cannot advance until approved
      return currentState;
    }

    case 'RECOVERY_EXECUTED': {
      // Step 8: INDEPENDENT VERIFICATION & MISSION COMPLETE
      const surplus = currentState.budgetCap - currentState.actualSpend;

      const event: TraceEvent = {
        id: 'evt-08',
        stepNumber: '08',
        phase: 'INDEPENDENT_VERIFICATION',
        timestamp: nowTime(25),
        title: 'INDEPENDENT VERIFICATION — MISSION COMPLETE',
        tool: 'independent_verification()',
        description: `500 / 500 Orders Protected. Zero Manual Overrides Required. Evaluator confirmed: 100% volume satisfied, spend of ₹${currentState.actualSpend.toLocaleString()} ≤ ₹${currentState.budgetCap.toLocaleString()} cap (Surplus: ₹${surplus.toLocaleString()}), carrier delivery SLA bound before 18:00 cutoff.`,
        status: 'SUCCESS',
        badgeColor: 'text-emerald-400',
        details: [
          { label: 'External ERP Audit', value: '500/500 Verified (100% Intact)' },
          { label: 'Fiscal Audit', value: `₹${currentState.actualSpend.toLocaleString()} Spent (₹${surplus.toLocaleString()} surplus)` },
          { label: 'Carrier SLA', value: '17:30 IST Arrival (< 18:00 cutoff)' },
          { label: 'Autonomous Recovery Loop', value: '25s elapsed, 0s human lag' },
        ],
      };

      const audit: AuditRecord = {
        id: 'aud-07',
        time: nowTime(25).slice(0, 8),
        tool: 'independent_verification',
        result: 'STATUS_GOAL_SATISFIED',
        status: 'SUCCESS',
        latencyMs: 140,
      };

      const updatedVerification: VerificationCriterion[] = [
        {
          id: 'v1',
          label: '500 / 500 Orders Protected',
          source: 'External ERP Polled',
          verified: true,
          value: '500/500 Complete (100%)',
        },
        {
          id: 'v2',
          label: `Spend ≤ ₹${currentState.budgetCap.toLocaleString()} Cap`,
          source: 'Ledger Verified',
          verified: true,
          value: `₹${currentState.actualSpend.toLocaleString()} Spent`,
        },
        {
          id: 'v3',
          label: 'Delivery ETA < 18:00 Cutoff',
          source: 'Carrier SLA Bound',
          verified: true,
          value: '17:30 IST Guaranteed',
        },
        {
          id: 'v4',
          label: 'Zero Human Overrides Required',
          source: 'Fully Autonomous Policy',
          verified: true,
          value: '100% Autonomous',
        },
      ];

      return {
        ...currentState,
        phase: 'MISSION_COMPLETE',
        isCompleted: true,
        activePlanSummary: 'Mission verified complete. All 500 critical orders protected within budget and SLA deadlines.',
        traceEvents: [...currentState.traceEvents, event],
        auditRecords: [...currentState.auditRecords, audit],
        verificationList: updatedVerification,
        engineVerdict: 'STATUS_GOAL_SATISFIED',
      };
    }

    case 'INDEPENDENT_VERIFICATION':
    case 'MISSION_COMPLETE':
    default:
      return currentState;
  }
}

export function approveHumanOverride(currentState: MissionState): MissionState {
  if (currentState.phase !== 'AWAITING_APPROVAL') return currentState;

  // Once approved, advance to RECOVERY_EXECUTED
  const suppliersWithAcks = currentState.selectedSuppliers.map((s, idx) => ({
    ...s,
    ackToken: `ACK-OVERRIDE-88${19 + idx}`,
  }));

  const now = '16:02:20 IST';

  const approvalEvent: TraceEvent = {
    id: 'evt-override-01',
    stepNumber: '06B',
    phase: 'AUTONOMOUS_REPLANNING',
    timestamp: now,
    title: 'HUMAN SUPERVISOR OVERRIDE AUTHORIZED',
    description: `Supervisor authorized emergency overdraft of ₹${(currentState.actualSpend - currentState.budgetCap).toLocaleString()} for mission criticality. Proceeding with autonomous PO execution.`,
    status: 'WARNING',
    badgeColor: 'text-amber-400',
    details: [
      { label: 'Authorized Spend', value: `₹${currentState.actualSpend.toLocaleString()}` },
      { label: 'Supervisory Badge', value: 'SEC-AUTH-SUP-901' },
    ],
  };

  const execEvent: TraceEvent = {
    id: 'evt-07',
    stepNumber: '07',
    phase: 'RECOVERY_EXECUTED',
    timestamp: '16:02:22 IST',
    title: 'RECOVERY ACTION EXECUTED (AUTHORIZED)',
    tool: 'execute_orders()',
    description: `Parallel PO submission executed with supervisor authorization: ${suppliersWithAcks
      .map(s => `PO-${s.supplier.replace('Supplier ', 'SUP-')}: Accepted (${s.ackToken})`)
      .join(', ')}.`,
    status: 'SUCCESS',
    badgeColor: 'text-cyan-400',
    details: suppliersWithAcks.map(s => ({
      label: s.supplier,
      value: `${s.units} units @ ₹${s.spend.toLocaleString()} (ETA ${s.eta})`,
    })),
  };

  const auditRecord: AuditRecord = {
    id: 'aud-override',
    time: now.slice(0, 8),
    tool: 'human_gate_override',
    result: 'SUPERVISOR_APPROVED',
    status: 'SUCCESS',
    latencyMs: 120,
  };

  return {
    ...currentState,
    phase: 'RECOVERY_EXECUTED',
    isPausedForApproval: false,
    humanOverridesPending: 0,
    currentUnitsProtected: 500,
    selectedSuppliers: suppliersWithAcks,
    activePlanSummary: 'Supervisor override processed. Dispatches acknowledged. Initiating independent verification audit.',
    traceEvents: [...currentState.traceEvents, approvalEvent, execEvent],
    auditRecords: [...currentState.auditRecords, auditRecord],
  };
}
