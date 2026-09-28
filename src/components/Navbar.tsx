import React, { useState } from 'react';
import { Terminal, Moon, Sun, Menu, X, Activity, BookOpen, BarChart3, Play } from 'lucide-react';

export type NavTab = 'workbench' | 'guide' | 'benchmark' | 'telemetry';

interface NavbarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  darkMode: boolean;
  onToggleTheme: () => void;
  onOpenSystemTasks: () => void;
  isSystemTelemetryActive: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  darkMode,
  onToggleTheme,
  onOpenSystemTasks,
  isSystemTelemetryActive,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleTabClick = (tab: NavTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="border-b border-slate-800 bg-slate-900 sticky top-0 z-40 px-4 lg:px-8 py-3 font-sans">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Zone 1: Single clean brand wordmark element */}
        <div
          onClick={() => handleTabClick('workbench')}
          className="flex items-center gap-2.5 cursor-pointer select-none shrink-0"
        >
          <div className="w-7 h-7 rounded bg-slate-950 border border-slate-700 flex items-center justify-center text-blue-400">
            <Terminal className="w-3.5 h-3.5" />
          </div>
          <span className="text-sm font-bold tracking-tight text-white uppercase font-mono whitespace-nowrap">
            CPU Scheduler Pro
          </span>
        </div>

        {/* Zone 2: 4 single-line nav links with clean typography */}
        <nav className="hidden md:flex items-center gap-1 text-xs font-medium shrink-0">
          <button
            onClick={() => handleTabClick('workbench')}
            className={`px-3 py-1.5 rounded transition whitespace-nowrap ${
              activeTab === 'workbench'
                ? 'bg-slate-800 text-white font-semibold border border-slate-700'
                : 'text-slate-300 hover:text-white hover:bg-slate-850'
            }`}
          >
            Dispatcher Workbench
          </button>

          <button
            onClick={() => handleTabClick('guide')}
            className={`px-3 py-1.5 rounded transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'guide'
                ? 'bg-slate-800 text-white font-semibold border border-slate-700'
                : 'text-slate-300 hover:text-white hover:bg-slate-850'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-blue-400" />
            <span>Algorithm Guide</span>
          </button>

          <button
            onClick={() => handleTabClick('benchmark')}
            className={`px-3 py-1.5 rounded transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'benchmark'
                ? 'bg-slate-800 text-white font-semibold border border-slate-700'
                : 'text-slate-300 hover:text-white hover:bg-slate-850'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Benchmark Matrix</span>
          </button>

          <button
            onClick={() => handleTabClick('telemetry')}
            className={`px-3 py-1.5 rounded transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'telemetry'
                ? 'bg-slate-800 text-white font-semibold border border-slate-700'
                : 'text-slate-300 hover:text-white hover:bg-slate-850'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-amber-400" />
            <span>Host Telemetry</span>
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Host Tasks Action Button */}
          <button
            onClick={onOpenSystemTasks}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded border transition whitespace-nowrap ${
              isSystemTelemetryActive
                ? 'bg-emerald-950 text-emerald-200 border-emerald-700 hover:bg-emerald-900'
                : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-750'
            }`}
            title="Inspect background tasks currently executing on host system"
          >
            <Activity className={`w-3.5 h-3.5 ${isSystemTelemetryActive ? 'text-emerald-400' : 'text-blue-400'}`} />
            <span>{isSystemTelemetryActive ? 'Host Tasks Active' : 'Load Host Tasks'}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className="p-1.5 rounded bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-slate-200 border border-slate-700 transition shrink-0"
            title={darkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-400" />}
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden pt-3 mt-3 border-t border-slate-800 space-y-1.5 text-xs">
          <button
            onClick={() => handleTabClick('workbench')}
            className={`w-full text-left px-3 py-2 rounded font-medium ${
              activeTab === 'workbench' ? 'bg-slate-800 text-white font-bold' : 'text-slate-300'
            }`}
          >
            Dispatcher Workbench
          </button>
          <button
            onClick={() => handleTabClick('guide')}
            className={`w-full text-left px-3 py-2 rounded font-medium ${
              activeTab === 'guide' ? 'bg-slate-800 text-white font-bold' : 'text-slate-300'
            }`}
          >
            Algorithm Reference Guide
          </button>
          <button
            onClick={() => handleTabClick('benchmark')}
            className={`w-full text-left px-3 py-2 rounded font-medium ${
              activeTab === 'benchmark' ? 'bg-slate-800 text-white font-bold' : 'text-slate-300'
            }`}
          >
            Benchmark Matrix (All 6 Algorithms)
          </button>
          <button
            onClick={() => handleTabClick('telemetry')}
            className={`w-full text-left px-3 py-2 rounded font-medium ${
              activeTab === 'telemetry' ? 'bg-slate-800 text-white font-bold' : 'text-slate-300'
            }`}
          >
            Host Background Telemetry
          </button>
          <button
            onClick={() => {
              onOpenSystemTasks();
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded font-medium text-blue-400 bg-slate-850 border border-slate-750"
          >
            {isSystemTelemetryActive ? 'Re-sync Host Tasks' : 'Load Host Tasks (Live System)'}
          </button>
        </div>
      )}
    </header>
  );
};
