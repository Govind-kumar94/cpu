import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Process, AlgorithmName } from './types';
import { PRESETS, Preset } from './data/presets';
import { runAlgorithm } from './core/algorithms';
import { ComparisonEngine } from './core/comparison';
import { computeTimelineState } from './core/simulator';
import { Header } from './components/Header';
import { AlgorithmSelector } from './components/AlgorithmSelector';
import { ProcessTable } from './components/ProcessTable';
import { GanttChart } from './components/GanttChart';
import { PlaybackControls } from './components/PlaybackControls';
import { MetricsCards } from './components/MetricsCards';
import { ComparisonView } from './components/ComparisonView';
import { ImportExportModal } from './components/ImportExportModal';
import { RandomGeneratorModal } from './components/RandomGeneratorModal';

export const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [processes, setProcesses] = useState<Process[]>(PRESETS[0].processes);
  const [currentAlgorithm, setCurrentAlgorithm] = useState<AlgorithmName>('FCFS');
  const [quantum, setQuantum] = useState<number>(2);
  const [activePresetId, setActivePresetId] = useState<string | undefined>('textbook-standard');
  const [isComparing, setIsComparing] = useState<boolean>(false);

  // Playback & Animation state
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);

  // Modals
  const [isIOModalOpen, setIsIOModalOpen] = useState<boolean>(false);
  const [isRandomModalOpen, setIsRandomModalOpen] = useState<boolean>(false);

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
      // Don't trigger if typing in an input
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
    if (preset.recommendedAlgorithm) {
      setCurrentAlgorithm(preset.recommendedAlgorithm as AlgorithmName);
    }
    setCurrentTime(0);
    setIsPlaying(false);
  };

  // Process manipulation handlers
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
    setCurrentTime(0);
    setIsPlaying(false);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} transition-colors`}>
      {/* Header */}
      <Header
        darkMode={darkMode}
        onToggleTheme={() => setDarkMode(!darkMode)}
        onSelectPreset={handleSelectPreset}
        onOpenRandom={() => setIsRandomModalOpen(true)}
        onOpenIO={() => setIsIOModalOpen(true)}
        activePresetId={activePresetId}
        isComparing={isComparing}
        onToggleCompare={() => setIsComparing(!isComparing)}
      />

      {/* Main Workspace */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6">
        {/* Comparison Matrix Modal/View Toggle */}
        {isComparing ? (
          <ComparisonView
            comparisonReport={comparisonReport}
            onSelectAlgorithm={(algo) => {
              setCurrentAlgorithm(algo);
              setIsComparing(false);
            }}
          />
        ) : (
          <>
            {/* Algorithm Selector */}
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

            {/* Interactive Gantt Chart */}
            <GanttChart
              scheduleResult={scheduleResult}
              currentTime={currentTime}
              onSeek={(time) => {
                setCurrentTime(time);
                setIsPlaying(false);
              }}
            />

            {/* Animation & Playback Controls */}
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

            {/* Grid: Process Table Editor + Realtime Performance Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Process Workload Configuration */}
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

              {/* Performance Metrics Cards and Output Table */}
              <div className="lg:col-span-7">
                <MetricsCards scheduleResult={scheduleResult} />
              </div>
            </div>
          </>
        )}
      </main>

      {/* Modals */}
      <ImportExportModal
        isOpen={isIOModalOpen}
        onClose={() => setIsIOModalOpen(false)}
        onImportProcesses={(imported) => {
          setProcesses(imported);
          setActivePresetId(undefined);
          setCurrentTime(0);
          setIsPlaying(false);
        }}
        currentProcesses={processes}
        scheduleResult={scheduleResult}
        currentAlgorithm={currentAlgorithm}
      />

      <RandomGeneratorModal
        isOpen={isRandomModalOpen}
        onClose={() => setIsRandomModalOpen(false)}
        onGenerate={(generated) => {
          setProcesses(generated);
          setActivePresetId(undefined);
          setCurrentTime(0);
          setIsPlaying(false);
        }}
      />
    </div>
  );
};
