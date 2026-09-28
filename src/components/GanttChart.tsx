import React, { useState } from 'react';
import { ScheduleResult, ExecutionBlock } from '../types';
import { IDLE_COLOR } from '../core/algorithms';

interface GanttChartProps {
  scheduleResult: ScheduleResult;
  currentTime: number;
  onSeek: (time: number) => void;
}

export const GanttChart: React.FC<GanttChartProps> = ({
  scheduleResult,
  currentTime,
  onSeek,
}) => {
  const [hoveredBlock, setHoveredBlock] = useState<ExecutionBlock | null>(null);
  const finishTime = scheduleResult.finish_time;

  if (finishTime === 0 || scheduleResult.timeline.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded p-6 text-center text-slate-500 font-sans">
        No processes scheduled or total burst is 0.
      </div>
    );
  }

  // Calculate ticks to display on the time axis
  const tickInterval = finishTime > 40 ? 5 : finishTime > 20 ? 2 : 1;
  const ticks: number[] = [];
  for (let i = 0; i <= finishTime; i += tickInterval) {
    ticks.push(i);
  }
  if (ticks[ticks.length - 1] !== finishTime) {
    ticks.push(finishTime);
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded p-5 shadow-sm font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h2 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            Execution Timeline (Gantt Chart)
          </h2>
          <p className="text-[11px] text-slate-400">
            Horizontal time progression of CPU allocation. Click any block to jump playback position.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-slate-600" />
            <span className="text-slate-400">Idle CPU</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-blue-600" />
            <span className="text-slate-400">Active Thread</span>
          </div>
          <div className="text-slate-400">
            Span: <span className="text-white font-bold">{finishTime} units</span>
          </div>
        </div>
      </div>

      {/* Gantt Bar Container */}
      <div className="relative pt-2 pb-6 select-none">
        {/* Main Gantt Timeline Bar */}
        <div className="relative h-14 w-full bg-slate-950 rounded border border-slate-800 overflow-hidden flex shadow-inner">
          {scheduleResult.timeline.map((block, index) => {
            const blockDuration = block.end - block.start;
            const widthPercent = (blockDuration / finishTime) * 100;
            const isIdle = block.pid === 'IDLE';

            return (
              <div
                key={`${block.pid}-${block.start}-${index}`}
                onClick={() => onSeek(block.start)}
                onMouseEnter={() => setHoveredBlock(block)}
                onMouseLeave={() => setHoveredBlock(null)}
                style={{
                  width: `${widthPercent}%`,
                  backgroundColor: isIdle ? IDLE_COLOR : block.color,
                }}
                className={`relative h-full flex flex-col items-center justify-center cursor-pointer transition-all border-r border-slate-900/60 group ${
                  isIdle
                    ? 'bg-[repeating-linear-gradient(45deg,#334155,#334155_6px,#1e293b_6px,#1e293b_12px)] opacity-60 hover:opacity-90'
                    : 'hover:brightness-110 shadow-sm'
                }`}
              >
                {/* Block Content */}
                <span className="text-xs font-bold text-white drop-shadow-md truncate px-1 font-mono">
                  {block.pid}
                </span>
                <span className="text-[10px] text-white/80 font-mono scale-90">
                  {blockDuration}u
                </span>
              </div>
            );
          })}

          {/* Current Time Cursor Line */}
          <div
            style={{ left: `${(Math.min(currentTime, finishTime) / finishTime) * 100}%` }}
            className="absolute top-0 bottom-0 w-0.5 bg-yellow-400 z-20 pointer-events-none shadow-[0_0_8px_rgba(250,204,21,0.9)] transition-[left] duration-150"
          >
            <div className="absolute -top-2 -translate-x-1/2 w-3 h-3 bg-yellow-400 rotate-45 rounded-[2px]" />
          </div>
        </div>

        {/* Time Axis & Markers */}
        <div className="relative w-full h-6 mt-1">
          {ticks.map((tick) => {
            const leftPercent = (tick / finishTime) * 100;
            return (
              <div
                key={tick}
                style={{ left: `${leftPercent}%` }}
                className="absolute top-0 -translate-x-1/2 flex flex-col items-center pointer-events-none"
              >
                <div className="w-px h-1.5 bg-slate-700 mb-0.5" />
                <span className="text-[10px] font-mono text-slate-400 font-medium">
                  {tick}
                </span>
              </div>
            );
          })}
        </div>

        {/* Floating Tooltip info */}
        {hoveredBlock && (
          <div className="absolute top-16 right-4 z-30 bg-slate-900 text-slate-200 border border-slate-700 text-xs px-3.5 py-2.5 rounded-lg shadow-xl font-mono flex flex-wrap items-center gap-3 animate-fadeIn">
            <span
              className="w-2.5 h-2.5 rounded-sm"
              style={{ backgroundColor: hoveredBlock.color }}
            />
            <span className="font-bold text-white font-sans">{hoveredBlock.pid}</span>
            <span className="text-slate-400">
              Start: <span className="text-slate-200 font-bold">{hoveredBlock.start}</span>
            </span>
            <span className="text-slate-400">
              End: <span className="text-slate-200 font-bold">{hoveredBlock.end}</span>
            </span>
            <span className="text-slate-400">
              Burst: <span className="text-blue-400 font-bold">{hoveredBlock.end - hoveredBlock.start}u</span>
            </span>
            {(() => {
              const matched = scheduleResult.processes.find(p => p.pid === hoveredBlock.pid);
              if (matched?.systemInfo) {
                return (
                  <span className="text-[11px] px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                    Host PID {matched.systemInfo.realPid} ({matched.systemInfo.command}) | CPU: {matched.systemInfo.cpuPercent}%
                  </span>
                );
              }
              return null;
            })()}
          </div>
        )}
      </div>
    </div>
  );
};
