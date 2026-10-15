import React, { useState } from 'react';
import { Terminal, Download, Trash2, CheckCircle2, AlertTriangle, AlertOctagon, Info } from 'lucide-react';
import { LogEvent } from '../types/mineguard';

interface EventLogProps {
  events: LogEvent[];
  onClearLog: () => void;
}

export const EventLog: React.FC<EventLogProps> = ({ events, onClearLog }) => {
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  const filteredEvents = events.filter((e) => {
    if (categoryFilter === 'ALL') return true;
    return e.category === categoryFilter;
  });

  const getEventIcon = (level: LogEvent['level']) => {
    switch (level) {
      case 'error':
        return <AlertOctagon className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />;
      case 'warn':
        return <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />;
      case 'success':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />;
      case 'info':
      default:
        return <Info className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />;
    }
  };

  const getCategoryBadgeClass = (category: LogEvent['category']) => {
    switch (category) {
      case 'ALERT':
        return 'bg-red-950/80 border-red-700/60 text-red-300';
      case 'LORA':
        return 'bg-cyan-950/80 border-cyan-700/60 text-cyan-300';
      case 'POWER':
        return 'bg-amber-950/80 border-amber-700/60 text-amber-300';
      case 'ZONE_A':
        return 'bg-emerald-950/80 border-emerald-700/60 text-emerald-300';
      case 'ZONE_B':
        return 'bg-blue-950/80 border-blue-700/60 text-blue-300';
      case 'SYSTEM':
      default:
        return 'bg-slate-800 border-slate-700 text-slate-300';
    }
  };

  const exportLogAsJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(events, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `oreon_simulation_log_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div id="event-log-card" className="industrial-card p-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-white tracking-wide">SYSTEM EVENT LOG</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400">
                Live Audit Trail
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Logic-Generated Architecture & Safety State Transitions
            </p>
          </div>
        </div>

        {/* Categories & Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center bg-slate-900/90 rounded-lg p-0.5 border border-slate-800 text-xs font-mono">
            {['ALL', 'ALERT', 'LORA', 'POWER', 'ZONE_A', 'ZONE_B'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-2 py-0.5 rounded transition-colors text-[11px] ${
                  categoryFilter === cat
                    ? 'bg-slate-700 text-white font-medium'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={exportLogAsJson}
              className="p-1.5 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Export event log as JSON"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onClearLog}
              className="p-1.5 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-red-300 transition-colors"
              title="Clear log history"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Log Feed */}
      <div className="mt-3 bg-charcoal-950/90 rounded-lg p-3 border border-slate-800/80 max-h-[320px] overflow-y-auto font-mono text-xs space-y-2">
        {filteredEvents.length === 0 ? (
          <div className="py-6 text-center text-slate-600 text-xs">
            No events recorded in this category yet.
          </div>
        ) : (
          filteredEvents.map((evt) => (
            <div
              key={evt.id}
              className="flex items-start gap-2.5 py-1 px-1.5 hover:bg-slate-900/60 rounded transition-colors"
            >
              <span className="text-[11px] text-slate-500 whitespace-nowrap pt-0.5">
                [{evt.timestamp}]
              </span>
              <span className="pt-0.5">{getEventIcon(evt.level)}</span>
              <span
                className={`text-[10px] uppercase font-semibold px-1.5 py-0.2 rounded border whitespace-nowrap ${getCategoryBadgeClass(
                  evt.category
                )}`}
              >
                {evt.category}
              </span>
              <span className="text-slate-200 text-[11px] leading-relaxed break-all">
                {evt.message}
              </span>
            </div>
          ))
        )}
      </div>
      <div className="mt-2 text-[10px] text-slate-500 font-mono text-right">
        Showing {filteredEvents.length} of {events.length} system events
      </div>
    </div>
  );
};
