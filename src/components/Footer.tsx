import React from 'react';
import { Terminal, ShieldCheck, FileText, Mail, Github, ExternalLink, Cpu } from 'lucide-react';
import { NavTab } from './Navbar';

interface FooterProps {
  onSelectTab: (tab: NavTab) => void;
  onOpenLegal: (type: 'privacy' | 'terms') => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab, onOpenLegal }) => {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-400 text-xs font-sans mt-12">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand & Genuine Description */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2 text-white">
              <div className="w-6 h-6 rounded bg-slate-900 border border-slate-700 flex items-center justify-center text-blue-400">
                <Terminal className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold tracking-tight uppercase font-mono text-sm">
                CPU Scheduler Pro
              </span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Deterministic operating systems scheduling visualizer, simulator, and benchmark workbench. 
              Built with React, TypeScript, and Node.js for systems engineering research, algorithm analysis, and computer science education.
            </p>
            <div className="text-[10px] font-mono text-slate-500">
              Host Environment: Linux Node.js 22
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-2.5">
            <span className="text-[11px] font-bold text-slate-200 uppercase tracking-wider font-mono block">
              Dispatcher & Tools
            </span>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <button
                  onClick={() => onSelectTab('workbench')}
                  className="hover:text-white transition"
                >
                  Simulator Workbench
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('guide')}
                  className="hover:text-white transition"
                >
                  Algorithm Reference Guide
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('benchmark')}
                  className="hover:text-white transition"
                >
                  Benchmark Comparison Matrix
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('telemetry')}
                  className="hover:text-white transition"
                >
                  Host Process Telemetry
                </button>
              </li>
            </ul>
          </div>

          {/* Supported Algorithms List */}
          <div className="space-y-2.5">
            <span className="text-[11px] font-bold text-slate-200 uppercase tracking-wider font-mono block">
              Algorithms Implemented
            </span>
            <ul className="space-y-1.5 text-[11px] text-slate-400">
              <li>First-Come, First-Served (FCFS)</li>
              <li>Shortest Job First (SJF)</li>
              <li>Shortest Remaining Time First (SRTF)</li>
              <li>Priority (Non-Preemptive & Preemptive)</li>
              <li>Round Robin (Configurable Quantum)</li>
            </ul>
          </div>

          {/* Contact and Legal */}
          <div className="space-y-2.5">
            <span className="text-[11px] font-bold text-slate-200 uppercase tracking-wider font-mono block">
              Legal & Maintainer
            </span>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <button
                  onClick={() => onOpenLegal('privacy')}
                  className="hover:text-white transition flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3 h-3 text-blue-400" />
                  <span>Privacy Policy</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegal('terms')}
                  className="hover:text-white transition flex items-center gap-1.5"
                >
                  <FileText className="w-3 h-3 text-emerald-400" />
                  <span>Terms & Conditions</span>
                </button>
              </li>
              <li>
                <a
                  href="mailto:govindku9546@gmail.com"
                  className="hover:text-white transition flex items-center gap-1.5 text-slate-300"
                >
                  <Mail className="w-3 h-3 text-slate-400" />
                  <span>govindku9546@gmail.com</span>
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/Govind-kumar94/cpu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition flex items-center gap-1.5 text-slate-300"
                >
                  <Github className="w-3 h-3 text-slate-400" />
                  <span>GitHub Repository</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Attribution and Copyright */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <div>
            © 2026 CPU Scheduler Pro. Built for operating systems education and research.
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Deterministic Math Engine</span>
            <span>•</span>
            <span>Zero Third-Party Trackers</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
