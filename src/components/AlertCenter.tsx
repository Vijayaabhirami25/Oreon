import React, { useState } from 'react';
import {
  AlertOctagon,
  AlertTriangle,
  Info,
  CheckCircle,
  Bell,
  Clock,
} from 'lucide-react';
import { AlertItem, AlertSeverity } from '../types/mineguard';

interface AlertCenterProps {
  alerts: AlertItem[];
  onAcknowledgeAlert: (id: string) => void;
  onAcknowledgeAll: () => void;
}

export const AlertCenter: React.FC<AlertCenterProps> = ({
  alerts,
  onAcknowledgeAlert,
  onAcknowledgeAll,
}) => {
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'ACKNOWLEDGED'>('ALL');

  const filteredAlerts = alerts.filter((alert) => {
    if (filter === 'ACTIVE') return alert.status === 'ACTIVE';
    if (filter === 'ACKNOWLEDGED') return alert.status === 'ACKNOWLEDGED';
    return true;
  });

  const activeCount = alerts.filter((a) => a.status === 'ACTIVE').length;

  const getSeverityBadge = (severity: AlertSeverity) => {
    switch (severity) {
      case 'CRITICAL':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-950/80 border border-red-500 text-red-300">
            <AlertOctagon className="w-3 h-3 text-red-400" />
            CRITICAL
          </span>
        );
      case 'WARNING':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-amber-950/80 border border-amber-500 text-amber-300">
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            WARNING
          </span>
        );
      case 'INFO':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-blue-950/80 border border-blue-500 text-blue-300">
            <Info className="w-3 h-3 text-blue-400" />
            INFO
          </span>
        );
    }
  };

  return (
    <div id="alert-center-card" className="industrial-card p-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-white tracking-wide">HAZARD ALERT CENTER</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950/80 border border-red-600/50 text-red-300">
                SIMULATED ALARMS
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Active Hazard Conditions & Operator Action Required
            </p>
          </div>
        </div>

        {/* Filter Tabs & Acknowledge All Button */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center bg-slate-900/90 rounded-lg p-0.5 border border-slate-800 text-xs font-mono">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-2.5 py-1 rounded transition-colors ${
                filter === 'ALL'
                  ? 'bg-slate-700/80 text-white font-medium'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({alerts.length})
            </button>
            <button
              onClick={() => setFilter('ACTIVE')}
              className={`px-2.5 py-1 rounded transition-colors ${
                filter === 'ACTIVE'
                  ? 'bg-red-900/60 text-red-200 font-medium'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Active ({activeCount})
            </button>
            <button
              onClick={() => setFilter('ACKNOWLEDGED')}
              className={`px-2.5 py-1 rounded transition-colors ${
                filter === 'ACKNOWLEDGED'
                  ? 'bg-slate-700/80 text-white font-medium'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Ack'd ({alerts.length - activeCount})
            </button>
          </div>

          {activeCount > 0 && (
            <button
              onClick={onAcknowledgeAll}
              className="px-2.5 py-1 rounded text-xs font-mono bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-colors"
            >
              Acknowledge All
            </button>
          )}
        </div>
      </div>

      {/* Alert List */}
      <div className="mt-3.5 divide-y divide-slate-800/80 max-h-[340px] overflow-y-auto pr-1">
        {filteredAlerts.length === 0 ? (
          <div className="py-8 text-center text-slate-500 text-xs font-mono">
            <CheckCircle className="w-8 h-8 text-emerald-500/40 mx-auto mb-2" />
            No alerts currently in this view. All simulated conditions nominal.
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const isActive = alert.status === 'ACTIVE';
            const isCritical = alert.severity === 'CRITICAL';

            return (
              <div
                key={alert.id}
                className={`py-3 px-3 transition-colors rounded-lg my-1 ${
                  isActive && isCritical
                    ? 'bg-red-950/40 border border-red-500/60 shadow-sm animate-pulse-subtle'
                    : isActive
                    ? 'bg-amber-950/20 border border-amber-500/40'
                    : 'bg-slate-900/20 opacity-70 border border-transparent'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-start gap-2.5">
                    <div className="mt-0.5">{getSeverityBadge(alert.severity)}</div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-semibold text-slate-200 font-mono">
                          {alert.type}
                        </span>
                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${
                            isActive
                              ? 'bg-red-950/60 border-red-600/50 text-red-300 font-bold'
                              : 'bg-slate-800 border-slate-700 text-slate-400'
                          }`}
                        >
                          {alert.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1 leading-snug">
                        {alert.description}
                      </p>
                    </div>
                  </div>

                  {/* Timestamp & Acknowledge Button */}
                  <div className="flex items-center gap-3 sm:self-center flex-shrink-0 font-mono text-xs">
                    <div className="flex items-center gap-1 text-slate-400 text-[11px]">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>{alert.timestamp}</span>
                    </div>

                    {isActive ? (
                      <button
                        onClick={() => onAcknowledgeAlert(alert.id)}
                        className="px-2.5 py-1 rounded text-xs font-medium bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 transition-colors whitespace-nowrap"
                      >
                        Acknowledge
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-500 italic">
                        Ack'd {alert.acknowledgedAt || ''}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
