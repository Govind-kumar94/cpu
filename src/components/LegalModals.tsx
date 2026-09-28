import React from 'react';
import { X, ShieldCheck, FileText, Check } from 'lucide-react';

interface LegalModalProps {
  type: 'privacy' | 'terms' | null;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-fadeIn font-sans text-slate-200">
      <div className="bg-slate-900 border border-slate-750 rounded w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-slate-950 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {type === 'privacy' ? (
              <ShieldCheck className="w-5 h-5 text-blue-400" />
            ) : (
              <FileText className="w-5 h-5 text-emerald-400" />
            )}
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              {type === 'privacy' ? 'Privacy Policy' : 'Terms & Conditions of Use'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-300 leading-relaxed font-sans">
          {type === 'privacy' ? (
            <>
              <div>
                <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1">
                  Effective Date: September 2026 | Version 2.1
                </span>
                <h3 className="text-sm font-semibold text-white mb-1.5">
                  1. Overview & Local-First Philosophy
                </h3>
                <p>
                  CPU Scheduler Pro is committed to protecting your privacy. This application is designed
                  as an operating systems scheduling visualizer and simulator. We do not sell, rent, or monetize
                  user information. All scheduling calculations and timeline simulations are executed strictly
                  within your local browser runtime.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-white mb-1.5">
                  2. Host Background Process Telemetry
                </h3>
                <p>
                  The application includes an optional feature allowing users to sample background operating system
                  tasks. Before any host system query is dispatched, explicit user confirmation is requested via an
                  authorization modal dialog. When authorized, the service reads:
                </p>
                <ul className="list-disc pl-5 mt-1 space-y-1 text-slate-400">
                  <li>Operating system Process ID (PID) and executable name (e.g. node, nginx, esbuild)</li>
                  <li>Instantaneous processor utilization percentage (%CPU) and working set memory percentage (%MEM)</li>
                  <li>Process niceness level (-20 to +19) and active elapsed runtime</li>
                </ul>
                <p className="mt-1.5">
                  This inspection is strictly read-only. We never read user documents, browser history, keystrokes,
                  environment secrets, network sockets, or file contents. Telemetry data is never uploaded to external
                  cloud databases or analytics brokers.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-white mb-1.5">
                  3. Cookies and Local Storage
                </h3>
                <p>
                  We do not use third-party marketing cookies or advertising trackers. Local browser storage is used
                  solely for technical application preferences, such as your selected visual theme (dark or light mode).
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-white mb-1.5">
                  4. Contact Information
                </h3>
                <p>
                  If you have questions regarding this Privacy Policy or system telemetry operations, contact the project
                  maintainer at <strong className="text-white">govindku9546@gmail.com</strong>.
                </p>
              </div>
            </>
          ) : (
            <>
              <div>
                <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1">
                  Last Updated: September 2026 | Version 2.1
                </span>
                <h3 className="text-sm font-semibold text-white mb-1.5">
                  1. Acceptance of Terms
                </h3>
                <p>
                  By accessing and using CPU Scheduler Pro, you agree to comply with and be bound by these Terms
                  and Conditions of Use. If you do not agree to these terms, please do not use the application.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-white mb-1.5">
                  2. Permitted Use & Educational License
                </h3>
                <p>
                  This software is provided for educational, academic, research, and technical simulation purposes.
                  You may use the simulator to evaluate process scheduling algorithms, export simulation spreadsheets,
                  and inspect systems engineering workflows.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-white mb-1.5">
                  3. Simulation Accuracy Disclaimer
                </h3>
                <p>
                  The algorithms implemented (FCFS, SJF, SRTF, Priority Scheduling, and Round Robin) represent
                  canonical computer science mathematical models. Real-world operating systems (such as Linux CFS/EEVDF
                  or Windows Priority-driven preemptive dispatchers) incorporate multi-core affinity, interrupt handling,
                  and dynamic heuristics that differ from simplified theoretical models.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-white mb-1.5">
                  4. Host Telemetry Responsibility
                </h3>
                <p>
                  When utilizing the host background task inspection feature, you affirm that you have the appropriate
                  authorization to inspect process metadata on the operating system instance where this service executes.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-white mb-1.5">
                  5. Limitation of Liability
                </h3>
                <p>
                  The software is provided "as is", without warranty of any kind, express or implied. In no event
                  shall the authors or maintainers be liable for any claim, damages, or other liability arising from
                  the use of this software.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-950 border-t border-slate-800 px-6 py-3 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white transition border border-slate-700"
          >
            Close Document
          </button>
        </div>
      </div>
    </div>
  );
};
