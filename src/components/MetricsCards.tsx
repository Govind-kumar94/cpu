import React from 'react';
import { ScheduleResult } from '../types';
import { Clock, Hourglass, Zap, Percent, Gauge, CheckCircle2 } from 'lucide-react';

interface MetricsCardsProps {
  scheduleResult: ScheduleResult;
}

export const MetricsCards: React.FC<MetricsCardsProps> = ({ scheduleResult }) => {
  return (
    <div className="space-y-4 font-sans">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Avg Waiting Time */}
        <div className="bg-slate-900 border border-slate-800 rounded p-3 shadow-sm hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider font-mono">Avg Waiting</span>
            <Hourglass className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="text-xl font-bold text-white font-mono">
            {scheduleResult.average_waiting} <span className="text-xs text-slate-400 font-sans font-normal">units</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1 font-mono">WT = TAT - BT</div>
        </div>

        {/* Avg Turnaround Time */}
        <div className="bg-slate-900 border border-slate-800 rounded p-3 shadow-sm hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider font-mono">Avg Turnaround</span>
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-white font-mono">
            {scheduleResult.average_turnaround} <span className="text-xs text-slate-400 font-sans font-normal">units</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1 font-mono">TAT = CT - AT</div>
        </div>

        {/* Avg Response Time */}
        <div className="bg-slate-900 border border-slate-800 rounded p-3 shadow-sm hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider font-mono">Avg Response</span>
            <Zap className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl font-bold text-white font-mono">
            {scheduleResult.average_response} <span className="text-xs text-slate-400 font-sans font-normal">units</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1 font-mono">First Exec - AT</div>
        </div>

        {/* CPU Utilization */}
        <div className="bg-slate-900 border border-slate-800 rounded p-3 shadow-sm hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider font-mono">CPU Utilization</span>
            <Percent className="w-3.5 h-3.5 text-blue-300" />
          </div>
          <div className="text-xl font-bold text-white font-mono">
            {scheduleResult.cpu_utilization}%
          </div>
          <div className="text-[10px] text-slate-500 mt-1 font-mono">Busy / Finish</div>
        </div>

        {/* Throughput */}
        <div className="bg-slate-900 border border-slate-800 rounded p-3 shadow-sm hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider font-mono">Throughput</span>
            <Gauge className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-xl font-bold text-white font-mono">
            {scheduleResult.throughput}
          </div>
          <div className="text-[10px] text-slate-500 mt-1 font-mono">Tasks / unit time</div>
        </div>

        {/* Total Time & Idle */}
        <div className="bg-slate-900 border border-slate-800 rounded p-3 shadow-sm hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider font-mono">Finish / Idle</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className="text-xl font-bold text-white font-mono">
            {scheduleResult.finish_time} <span className="text-xs text-slate-400 font-sans font-normal">/ {scheduleResult.idle_time}u</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1 font-mono">Total timeline span</div>
        </div>
      </div>

      {/* Detailed Per-Process Results Table */}
      <div className="bg-slate-900 border border-slate-800 rounded p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-3">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            Process Execution Manifest Table
          </h3>
          <span className="text-[11px] text-slate-400 font-mono">
            TAT = CT - AT | WT = TAT - BT
          </span>
        </div>

        <div className="overflow-x-auto border border-slate-800 rounded">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px] border-b border-slate-800 font-mono">
              <tr>
                <th className="py-2.5 px-3">PID</th>
                <th className="py-2.5 px-3 text-center">Arrival (AT)</th>
                <th className="py-2.5 px-3 text-center">Burst (BT)</th>
                <th className="py-2.5 px-3 text-center">Priority</th>
                <th className="py-2.5 px-3 text-center font-bold text-slate-200">Completion (CT)</th>
                <th className="py-2.5 px-3 text-center font-bold text-emerald-400">Turnaround (TAT)</th>
                <th className="py-2.5 px-3 text-center font-bold text-blue-400">Waiting (WT)</th>
                <th className="py-2.5 px-3 text-center font-bold text-amber-400">Response (RT)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-mono">
              {scheduleResult.processes.map((p) => (
                <tr key={p.pid} className="hover:bg-slate-800/40 transition">
                  <td className="py-2 px-3 font-sans font-medium text-slate-200 flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-sm shrink-0"
                      style={{ backgroundColor: p.color }}
                    />
                    <span className="font-semibold font-mono">{p.pid}</span>
                    {p.systemInfo && (
                      <span className="text-[10px] text-slate-400 font-mono">
                        ({p.systemInfo.command})
                      </span>
                    )}
                  </td>
                  <td className="py-2 px-3 text-center text-slate-300">{p.arrival_time}</td>
                  <td className="py-2 px-3 text-center text-slate-300">{p.burst_time}</td>
                  <td className="py-2 px-3 text-center text-slate-300">{p.priority}</td>
                  <td className="py-2 px-3 text-center font-semibold text-white">{p.completion_time}</td>
                  <td className="py-2 px-3 text-center font-semibold text-emerald-400">{p.turnaround_time}</td>
                  <td className="py-2 px-3 text-center font-semibold text-blue-400">{p.waiting_time}</td>
                  <td className="py-2 px-3 text-center font-semibold text-amber-400">{p.response_time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
