import React, { useState } from 'react';
import { X, Sparkles, Shuffle } from 'lucide-react';
import { Process } from '../types';
import { generateRandomProcesses } from '../data/presets';

interface RandomGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (processes: Process[]) => void;
}

export const RandomGeneratorModal: React.FC<RandomGeneratorModalProps> = ({
  isOpen,
  onClose,
  onGenerate,
}) => {
  const [count, setCount] = useState(5);
  const [maxArrival, setMaxArrival] = useState(8);
  const [maxBurst, setMaxBurst] = useState(10);
  const [maxPriority, setMaxPriority] = useState(5);

  if (!isOpen) return null;

  const handleGenerate = () => {
    const generated = generateRandomProcesses(count, maxArrival, maxBurst, maxPriority);
    onGenerate(generated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 font-sans">
      <div className="bg-slate-900 border border-slate-800 rounded w-full max-w-md shadow-2xl overflow-hidden animate-fadeIn">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Shuffle className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white font-mono uppercase">Generate Synthetic Workload</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs">
          {/* Process Count */}
          <div className="space-y-1.5">
            <div className="flex justify-between font-medium">
              <span className="text-slate-300">Process Count:</span>
              <span className="text-blue-400 font-mono font-bold">{count} tasks</span>
            </div>
            <input
              type="range"
              min="2"
              max="12"
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value, 10))}
              className="w-full accent-blue-500 cursor-pointer"
            />
          </div>

          {/* Max Arrival Time */}
          <div className="space-y-1.5">
            <div className="flex justify-between font-medium">
              <span className="text-slate-300">Max Arrival Time:</span>
              <span className="text-blue-400 font-mono font-bold">{maxArrival} units</span>
            </div>
            <input
              type="range"
              min="0"
              max="20"
              value={maxArrival}
              onChange={(e) => setMaxArrival(parseInt(e.target.value, 10))}
              className="w-full accent-blue-500 cursor-pointer"
            />
          </div>

          {/* Max Burst Time */}
          <div className="space-y-1.5">
            <div className="flex justify-between font-medium">
              <span className="text-slate-300">Max Burst Time:</span>
              <span className="text-blue-400 font-mono font-bold">{maxBurst} units</span>
            </div>
            <input
              type="range"
              min="2"
              max="25"
              value={maxBurst}
              onChange={(e) => setMaxBurst(parseInt(e.target.value, 10))}
              className="w-full accent-blue-500 cursor-pointer"
            />
          </div>

          {/* Max Priority */}
          <div className="space-y-1.5">
            <div className="flex justify-between font-medium">
              <span className="text-slate-300">Max Priority Range:</span>
              <span className="text-amber-400 font-mono font-bold">1 to {maxPriority}</span>
            </div>
            <input
              type="range"
              min="2"
              max="10"
              value={maxPriority}
              onChange={(e) => setMaxPriority(parseInt(e.target.value, 10))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleGenerate}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition flex items-center gap-1.5 shadow-md shadow-blue-500/20"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Generate Workload</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
