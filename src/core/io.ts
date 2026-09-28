import { Process, ScheduleResult } from '../types';
import { PROCESS_COLORS } from './algorithms';

export function parseProcessesCSV(csvText: string): Process[] {
  const lines = csvText.trim().split(/\r?\n/);
  if (lines.length <= 1) return [];

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  const pidIdx = headers.findIndex(h => h.includes('pid') || h.includes('process') || h.includes('name'));
  const arrivalIdx = headers.findIndex(h => h.includes('arrival') || h.includes('at'));
  const burstIdx = headers.findIndex(h => h.includes('burst') || h.includes('bt') || h.includes('duration'));
  const priorityIdx = headers.findIndex(h => h.includes('priority') || h.includes('pr'));

  const processes: Process[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const parts = line.split(',').map(p => p.trim());

    const pid = (pidIdx !== -1 && parts[pidIdx]) ? parts[pidIdx] : (parts[0] || `P${i}`);
    const arrival = parseInt((arrivalIdx !== -1 ? parts[arrivalIdx] : parts[1]) || '0', 10);
    const burst = parseInt((burstIdx !== -1 ? parts[burstIdx] : parts[2]) || '1', 10);
    const priority = parseInt((priorityIdx !== -1 ? parts[priorityIdx] : parts[3]) || '1', 10);

    if (burst > 0 && arrival >= 0) {
      processes.push({
        pid,
        arrival_time: isNaN(arrival) ? 0 : arrival,
        burst_time: isNaN(burst) ? 1 : burst,
        priority: isNaN(priority) ? 1 : Math.max(1, priority),
        color: PROCESS_COLORS[(processes.length) % PROCESS_COLORS.length],
      });
    }
  }

  return processes;
}

export function parseProcessesJSON(jsonText: string): Process[] {
  try {
    const raw = JSON.parse(jsonText);
    if (!Array.isArray(raw)) return [];

    const processes: Process[] = [];
    raw.forEach((item, index) => {
      const pid = String(item.pid || item.PID || item.name || `P${index + 1}`);
      const arrival = Number(item.arrival ?? item.arrival_time ?? item.at ?? 0);
      const burst = Number(item.burst ?? item.burst_time ?? item.bt ?? 1);
      const priority = Number(item.priority ?? item.pr ?? 1);

      if (burst > 0 && arrival >= 0) {
        processes.push({
          pid,
          arrival_time: isNaN(arrival) ? 0 : arrival,
          burst_time: isNaN(burst) ? 1 : burst,
          priority: isNaN(priority) ? 1 : Math.max(1, priority),
          color: item.color || PROCESS_COLORS[(processes.length) % PROCESS_COLORS.length],
        });
      }
    });

    return processes;
  } catch (err) {
    console.error('Failed to parse JSON processes', err);
    return [];
  }
}

export function generateCSVReport(result: ScheduleResult, algorithm: string): string {
  const headers = ['PID', 'Arrival Time', 'Burst Time', 'Priority', 'Completion Time', 'Waiting Time', 'Turnaround Time', 'Response Time'];
  const rows = result.processes.map(p => [
    p.pid,
    p.arrival_time,
    p.burst_time,
    p.priority,
    p.completion_time,
    p.waiting_time,
    p.turnaround_time,
    p.response_time,
  ]);

  const summary = [
    '',
    `# Algorithm: ${algorithm}`,
    `# Average Waiting Time: ${result.average_waiting}`,
    `# Average Turnaround Time: ${result.average_turnaround}`,
    `# Average Response Time: ${result.average_response}`,
    `# CPU Utilization: ${result.cpu_utilization}%`,
    `# Throughput: ${result.throughput} processes/unit`,
    `# Total Finish Time: ${result.finish_time}`,
    `# Idle Time: ${result.idle_time}`,
  ];

  return [
    headers.join(','),
    ...rows.map(r => r.join(',')),
    ...summary,
  ].join('\n');
}

export function generateJSONReport(result: ScheduleResult, algorithm: string): string {
  return JSON.stringify(
    {
      algorithm,
      summary: {
        average_waiting: result.average_waiting,
        average_turnaround: result.average_turnaround,
        average_response: result.average_response,
        cpu_utilization: result.cpu_utilization,
        throughput: result.throughput,
        finish_time: result.finish_time,
        idle_time: result.idle_time,
      },
      processes: result.processes,
      timeline: result.timeline,
    },
    null,
    2
  );
}

export function downloadFile(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
