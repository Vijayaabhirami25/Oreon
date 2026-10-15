import React, { useState } from 'react';
import {
  Radio,
  Wifi,
  WifiOff,
  CheckCircle2,
  AlertOctagon,
  Send,
  DownloadCloud,
  FileText,
  Activity,
  Sparkles,
} from 'lucide-react';
import { CommState, PacketRecord, TelemetryPoint, DemoScenarioType } from '../../types/mineguard';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface LoraCommPageProps {
  comm: CommState;
  recentPackets: PacketRecord[];
  telemetryHistory: TelemetryPoint[];
  onTriggerScenario: (scenario: DemoScenarioType) => void;
}

export const LoraCommPage: React.FC<LoraCommPageProps> = ({
  comm,
  recentPackets,
  telemetryHistory,
  onTriggerScenario,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;
  const isConnected = comm.status === 'CONNECTED';

  const totalPages = Math.ceil(recentPackets.length / pageSize) || 1;
  const paginatedPackets = recentPackets.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="pb-2 border-b border-[#E5E7EB]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-[#171A21] flex items-center gap-2">
              <Radio className="w-5 h-5 text-[#06B6D4]" />
              Proposed LoRa Inter-Zone Communication Link
            </h2>
            <p className="text-xs text-[#697386] mt-0.5">
              Simulated wireless telemetry link between Zone A (Sensor Pod) and Zone B (Safety Controller).
            </p>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-100 text-[#697386] border border-slate-200 self-start sm:self-auto">
            Channel: Proposed 2.4GHz / Sub-GHz LoRa
          </span>
        </div>

        {/* Notice */}
        <div className="mt-3 p-2.5 rounded bg-cyan-50/70 border border-cyan-200 text-xs text-cyan-900 flex items-center gap-2">
          <Wifi className="w-4 h-4 text-cyan-600 flex-shrink-0" />
          <span>
            <strong>PROPOSED WIRELESS ARCHITECTURE:</strong> The inter-zone RF link, packet delivery rate, and drop calculations are simulated in software. Hardware radio transceivers, frequency registers, and physical RSSI/SNR characterization are scheduled for underground empirical tests.
          </span>
        </div>
      </div>

      {/* RF Link Fault Injection Bar */}
      <div className="ciklum-card p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#FF3B30]" />
            <h3 className="text-sm font-bold text-[#171A21]">RF Link Test Controls</h3>
          </div>
          <span className="text-[11px] text-[#697386]">Simulate wireless degradation & reconnect recovery</span>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => onTriggerScenario('COMM_FAILURE')}
            className={`px-4 py-2 rounded-md text-xs font-semibold flex items-center gap-2 border transition-all ${
              !isConnected
                ? 'bg-red-100 border-red-300 text-red-900 ring-1 ring-red-400'
                : 'bg-white border-red-200 text-red-700 hover:bg-red-50'
            }`}
          >
            <WifiOff className="w-4 h-4" />
            <span>Simulate LoRa Communication Failure</span>
          </button>

          <button
            onClick={() => onTriggerScenario('RESTORE_COMM')}
            className={`px-4 py-2 rounded-md text-xs font-semibold flex items-center gap-2 border transition-all ${
              isConnected
                ? 'bg-emerald-100 border-emerald-300 text-emerald-900 ring-1 ring-emerald-400'
                : 'bg-white border-emerald-200 text-emerald-700 hover:bg-emerald-50'
            }`}
          >
            <Wifi className="w-4 h-4" />
            <span>Restore LoRa Communication</span>
          </button>
        </div>
      </div>

      {/* Section A: Live Connection Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {/* Link Status */}
        <div className="ciklum-card p-4">
          <div className="flex items-center justify-between text-xs text-[#697386]">
            <span className="font-semibold text-[#171A21]">Link State</span>
            <span className="text-[10px] font-mono text-[#697386]">Proposed RF</span>
          </div>
          <div className="text-xl font-bold font-mono-num mt-2 flex items-center gap-2">
            {isConnected ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span className="text-emerald-700">CONNECTED</span>
              </>
            ) : (
              <>
                <AlertOctagon className="w-5 h-5 text-red-600 animate-pulse" />
                <span className="text-red-700">DISCONNECTED</span>
              </>
            )}
          </div>
          <div className="text-xs text-[#697386] mt-2 pt-2 border-t border-slate-100">
            Simulated Quality: <strong className="text-[#171A21]">{comm.qualitySimulated}</strong>
          </div>
        </div>

        {/* Packets Sent */}
        <div className="ciklum-card p-4">
          <div className="flex items-center justify-between text-xs text-[#697386]">
            <span className="font-semibold text-[#171A21] flex items-center gap-1.5">
              <Send className="w-3.5 h-3.5 text-[#2563EB]" />
              Packets Transmitted
            </span>
            <span className="text-[10px] font-mono text-[#697386]">Zone A</span>
          </div>
          <div className="text-2xl font-bold font-mono-num text-[#171A21] mt-2">
            {comm.packetsSent}
          </div>
          <div className="text-xs text-[#697386] mt-2 pt-2 border-t border-slate-100">
            Last Tx: <strong className="text-[#171A21] font-mono">{comm.lastPacketTime || 'None'}</strong>
          </div>
        </div>

        {/* Packets Received */}
        <div className="ciklum-card p-4">
          <div className="flex items-center justify-between text-xs text-[#697386]">
            <span className="font-semibold text-[#171A21] flex items-center gap-1.5">
              <DownloadCloud className="w-3.5 h-3.5 text-emerald-600" />
              Packets Validated
            </span>
            <span className="text-[10px] font-mono text-[#697386]">Zone B</span>
          </div>
          <div className="text-2xl font-bold font-mono-num text-emerald-700 mt-2">
            {comm.packetsReceived}
          </div>
          <div className="text-xs text-[#697386] mt-2 pt-2 border-t border-slate-100">
            Dropped: <strong className="text-red-700 font-mono">{comm.packetsLost} pkts</strong>
          </div>
        </div>

        {/* Delivery Rate */}
        <div className="ciklum-card p-4">
          <div className="flex items-center justify-between text-xs text-[#697386]">
            <span className="font-semibold text-[#171A21]">Delivery Rate</span>
            <span className="text-[10px] font-mono text-[#697386]">Reliability</span>
          </div>
          <div className="text-2xl font-bold font-mono-num text-[#171A21] mt-2">
            {comm.deliveryRate.toFixed(1)}%
          </div>
          <div className="text-xs text-[#697386] mt-2 pt-2 border-t border-slate-100">
            Success Ratio: <strong className="text-[#171A21] font-mono">{comm.packetsReceived}/{comm.packetsSent}</strong>
          </div>
        </div>
      </div>

      {/* Section B: Packet Flow Visualizer */}
      <div className="ciklum-card p-4">
        <h3 className="text-sm font-bold text-[#171A21] mb-2 flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#06B6D4]" />
          Inter-Unit Packet Transmission Channel
        </h3>
        <div className="p-4 rounded-lg bg-[#F8FAFC] border border-[#E5E7EB] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
              ZONE A
            </div>
            <div>
              <div className="text-xs font-bold text-[#171A21]">Sensor Pod Transmitter</div>
              <div className="text-[11px] text-[#697386]">Brim Mount • Packets formatted & queued</div>
            </div>
          </div>

          {/* Animated Wave channel */}
          <div className="flex-1 mx-6 flex flex-col items-center">
            <div className="flex items-center gap-2 w-full justify-center">
              <span className={`w-3 h-3 rounded-full ${isConnected ? 'bg-emerald-500 animate-ping' : 'bg-red-500'}`} />
              <div className={`h-1 flex-1 border-b-2 ${isConnected ? 'border-dashed border-cyan-400' : 'border-solid border-red-300'}`} />
              <Radio className={`w-5 h-5 ${isConnected ? 'text-cyan-600' : 'text-red-500'}`} />
              <div className={`h-1 flex-1 border-b-2 ${isConnected ? 'border-dashed border-cyan-400' : 'border-solid border-red-300'}`} />
              <span className={`w-3 h-3 rounded-full ${isConnected ? 'bg-cyan-500 animate-pulse' : 'bg-red-500'}`} />
            </div>
            <span className={`text-[11px] font-mono mt-1 ${isConnected ? 'text-cyan-700' : 'text-red-700 font-bold'}`}>
              {isConnected ? 'Simulated LoRa Carrier Wave Active' : 'RF Carrier Severed — Receiver Timeout'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div>
              <div className="text-xs font-bold text-[#171A21] text-right">Zone B Receiver</div>
              <div className="text-[11px] text-[#697386] text-right">Safety Controller • Checksum verified</div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs">
              ZONE B
            </div>
          </div>
        </div>
      </div>

      {/* Section C: Communication Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Packet Delivery Rate Chart */}
        <div className="ciklum-card p-4">
          <h3 className="text-sm font-bold text-[#171A21] mb-1">Packet Delivery Rate Over Time (%)</h3>
          <p className="text-[11px] text-[#697386] mb-3">Reflects simulated RF outages and recovery</p>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={telemetryHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F2F5" />
                <XAxis dataKey="timeStr" tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                <YAxis domain={[0, 105]} tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB', borderRadius: '6px', fontSize: '11px' }} />
                <Line type="stepAfter" dataKey="packetDeliveryRate" stroke="#06B6D4" strokeWidth={2.5} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Packets Sent vs Received Cumulative */}
        <div className="ciklum-card p-4">
          <h3 className="text-sm font-bold text-[#171A21] mb-1">Packets Sent vs Received</h3>
          <p className="text-[11px] text-[#697386] mb-3">Comparing Zone A transmitted vs Zone B received</p>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={telemetryHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F2F5" />
                <XAxis dataKey="timeStr" tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                <YAxis domain={['auto', 'auto']} tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB', borderRadius: '6px', fontSize: '11px' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Line type="monotone" name="Sent (Zone A)" dataKey="packetsSent" stroke="#2563EB" strokeWidth={2} dot={false} isAnimationActive={false} />
                <Line type="monotone" name="Received (Zone B)" dataKey="packetsReceived" stroke="#10B981" strokeWidth={2} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Section D: Recent Packet History Table */}
      <div className="ciklum-card p-4">
        <div className="flex items-center justify-between mb-3 border-b border-[#E5E7EB] pb-2">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#2563EB]" />
            <h3 className="text-sm font-bold text-[#171A21]">Recent LoRa Packet Transmissions</h3>
            <span className="text-xs text-[#697386]">({recentPackets.length} total logged)</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[#E5E7EB] bg-[#F8FAFC] text-[#697386]">
                <th className="py-2.5 px-3">Packet ID</th>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Source → Dest</th>
                <th className="py-2.5 px-3">Gas (ppm)</th>
                <th className="py-2.5 px-3">Temp (°C)</th>
                <th className="py-2.5 px-3">IMU Status</th>
                <th className="py-2.5 px-3">Tx Outcome</th>
                <th className="py-2.5 px-3">Validation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {paginatedPackets.map((pkt) => (
                <tr key={pkt.packetId} className="hover:bg-slate-50 transition-colors">
                  <td className="py-2 px-3 font-bold text-[#171A21]">#{pkt.packetId}</td>
                  <td className="py-2 px-3 text-[#697386]">{pkt.timestamp}</td>
                  <td className="py-2 px-3 text-[#4A5568]">Zone A → Zone B</td>
                  <td className="py-2 px-3">{pkt.gasLevel.toFixed(1)}</td>
                  <td className="py-2 px-3">{pkt.temperature.toFixed(1)}</td>
                  <td className="py-2 px-3">
                    {pkt.fallDetected ? (
                      <span className="px-1.5 py-0.2 rounded bg-red-100 text-red-800 font-bold">FALL</span>
                    ) : (
                      <span className="text-slate-500">Normal</span>
                    )}
                  </td>
                  <td className="py-2 px-3">
                    <span
                      className={`px-1.5 py-0.2 rounded font-bold ${
                        pkt.transmissionOutcome === 'SENT'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-red-50 text-red-700'
                      }`}
                    >
                      {pkt.transmissionOutcome}
                    </span>
                  </td>
                  <td className="py-2 px-3">
                    <span
                      className={`px-1.5 py-0.2 rounded font-bold ${
                        pkt.validationResult === 'PASSED'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-red-50 text-red-700'
                      }`}
                    >
                      {pkt.validationResult}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between pt-3 mt-2 border-t border-[#E5E7EB] text-xs">
          <span className="text-[#697386]">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-2.5 py-1 rounded border border-[#E5E7EB] bg-white text-[#171A21] disabled:opacity-40"
            >
              Previous
            </button>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-2.5 py-1 rounded border border-[#E5E7EB] bg-white text-[#171A21] disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
