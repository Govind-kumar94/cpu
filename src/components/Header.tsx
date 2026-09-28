import React from 'react';
import { Cpu, Moon, Sun, Sparkles, FolderDown, Shuffle, BookOpen, BarChart3 } from 'lucide-react';
import { PRESETS, Preset } from '../data/presets';

interface HeaderProps {
  darkMode: boolean;
  onToggleTheme: () => void;
  onSelectPreset: (preset: Preset) => void;
  onOpenRandom: () => void;
  onOpenIO: () => void;
  activePresetId?: string;
  isComparing: boolean;
  onToggleCompare: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  onToggleTheme,
  onSelectPreset,
  onOpenRandom,
  onOpenIO,
  activePresetId,
  isComparing,
  onToggleCompare,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-30 px-4 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-blue-500/20">
          <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
            <Cpu className="w-5 h-5 text-blue-400 animate-pulse" />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-white tracking-tight">CPU Scheduler Pro</h1>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
              v2.0
            </span>
          </div>
          <p className="text-xs text-slate-400">Operating System Scheduling Simulator & Visualizer</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        {/* Preset Selector */}
        <div className="relative">
          <select
            value={activePresetId || ''}
            onChange={(e) => {
              const found = PRESETS.find(p => p.id === e.target.value);
              if (found) onSelectPreset(found);
            }}
            aria-label="Load Preset Workload"
            className="text-xs bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded-lg px-3 py-2 pr-8 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer appearance-none"
          >
            <option value="" disabled>Load Preset Workload...</option>
            {PRESETS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <BookOpen className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Random Generator */}
        <button
          onClick={onOpenRandom}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
          title="Generate Random Workload"
        >
          <Shuffle className="w-3.5 h-3.5 text-amber-400" />
          <span>Randomize</span>
        </button>

        {/* Import/Export */}
        <button
          onClick={onOpenIO}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
          title="Import or Export processes and results"
        >
          <FolderDown className="w-3.5 h-3.5 text-emerald-400" />
          <span>Import / Export</span>
        </button>

        {/* Compare All Toggle */}
        <button
          onClick={onToggleCompare}
          className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg transition shadow-sm ${
            isComparing
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-500/25'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5 text-blue-300" />
          <span>{isComparing ? 'Close Matrix' : 'Compare All 6'}</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700 transition"
          title={darkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-400" />}
        </button>
      </div>
    </header>
  );
};
