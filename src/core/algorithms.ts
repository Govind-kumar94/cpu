import { Process, ScheduledProcess, ExecutionBlock, ScheduleResult, AlgorithmName } from '../types';

export const PROCESS_COLORS = [
  '#1d4ed8', // Intercity Blue
  '#15803d', // Alpine Forest Green
  '#b45309', // Amber Junction
  '#b91c1c', // Signal Crimson
  '#0284c7', // Steel Coastal
  '#0f766e', // Mineral Teal
  '#475569', // Granite Slate
  '#c2410c', // Ochre Rust
  '#1e3a8a', // Deep Marine
  '#166534', // Pine Regional
  '#9a3412', // Terracotta Brick
  '#334155', // Ballast Stone
];

export const IDLE_COLOR = '#1e293b'; // Railway Ballast Slate

export function cloneProcesses(processes: Process[]): ScheduledProcess[] {
  return processes.map((p, i) => ({
    ...p,
    color: p.color || PROCESS_COLORS[i % PROCESS_COLORS.length],
    remaining_time: p.burst_time,
    response_time: -1,
    waiting_time: 0,
    turnaround_time: 0,
    completion_time: 0,
  }));
}

export function buildScheduleResult(processes: ScheduledProcess[], timeline: ExecutionBlock[]): ScheduleResult {
  if (processes.length === 0) {
    return {
      processes: [],
      timeline: [],
      average_waiting: 0,
      average_turnaround: 0,
      average_response: 0,
      cpu_utilization: 0,
      throughput: 0,
      finish_time: 0,
      idle_time: 0,
    };
  }

  // Merge contiguous blocks with identical PID
  const mergedTimeline: ExecutionBlock[] = [];
  for (const block of timeline) {
    if (block.start === block.end) continue;
    if (mergedTimeline.length > 0 && mergedTimeline[mergedTimeline.length - 1].pid === block.pid) {
      mergedTimeline[mergedTimeline.length - 1].end = block.end;
    } else {
      mergedTimeline.push({ ...block });
    }
  }

  const n = processes.length;
  const avgWaiting = processes.reduce((acc, p) => acc + p.waiting_time, 0) / n;
  const avgTurnaround = processes.reduce((acc, p) => acc + p.turnaround_time, 0) / n;
  const avgResponse = processes.reduce((acc, p) => acc + (p.response_time >= 0 ? p.response_time : 0), 0) / n;
  const finishTime = Math.max(0, ...processes.map(p => p.completion_time));
  const totalBurst = processes.reduce((acc, p) => acc + p.burst_time, 0);
  const idleTime = Math.max(0, finishTime - totalBurst);
  const cpuUtilization = finishTime > 0 ? Math.min(100, (totalBurst / finishTime) * 100) : 0;
  const throughput = finishTime > 0 ? n / finishTime : 0;

  return {
    processes,
    timeline: mergedTimeline,
    average_waiting: Number(avgWaiting.toFixed(2)),
    average_turnaround: Number(avgTurnaround.toFixed(2)),
    average_response: Number(avgResponse.toFixed(2)),
    cpu_utilization: Number(cpuUtilization.toFixed(2)),
    throughput: Number(throughput.toFixed(4)),
    finish_time: finishTime,
    idle_time: idleTime,
  };
}

// ----------------------------------------------------------------------
// FCFS
// ----------------------------------------------------------------------
export function fcfs(rawProcesses: Process[]): ScheduleResult {
  const processes = cloneProcesses(rawProcesses);
  processes.sort((a, b) => a.arrival_time - b.arrival_time);

  let currentTime = 0;
  const timeline: ExecutionBlock[] = [];

  for (const p of processes) {
    if (currentTime < p.arrival_time) {
      timeline.push({
        pid: 'IDLE',
        start: currentTime,
        end: p.arrival_time,
        color: IDLE_COLOR,
      });
      currentTime = p.arrival_time;
    }

    const start = currentTime;
    if (p.response_time === -1) {
      p.response_time = start - p.arrival_time;
    }

    currentTime += p.burst_time;
    p.completion_time = currentTime;
    p.turnaround_time = p.completion_time - p.arrival_time;
    p.waiting_time = p.turnaround_time - p.burst_time;

    timeline.push({
      pid: p.pid,
      start,
      end: currentTime,
      color: p.color,
    });
  }

  return buildScheduleResult(processes, timeline);
}

