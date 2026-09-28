import React from 'react';
import { AlgorithmName } from '../types';
import { Timer, Zap, ArrowDownNarrowWide, Clock, ShieldAlert, Cpu } from 'lucide-react';

interface AlgorithmSelectorProps {
  currentAlgorithm: AlgorithmName;
  onSelectAlgorithm: (algo: AlgorithmName) => void;
  quantum: number;
  onChangeQuantum: (q: number) => void;
}

interface AlgoMeta {
  name: AlgorithmName;
  short: string;
  preemptive: boolean;
  desc: string;
  badge: string;
}

const ALGORITHMS: AlgoMeta[] = [
  {
    name: 'FCFS',
    short: 'FCFS',
    preemptive: false,
    desc: 'Non-preemptive FIFO execution. Simple, but vulnerable to convoy effect.',
    badge: 'Non-Preemptive',
  },
  {
    name: 'SJF',
    short: 'SJF',
    preemptive: false,
    desc: 'Shortest Job First. Selects smallest burst time among ready tasks.',
    badge: 'Optimal Wait (NP)',
  },
  {
    name: 'SJF Preemptive',
    short: 'SRTF',
    preemptive: true,
    desc: 'Shortest Remaining Time First. Preempts when shorter job arrives.',
    badge: 'Preemptive Optimal',
  },
  {
    name: 'Priority',
    short: 'Priority',
    preemptive: false,
    desc: 'Executes highest priority (lowest integer value) to completion.',
    badge: 'Non-Preemptive',
  },
  {
    name: 'Priority Preemptive',
    short: 'Priority (P)',
    preemptive: true,
    desc: 'Preempts running task immediately when higher priority task arrives.',
    badge: 'Preemptive',
  },
  {
    name: 'Round Robin',
    short: 'RR',
    preemptive: true,
    desc: 'Cyclic allocation of fixed time slice (quantum) to each ready process.',
    badge: 'Time-Sliced',
  },
];

export const AlgorithmSelector: React.FC<AlgorithmSelectorProps> = ({
  currentAlgorithm,
  onSelectAlgorithm,
  quantum,
  onChangeQuantum,
}) => {
  const activeMeta = ALGORITHMS.find(a => a.name === currentAlgorithm) || ALGORITHMS[0];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded p-4 shadow-sm font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Algorithm Tabs */}
        <div className="flex flex-wrap gap-2">
          {ALGORITHMS.map((algo) => {
            const isSelected = algo.name === currentAlgorithm;
            return (
              <button
                key={algo.name}
                onClick={() => onSelectAlgorithm(algo.name)}
                className={`relative px-3 py-1.5 rounded text-xs font-semibold transition flex items-center gap-1.5 border ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                    : 'bg-slate-850 hover:bg-slate-800 text-slate-300 border-slate-750 hover:border-slate-700'
                }`}
              >
                <span>{algo.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                    isSelected
                      ? 'bg-blue-700 text-blue-100'
                      : algo.preemptive
                      ? 'bg-amber-950 text-amber-300 border border-amber-850'
                      : 'bg-slate-750 text-slate-400'
                  }`}
                >
                  {algo.preemptive ? 'PREEMPT' : 'NON-P'}
                </span>
              </button>
            );
          })}
        </div>

        {/* Quantum Control for Round Robin */}
        {currentAlgorithm === 'Round Robin' && (
          <div className="flex items-center gap-3 bg-slate-950 border border-slate-700 rounded px-3 py-1.5 animate-fadeIn">
            <div className="flex items-center gap-1.5 text-xs text-blue-400 font-semibold">
              <Timer className="w-4 h-4" />
              <span>Time Quantum (q):</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="1"
                max="10"
                value={quantum}
                onChange={(e) => onChangeQuantum(parseInt(e.target.value, 10))}
                className="w-20 accent-blue-500 cursor-pointer"
              />
              <span className="text-xs font-bold text-white font-mono bg-blue-950 px-2 py-0.5 rounded border border-blue-800">
                {quantum} units
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Algorithm description ribbon */}
      <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
        <div className="flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-blue-400 shrink-0" />
          <span>{activeMeta.desc}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-500 font-mono">
            Priority convention: Lower numerical value = Higher scheduling priority (e.g. 1 &gt; 5)
          </span>
        </div>
      </div>
    </div>
  );
};
