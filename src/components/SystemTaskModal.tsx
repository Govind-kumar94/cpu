import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, Cpu, Check, X, AlertTriangle, ArrowRight, Server, Activity } from 'lucide-react';

interface SystemTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAgree: (config: { limit: number; sort: 'cpu' | 'mem' | 'etime'; stagger: boolean }) => void;
  onDecline: () => void;
  isLoading?: boolean;
}

export const SystemTaskModal: React.FC<SystemTaskModalProps> = ({
  isOpen,
  onClose,
  onAgree,
  onDecline,
  isLoading = false,
}) => {
  const [limit, setLimit] = useState<number>(8);
  const [sort, setSort] = useState<'cpu' | 'mem' | 'etime'>('cpu');
  const [stagger, setStagger] = useState<boolean>(true);

  if (!isOpen) return null;

  const handleAgree = () => {
    onAgree({ limit, sort, stagger });
  };

  const handleDecline = () => {
    onDecline();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-fadeIn">
      {/* Container with quiet, confident institutional styling */}
      <div className="bg-slate-900 border border-slate-700/80 rounded-xl w-full max-w-xl shadow-2xl overflow-hidden font-sans text-slate-100">
        {/* Authority Header Stripe */}
        <div className="bg-slate-950 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-blue-950 border border-blue-700/50 flex items-center justify-center text-blue-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] font-mono tracking-widest text-slate-400 uppercase">
                SECURITY CLEARANCE PROTOCOL
              </div>
              <h2 className="text-sm font-semibold tracking-tight text-white">
                Host System Background Task Inspection
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded hover:bg-slate-800 transition"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 text-xs">
          {/* Official Notice Alert Banner */}
          <div className="bg-amber-950/30 border border-amber-800/60 rounded-lg p-3.5 flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1 text-slate-300">
              <div className="font-semibold text-amber-200 text-xs">
                Explicit User Consent Required
              </div>
              <p className="leading-relaxed text-[11px] text-slate-300">
                This web application would like permission to query real background tasks and active threads currently executing on your host system. 
                These tasks will be loaded into the CPU scheduler to simulate real operating system queue dispatching.
              </p>
            </div>
          </div>

          {/* Telemetry Specification */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3.5 space-y-2 font-mono text-[11px]">
            <div className="text-slate-400 uppercase tracking-wider text-[10px] font-sans font-bold flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-blue-400" />
              <span>Telemetry Data to be Sampled:</span>
            </div>
            <ul className="space-y-1 text-slate-300 pl-4 list-disc marker:text-slate-600">
              <li>
                <span className="text-white font-semibold">Process IDs & Executables:</span> Real OS PIDs and commands (e.g. <code className="text-blue-300 bg-slate-800 px-1 rounded">node</code>, <code className="text-blue-300 bg-slate-800 px-1 rounded">esbuild</code>, <code className="text-blue-300 bg-slate-800 px-1 rounded">nginx</code>)
              </li>
              <li>
                <span className="text-white font-semibold">CPU Utilization:</span> Active kernel %CPU translated into scheduler burst times
              </li>
              <li>
                <span className="text-white font-semibold">Priority / Niceness:</span> Linux nice values (-20 to 19) converted to scheduling priority
              </li>
              <li>
                <span className="text-white font-semibold">Privacy Boundary:</span> Strictly read-only. No file contents, keystrokes, or network sockets are read or transmitted.
              </li>
            </ul>
          </div>

          {/* Sample Configuration Parameters */}
          <div className="bg-slate-950/40 border border-slate-800 rounded-lg p-3.5 space-y-3">
            <div className="text-slate-400 uppercase tracking-wider text-[10px] font-sans font-bold flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>Inspection Parameters</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Task Count */}
              <div>
                <label className="text-slate-400 block mb-1 font-mono text-[10px]">
                  SAMPLE COUNT
                </label>
                <select
                  value={limit}
                  onChange={(e) => setLimit(parseInt(e.target.value, 10))}
                  className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded px-2.5 py-1.5 focus:outline-none focus:border-blue-500 font-mono"
                >
                  <option value={5}>Top 5 Processes</option>
                  <option value={8}>Top 8 Processes</option>
                  <option value={12}>Top 12 Processes</option>
                  <option value={16}>Top 16 Processes</option>
                </select>
              </div>

              {/* Sort Order */}
              <div>
                <label className="text-slate-400 block mb-1 font-mono text-[10px]">
                  SORT CRITERIA
                </label>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as 'cpu' | 'mem' | 'etime')}
                  className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded px-2.5 py-1.5 focus:outline-none focus:border-blue-500 font-mono"
                >
                  <option value="cpu">Highest CPU Utilization</option>
                  <option value="mem">Highest Memory Usage</option>
                  <option value="etime">Longest Execution Time</option>
                </select>
              </div>

              {/* Arrival Mode */}
              <div>
                <label className="text-slate-400 block mb-1 font-mono text-[10px]">
                  ARRIVAL TIMING
                </label>
                <select
                  value={stagger ? 'stagger' : 'batch'}
                  onChange={(e) => setStagger(e.target.value === 'stagger')}
                  className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded px-2.5 py-1.5 focus:outline-none focus:border-blue-500 font-mono"
                >
                  <option value="stagger">Staggered (t=0, 1, 2...)</option>
                  <option value="batch">Simultaneous Batch (t=0)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-950 border-t border-slate-800 px-6 py-3.5 flex items-center justify-between gap-3">
          <button
            onClick={handleDecline}
            disabled={isLoading}
            className="px-3.5 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-700/60 transition"
          >
            Decline Authorization
          </button>

          <button
            onClick={handleAgree}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition flex items-center gap-2 shadow-sm disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Reading System Telemetry...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Agree & Inspect System Tasks</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