// ----------------------------------------------------------------------
// SJF (Non-preemptive)
// ----------------------------------------------------------------------
export function sjf(rawProcesses: Process[]): ScheduleResult {
  const processes = cloneProcesses(rawProcesses);
  const n = processes.length;
  let completed = 0;
  let currentTime = 0;
  const timeline: ExecutionBlock[] = [];
  const visited = new Array<boolean>(n).fill(false);

  while (completed < n) {
    const available: { index: number; process: ScheduledProcess }[] = [];
    for (let i = 0; i < n; i++) {
      if (!visited[i] && processes[i].arrival_time <= currentTime) {
        available.push({ index: i, process: processes[i] });
      }
    }

    if (available.length === 0) {
      // Advance to next arrival or +1
      const nextArrival = Math.min(
        ...processes.filter((_, i) => !visited[i]).map(p => p.arrival_time)
      );
      const idleEnd = nextArrival > currentTime ? nextArrival : currentTime + 1;
      timeline.push({
        pid: 'IDLE',
        start: currentTime,
        end: idleEnd,
        color: IDLE_COLOR,
      });
      currentTime = idleEnd;
      continue;
    }

    // Pick shortest burst time, break tie by arrival_time
    available.sort((a, b) => {
      if (a.process.burst_time !== b.process.burst_time) {
        return a.process.burst_time - b.process.burst_time;
      }
      return a.process.arrival_time - b.process.arrival_time;
    });

    const { index, process } = available[0];
    visited[index] = true;

    const start = currentTime;
    if (process.response_time === -1) {
      process.response_time = start - process.arrival_time;
    }

    currentTime += process.burst_time;
    process.completion_time = currentTime;
    process.turnaround_time = currentTime - process.arrival_time;
    process.waiting_time = process.turnaround_time - process.burst_time;

    timeline.push({
      pid: process.pid,
      start,
      end: currentTime,
      color: process.color,
    });

    completed++;
  }

  return buildScheduleResult(processes, timeline);
}

// ----------------------------------------------------------------------
// SJF Preemptive (SRTF)
// ----------------------------------------------------------------------
export function sjfPreemptive(rawProcesses: Process[]): ScheduleResult {
  const processes = cloneProcesses(rawProcesses);
  const n = processes.length;
  let completed = 0;
  let currentTime = 0;
  const timeline: ExecutionBlock[] = [];

  let currentProcess: ScheduledProcess | null = null;
  let blockStart = 0;

  while (completed < n) {
    const available = processes.filter(
      p => p.arrival_time <= currentTime && p.remaining_time > 0
    );

    if (available.length === 0) {
      if (currentProcess !== null) {
        timeline.push({
          pid: currentProcess.pid,
          start: blockStart,
          end: currentTime,
          color: currentProcess.color,
        });
        currentProcess = null;
      }

      // IDLE tick
      const nextArrival = Math.min(
        ...processes.filter(p => p.remaining_time > 0).map(p => p.arrival_time)
      );
      const idleEnd = nextArrival > currentTime ? nextArrival : currentTime + 1;
      timeline.push({
        pid: 'IDLE',
        start: currentTime,
        end: idleEnd,
        color: IDLE_COLOR,
      });
      currentTime = idleEnd;
      blockStart = currentTime;
      continue;
    }

    // Shortest remaining time, break tie by arrival_time
    available.sort((a, b) => {
      if (a.remaining_time !== b.remaining_time) {
        return a.remaining_time - b.remaining_time;
      }
      return a.arrival_time - b.arrival_time;
    });

    const process = available[0];

    if (currentProcess !== process) {
      if (currentProcess !== null) {
        timeline.push({
          pid: currentProcess.pid,
          start: blockStart,
          end: currentTime,
          color: currentProcess.color,
        });
      }
      currentProcess = process;
      blockStart = currentTime;
    }

    if (process.response_time === -1) {
      process.response_time = currentTime - process.arrival_time;
    }

    process.remaining_time -= 1;
    currentTime += 1;

    if (process.remaining_time === 0) {
      process.completion_time = currentTime;
      process.turnaround_time = currentTime - process.arrival_time;
      process.waiting_time = process.turnaround_time - process.burst_time;
      completed++;
    }
  }

  if (currentProcess !== null) {
    timeline.push({
      pid: currentProcess.pid,
      start: blockStart,
      end: currentTime,
      color: currentProcess.color,
    });
  }

  return buildScheduleResult(processes, timeline);
}

