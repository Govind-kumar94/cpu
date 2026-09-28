import { Process } from '../types';
import { PROCESS_COLORS } from '../core/algorithms';

export interface Preset {
  id: string;
  name: string;
  description: string;
  recommendedAlgorithm?: string;
  processes: Process[];
}

export const PRESETS: Preset[] = [
  {
    id: 'textbook-standard',
    name: 'OS Textbook Standard',
    description: 'Classic 4-process mixed arrival times, burst durations, and priorities.',
    recommendedAlgorithm: 'SJF Preemptive',
    processes: [
      { pid: 'P1', arrival_time: 0, burst_time: 8, priority: 3, color: PROCESS_COLORS[0] },
      { pid: 'P2', arrival_time: 1, burst_time: 4, priority: 1, color: PROCESS_COLORS[1] },
      { pid: 'P3', arrival_time: 2, burst_time: 9, priority: 4, color: PROCESS_COLORS[2] },
      { pid: 'P4', arrival_time: 3, burst_time: 5, priority: 2, color: PROCESS_COLORS[3] },
    ],
  },
  {
    id: 'convoy-effect',
    name: 'Convoy Effect Demo',
    description: 'Heavy CPU burst arrives at t=0 while lightweight tasks wait behind it in FCFS.',
    recommendedAlgorithm: 'Round Robin',
    processes: [
      { pid: 'Heavy P1', arrival_time: 0, burst_time: 20, priority: 3, color: PROCESS_COLORS[3] },
      { pid: 'Quick P2', arrival_time: 1, burst_time: 3, priority: 2, color: PROCESS_COLORS[1] },
      { pid: 'Quick P3', arrival_time: 2, burst_time: 2, priority: 1, color: PROCESS_COLORS[0] },
      { pid: 'Quick P4', arrival_time: 3, burst_time: 4, priority: 2, color: PROCESS_COLORS[4] },
    ],
  },
  {
    id: 'priority-preemption',
    name: 'Priority & Starvation Demo',
    description: 'Higher-priority processes arrive successively, preempting low-priority tasks.',
    recommendedAlgorithm: 'Priority Preemptive',
    processes: [
      { pid: 'Background Worker', arrival_time: 0, burst_time: 14, priority: 5, color: PROCESS_COLORS[4] },
      { pid: 'Batch Job', arrival_time: 2, burst_time: 6, priority: 3, color: PROCESS_COLORS[2] },
      { pid: 'Audio Stream', arrival_time: 4, burst_time: 3, priority: 1, color: PROCESS_COLORS[0] },
      { pid: 'User Input Handler', arrival_time: 7, burst_time: 2, priority: 1, color: PROCESS_COLORS[1] },
    ],
  },
  {
    id: 'interactive-system',
    name: 'Realistic System Workload',
    description: 'Simulated real OS processes with kernel interrupts, background daemons, and apps.',
    recommendedAlgorithm: 'Round Robin',
    processes: [
      { pid: 'kernel_task', arrival_time: 0, burst_time: 3, priority: 1, color: PROCESS_COLORS[5] },
      { pid: 'window_server', arrival_time: 0, burst_time: 7, priority: 2, color: PROCESS_COLORS[0] },
      { pid: 'chrome_render', arrival_time: 2, burst_time: 10, priority: 3, color: PROCESS_COLORS[2] },
      { pid: 'code_lsp', arrival_time: 3, burst_time: 5, priority: 3, color: PROCESS_COLORS[4] },
      { pid: 'audio_engine', arrival_time: 5, burst_time: 2, priority: 1, color: PROCESS_COLORS[1] },
    ],
  },
  {
    id: 'io-bursts',
    name: 'Short Burst Interactive',
    description: 'Fast, evenly balanced bursts with stagger arrivals testing turnaround agility.',
    recommendedAlgorithm: 'SJF',
    processes: [
      { pid: 'P1', arrival_time: 0, burst_time: 3, priority: 2, color: PROCESS_COLORS[0] },
      { pid: 'P2', arrival_time: 2, burst_time: 4, priority: 1, color: PROCESS_COLORS[1] },
      { pid: 'P3', arrival_time: 4, burst_time: 2, priority: 3, color: PROCESS_COLORS[2] },
      { pid: 'P4', arrival_time: 6, burst_time: 5, priority: 2, color: PROCESS_COLORS[3] },
      { pid: 'P5', arrival_time: 8, burst_time: 3, priority: 1, color: PROCESS_COLORS[4] },
    ],
  },
];

export function generateRandomProcesses(
  count: number = 5,
  maxArrival: number = 10,
  maxBurst: number = 12,
  maxPriority: number = 5
): Process[] {
  const processes: Process[] = [];
  for (let i = 1; i <= count; i++) {
    const arrival = i === 1 ? 0 : Math.floor(Math.random() * (maxArrival + 1));
    const burst = Math.floor(Math.random() * (maxBurst - 1)) + 1; // 1 to maxBurst
    const priority = Math.floor(Math.random() * maxPriority) + 1; // 1 to maxPriority

    processes.push({
      pid: `P${i}`,
      arrival_time: arrival,
      burst_time: burst,
      priority,
      color: PROCESS_COLORS[(i - 1) % PROCESS_COLORS.length],
    });
  }

  // Sort initially by arrival time for convenience
  processes.sort((a, b) => a.arrival_time - b.arrival_time);
  return processes;
}
