import React from 'react';
import { NotificationAlert } from '../types';
import { ShieldCheck, ShieldAlert, AlertTriangle, Info, X, RefreshCw } from 'lucide-react';

interface NotificationBannerProps {
  alert: NotificationAlert | null;
  onDismiss: () => void;
  onAction?: () => void;
}

export const NotificationBanner: React.FC<NotificationBannerProps> = ({
  alert,
  onDismiss,
  onAction,
}) => {
  if (!alert) return null;

  const isSuccess = alert.type === 'success';
  const isWarning = alert.type === 'warning';
  const isAlert = alert.type === 'alert';

  const bgStyles = isSuccess
    ? 'bg-emerald-950/40 border-emerald-800/70 text-emerald-100'
    : isWarning
    ? 'bg-amber-950/40 border-amber-800/70 text-amber-100'
    : isAlert
    ? 'bg-rose-950/40 border-rose-800/70 text-rose-100'
    : 'bg-slate-900 border-slate-750 text-slate-200';

  const iconColor = isSuccess
    ? 'text-emerald-400'
    : isWarning
    ? 'text-amber-400'
    : isAlert
    ? 'text-rose-400'
    : 'text-blue-400';

  return (
    <div
      className={`border rounded-lg p-3 sm:px-4 sm:py-3 shadow-md flex items-center justify-between gap-3 text-xs transition-all animate-fadeIn ${bgStyles}`}
      role="alert"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className={`shrink-0 ${iconColor}`}>
          {isSuccess && <ShieldCheck className="w-4 h-4" />}
          {isWarning && <AlertTriangle className="w-4 h-4" />}
          {isAlert && <ShieldAlert className="w-4 h-4" />}
          {!isSuccess && !isWarning && !isAlert && <Info className="w-4 h-4" />}
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold tracking-tight text-white font-sans text-xs">
              {alert.title}
            </span>
            <span className="text-[10px] font-mono text-slate-400 opacity-80">
              [{alert.timestamp}]
            </span>
          </div>
          <p className="text-[11px] text-slate-300 truncate sm:whitespace-normal mt-0.5">
            {alert.message}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {alert.actionLabel && (
          <button
            onClick={() => {
              if (alert.onAction) alert.onAction();
              else if (onAction) onAction();
            }}
            className="px-2.5 py-1 text-[11px] font-medium font-sans rounded bg-slate-800/80 hover:bg-slate-750 text-white border border-slate-650 hover:border-slate-500 transition flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3 text-blue-400" />
            <span>{alert.actionLabel}</span>
          </button>
        )}

        <button
          onClick={onDismiss}
          className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition"
          aria-label="Dismiss notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
