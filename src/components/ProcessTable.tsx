import React, { useState } from 'react';
import { Process, ScheduledProcess } from '../types';
import { Plus, Trash2, RotateCcw, AlertCircle } from 'lucide-react';
import { PROCESS_COLORS } from '../core/algorithms';

interface ProcessTableProps {
  processes: Process[];
  scheduledProcesses?: ScheduledProcess[];
  currentTime: number;
  onUpdateProcess: (index: number, updated: Process) => void;
  onAddProcess: (p: Process) => void;
  onDeleteProcess: (index: number) => void;
  onResetProcesses: () => void;
}

export const ProcessTable: React.FC<ProcessTableProps> = ({
  processes,
  scheduledProcesses,
  currentTime,
  onUpdateProcess,
  onAddProcess,
  onDeleteProcess,
  onResetProcesses,
}) => {
  const [newPid, setNewPid] = useState(`P${processes.length + 1}`);
  const [newArrival, setNewArrival] = useState('0');
  const [newBurst, setNewBurst] = useState('4');
  const [newPriority, setNewPriority] = useState('1');
  const [error, setError] = useState<string | null>(null);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const arrival = parseInt(newArrival, 10);
    const burst = parseInt(newBurst, 10);
    const priority = parseInt(newPriority, 10);

    if (!newPid.trim()) {
      setError('PID is required');
      return;
    }
    if (isNaN(arrival) || arrival < 0) {
      setError('Arrival time must be ≥ 0');
      return;
    }
    if (isNaN(burst) || burst <= 0) {
      setError('Burst time must be ≥ 1');
      return;
    }
    if (isNaN(priority) || priority < 1) {
      setError('Priority must be ≥ 1');
      return;
    }

    onAddProcess({
      pid: newPid.trim(),
      arrival_time: arrival,
      burst_time: burst,
      priority,
      color: PROCESS_COLORS[processes.length % PROCESS_COLORS.length],
    });

    setNewPid(`P${processes.length + 2}`);
    setNewBurst('4');
    setError(null);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded p-4 shadow-sm flex flex-col h-full font-sans">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Process Manifest</h2>
          <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
            {processes.length} tasks
          </span>
        </div>
        <button
          onClick={onResetProcesses}
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 transition"
          title="Reset to default textbook problem"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Default</span>
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto flex-1 max-h-[300px] border border-slate-800 rounded">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/80 text-slate-400 uppercase font-semibold text-[11px] sticky top-0 z-10 border-b border-slate-800">
            <tr>
              <th className="py-2.5 px-3">Process</th>
              <th className="py-2.5 px-2 text-center">Arrival (AT)</th>
              <th className="py-2.5 px-2 text-center">Burst (BT)</th>
              <th className="py-2.5 px-2 text-center">Priority</th>
              <th className="py-2.5 px-2 text-center">Live Status</th>
              <th className="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {processes.map((p, idx) => {
              const scheduled = scheduledProcesses?.find(sp => sp.pid === p.pid);
              const isCompleted = scheduled && scheduled.completion_time <= currentTime && currentTime > 0;
              const hasArrived = p.arrival_time <= currentTime;

              return (
                <tr
                  key={`${p.pid}-${idx}`}
                  className="hover:bg-slate-800/40 transition group"
                >
                  <td className="py-2 px-3 font-sans font-medium text-slate-200">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-sm shrink-0 shadow-sm"
                        style={{ backgroundColor: p.color }}
                      />
                      <input
                        type="text"
                        value={p.pid}
                        onChange={(e) => onUpdateProcess(idx, { ...p, pid: e.target.value })}
                        className="w-28 bg-transparent focus:bg-slate-800 px-1 py-0.5 rounded text-white font-medium border border-transparent focus:border-slate-600 focus:outline-none font-mono text-xs"
                      />
                      {p.systemInfo && (
                        <span
                          className="text-[10px] text-blue-400 font-mono shrink-0 cursor-help"
                          title={`Real Host Task: PID ${p.systemInfo.realPid} | Comm: ${p.systemInfo.command} | CPU: ${p.systemInfo.cpuPercent}% | Mem: ${p.systemInfo.memPercent}% | Nice: ${p.systemInfo.nice} | Elapsed: ${p.systemInfo.elapsed}`}
                        >
                          [SYS]
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-2 px-2 text-center">
                    <input
                      type="number"
                      min="0"
                      value={p.arrival_time}
                      onChange={(e) =>
                        onUpdateProcess(idx, {
                          ...p,
                          arrival_time: Math.max(0, parseInt(e.target.value, 10) || 0),
                        })
                      }
                      className="w-14 bg-transparent focus:bg-slate-800 px-1 py-0.5 rounded text-center text-slate-300 border border-transparent focus:border-slate-600 focus:outline-none"
                    />
                  </td>

                  <td className="py-2 px-2 text-center">
                    <input
                      type="number"
                      min="1"
                      value={p.burst_time}
                      onChange={(e) =>
                        onUpdateProcess(idx, {
                          ...p,
                          burst_time: Math.max(1, parseInt(e.target.value, 10) || 1),
                        })
                      }
                      className="w-14 bg-transparent focus:bg-slate-800 px-1 py-0.5 rounded text-center text-blue-300 font-semibold border border-transparent focus:border-slate-600 focus:outline-none"
                    />
                  </td>

                  <td className="py-2 px-2 text-center">
                    <input
                      type="number"
                      min="1"
                      value={p.priority}
                      onChange={(e) =>
                        onUpdateProcess(idx, {
                          ...p,
                          priority: Math.max(1, parseInt(e.target.value, 10) || 1),
                        })
                      }
                      className="w-14 bg-transparent focus:bg-slate-800 px-1 py-0.5 rounded text-center text-amber-400 border border-transparent focus:border-slate-600 focus:outline-none"
                    />
                  </td>

                  <td className="py-2 px-2 text-center">
                    {isCompleted ? (
                      <span className="text-[11px] text-emerald-400 font-medium font-mono">
                        Done (t={scheduled.completion_time})
                      </span>
                    ) : hasArrived ? (
                      <span className="text-[11px] text-blue-400 font-medium font-sans">
                        Ready
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-500 font-mono">
                        t={p.arrival_time}
                      </span>
                    )}
                  </td>

                  <td className="py-2 px-3 text-right">
                    <button
                      onClick={() => onDeleteProcess(idx)}
                      disabled={processes.length <= 1}
                      className="p-1 rounded text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition disabled:opacity-30 disabled:hover:bg-transparent"
                      title={processes.length <= 1 ? 'Must have at least 1 process' : 'Delete process'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add Process Form */}
      <form onSubmit={handleAdd} className="mt-3 pt-3 border-t border-slate-800 flex flex-wrap items-center gap-2">
        <input
          type="text"
          placeholder="PID"
          value={newPid}
          onChange={(e) => setNewPid(e.target.value)}
          className="w-20 bg-slate-800 text-white text-xs px-2.5 py-1.5 rounded border border-slate-700 focus:outline-none focus:border-blue-500 font-mono"
        />
        <input
          type="number"
          min="0"
          placeholder="Arrival"
          value={newArrival}
          onChange={(e) => setNewArrival(e.target.value)}
          className="w-18 bg-slate-800 text-white text-xs px-2.5 py-1.5 rounded border border-slate-700 focus:outline-none focus:border-blue-500 font-mono text-center"
          title="Arrival Time"
        />
        <input
          type="number"
          min="1"
          placeholder="Burst"
          value={newBurst}
          onChange={(e) => setNewBurst(e.target.value)}
          className="w-18 bg-slate-800 text-white text-xs px-2.5 py-1.5 rounded border border-slate-700 focus:outline-none focus:border-blue-500 font-mono text-center"
          title="Burst Time"
        />
        <input
          type="number"
          min="1"
          placeholder="Priority"
          value={newPriority}
          onChange={(e) => setNewPriority(e.target.value)}
          className="w-18 bg-slate-800 text-white text-xs px-2.5 py-1.5 rounded border border-slate-700 focus:outline-none focus:border-blue-500 font-mono text-center"
          title="Priority (1 = Highest)"
        />
        <button
          type="submit"
          className="flex items-center gap-1 bg-blue-600 hover:bg-blue-500 text-white text-xs px-3 py-1.5 rounded font-medium transition ml-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Task</span>
        </button>
      </form>

      {error && (
        <div className="mt-2 flex items-center gap-1.5 text-xs text-red-400 bg-red-500/10 px-2.5 py-1 rounded">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
