import React from 'react';
import { ComparisonReport } from '../core/comparison';
import { Trophy, CheckCircle, BarChart3, ArrowRight, Zap } from 'lucide-react';
import { AlgorithmName } from '../types';

interface ComparisonViewProps {
  comparisonReport: ComparisonReport;
  onSelectAlgorithm: (algo: AlgorithmName) => void;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({
  comparisonReport,
  onSelectAlgorithm,
}) => {
  const { metrics, bestAlgorithm, bestReason } = comparisonReport;

  // Find max values for scaling the bar charts
  const maxWait = Math.max(1, ...metrics.map((m) => m.waiting));
  const maxTurnaround = Math.max(1, ...metrics.map((m) => m.turnaround));
  const maxThroughput = Math.max(0.01, ...metrics.map((m) => m.throughput));

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-6 animate-fadeIn">
      {/* Header & Trophy Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white tracking-tight">Algorithm Benchmark & Comparison Matrix</h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-semibold border border-blue-500/30">
              6 Algorithms Evaluated
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Performance comparison across identical process workload and arrival profiles.
          </p>
        </div>

        {/* Best Algorithm Badge */}
        <div className="bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-transparent border border-amber-500/30 rounded-xl p-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center shrink-0">
            <Trophy className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-amber-400/90 tracking-wider">
              Optimal Recommendation
            </div>
            <div className="text-sm font-black text-white flex items-center gap-2">
              <span>{bestAlgorithm}</span>
              <button
                onClick={() => onSelectAlgorithm(bestAlgorithm)}
                className="text-[11px] text-blue-400 hover:text-blue-300 underline font-normal ml-1 flex items-center gap-0.5"
              >
                <span>Simulate</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Rationale explanation */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-3 text-xs text-slate-300 flex items-start gap-2.5">
        <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-white">Performance Analysis: </span>
          <span>{bestReason}</span>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto border border-slate-800 rounded-lg">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px] border-b border-slate-800">
            <tr>
              <th className="py-3 px-3">Algorithm</th>
              <th className="py-3 px-3 text-center">Avg Waiting Time</th>
              <th className="py-3 px-3 text-center">Avg Turnaround</th>
              <th className="py-3 px-3 text-center">Avg Response</th>
              <th className="py-3 px-3 text-center">CPU Utilization</th>
              <th className="py-3 px-3 text-center">Throughput</th>
              <th className="py-3 px-3 text-center">Finish Time</th>
              <th className="py-3 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {metrics.map((m) => {
              const isBest = m.name === bestAlgorithm;

              return (
                <tr
                  key={m.name}
                  className={`transition ${
                    isBest ? 'bg-amber-500/5 hover:bg-amber-500/10' : 'hover:bg-slate-800/40'
                  }`}
                >
                  <td className="py-2.5 px-3 font-sans font-medium text-slate-200 flex items-center gap-2">
                    {isBest && <Trophy className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                    <span className={isBest ? 'font-bold text-amber-300' : ''}>{m.name}</span>
                  </td>
                  <td className="py-2.5 px-3 text-center font-bold text-blue-400">{m.waiting}u</td>
                  <td className="py-2.5 px-3 text-center font-bold text-emerald-400">{m.turnaround}u</td>
                  <td className="py-2.5 px-3 text-center text-slate-300">{m.response}u</td>
                  <td className="py-2.5 px-3 text-center font-semibold text-purple-400">{m.cpu}%</td>
                  <td className="py-2.5 px-3 text-center text-cyan-400">{m.throughput}</td>
                  <td className="py-2.5 px-3 text-center text-slate-300">{m.finish}u</td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={() => onSelectAlgorithm(m.name)}
                      className="px-2.5 py-1 text-[11px] font-sans font-medium rounded bg-slate-800 hover:bg-blue-600 text-slate-200 hover:text-white transition border border-slate-700 hover:border-blue-500"
                    >
                      View
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Visual Comparative Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {/* Chart 1: Average Waiting Time (Lower is better) */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Avg Waiting Time (Lower is better)
            </h4>
            <span className="text-[10px] text-slate-500 font-mono">Time units</span>
          </div>
          <div className="space-y-2.5">
            {metrics.map((m) => {
              const width = Math.max(4, (m.waiting / maxWait) * 100);
              const isBest = m.name === bestAlgorithm;

              return (
                <div key={m.name} className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className={`font-medium ${isBest ? 'text-amber-400 font-bold' : 'text-slate-300'}`}>
                      {m.name}
                    </span>
                    <span className="font-mono text-slate-400">{m.waiting}u</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${width}%` }}
                      className={`h-full rounded-full transition-all duration-500 ${
                        isBest ? 'bg-amber-400' : 'bg-blue-500'
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 2: Average Turnaround Time (Lower is better) */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Avg Turnaround Time (Lower is better)
            </h4>
            <span className="text-[10px] text-slate-500 font-mono">Time units</span>
          </div>
          <div className="space-y-2.5">
            {metrics.map((m) => {
              const width = Math.max(4, (m.turnaround / maxTurnaround) * 100);
              const isBest = m.name === bestAlgorithm;

              return (
                <div key={m.name} className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className={`font-medium ${isBest ? 'text-amber-400 font-bold' : 'text-slate-300'}`}>
                      {m.name}
                    </span>
                    <span className="font-mono text-slate-400">{m.turnaround}u</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${width}%` }}
                      className={`h-full rounded-full transition-all duration-500 ${
                        isBest ? 'bg-amber-400' : 'bg-emerald-500'
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 3: CPU Utilization (Higher is better) */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              CPU Utilization (Higher is better)
            </h4>
            <span className="text-[10px] text-slate-500 font-mono">Percentage %</span>
          </div>
          <div className="space-y-2.5">
            {metrics.map((m) => {
              const width = Math.max(4, m.cpu);

              return (
                <div key={m.name} className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-300 font-medium">{m.name}</span>
                    <span className="font-mono text-purple-400 font-semibold">{m.cpu}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${width}%` }}
                      className="h-full rounded-full bg-purple-500 transition-all duration-500"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 4: Throughput (Higher is better) */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Throughput (Higher is better)
            </h4>
            <span className="text-[10px] text-slate-500 font-mono">Tasks / unit</span>
          </div>
          <div className="space-y-2.5">
            {metrics.map((m) => {
              const width = Math.max(4, (m.throughput / maxThroughput) * 100);

              return (
                <div key={m.name} className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-300 font-medium">{m.name}</span>
                    <span className="font-mono text-cyan-400 font-semibold">{m.throughput}</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${width}%` }}
                      className="h-full rounded-full bg-cyan-500 transition-all duration-500"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
