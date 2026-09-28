import React, { useState, useEffect } from 'react';
import { Process } from '../types';
import { ShieldCheck, ShieldAlert, Activity, Server, RefreshCw, CheckCircle, Terminal, AlertTriangle, ArrowRight } from 'lucide-react';

interface HostTelemetryPageProps {
  onOpenSystemTasksModal: () => void;
  isSystemTelemetryActive: boolean;
  currentProcesses: Process[];
}

export const HostTelemetryPage: React.FC<HostTelemetryPageProps> = ({
  onOpenSystemTasksModal,
  isSystemTelemetryActive,
  currentProcesses,
}) => {
  const [endpointStatus, setEndpointStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [latencyMs, setLatencyMs] = useState<number | null>(null);

  const checkHealth = async () => {
    setEndpointStatus('checking');
    const start = performance.now();
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        setLatencyMs(Math.round(performance.now() - start));
        setEndpointStatus('online');
      } else {
        setEndpointStatus('offline');
      }
    } catch {
      setEndpointStatus('offline');
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  const liveProcesses = currentProcesses.filter(p => !!p.systemInfo);

  return (
    <div className="space-y-8 animate-fadeIn text-slate-100 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider mb-1">
          <Activity className="w-4 h-4" />
          <span>Kernel Subsystem Inspection</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
          Host Background Process Telemetry
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl">
          Directly inspect active background threads and operating system processes running on the host server. 
          Use real execution metrics, process IDs, and Linux nice values to drive simulation queue dispatching.
        </p>
      </div>

      {/* Status & Connection Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Telemetry Status Card */}
        <div className="bg-slate-900 border border-slate-800 rounded p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>TELEMETRY STATE</span>
            <div className={`w-2 h-2 rounded-sm ${isSystemTelemetryActive ? 'bg-emerald-400' : 'bg-slate-600'}`} />
          </div>
          <div className="text-lg font-bold text-white font-mono flex items-center gap-2">
            {isSystemTelemetryActive ? (
              <span className="text-emerald-400">ACTIVE & AUTHORIZED</span>
            ) : (
              <span className="text-slate-400">SIMULATED / STANDBY</span>
            )}
          </div>
          <p className="text-[11px] text-slate-400">
            {isSystemTelemetryActive
              ? `${liveProcesses.length} host processes currently loaded into dispatcher queue.`
              : 'Dispatcher is currently running in synthetic simulation mode.'}
          </p>
        </div>

        {/* Backend Daemon Card */}
        <div className="bg-slate-900 border border-slate-800 rounded p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>API DAEMON</span>
            <button
              onClick={checkHealth}
              className="hover:text-white transition"
              title="Ping backend"
            >
              <RefreshCw className="w-3 h-3 text-slate-400" />
            </button>
          </div>
          <div className="text-lg font-bold text-white font-mono flex items-center gap-2">
            {endpointStatus === 'online' ? (
              <span className="text-blue-400">OPERATIONAL ({latencyMs}ms)</span>
            ) : endpointStatus === 'checking' ? (
              <span className="text-slate-400">CONNECTING...</span>
            ) : (
              <span className="text-amber-400">FALLBACK STANDBY</span>
            )}
          </div>
          <p className="text-[11px] text-slate-400 font-mono">
            GET /api/system-processes
          </p>
        </div>

        {/* Action Trigger Card */}
        <div className="bg-slate-900 border border-slate-800 rounded p-4 flex flex-col justify-between space-y-2">
          <div className="text-xs text-slate-400 font-mono uppercase">
            CLEARANCE PROTOCOL
          </div>
          <button
            onClick={onOpenSystemTasksModal}
            className="w-full px-3 py-2 rounded text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition flex items-center justify-center gap-2 shadow-sm"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isSystemTelemetryActive ? 'Re-sync System Tasks' : 'Authorize & Sample Tasks'}</span>
          </button>
          <span className="text-[10px] text-slate-400 text-center block">
            Requires explicit user agreement dialog
          </span>
        </div>
      </div>

      {/* Security and Privacy Protocol Specification */}
      <div className="bg-slate-900 border border-slate-800 rounded p-5 space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Security Clearance & Data Minimization Protocol
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
          <div className="space-y-2 bg-slate-950/70 p-4 rounded border border-slate-800">
            <span className="font-semibold text-slate-200 block font-mono text-[11px] uppercase text-blue-400">
              Read-Only Data Retrieved
            </span>
            <ul className="space-y-1.5 pl-4 list-disc text-[11px] text-slate-300 marker:text-slate-600">
              <li>
                <strong className="text-white">Process ID (PID):</strong> Real operating system process identifier
              </li>
              <li>
                <strong className="text-white">Executable Name:</strong> Command binary name (e.g. node, esbuild, nginx, npm)
              </li>
              <li>
                <strong className="text-white">CPU Load (%CPU):</strong> Instantaneous processor utilization translated to burst units
              </li>
              <li>
                <strong className="text-white">Memory Allocation (%MEM):</strong> Working set memory percentage
              </li>
              <li>
                <strong className="text-white">Process Niceness (NI):</strong> Operating system priority level (-20 to +19)
              </li>
              <li>
                <strong className="text-white">Elapsed Runtime (ETIME):</strong> Active thread lifetime since invocation
              </li>
            </ul>
          </div>

          <div className="space-y-2 bg-slate-950/70 p-4 rounded border border-slate-800">
            <span className="font-semibold text-slate-200 block font-mono text-[11px] uppercase text-emerald-400">
              Explicit Privacy Guarantees
            </span>
            <ul className="space-y-1.5 pl-4 list-disc text-[11px] text-slate-300 marker:text-slate-600">
              <li>
                <strong className="text-white">User Agreement Enforced:</strong> No background inspection occurs without explicit consent in the authorization modal.
              </li>
              <li>
                <strong className="text-white">Zero File or Memory Inspection:</strong> File contents, user directories, environment secrets, and memory heaps are never accessed.
              </li>
              <li>
                <strong className="text-white">Zero External Telemetry:</strong> System data is processed in memory on your host instance and never sent to external servers or telemetry brokers.
              </li>
              <li>
                <strong className="text-white">Instant Revocation:</strong> You can switch back to synthetic textbook workloads anytime with a single click.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Current Live Process Telemetry Table */}
      {liveProcesses.length > 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Currently Loaded Host Background Processes
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {liveProcesses.length} processes synchronized
            </span>
          </div>

          <div className="overflow-x-auto border border-slate-800 rounded">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Dispatcher ID</th>
                  <th className="py-2.5 px-3 text-center">Host PID</th>
                  <th className="py-2.5 px-3">Command Binary</th>
                  <th className="py-2.5 px-3 text-center font-bold text-blue-400">CPU Usage</th>
                  <th className="py-2.5 px-3 text-center">Memory %</th>
                  <th className="py-2.5 px-3 text-center font-bold text-amber-400">Linux Nice</th>
                  <th className="py-2.5 px-3 text-center">Elapsed Runtime</th>
                  <th className="py-2.5 px-3 text-center">Assigned Burst</th>
                  <th className="py-2.5 px-3 text-center">Assigned Priority</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {liveProcesses.map((p) => (
                  <tr key={p.pid} className="hover:bg-slate-800/40 transition">
                    <td className="py-2 px-3 flex items-center gap-2 font-sans font-medium text-slate-200">
                      <span
                        className="w-2.5 h-2.5 rounded-sm shrink-0"
                        style={{ backgroundColor: p.color }}
                      />
                      <span>{p.pid}</span>
                    </td>
                    <td className="py-2 px-3 text-center text-slate-300">{p.systemInfo?.realPid}</td>
                    <td className="py-2 px-3 font-semibold text-white">{p.systemInfo?.command}</td>
                    <td className="py-2 px-3 text-center font-bold text-blue-400">{p.systemInfo?.cpuPercent}%</td>
                    <td className="py-2 px-3 text-center text-slate-300">{p.systemInfo?.memPercent}%</td>
                    <td className="py-2 px-3 text-center font-bold text-amber-400">{p.systemInfo?.nice}</td>
                    <td className="py-2 px-3 text-center text-slate-400">{p.systemInfo?.elapsed}</td>
                    <td className="py-2 px-3 text-center font-bold text-slate-200">{p.burst_time}u</td>
                    <td className="py-2 px-3 text-center font-bold text-emerald-400">{p.priority}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded p-8 text-center space-y-3">
          <Terminal className="w-8 h-8 text-slate-500 mx-auto" />
          <h4 className="text-sm font-bold text-white">No Host Processes Currently Loaded</h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            The dispatcher is currently configured with synthetic simulation data. 
            Click the button below to review authorization terms and inspect active host background tasks.
          </p>
          <button
            onClick={onOpenSystemTasksModal}
            className="px-4 py-2 rounded text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition inline-flex items-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Review Clearance Terms & Load Host Tasks</span>
          </button>
        </div>
      )}
    </div>
  );
};
