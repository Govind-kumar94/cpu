import React, { useState } from 'react';
import { X, Upload, Download, FileText, Check, AlertCircle } from 'lucide-react';
import { Process, ScheduleResult } from '../types';
import {
  parseProcessesCSV,
  parseProcessesJSON,
  generateCSVReport,
  generateJSONReport,
  downloadFile,
} from '../core/io';

interface ImportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportProcesses: (processes: Process[]) => void;
  currentProcesses: Process[];
  scheduleResult: ScheduleResult;
  currentAlgorithm: string;
}

const SAMPLE_CSV = `PID,Arrival,Burst,Priority
P1,0,5,2
P2,1,3,1
P3,2,8,4
P4,3,6,2`;

export const ImportExportModal: React.FC<ImportExportModalProps> = ({
  isOpen,
  onClose,
  onImportProcesses,
  currentProcesses,
  scheduleResult,
  currentAlgorithm,
}) => {
  const [activeTab, setActiveTab] = useState<'import' | 'export'>('import');
  const [importText, setImportText] = useState('');
  const [importFormat, setImportFormat] = useState<'csv' | 'json'>('csv');
  const [statusMessage, setStatusMessage] = useState<{ text: string; isError: boolean } | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setImportText(content);
      if (file.name.endsWith('.json')) {
        setImportFormat('json');
      } else {
        setImportFormat('csv');
      }
    };
    reader.readAsText(file);
  };

  const handleImport = () => {
    try {
      let parsed: Process[] = [];
      if (importFormat === 'csv') {
        parsed = parseProcessesCSV(importText);
      } else {
        parsed = parseProcessesJSON(importText);
      }

      if (parsed.length === 0) {
        setStatusMessage({ text: 'No valid processes found. Check format and values.', isError: true });
        return;
      }

      onImportProcesses(parsed);
      setStatusMessage({ text: `Successfully loaded ${parsed.length} processes!`, isError: false });
      setTimeout(() => {
        onClose();
        setStatusMessage(null);
      }, 1000);
    } catch (err: any) {
      setStatusMessage({ text: err.message || 'Import parsing failed', isError: true });
    }
  };

  const handleExportCSV = () => {
    const content = generateCSVReport(scheduleResult, currentAlgorithm);
    downloadFile(`cpu-schedule-${currentAlgorithm.toLowerCase().replace(/\s+/g, '-')}.csv`, content, 'text/csv');
  };

  const handleExportJSON = () => {
    const content = generateJSONReport(scheduleResult, currentAlgorithm);
    downloadFile(`cpu-schedule-${currentAlgorithm.toLowerCase().replace(/\s+/g, '-')}.json`, content, 'application/json');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 font-sans">
      <div className="bg-slate-900 border border-slate-800 rounded w-full max-w-xl shadow-2xl overflow-hidden animate-fadeIn">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('import')}
              className={`text-sm font-bold pb-1 transition border-b-2 ${
                activeTab === 'import'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Import Workload
            </button>
            <button
              onClick={() => setActiveTab('export')}
              className={`text-sm font-bold pb-1 transition border-b-2 ${
                activeTab === 'export'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Export Results
            </button>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {activeTab === 'import' ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <label className="text-xs text-slate-400">Format:</label>
                  <select
                    value={importFormat}
                    onChange={(e) => setImportFormat(e.target.value as 'csv' | 'json')}
                    className="bg-slate-800 border border-slate-700 text-xs text-slate-200 rounded px-2 py-1 font-mono"
                  >
                    <option value="csv">CSV (Comma Separated)</option>
                    <option value="json">JSON Array</option>
                  </select>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setImportText(SAMPLE_CSV);
                    setImportFormat('csv');
                  }}
                  className="text-xs text-blue-400 hover:underline"
                >
                  Fill Sample CSV
                </button>
              </div>

              <div>
                <textarea
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  placeholder={
                    importFormat === 'csv'
                      ? 'PID,Arrival,Burst,Priority\nP1,0,4,1\nP2,1,5,2'
                      : '[{ "pid": "P1", "arrival": 0, "burst": 4, "priority": 1 }]'
                  }
                  rows={6}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* File upload drag drop alternative */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-400 hover:text-slate-200 bg-slate-800 px-3 py-1.5 rounded border border-slate-700 transition">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Choose CSV/JSON file</span>
                  <input
                    type="file"
                    accept=".csv,.json,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                <button
                  onClick={handleImport}
                  className="px-4 py-2 text-xs font-semibold rounded bg-blue-600 hover:bg-blue-500 text-white transition shadow-sm"
                >
                  Import Processes
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xs text-slate-400">
                Download currently evaluated metrics, process turnaround, waiting times, and timeline data.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={handleExportCSV}
                  className="flex flex-col items-center justify-center p-4 rounded bg-slate-800 hover:bg-slate-750 border border-slate-700 transition group text-center"
                >
                  <Download className="w-6 h-6 text-emerald-400 mb-2 group-hover:scale-105 transition" />
                  <span className="text-xs font-bold text-white">CSV Spreadsheet</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">Compatible with Excel</span>
                </button>

                <button
                  onClick={handleExportJSON}
                  className="flex flex-col items-center justify-center p-4 rounded bg-slate-800 hover:bg-slate-750 border border-slate-700 transition group text-center"
                >
                  <FileText className="w-6 h-6 text-blue-400 mb-2 group-hover:scale-105 transition" />
                  <span className="text-xs font-bold text-white">JSON Data</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">Raw structured data</span>
                </button>

                <button
                  onClick={handlePrint}
                  className="flex flex-col items-center justify-center p-4 rounded bg-slate-800 hover:bg-slate-750 border border-slate-700 transition group text-center"
                >
                  <Download className="w-6 h-6 text-indigo-400 mb-2 group-hover:scale-105 transition" />
                  <span className="text-xs font-bold text-white">Print / PDF Report</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">Summary document</span>
                </button>
              </div>
            </div>
          )}

          {statusMessage && (
            <div
              className={`mt-4 p-2.5 rounded text-xs flex items-center gap-2 ${
                statusMessage.isError
                  ? 'bg-red-950/40 text-red-400 border border-red-800'
                  : 'bg-emerald-950/40 text-emerald-400 border border-emerald-800'
              }`}
            >
              {statusMessage.isError ? <AlertCircle className="w-4 h-4" /> : <Check className="w-4 h-4" />}
              <span>{statusMessage.text}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