// ----------------------------------------------------------------------
// Priority (Non-preemptive)
// ----------------------------------------------------------------------
export function priorityScheduling(rawProcesses: Process[]): ScheduleResult {
  const processes = cloneProcesses(rawProcesses);
  const n = processes.length;
  let completed = 0;
  let currentTime = 0;
  const timeline: ExecutionBlock[] = [];
  const visited = new Array<boolean>(n).fill(false);

  while (completed < n) {
    const available: { index: number; process: ScheduledProcess }[] = [];
    for (let i = 0; i < n; i++) {
      if (!visited[i] && processes[i].arrival_time <= currentTime) {
        available.push({ index: i, process: processes[i] });
      }
    }

    if (available.length === 0) {
      const nextArrival = Math.min(
        ...processes.filter((_, i) => !visited[i]).map(p => p.arrival_time)
      );
      const idleEnd = nextArrival > currentTime ? nextArrival : currentTime + 1;
      timeline.push({
        pid: 'IDLE',
        start: currentTime,
        end: idleEnd,
        color: IDLE_COLOR,
      });
      currentTime = idleEnd;
      continue;
    }

    // Lower number = higher priority
    available.sort((a, b) => {
      if (a.process.priority !== b.process.priority) {
        return a.process.priority - b.process.priority;
      }
      return a.process.arrival_time - b.process.arrival_time;
    });

    const { index, process } = available[0];
    visited[index] = true;

    const start = currentTime;
    if (process.response_time === -1) {
      process.response_time = start - process.arrival_time;
    }

    currentTime += process.burst_time;
    process.completion_time = currentTime;
    process.turnaround_time = currentTime - process.arrival_time;
    process.waiting_time = process.turnaround_time - process.burst_time;

    timeline.push({
      pid: process.pid,
      start,
      end: currentTime,
      color: process.color,
    });

    completed++;
  }

  return buildScheduleResult(processes, timeline);
}

// ----------------------------------------------------------------------
// Priority Preemptive
// ----------------------------------------------------------------------
export function priorityPreemptive(rawProcesses: Process[]): ScheduleResult {
  const processes = cloneProcesses(rawProcesses);
  const n = processes.length;
  let completed = 0;
  let currentTime = 0;
  const timeline: ExecutionBlock[] = [];

  let currentProcess: ScheduledProcess | null = null;
  let blockStart = 0;

  while (completed < n) {
    const available = processes.filter(
      p => p.arrival_time <= currentTime && p.remaining_time > 0
    );

    if (available.length === 0) {
      if (currentProcess !== null) {
        timeline.push({
          pid: currentProcess.pid,
          start: blockStart,
          end: currentTime,
          color: currentProcess.color,
        });
        currentProcess = null;
      }

      const nextArrival = Math.min(
        ...processes.filter(p => p.remaining_time > 0).map(p => p.arrival_time)
      );
      const idleEnd = nextArrival > currentTime ? nextArrival : currentTime + 1;
      timeline.push({
        pid: 'IDLE',
        start: currentTime,
        end: idleEnd,
        color: IDLE_COLOR,
      });
      currentTime = idleEnd;
      blockStart = currentTime;
      continue;
    }

    // Lower number = higher priority
    available.sort((a, b) => {
      if (a.priority !== b.priority) {
        return a.priority - b.priority;
      }
      return a.arrival_time - b.arrival_time;
    });

    const process = available[0];

    if (currentProcess !== process) {
      if (currentProcess !== null) {
        timeline.push({
          pid: currentProcess.pid,
          start: blockStart,
          end: currentTime,
          color: currentProcess.color,
        });
      }
      currentProcess = process;
      blockStart = currentTime;
    }

    if (process.response_time === -1) {
      process.response_time = currentTime - process.arrival_time;
    }

    process.remaining_time -= 1;
    currentTime += 1;

    if (process.remaining_time === 0) {
      process.completion_time = currentTime;
      process.turnaround_time = currentTime - process.arrival_time;
      process.waiting_time = process.turnaround_time - process.burst_time;
      completed++;
    }
  }

  if (currentProcess !== null) {
    timeline.push({
      pid: currentProcess.pid,
      start: blockStart,
      end: currentTime,
      color: currentProcess.color,
    });
  }

  return buildScheduleResult(processes, timeline);
}

