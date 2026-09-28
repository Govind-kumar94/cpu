import React from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  SkipBack,
  FastForward,
  Activity,
  Layers,
} from 'lucide-react';
import { TimelineStepState } from '../types';

interface PlaybackControlsProps {
  timelineState: TimelineStepState;
  finishTime: number;
  isPlaying: boolean;
  playbackSpeed: number;
  onTogglePlay: () => void;
  onStepBack: () => void;
  onStepForward: () => void;
  onReset: () => void;
  onJumpEnd: () => void;
  onSeek: (time: number) => void;
  onChangeSpeed: (speed: number) => void;
}

export const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  timelineState,
  finishTime,
  isPlaying,
  playbackSpeed,
  onTogglePlay,
  onStepBack,
  onStepForward,
  onReset,
  onJumpEnd,
  onSeek,
  onChangeSpeed,
}) => {
  const isIdle = !timelineState.currentPid || timelineState.currentPid === 'IDLE';
  const isFinished = timelineState.time >= finishTime && finishTime > 0;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded p-4 shadow-sm flex flex-col gap-4 font-sans">
      {/* Top row: Transport Controls + Speed + Scrub bar */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Reset */}
          <button
            onClick={onReset}
            className="p-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
            title="Reset to t=0"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Step Back */}
          <button
            onClick={onStepBack}
            disabled={timelineState.time <= 0}
            className="p-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition disabled:opacity-40"
            title="Step back 1 unit"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          {/* Play/Pause */}
          <button
            onClick={onTogglePlay}
            className={`px-4 py-2 rounded font-semibold flex items-center gap-2 text-xs transition border shadow-sm ${
              isPlaying
                ? 'bg-amber-600 hover:bg-amber-500 text-white border-amber-500'
                : 'bg-blue-600 hover:bg-blue-500 text-white border-blue-500'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>{isFinished ? 'Replay' : 'Play'}</span>
              </>
            )}
          </button>

          {/* Step Forward */}
          <button
            onClick={onStepForward}
            disabled={timelineState.time >= finishTime}
            className="p-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition disabled:opacity-40"
            title="Step forward 1 unit"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          {/* Jump End */}
          <button
            onClick={onJumpEnd}
            disabled={timelineState.time >= finishTime}
            className="p-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition disabled:opacity-40"
            title="Jump to finish time"
          >
            <FastForward className="w-4 h-4" />
          </button>

          {/* Speed Selector */}
          <div className="flex items-center ml-2 bg-slate-800 border border-slate-700 rounded p-0.5 text-xs">
            {[0.5, 1, 2, 4].map((s) => (
              <button
                key={s}
                onClick={() => onChangeSpeed(s)}
                className={`px-2 py-1 rounded font-mono font-medium transition ${
                  playbackSpeed === s
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>

        {/* Scrub Slider */}
        <div className="w-full lg:w-auto flex-1 max-w-md flex items-center gap-3">
          <span className="text-xs text-slate-400 font-mono shrink-0">t = 0</span>
          <input
            type="range"
            min="0"
            max={finishTime || 1}
            value={timelineState.time}
            onChange={(e) => onSeek(parseInt(e.target.value, 10))}
            className="w-full accent-blue-500 cursor-pointer h-2 bg-slate-800 rounded"
          />
          <div className="bg-slate-800 border border-slate-700 px-2.5 py-1 rounded font-mono text-xs text-white font-bold shrink-0">
            t = {timelineState.time} / {finishTime}
          </div>
        </div>
      </div>

      {/* Bottom row: Live CPU State + Ready Queue Visualizer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-slate-800">
        {/* Active CPU Widget */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center border transition-all ${
                isIdle
                  ? 'bg-slate-800/80 border-slate-700 text-slate-400'
                  : 'bg-blue-600/20 border-blue-500/40 text-blue-400 animate-pulse'
              }`}
            >
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono">CORE 01 • EXECUTION TRACK</div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                {isIdle ? (
                  <span className="text-slate-400 font-mono">TRACK CLEAR (IDLE DISPATCH)</span>
                ) : (
                  <>
                    <span
                      className="w-2.5 h-2.5 rounded-sm inline-block"
                      style={{ backgroundColor: timelineState.currentBlock?.color }}
                    />
                    <span>Executing <span className="font-mono text-blue-400 font-bold">{timelineState.currentPid}</span></span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="text-right font-mono text-xs">
            {timelineState.currentPid && !isIdle ? (
              <div>
                <span className="text-slate-400 text-[10px] block uppercase">Remaining</span>
                <span className="text-blue-400 font-bold">
                  {timelineState.processRemaining[timelineState.currentPid] ?? 0} units
                </span>
              </div>
            ) : (
              <span className="text-slate-500 text-xs">0 active threads</span>
            )}
          </div>
        </div>

        {/* Ready Queue Visualizer */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-amber-600/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0">
              <Layers className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Ready Queue (Holding Track)</div>
              <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
                {timelineState.readyQueue.length === 0 ? (
                  <span className="text-xs text-slate-500 font-mono">Empty</span>
                ) : (
                  timelineState.readyQueue.map((item) => (
                    <span
                      key={item.pid}
                      className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-200 shrink-0"
                    >
                      <span
                        className="w-2 h-2 rounded-sm"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="font-semibold">{item.pid}</span>
                      <span className="text-slate-400 text-[10px]">({item.remaining}u)</span>
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="text-right font-mono text-xs shrink-0 pl-2">
            <span className="text-slate-400 text-[10px] block uppercase">Queued</span>
            <span className="text-amber-400 font-bold">{timelineState.readyQueue.length} tasks</span>
          </div>
        </div>
      </div>
    </div>
  );
};
