export interface SystemProcessInfo {
  realPid: number;
  command: string;
  cpuPercent: number;
  memPercent: number;
  nice: number;
  elapsed: string;
}

export interface Process {
  pid: string;
  arrival_time: number;
  burst_time: number;
  priority: number;
  color: string;
  systemInfo?: SystemProcessInfo;
}

export interface NotificationAlert {
  id: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  title: string;
  message: string;
  timestamp: string;
  actionLabel?: string;
  onAction?: () => void;
}

export interface ScheduledProcess extends Process {
  remaining_time: number;
  completion_time: number;
  waiting_time: number;
  turnaround_time: number;
  response_time: number;
}

export interface ExecutionBlock {
  pid: string;
  start: number;
  end: number;
  color: string;
}

export interface ScheduleResult {
  processes: ScheduledProcess[];
  timeline: ExecutionBlock[];
  average_waiting: number;
  average_turnaround: number;
  average_response: number;
  cpu_utilization: number;
  throughput: number;
  finish_time: number;
  idle_time: number;
}

export type AlgorithmName =
  | 'FCFS'
  | 'SJF'
  | 'SJF Preemptive'
  | 'Priority'
  | 'Priority Preemptive'
  | 'Round Robin';

export interface AlgorithmMetrics {
  name: AlgorithmName;
  waiting: number;
  turnaround: number;
  response: number;
  cpu: number;
  throughput: number;
  finish: number;
  idle: number;
}

export interface TimelineStepState {
  time: number;
  currentPid: string | null;
  currentBlock: ExecutionBlock | null;
  readyQueue: { pid: string; remaining: number; priority: number; color: string }[];
  completedPids: string[];
  processRemaining: Record<string, number>;
}