// ----------------------------------------------------------------------
// Round Robin
// ----------------------------------------------------------------------
export function roundRobin(rawProcesses: Process[], quantum: number = 2): ScheduleResult {
  const processes = cloneProcesses(rawProcesses);
  const n = processes.length;
  if (n === 0) return buildScheduleResult([], []);

  const effectiveQuantum = Math.max(1, quantum);
  const queue: ScheduledProcess[] = [];
  const timeline: ExecutionBlock[] = [];
  let currentTime = 0;
  let completed = 0;
  const arrived = new Set<number>();

  // Helper to add newly arrived processes to ready queue
  const checkArrivals = () => {
    // Sort newly arrived by arrival_time to preserve FIFO arrival order
    const newlyArrivedIndices: number[] = [];
    for (let i = 0; i < n; i++) {
      if (!arrived.has(i) && processes[i].arrival_time <= currentTime) {
        newlyArrivedIndices.push(i);
        arrived.add(i);
      }
    }
    newlyArrivedIndices.sort((a, b) => processes[a].arrival_time - processes[b].arrival_time);
    for (const idx of newlyArrivedIndices) {
      queue.push(processes[idx]);
    }
  };

  while (completed < n) {
    checkArrivals();

    if (queue.length === 0) {
      const remainingArrivals = processes
        .filter(p => p.remaining_time > 0)
        .map(p => p.arrival_time);
      const nextArrival = remainingArrivals.length > 0 ? Math.min(...remainingArrivals) : currentTime + 1;
      const idleEnd = nextArrival > currentTime ? nextArrival : currentTime + 1;
      timeline.push({
        pid: 'IDLE',
        start: currentTime,
        end: idleEnd,
        color: IDLE_COLOR,
      });
      currentTime = idleEnd;
      continue;
    }

    const process = queue.shift()!;

    if (process.response_time === -1) {
      process.response_time = currentTime - process.arrival_time;
    }

    const start = currentTime;
    const run = Math.min(effectiveQuantum, process.remaining_time);
    currentTime += run;
    process.remaining_time -= run;

    timeline.push({
      pid: process.pid,
      start,
      end: currentTime,
      color: process.color,
    });

    // Check for processes arriving while this one was running
    checkArrivals();

    if (process.remaining_time > 0) {
      queue.push(process);
    } else {
      process.completion_time = currentTime;
      process.turnaround_time = currentTime - process.arrival_time;
      process.waiting_time = process.turnaround_time - process.burst_time;
      completed++;
    }
  }

  return buildScheduleResult(processes, timeline);
}

// ----------------------------------------------------------------------
// Runner Dispatcher
// ----------------------------------------------------------------------
export function runAlgorithm(
  name: AlgorithmName,
  processes: Process[],
  quantum: number = 2
): ScheduleResult {
  switch (name) {
    case 'FCFS':
      return fcfs(processes);
    case 'SJF':
      return sjf(processes);
    case 'SJF Preemptive':
      return sjfPreemptive(processes);
    case 'Priority':
      return priorityScheduling(processes);
    case 'Priority Preemptive':
      return priorityPreemptive(processes);
    case 'Round Robin':
      return roundRobin(processes, quantum);
    default:
      throw new Error(`Unknown Algorithm: ${name}`);
  }
}
