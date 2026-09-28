import React, { useState, useMemo, useEffect } from 'react';
import { Process, AlgorithmName, NotificationAlert } from './types';
import { PRESETS, Preset } from './data/presets';
import { runAlgorithm } from './core/algorithms';
import { ComparisonEngine } from './core/comparison';
import { computeTimelineState } from './core/simulator';
import { fetchLiveSystemProcesses } from './core/systemProcesses';
import { Navbar, NavTab } from './components/Navbar';
import { Hero } from './components/Hero';
import { AlgorithmSelector } from './components/AlgorithmSelector';
import { ProcessTable } from './components/ProcessTable';
import { GanttChart } from './components/GanttChart';
import { PlaybackControls } from './components/PlaybackControls';
import { MetricsCards } from './components/MetricsCards';
import { ComparisonView } from './components/ComparisonView';
import { AlgorithmGuide } from './components/AlgorithmGuide';
import { HostTelemetryPage } from './components/HostTelemetryPage';
import { ImportExportModal } from './components/ImportExportModal';
import { RandomGeneratorModal } from './components/RandomGeneratorModal';
import { SystemTaskModal } from './components/SystemTaskModal';
import { NotificationBanner } from './components/NotificationBanner';
import { LegalModal } from './components/LegalModals';
import { Footer } from './components/Footer';
import { BookOpen, Shuffle, FolderDown, Activity } from 'lucide-react';

