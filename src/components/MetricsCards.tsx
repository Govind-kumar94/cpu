import React from 'react';
import { ScheduleResult } from '../types';
import { Clock, Hourglass, Zap, Percent, Gauge, CheckCircle2 } from 'lucide-react';

interface MetricsCardsProps {
  scheduleResult: ScheduleResult;
}

export const MetricsCards: React.FC<MetricsCardsProps> = ({ scheduleResult }) => {
  return (
    <div className="space-y-4">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Avg Waiting Time */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 shadow-sm hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Avg Waiting</span>
            <Hourglass className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-xl font-black text-white font-mono">
            {scheduleResult.average_waiting} <span className="text-xs text-slate-400 font-sans font-normal">units</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1">WT = TAT - BT</div>
        </div>

        {/* Avg Turnaround Time */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 shadow-sm hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Avg Turnaround</span>
            <Clock className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-black text-white font-mono">
            {scheduleResult.average_turnaround} <span className="text-xs text-slate-400 font-sans font-normal">units</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1">TAT = CT - AT</div>
        </div>

        {/* Avg Response Time */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 shadow-sm hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Avg Response</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-black text-white font-mono">
            {scheduleResult.average_response} <span className="text-xs text-slate-400 font-sans font-normal">units</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1">First Exec - AT</div>
        </div>

        {/* CPU Utilization */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 shadow-sm hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">CPU Utilization</span>
            <Percent className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-xl font-black text-white font-mono">
            {scheduleResult.cpu_utilization}%
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Total Burst / Finish</div>
        </div>

        {/* Throughput */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 shadow-sm hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Throughput</span>
            <Gauge className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl font-black text-white font-mono">
            {scheduleResult.throughput}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Tasks / unit time</div>
        </div>

        {/* Total Time & Idle */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 shadow-sm hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Finish / Idle</span>
            <CheckCircle2 className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-xl font-black text-white font-mono">
            {scheduleResult.finish_time} <span className="text-xs text-slate-400 font-sans font-normal">/ {scheduleResult.idle_time}u idle</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Total execution span</div>
        </div>
      </div>

      {/* Detailed Per-Process Results Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Detailed Process Results Table
          </h3>
          <span className="text-[11px] text-slate-400">
            Formula: Turnaround Time = Completion - Arrival | Waiting Time = Turnaround - Burst
          </span>
        </div>

        <div className="overflow-x-auto border border-slate-800 rounded-lg">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase font-semibold text-[10px] border-b border-slate-800">
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
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {scheduleResult.processes.map((p) => (
                <tr key={p.pid} className="hover:bg-slate-800/40 transition">
                  <td className="py-2 px-3 font-sans font-medium text-slate-200 flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: p.color }}
                    />
                    <span className="font-semibold">{p.pid}</span>
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
