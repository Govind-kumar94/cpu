import React from 'react';
import { AlgorithmName } from '../types';
import { BookOpen, CheckCircle, AlertTriangle, ArrowRight, Zap, Calculator, Clock, Layers } from 'lucide-react';

interface AlgorithmGuideProps {
  onSelectAndLaunch: (algo: AlgorithmName) => void;
}

interface GuideItem {
  name: AlgorithmName;
  type: 'Non-Preemptive' | 'Preemptive';
  summary: string;
  howItWorks: string;
  advantages: string[];
  disadvantages: string[];
  idealFor: string;
}

const ALGO_GUIDES: GuideItem[] = [
  {
    name: 'FCFS',
    type: 'Non-Preemptive',
    summary: 'Executes processes strictly in the order they arrive in the ready queue.',
    howItWorks: 'The CPU is allocated to the process that requested it first. Once allocated, the process retains control until it completes its CPU burst or terminates.',
    advantages: [
      'Simple and intuitive to implement using a FIFO queue',
      'Minimal scheduling overhead with zero preemption context switches',
      'Guarantees all processes eventually execute without starvation',
    ],
    disadvantages: [
      'Suffers from the Convoy Effect where short processes wait behind long-running tasks',
      'Average waiting time is typically high and highly sensitive to arrival sequence',
      'Not suitable for interactive or multi-user operating systems',
    ],
    idealFor: 'Batch systems where arrival order is paramount and interactive latency is not critical.',
  },
  {
    name: 'SJF',
    type: 'Non-Preemptive',
    summary: 'Selects the waiting process with the smallest CPU burst time.',
    howItWorks: 'When the CPU becomes available, the dispatcher examines all arrived ready tasks and assigns the CPU to the task with the lowest burst duration. Ties are broken by arrival time.',
    advantages: [
      'Provably optimal for minimizing average waiting time among non-preemptive algorithms',
      'Increases system throughput by quickly clearing short tasks from the queue',
      'Reduces the number of concurrently waiting tasks',
    ],
    disadvantages: [
      'Requires prior knowledge or prediction of future CPU burst lengths',
      'Long-burst processes may suffer starvation if short jobs arrive continuously',
      'Cannot react immediately when an urgent short job arrives during a long burst',
    ],
    idealFor: 'Long-term job scheduling where execution durations can be estimated from historical job profiles.',
  },
  {
    name: 'SJF Preemptive',
    type: 'Preemptive',
    summary: 'Also known as Shortest Remaining Time First (SRTF). Preempts if a new task has a shorter remaining burst.',
    howItWorks: 'At every clock tick or arrival event, the remaining burst time of the currently running process is compared against all newly arrived processes. If an arrived process needs less time than the current job has remaining, the current job is preempted and returned to the ready queue.',
    advantages: [
      'Achieves the lowest average turnaround and waiting times of all scheduling algorithms',
      'Provides excellent responsiveness to brief, interactive user requests',
      'Short tasks are never trapped behind long-running calculations',
    ],
    disadvantages: [
      'Frequent preemption increases context switching overhead',
      'Requires constant monitoring of remaining execution cycles',
      'Severe starvation risk for long processes under heavy workloads',
    ],
    idealFor: 'Time-critical computing where minimal average response and turnaround times are strictly required.',
  },
  {
    name: 'Priority',
    type: 'Non-Preemptive',
    summary: 'Allocates the CPU to the process with the highest priority rank (lower numerical integer = higher priority).',
    howItWorks: 'Each process is assigned an integer priority level. When a scheduling decision occurs, the process with the highest priority among ready tasks is chosen and allowed to run to completion.',
    advantages: [
      'Enables explicit differentiation between critical system services and background jobs',
      'Provides predictable execution order based on administrative policy',
      'Straightforward to configure with static priority assignments',
    ],
    disadvantages: [
      'Low priority processes may starve indefinitely under continuous high-priority traffic',
      'Vulnerable to priority inversion if lower priority tasks hold shared resources',
      'Does not consider process duration or optimal turnaround efficiency',
    ],
    idealFor: 'Specialized controller systems where task urgency is predetermined and non-negotiable.',
  },
  {
    name: 'Priority Preemptive',
    type: 'Preemptive',
    summary: 'Immediately halts the running process if a higher priority task enters the ready queue.',
    howItWorks: 'Whenever a process arrives with a priority value strictly higher than the currently executing process, the CPU immediately preempts the active thread and context-switches to the newly arrived task.',
    advantages: [
      'Guarantees immediate CPU access for urgent hardware interrupts or critical system events',
      'Minimizes response latency for top-priority threads',
      'Essential for real-time operating system constraints',
    ],
    disadvantages: [
      'Increased context switch frequency and cache invalidation costs',
      'Starvation risk remains acute unless priority aging is implemented',
      'Complexity in preserving thread execution states across preemption boundaries',
    ],
    idealFor: 'Hard and soft real-time operating systems, industrial process control, and audio processing daemons.',
  },
  {
    name: 'Round Robin',
    type: 'Preemptive',
    summary: 'Cyclic scheduling where each ready process receives a fixed slice of CPU time (quantum).',
    howItWorks: 'The ready queue is maintained as a circular FIFO list. The scheduler allocates the CPU to the first process for up to one time quantum (q). If the process burst exceeds the quantum, it is preempted and appended to the back of the queue. If it finishes before the quantum expires, the next task runs immediately.',
    advantages: [
      'Guarantees absolute fairness: no process can monopolize the CPU',
      'Completely prevents process starvation without requiring priority aging',
      'Provides consistent, predictable response times for all interactive users',
    ],
    disadvantages: [
      'Performance depends heavily on time quantum size selection',
      'If quantum is too small: excessive context switching degrades CPU efficiency',
      'If quantum is too large: degenerates into First-Come First-Served behavior',
    ],
    idealFor: 'General-purpose interactive operating systems, web application servers, and multi-user environments.',
  },
];

