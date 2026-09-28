import { Process, AlgorithmName, AlgorithmMetrics, ScheduleResult } from '../types';
import { runAlgorithm } from './algorithms';

export const ALL_ALGORITHMS: AlgorithmName[] = [
  'FCFS',
  'SJF',
  'SJF Preemptive',
  'Priority',
  'Priority Preemptive',
  'Round Robin',
];

export interface ComparisonReport {
  results: Record<AlgorithmName, ScheduleResult>;
  metrics: AlgorithmMetrics[];
  bestAlgorithm: AlgorithmName;
  bestReason: string;
}

export class ComparisonEngine {
  public static compare(processes: Process[], quantum: number = 2): ComparisonReport {
    const results: Record<AlgorithmName, ScheduleResult> = {} as Record<AlgorithmName, ScheduleResult>;
    const metrics: AlgorithmMetrics[] = [];

    for (const algo of ALL_ALGORITHMS) {
      const result = runAlgorithm(algo, processes, quantum);
      results[algo] = result;
      metrics.push({
        name: algo,
        waiting: result.average_waiting,
        turnaround: result.average_turnaround,
        response: result.average_response,
        cpu: result.cpu_utilization,
        throughput: result.throughput,
        finish: result.finish_time,
        idle: result.idle_time,
      });
    }

    // Determine best algorithm (primary: lowest avg waiting time, secondary: lowest turnaround)
    let best = ALL_ALGORITHMS[0];
    let minWait = Infinity;
    let minTurnaround = Infinity;

    for (const m of metrics) {
      if (m.waiting < minWait || (m.waiting === minWait && m.turnaround < minTurnaround)) {
        minWait = m.waiting;
        minTurnaround = m.turnaround;
        best = m.name;
      }
    }

    const bestResult = results[best];
    const bestReason = `${best} achieved the lowest average waiting time (${bestResult.average_waiting}ms) and average turnaround time (${bestResult.average_turnaround}ms) with ${bestResult.cpu_utilization}% CPU utilization.`;

    return {
      results,
      metrics,
      bestAlgorithm: best,
      bestReason,
    };
  }
}
