export type StageStatus = 'passed' | 'failed' | 'blocked' | 'running' | 'pending';
export type StageType = 'STATIC' | 'MANUAL' | 'API' | 'UI' | 'PERF' | 'GATE';
export type OutcomeConfig = 'AUTO' | 'PASS' | 'FAIL' | 'SKIP';

export interface LogEntry {
  prefix: string;
  message: string;
  type: 'normal' | 'success' | 'error' | 'warning';
}

export interface Artifact {
  name: string;
  type: 'link' | 'report';
}

export interface Stage {
  id: string;
  name: string;
  type: StageType;
  description: string;
  status: StageStatus;
  logs: LogEntry[];
  triageNote?: string;
  artifacts?: Artifact[];
}

export interface PipelineState {
  stages: Stage[];
  releaseStatus: 'pending' | 'passed' | 'blocked';
  selectedStageId: string | null;
}

export interface StageOutcome {
  stageId: string;
  outcome: OutcomeConfig;
}

export interface PipelineReport {
  id: string;
  runDate: Date;
  stages: Stage[];
  releaseStatus: 'pending' | 'passed' | 'blocked';
  passRate: number;
  // Stats from database (used when stages array is empty)
  totalPassed?: number;
  totalFailed?: number;
  totalPending?: number;
}