export const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<NavTab>('workbench');
  const [processes, setProcesses] = useState<Process[]>(PRESETS[0].processes);
  const [currentAlgorithm, setCurrentAlgorithm] = useState<AlgorithmName>('FCFS');
  const [quantum, setQuantum] = useState<number>(2);
  const [activePresetId, setActivePresetId] = useState<string | undefined>('textbook-standard');

  // Playback & Animation state
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);

  // Modals state
  const [isIOModalOpen, setIsIOModalOpen] = useState<boolean>(false);
  const [isRandomModalOpen, setIsRandomModalOpen] = useState<boolean>(false);
  const [isSystemModalOpen, setIsSystemModalOpen] = useState<boolean>(false);
  const [isSystemLoading, setIsSystemLoading] = useState<boolean>(false);
  const [legalModalType, setLegalModalType] = useState<'privacy' | 'terms' | null>(null);

  // System Telemetry & Notification Alert state
  const [isSystemTelemetryActive, setIsSystemTelemetryActive] = useState<boolean>(false);
  const [notificationAlert, setNotificationAlert] = useState<NotificationAlert | null>({
    id: 'initial-info',
    type: 'info',
    title: 'DISPATCH CONTROL READY',
    message: 'Loaded with standard operating system textbook manifest. To sample real background processes executing on your system, select "Load Host Tasks".',
    timestamp: '00:00:01',
    actionLabel: 'Inspect Host',
    onAction: () => setIsSystemModalOpen(true),
  });

  // Compute active schedule result
  const scheduleResult = useMemo(() => {
    return runAlgorithm(currentAlgorithm, processes, quantum);
  }, [currentAlgorithm, processes, quantum]);

  // Compute all 6 algorithms comparison
  const comparisonReport = useMemo(() => {
    return ComparisonEngine.compare(processes, quantum);
  }, [processes, quantum]);

  // Compute timeline simulator state for the current scrub position
  const timelineState = useMemo(() => {
    return computeTimelineState(scheduleResult, currentTime);
  }, [scheduleResult, currentTime]);

  // Reset currentTime if it exceeds finish time when workload changes
  useEffect(() => {
    if (currentTime > scheduleResult.finish_time) {
      setCurrentTime(scheduleResult.finish_time);
    }
  }, [scheduleResult.finish_time]);

  // Playback timer loop
  useEffect(() => {
    if (!isPlaying) return;

    const baseDelay = 600; // ms per time unit at 1x
    const intervalTime = Math.max(80, baseDelay / playbackSpeed);

    const timer = setInterval(() => {
      setCurrentTime((prev) => {
        if (prev >= scheduleResult.finish_time) {
          setIsPlaying(false);
          return scheduleResult.finish_time;
        }
        return prev + 1;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPlaying, playbackSpeed, scheduleResult.finish_time]);

  // Keyboard controls (Space for play/pause, Left/Right arrows for step)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying((prev) => {
          if (currentTime >= scheduleResult.finish_time && !prev) {
            setCurrentTime(0);
            return true;
          }
          return !prev;
        });
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        setCurrentTime((prev) => Math.min(scheduleResult.finish_time, prev + 1));
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        setCurrentTime((prev) => Math.max(0, prev - 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentTime, scheduleResult.finish_time]);

  // Preset loading handler
  const handleSelectPreset = (preset: Preset) => {
    setProcesses(preset.processes);
    setActivePresetId(preset.id);
    setIsSystemTelemetryActive(false);
    if (preset.recommendedAlgorithm) {
      setCurrentAlgorithm(preset.recommendedAlgorithm as AlgorithmName);
    }
    setCurrentTime(0);
    setIsPlaying(false);

    setNotificationAlert({
      id: `preset-${preset.id}-${Date.now()}`,
      type: 'info',
      title: 'MANIFEST LOADED',
      message: `Loaded synthetic preset manifest: "${preset.name}". (${preset.processes.length} tasks scheduled).`,
      timestamp: new Date().toLocaleTimeString(),
    });
  };

  // System Task Handlers (User agreement flow)
  const handleAgreeSystemTasks = async (config: {
    limit: number;
    sort: 'cpu' | 'mem' | 'etime';
    stagger: boolean;
  }) => {
    setIsSystemLoading(true);
    try {
      const result = await fetchLiveSystemProcesses(config);
      setProcesses(result.processes);
      setIsSystemTelemetryActive(true);
      setActivePresetId(undefined);
      setCurrentTime(0);
      setIsPlaying(false);
      setIsSystemModalOpen(false);

      const sampleNames = result.processes
        .map((p) => p.systemInfo?.command || p.pid)
        .slice(0, 4)
        .join(', ');

      setNotificationAlert({
        id: `telemetry-granted-${Date.now()}`,
        type: 'success',
        title: 'HOST TELEMETRY AUTHORIZED',
        message: `Clearance granted. Retrieved ${result.processes.length} live background tasks from host system (${sampleNames}...). Real kernel nice values mapped to priority levels.`,
        timestamp: new Date().toLocaleTimeString(),
        actionLabel: 'Re-sync Tasks',
        onAction: () => setIsSystemModalOpen(true),
      });
    } catch (err: any) {
      setNotificationAlert({
        id: `telemetry-error-${Date.now()}`,
        type: 'alert',
        title: 'TELEMETRY SAMPLING FAILED',
        message: err.message || 'Could not query host processes.',
        timestamp: new Date().toLocaleTimeString(),
        actionLabel: 'Retry',
        onAction: () => setIsSystemModalOpen(true),
      });
    } finally {
      setIsSystemLoading(false);
    }
  };

  const handleDeclineSystemTasks = () => {
    setIsSystemModalOpen(false);
    setNotificationAlert({
      id: `telemetry-declined-${Date.now()}`,
      type: 'warning',
      title: 'TELEMETRY ACCESS DECLINED',
      message: 'Host system task inspection was declined. The dispatcher will continue using safe synthetic simulation tasks without background host access.',
      timestamp: new Date().toLocaleTimeString(),
      actionLabel: 'Grant Clearance',
      onAction: () => setIsSystemModalOpen(true),
    });
  };

  // Process table manipulation handlers
  const handleUpdateProcess = (index: number, updated: Process) => {
    setProcesses((prev) => {
      const next = [...prev];
      next[index] = updated;
      return next;
    });
    setActivePresetId(undefined);
  };

  const handleAddProcess = (p: Process) => {
    setProcesses((prev) => [...prev, p]);
    setActivePresetId(undefined);
  };

  const handleDeleteProcess = (index: number) => {
    if (processes.length <= 1) return;
    setProcesses((prev) => prev.filter((_, i) => i !== index));
    setActivePresetId(undefined);
  };

  const handleResetProcesses = () => {
    setProcesses(PRESETS[0].processes);
    setActivePresetId('textbook-standard');
    setIsSystemTelemetryActive(false);
    setCurrentTime(0);
    setIsPlaying(false);
    setNotificationAlert(null);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} transition-colors font-sans flex flex-col justify-between`}>
      <div>
        {/* Professional Navigation Bar */}
        <Navbar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          darkMode={darkMode}
          onToggleTheme={() => setDarkMode(!darkMode)}
          onOpenSystemTasks={() => setIsSystemModalOpen(true)}
          isSystemTelemetryActive={isSystemTelemetryActive}
        />

        {/* Hero Section */}
        <Hero
          onSelectTab={setActiveTab}
          onOpenSystemTasks={() => setIsSystemModalOpen(true)}
          activeProcessCount={processes.length}
        />

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6">
          {/* Notification Alert Banner */}
          <NotificationBanner
            alert={notificationAlert}
            onDismiss={() => setNotificationAlert(null)}
            onAction={() => setIsSystemModalOpen(true)}
          />

          {/* View Tab 1: Dispatcher Workbench */}
          {activeTab === 'workbench' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Workload Control Toolbar Strip */}
              <div className="bg-slate-900 border border-slate-800 rounded p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">
                    Workload Source:
                  </span>
                  <div className="relative">
                    <select
                      value={activePresetId || ''}
                      onChange={(e) => {
                        const found = PRESETS.find(p => p.id === e.target.value);
                        if (found) handleSelectPreset(found);
                      }}
                      aria-label="Preset Workload Selector"
                      className="bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded px-2.5 py-1.5 pr-7 font-medium focus:outline-none focus:border-blue-500 cursor-pointer appearance-none font-sans"
                    >
                      <option value="" disabled>Standard Manifests...</option>
                      {PRESETS.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                    <BookOpen className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setIsSystemModalOpen(true)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition border font-semibold ${
                      isSystemTelemetryActive
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                        : 'bg-slate-800 hover:bg-slate-750 text-slate-200 border-slate-700'
                    }`}
                  >
                    <Activity className={`w-3.5 h-3.5 ${isSystemTelemetryActive ? 'text-emerald-400' : 'text-blue-400'}`} />
                    <span>{isSystemTelemetryActive ? 'Re-sync Host Tasks' : 'Load Host Tasks'}</span>
                  </button>

                  <button
                    onClick={() => setIsRandomModalOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 transition"
                  >
                    <Shuffle className="w-3.5 h-3.5 text-amber-400" />
                    <span>Randomize</span>
                  </button>

                  <button
                    onClick={() => setIsIOModalOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 transition"
                  >
                    <FolderDown className="w-3.5 h-3.5 text-slate-400" />
                    <span>Import/Export</span>
                  </button>
                </div>
              </div>

              {/* Algorithm Selector Ribbon */}
              <AlgorithmSelector
                currentAlgorithm={currentAlgorithm}
                onSelectAlgorithm={(algo) => {
                  setCurrentAlgorithm(algo);
                  setCurrentTime(0);
                  setIsPlaying(false);
                }}
                quantum={quantum}
                onChangeQuantum={setQuantum}
              />

              {/* Interactive Gantt Chart / Timetable */}
              <GanttChart
                scheduleResult={scheduleResult}
                currentTime={currentTime}
                onSeek={(time) => {
                  setCurrentTime(time);
                  setIsPlaying(false);
                }}
              />

              {/* Playback Controls & Dual Core/Queue Track */}
              <PlaybackControls
                timelineState={timelineState}
                finishTime={scheduleResult.finish_time}
                isPlaying={isPlaying}
                playbackSpeed={playbackSpeed}
                onTogglePlay={() => {
                  if (currentTime >= scheduleResult.finish_time) {
                    setCurrentTime(0);
                    setIsPlaying(true);
                  } else {
                    setIsPlaying(!isPlaying);
                  }
                }}
                onStepBack={() => {
                  setIsPlaying(false);
                  setCurrentTime((prev) => Math.max(0, prev - 1));
                }}
                onStepForward={() => {
                  setIsPlaying(false);
                  setCurrentTime((prev) => Math.min(scheduleResult.finish_time, prev + 1));
                }}
                onReset={() => {
                  setIsPlaying(false);
                  setCurrentTime(0);
                }}
                onJumpEnd={() => {
                  setIsPlaying(false);
                  setCurrentTime(scheduleResult.finish_time);
                }}
                onSeek={(t) => {
                  setIsPlaying(false);
                  setCurrentTime(t);
                }}
                onChangeSpeed={setPlaybackSpeed}
              />

              {/* Grid: Process Workload Table + Metrics */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* Process Manifest Configuration */}
                <div className="lg:col-span-5">
                  <ProcessTable
                    processes={processes}
                    scheduledProcesses={scheduleResult.processes}
                    currentTime={currentTime}
                    onUpdateProcess={handleUpdateProcess}
                    onAddProcess={handleAddProcess}
                    onDeleteProcess={handleDeleteProcess}
                    onResetProcesses={handleResetProcesses}
                  />
                </div>

                {/* Performance Metrics & Timetable Statistics */}
                <div className="lg:col-span-7">
                  <MetricsCards scheduleResult={scheduleResult} />
                </div>
              </div>
            </div>
          )}

          {/* View Tab 2: Algorithm Reference Guide */}
          {activeTab === 'guide' && (
            <AlgorithmGuide
              onSelectAndLaunch={(algo) => {
                setCurrentAlgorithm(algo);
                setActiveTab('workbench');
                setCurrentTime(0);
                setIsPlaying(false);
              }}
            />
          )}

          {/* View Tab 3: Benchmark Comparison Matrix */}
          {activeTab === 'benchmark' && (
            <ComparisonView
              comparisonReport={comparisonReport}
              onSelectAlgorithm={(algo) => {
                setCurrentAlgorithm(algo);
                setActiveTab('workbench');
                setCurrentTime(0);
                setIsPlaying(false);
              }}
            />
          )}

          {/* View Tab 4: Host Background Telemetry */}
          {activeTab === 'telemetry' && (
            <HostTelemetryPage
              onOpenSystemTasksModal={() => setIsSystemModalOpen(true)}
              isSystemTelemetryActive={isSystemTelemetryActive}
              currentProcesses={processes}
            />
          )}
        </main>
      </div>

      {/* System Task Inspection & Permission Agreement Modal */}
      <SystemTaskModal
        isOpen={isSystemModalOpen}
        onClose={() => setIsSystemModalOpen(false)}
        onAgree={handleAgreeSystemTasks}
        onDecline={handleDeclineSystemTasks}
        isLoading={isSystemLoading}
      />

      {/* Import / Export Modal */}
      <ImportExportModal
        isOpen={isIOModalOpen}
        onClose={() => setIsIOModalOpen(false)}
        onImportProcesses={(imported) => {
          setProcesses(imported);
          setActivePresetId(undefined);
          setIsSystemTelemetryActive(false);
          setCurrentTime(0);
          setIsPlaying(false);
          setNotificationAlert({
            id: `imported-${Date.now()}`,
            type: 'success',
            title: 'FILE IMPORT COMPLETED',
            message: `Loaded ${imported.length} tasks from external file into scheduler manifest.`,
            timestamp: new Date().toLocaleTimeString(),
          });
        }}
        currentProcesses={processes}
        scheduleResult={scheduleResult}
        currentAlgorithm={currentAlgorithm}
      />

      {/* Synthetic Random Generator Modal */}
      <RandomGeneratorModal
        isOpen={isRandomModalOpen}
        onClose={() => setIsRandomModalOpen(false)}
        onGenerate={(generated) => {
          setProcesses(generated);
          setActivePresetId(undefined);
          setIsSystemTelemetryActive(false);
          setCurrentTime(0);
          setIsPlaying(false);
          setNotificationAlert({
            id: `randomized-${Date.now()}`,
            type: 'info',
            title: 'SYNTHETIC TASKS GENERATED',
            message: `Generated ${generated.length} synthetic process tasks.`,
            timestamp: new Date().toLocaleTimeString(),
          });
        }}
      />

      {/* Legal Modals (Privacy Policy / Terms of Service) */}
      <LegalModal
        type={legalModalType}
        onClose={() => setLegalModalType(null)}
      />

      {/* Authentic Professional Footer */}
      <Footer
        onSelectTab={setActiveTab}
        onOpenLegal={(type) => setLegalModalType(type)}
      />
    </div>
  );
};
