import React, { useState } from 'react';
import {
  Bell,
  AlertOctagon,
  AlertTriangle,
  Info,
  CheckCircle,
  Search,
  CheckCheck,
} from 'lucide-react';
import { AlertItem, AlertSeverity, AlertStatus } from '../../types/mineguard';

interface AlertsPageProps {
  alerts: AlertItem[];
  onAcknowledgeAlert: (id: string) => void;
  onAcknowledgeAll: () => void;
}

export const AlertsPage: React.FC<AlertsPageProps> = ({
  alerts,
  onAcknowledgeAlert,
  onAcknowledgeAll,
}) => {
  const [severityFilter, setSeverityFilter] = useState<'ALL' | AlertSeverity>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | AlertStatus>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const activeCount = alerts.filter((a) => a.status === 'ACTIVE').length;
  const criticalCount = alerts.filter((a) => a.severity === 'CRITICAL' && a.status === 'ACTIVE').length;

  const filteredAlerts = alerts.filter((alert) => {
    if (severityFilter !== 'ALL' && alert.severity !== severityFilter) return false;
    if (statusFilter !== 'ALL' && alert.status !== statusFilter) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchType = alert.type.toLowerCase().includes(q);
      const matchDesc = alert.description.toLowerCase().includes(q);
      const matchZone = alert.relatedZone?.toLowerCase().includes(q);
      if (!matchType && !matchDesc && !matchZone) return false;
    }
    return true;
  });

  const getSeverityBadge = (sev: AlertSeverity) => {
    switch (sev) {
      case 'CRITICAL':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626]">
            <AlertOctagon className="w-3.5 h-3.5" />
            CRITICAL
          </span>
        );
      case 'WARNING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-[#FFFBEB] border border-[#FDE68A] text-[#D97706]">
            <AlertTriangle className="w-3.5 h-3.5" />
            WARNING
          </span>
        );
      case 'INFO':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-mono bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB]">
            <Info className="w-3.5 h-3.5" />
            INFO
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-[#E5E7EB] gap-2">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#171A21] flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#FF3B30]" />
            Safety Hazard Alert Center
          </h2>
          <p className="text-xs text-[#697386] mt-0.5">
            Deduplicated real-time hazard alarms, threshold violations, and supervisor acknowledgment queue.
          </p>
        </div>

        {activeCount > 0 && (
          <button
            onClick={onAcknowledgeAll}
            className="px-3.5 py-1.5 rounded-md bg-[#171A21] hover:bg-[#2D3748] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors self-start sm:self-auto"
          >
            <CheckCheck className="w-4 h-4 text-emerald-400" />
            <span>Acknowledge All ({activeCount})</span>
          </button>
        )}
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="ciklum-card p-4">
          <span className="text-xs text-[#697386] font-medium">Total Recorded Alerts</span>
          <div className="text-2xl font-bold font-mono-num text-[#171A21] mt-1">{alerts.length}</div>
        </div>
        <div className="ciklum-card p-4">
          <span className="text-xs text-[#697386] font-medium">Active Unacknowledged</span>
          <div className={`text-2xl font-bold font-mono-num mt-1 ${activeCount > 0 ? 'text-[#DC2626]' : 'text-emerald-700'}`}>
            {activeCount}
          </div>
        </div>
        <div className="ciklum-card p-4">
          <span className="text-xs text-[#697386] font-medium">Active Critical Hazards</span>
          <div className={`text-2xl font-bold font-mono-num mt-1 ${criticalCount > 0 ? 'text-[#DC2626]' : 'text-[#171A21]'}`}>
            {criticalCount}
          </div>
        </div>
        <div className="ciklum-card p-4">
          <span className="text-xs text-[#697386] font-medium">Historical Acknowledged</span>
          <div className="text-2xl font-bold font-mono-num text-[#171A21] mt-1">
            {alerts.length - activeCount}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="ciklum-card p-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Status Tabs */}
          <div className="flex items-center bg-slate-100 rounded-md p-0.5 text-xs font-mono">
            {(['ALL', 'ACTIVE', 'ACKNOWLEDGED'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded transition-colors ${
                  statusFilter === st
                    ? 'bg-white text-[#171A21] font-bold shadow-sm'
                    : 'text-[#697386] hover:text-[#171A21]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Severity Tabs */}
          <div className="flex items-center bg-slate-100 rounded-md p-0.5 text-xs font-mono">
            {(['ALL', 'CRITICAL', 'WARNING', 'INFO'] as const).map((sev) => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`px-3 py-1 rounded transition-colors ${
                  severityFilter === sev
                    ? 'bg-white text-[#171A21] font-bold shadow-sm'
                    : 'text-[#697386] hover:text-[#171A21]'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search alerts by type or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-md border border-[#E5E7EB] bg-white text-xs text-[#171A21] focus:outline-none focus:border-[#FF3B30]"
          />
        </div>
      </div>

      {/* Alerts Table */}
      <div className="ciklum-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E5E7EB] bg-[#F8FAFC] text-[#697386] font-mono">
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Alert Type</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Origin Zone</th>
                <th className="py-3 px-4">Sensor Reading</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {filteredAlerts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#697386]">
                    <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-50" />
                    No alerts found matching the current filter.
                  </td>
                </tr>
              ) : (
                filteredAlerts.map((alert) => {
                  const isActive = alert.status === 'ACTIVE';
                  const isCrit = alert.severity === 'CRITICAL';
                  return (
                    <tr
                      key={alert.id}
                      className={`hover:bg-slate-50/70 transition-colors ${
                        isActive && isCrit ? 'bg-red-50/25' : ''
                      }`}
                    >
                      <td className="py-3 px-4">{getSeverityBadge(alert.severity)}</td>
                      <td className="py-3 px-4 font-bold text-[#171A21] font-mono">{alert.type}</td>
                      <td className="py-3 px-4 text-[#4A5568] max-w-xs">{alert.description}</td>
                      <td className="py-3 px-4 font-mono text-[#697386]">{alert.relatedZone || 'ZONE_A'}</td>
                      <td className="py-3 px-4 font-mono font-semibold text-[#171A21]">
                        {alert.sensorValue || '—'}
                      </td>
                      <td className="py-3 px-4 font-mono text-[#697386] whitespace-nowrap">
                        {alert.timestamp}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            isActive
                              ? 'bg-red-100 text-red-800'
                              : 'bg-slate-100 text-[#697386]'
                          }`}
                        >
                          {alert.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        {isActive ? (
                          <button
                            onClick={() => onAcknowledgeAlert(alert.id)}
                            className="px-3 py-1 rounded bg-white hover:bg-slate-100 border border-[#D1D5DB] text-xs font-medium text-[#171A21] transition-colors"
                          >
                            Acknowledge
                          </button>
                        ) : (
                          <span className="text-[11px] text-[#9CA3AF] italic">
                            Ack'd {alert.acknowledgedAt || ''}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
