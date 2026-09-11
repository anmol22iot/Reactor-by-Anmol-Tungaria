export type MissionPhase =
  | 'IDLE'
  | 'GOAL_RECEIVED'
  | 'OBSERVATION'
  | 'PLANNING_ACTION'
  | 'FAILURE_ENCOUNTERED'
  | 'FAILURE_DETECTED'
  | 'AUTONOMOUS_REPLANNING'
  | 'AWAITING_APPROVAL'
  | 'RECOVERY_EXECUTED'
  | 'INDEPENDENT_VERIFICATION'
  | 'MISSION_COMPLETE';

export type ChaosMode =
  | 'supplier_failure'
  | 'capacity_reduction'
  | 'budget_tightening'
  | 'inventory_mismatch'
  | 'api_timeout';

export interface SupplierInfo {
  id: string;
  name: string;
  unitPrice: number;
  maxCapacity: number;
  promisedEta: string;
  reliabilityScore: number;
  status: 'ELIGIBLE' | 'ACTIVE' | 'REJECTED' | 'BLACK_LISTED' | 'SELECTED';
  rejectionReason?: string;
}

export interface TraceEvent {
  id: string;
  stepNumber: string;
  phase: MissionPhase;
  timestamp: string;
  title: string;
  description: string;
  tool?: string;
  inputPayload?: string;
  resultPayload?: string;
  status: 'SUCCESS' | 'FAILURE' | 'REPLANNING' | 'WARNING' | 'INFO';
  badgeColor?: string;
  details?: {
    label: string;
    value: string;
  }[];
}

export interface AuditRecord {
  id: string;
  time: string;
  tool: string;
  result: string;
  status: 'SUCCESS' | 'FAILURE' | 'RETRY' | 'PENDING';
  latencyMs: number;
}

export interface VerificationCriterion {
  id: string;
  label: string;
  source: string;
  verified: boolean;
  value: string;
}

export interface MissionState {
  missionId: string;
  goal: string;
  targetUnits: number;
  currentUnitsProtected: number;
  warehouseOnHand: number;
  deficitUnits: number;
  budgetCap: number;
  actualSpend: number;
  deadlineTime: string;
  phase: MissionPhase;
  chaosMode: ChaosMode;
  recoveryCount: number;
  humanOverridesPending: number;
  isPausedForApproval: boolean;
  isCompleted: boolean;
  activePlanSummary: string;
  triggeringAnomaly: string | null;
  selectedSuppliers: {
    supplier: string;
    units: number;
    spend: number;
    eta: string;
    ackToken?: string;
  }[];
  traceEvents: TraceEvent[];
  auditRecords: AuditRecord[];
  verificationList: VerificationCriterion[];
  engineVerdict: 'STANDBY' | 'EXECUTING' | 'REPLANNING_IN_PROGRESS' | 'STATUS_GOAL_SATISFIED' | 'PAUSED_SAFETY_GATEWAY';
}
