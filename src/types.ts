export interface Process {
  pid: string;
  arrival_time: number;
  burst_time: number;
  priority: number;
  color: string;
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