export const AlgorithmGuide: React.FC<AlgorithmGuideProps> = ({ onSelectAndLaunch }) => {
  return (
    <div className="space-y-8 animate-fadeIn text-slate-100 max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center gap-2 text-xs font-mono text-blue-400 uppercase tracking-wider mb-1">
          <BookOpen className="w-4 h-4" />
          <span>Technical Reference</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
          Operating System Scheduling Algorithms
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl">
          Comprehensive reference guide explaining queue management, preemption mechanics, 
          mathematical definitions, and trade-offs across all six supported CPU scheduling algorithms.
        </p>
      </div>

      {/* Mathematical Formulas Section */}
      <div className="bg-slate-900 border border-slate-800 rounded p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Calculator className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Core Scheduling Equations & Metrics
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          <div className="bg-slate-950 p-3 rounded border border-slate-800 font-mono space-y-1">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-sans font-semibold">
              Turnaround Time (TAT)
            </span>
            <div className="text-emerald-400 font-bold text-sm">
              TAT = Completion Time - Arrival Time
            </div>
            <p className="text-[11px] text-slate-400 font-sans">
              Total elapsed duration from task arrival to final completion.
            </p>
          </div>

          <div className="bg-slate-950 p-3 rounded border border-slate-800 font-mono space-y-1">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-sans font-semibold">
              Waiting Time (WT)
            </span>
            <div className="text-blue-400 font-bold text-sm">
              WT = Turnaround Time - Burst Time
            </div>
            <p className="text-[11px] text-slate-400 font-sans">
              Total duration a process spent sitting in the ready queue.
            </p>
          </div>

          <div className="bg-slate-950 p-3 rounded border border-slate-800 font-mono space-y-1">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-sans font-semibold">
              Response Time (RT)
            </span>
            <div className="text-amber-400 font-bold text-sm">
              RT = First Execution Time - Arrival Time
            </div>
            <p className="text-[11px] text-slate-400 font-sans">
              Time elapsed from submission until the CPU first begins executing the task.
            </p>
          </div>

          <div className="bg-slate-950 p-3 rounded border border-slate-800 font-mono space-y-1">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-sans font-semibold">
              CPU Utilization
            </span>
            <div className="text-blue-300 font-bold text-sm">
              Utilization = (Total Busy Time / Finish Time) * 100
            </div>
            <p className="text-[11px] text-slate-400 font-sans">
              Percentage of total simulation time the CPU spent actively running tasks.
            </p>
          </div>

          <div className="bg-slate-950 p-3 rounded border border-slate-800 font-mono space-y-1">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-sans font-semibold">
              Throughput
            </span>
            <div className="text-cyan-400 font-bold text-sm">
              Throughput = Total Completed Tasks / Finish Time
            </div>
            <p className="text-[11px] text-slate-400 font-sans">
              Number of processes completed per unit of simulation time.
            </p>
          </div>

          <div className="bg-slate-950 p-3 rounded border border-slate-800 font-mono space-y-1">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-sans font-semibold">
              Round Robin Quantum Rule
            </span>
            <div className="text-slate-200 font-bold text-sm">
              80% of bursts &lt; Quantum (q)
            </div>
            <p className="text-[11px] text-slate-400 font-sans">
              Rule of thumb: 80% of CPU bursts should be shorter than time quantum q.
            </p>
          </div>
        </div>
      </div>

      {/* Individual Algorithm Detailed Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ALGO_GUIDES.map((algo) => (
          <div
            key={algo.name}
            className="bg-slate-900 border border-slate-800 rounded p-5 space-y-4 hover:border-slate-700 transition"
          >
            {/* Title & Preemption Badge */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">
                  {algo.name}
                </h3>
                <span className="text-[11px] text-slate-400">
                  {algo.summary}
                </span>
              </div>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-semibold border ${
                  algo.type === 'Preemptive'
                    ? 'bg-amber-950 text-amber-300 border-amber-800'
                    : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
              >
                {algo.type}
              </span>
            </div>

            {/* Mechanics */}
            <div className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded border border-slate-850">
              <span className="font-semibold text-slate-200 block mb-1 font-mono text-[10px] uppercase text-blue-400">
                Dispatch Mechanics:
              </span>
              {algo.howItWorks}
            </div>

            {/* Advantages and Disadvantages */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1.5">
                <span className="text-[10px] font-semibold text-emerald-400 uppercase font-mono flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  <span>Key Advantages</span>
                </span>
                <ul className="space-y-1 text-slate-300 text-[11px]">
                  {algo.advantages.map((adv, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-emerald-500 font-bold shrink-0">•</span>
                      <span>{adv}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] font-semibold text-rose-400 uppercase font-mono flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  <span>Key Limitations</span>
                </span>
                <ul className="space-y-1 text-slate-300 text-[11px]">
                  {algo.disadvantages.map((dis, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-rose-500 font-bold shrink-0">•</span>
                      <span>{dis}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Ideal Use Case */}
            <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800">
              <span className="text-slate-300 font-semibold">Typical Application: </span>
              <span>{algo.idealFor}</span>
            </div>

            {/* Launch in Dispatcher Action */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => onSelectAndLaunch(algo.name)}
                className="px-3 py-1.5 rounded text-xs font-semibold bg-slate-800 hover:bg-blue-600 text-slate-200 hover:text-white transition border border-slate-700 hover:border-blue-500 flex items-center gap-1.5"
              >
                <span>Simulate {algo.name}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
