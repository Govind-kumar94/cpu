import React from 'react';
import { Play, BookOpen, Cpu, ShieldCheck, Clock, Gauge, ArrowRight } from 'lucide-react';
import { NavTab } from './Navbar';

interface HeroProps {
  onSelectTab: (tab: NavTab) => void;
  onOpenSystemTasks: () => void;
  activeProcessCount: number;
}

export const Hero: React.FC<HeroProps> = ({
  onSelectTab,
  onOpenSystemTasks,
  activeProcessCount,
}) => {
  return (
    <section className="border-b border-slate-800 bg-slate-925 py-8 lg:py-10">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="max-w-3xl space-y-4">
          {/* Unboxed Section Metadata with Typographic Separator */}
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span className="w-2 h-2 rounded-sm bg-blue-500 shrink-0 inline-block" />
            <span className="font-semibold uppercase tracking-wider text-slate-200">
              Systems Engineering Workbench
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>Process Queue Simulation</span>
          </div>

          {/* Headline explaining: 1. What it is, 2. Who it is for, 3. What problem it solves */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
            CPU Scheduling Algorithm Visualizer and Benchmark Workbench
          </h1>

          {/* Benefit-driven subheadline without marketing fluff or em dashes */}
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Built for computer science students, systems engineers, and operating systems developers. 
            Simulate, inspect, and benchmark First-Come First-Served, Shortest Job First, Priority, and Round Robin 
            algorithms with step-by-step timeline execution, interactive Gantt charts, and authentic background process telemetry.
          </p>

          {/* Primary and Secondary Action Buttons (Professional rectangular proportions) */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onSelectTab('workbench')}
              className="px-4 py-2 rounded text-xs sm:text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white transition flex items-center gap-2 border border-blue-500 shadow-sm"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Launch Dispatcher</span>
            </button>

            <button
              onClick={() => onSelectTab('guide')}
              className="px-4 py-2 rounded text-xs sm:text-sm font-medium bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white transition flex items-center gap-2 border border-slate-700"
            >
              <BookOpen className="w-4 h-4 text-slate-400" />
              <span>Algorithm Reference</span>
            </button>

            <button
              onClick={onOpenSystemTasks}
              className="px-3.5 py-2 rounded text-xs sm:text-sm font-medium text-blue-400 hover:text-blue-300 hover:bg-slate-800/80 transition flex items-center gap-1.5 ml-auto sm:ml-0"
            >
              <span>Inspect Host Background Tasks</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Technical Capability Grid (Authentic system facts, zero fake marketing metrics) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-6 mt-6 border-t border-slate-800 text-xs">
          <div className="bg-slate-900/60 border border-slate-800 p-3 rounded space-y-1">
            <div className="flex items-center gap-2 text-slate-400 font-mono text-[10px] uppercase">
              <Cpu className="w-3.5 h-3.5 text-blue-400" />
              <span>Algorithms</span>
            </div>
            <div className="text-sm font-bold text-white font-mono">6 Models</div>
            <div className="text-slate-400 text-[11px]">
              FCFS, SJF, SRTF, Priority (P/NP), Round Robin
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-3 rounded space-y-1">
            <div className="flex items-center gap-2 text-slate-400 font-mono text-[10px] uppercase">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Host Telemetry</span>
            </div>
            <div className="text-sm font-bold text-white font-mono">Live Background Tasks</div>
            <div className="text-slate-400 text-[11px]">
              Optional read-only sampling of real host processes
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-3 rounded space-y-1">
            <div className="flex items-center gap-2 text-slate-400 font-mono text-[10px] uppercase">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Playback Engine</span>
            </div>
            <div className="text-sm font-bold text-white font-mono">0.5x to 4x Speed</div>
            <div className="text-slate-400 text-[11px]">
              Step forward, backward, or scrub along timeline
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-3 rounded space-y-1">
            <div className="flex items-center gap-2 text-slate-400 font-mono text-[10px] uppercase">
              <Gauge className="w-3.5 h-3.5 text-slate-300" />
              <span>Active Workload</span>
            </div>
            <div className="text-sm font-bold text-white font-mono">{activeProcessCount} Processes</div>
            <div className="text-slate-400 text-[11px]">
              Custom editable arrival, burst, and priority values
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
