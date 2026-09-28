import { ScheduleResult, TimelineStepState, ExecutionBlock } from '../types';

export function computeTimelineState(
  result: ScheduleResult,
  currentTime: number
): TimelineStepState {
  const time = Math.max(0, Math.min(currentTime, result.finish_time));
  
  // Find current active execution block
  let currentBlock: ExecutionBlock | null = null;
  if (result.timeline.length > 0) {
    if (time >= result.finish_time) {
      currentBlock = result.timeline[result.timeline.length - 1];
    } else {
      currentBlock = result.timeline.find(b => b.start <= time && time < b.end) || null;
    }
  }

  const currentPid = currentBlock ? currentBlock.pid : null;

  // Calculate executed time and remaining time for each process up to `time`
  const processRemaining: Record<string, number> = {};
  const completedPids: string[] = [];

  for (const p of result.processes) {
    let executed = 0;
    for (const b of result.timeline) {
      if (b.pid === p.pid) {
        const sliceStart = b.start;
        const sliceEnd = b.end;
        if (time > sliceStart) {
          executed += Math.min(sliceEnd, time) - sliceStart;
        }
      }
    }

    const remaining = Math.max(0, p.burst_time - executed);
    processRemaining[p.pid] = remaining;

    if (remaining === 0 && p.completion_time <= time) {
      completedPids.push(p.pid);
    }
  }

  // Ready Queue: arrived processes with remaining > 0 that are NOT currently executing
  const readyQueue = result.processes
    .filter(p => {
      const arrived = p.arrival_time <= time;
      const notFinished = processRemaining[p.pid] > 0;
      const isNotRunning = currentPid !== p.pid || (time >= result.finish_time);
      return arrived && notFinished && isNotRunning;
    })
    .map(p => ({
      pid: p.pid,
      remaining: processRemaining[p.pid],
      priority: p.priority,
      color: p.color,
    }));

  return {
    time,
    currentPid,
    currentBlock,
    readyQueue,
    completedPids,
    processRemaining,
  };
}
