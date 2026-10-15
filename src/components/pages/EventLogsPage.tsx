import React, { useState } from 'react';
import {
  FileText,
  Download,
  Trash2,
  Search,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Info,
} from 'lucide-react';
import { LogEvent } from '../../types/mineguard';

interface EventLogsPageProps {
  events: LogEvent[];
  onClearLog: () => void;
}

export const EventLogsPage: React.FC<EventLogsPageProps> = ({ events, onClearLog }) => {
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [levelFilter, setLevelFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredEvents = events.filter((evt) => {
    if (categoryFilter !== 'ALL' && evt.category !== categoryFilter) return false;
    if (levelFilter !== 'ALL' && evt.level !== levelFilter) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchMsg = evt.message.toLowerCase().includes(q);
      const matchCat = evt.category.toLowerCase().includes(q);
      if (!matchMsg && !matchCat) return false;
    }
    return true;
  });

  const getLevelIcon = (level: LogEvent['level']) => {
    switch (level) {
      case 'error':
        return <AlertOctagon className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />;
      case 'warn':
        return <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />;
      case 'success':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />;
      case 'info':
      default:
        return <Info className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />;
    }
  };

  const exportAsJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(events, null, 2));
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = `oreon_event_log_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const exportAsCsv = () => {
    const headers = ['Timestamp', 'Category', 'Level', 'PacketId', 'Message'];
    const rows = events.map((e) => [
      `"${e.timestamp}"`,
      `"${e.category}"`,
      `"${e.level}"`,
      e.packetId || '',
      `"${e.message.replace(/"/g, '""')}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `oreon_event_log_${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-[#E5E7EB] gap-2">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#171A21] flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#2563EB]" />
            System Event Audit Trail
          </h2>
          <p className="text-xs text-[#697386] mt-0.5">
            Real-time chronological telemetry, packet transmission, hazard rule triggers, and supervisor actions.
          </p>
        </div>

        {/* Export & Actions */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={exportAsCsv}
            className="px-3 py-1.5 rounded-md border border-[#E5E7EB] bg-white hover:bg-slate-50 text-xs font-semibold text-[#171A21] flex items-center gap-1.5"
            title="Export event log as CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={exportAsJson}
            className="px-3 py-1.5 rounded-md border border-[#E5E7EB] bg-white hover:bg-slate-50 text-xs font-semibold text-[#171A21] flex items-center gap-1.5"
            title="Export event log as JSON"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>
          <button
            onClick={onClearLog}
            className="p-1.5 rounded-md border border-[#E5E7EB] bg-white hover:bg-red-50 text-[#697386] hover:text-red-700 transition-colors"
            title="Clear event log"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="ciklum-card p-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Category Tabs */}
          <div className="flex items-center bg-slate-100 rounded-md p-0.5 text-xs font-mono">
            {['ALL', 'ALERT', 'LORA', 'POWER', 'ZONE_A', 'ZONE_B', 'SYSTEM'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-2.5 py-1 rounded transition-colors text-[11px] ${
                  categoryFilter === cat
                    ? 'bg-white text-[#171A21] font-bold shadow-sm'
                    : 'text-[#697386] hover:text-[#171A21]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Level Tabs */}
          <div className="flex items-center bg-slate-100 rounded-md p-0.5 text-xs font-mono">
            {['ALL', 'info', 'warn', 'error', 'success'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setLevelFilter(lvl)}
                className={`px-2.5 py-1 rounded transition-colors text-[11px] uppercase ${
                  levelFilter === lvl
                    ? 'bg-white text-[#171A21] font-bold shadow-sm'
                    : 'text-[#697386] hover:text-[#171A21]'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search audit events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-md border border-[#E5E7EB] bg-white text-xs text-[#171A21] focus:outline-none focus:border-[#FF3B30]"
          />
        </div>
      </div>

      {/* Events Table */}
      <div className="ciklum-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[#E5E7EB] bg-[#F8FAFC] text-[#697386]">
                <th className="py-3 px-4 w-28">Timestamp</th>
                <th className="py-3 px-4 w-24">Severity</th>
                <th className="py-3 px-4 w-28">Category</th>
                <th className="py-3 px-4 w-24">Packet ID</th>
                <th className="py-3 px-4 font-sans">Event Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[#697386] font-sans">
                    No events found matching current filters.
                  </td>
                </tr>
              ) : (
                filteredEvents.map((evt) => (
                  <tr key={evt.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-4 text-[#697386] whitespace-nowrap">
                      [{evt.timestamp}]
                    </td>
                    <td className="py-2.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 uppercase text-[10px] font-bold">
                        {getLevelIcon(evt.level)}
                        <span className={
                          evt.level === 'error'
                            ? 'text-red-700'
                            : evt.level === 'warn'
                            ? 'text-amber-700'
                            : evt.level === 'success'
                            ? 'text-emerald-700'
                            : 'text-blue-700'
                        }>
                          {evt.level}
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-[#171A21] font-semibold text-[10px] uppercase border border-slate-200">
                        {evt.category}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-[#697386]">
                      {evt.packetId ? `#${evt.packetId}` : '—'}
                    </td>
                    <td className="py-2.5 px-4 font-sans text-[#171A21] text-xs">
                      {evt.message}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="text-right text-xs text-[#697386] font-mono">
        Showing {filteredEvents.length} of {events.length} audit entries
      </div>
    </div>
  );
};
