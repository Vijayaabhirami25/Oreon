import React, { useState } from 'react';
import {
  ShieldCheck,
  Radio,
  Battery,
  Zap,
  ArrowRight,
  Server,
  FileCode,
  ChevronDown,
  ChevronUp,
  Layers,
} from 'lucide-react';
import { ZoneBState, ThresholdConfig, PacketRecord, TelemetryPoint } from '../../types/mineguard';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

interface ZoneBPageProps {
  zoneB: ZoneBState;
  thresholds: ThresholdConfig;
  recentPackets: PacketRecord[];
  telemetryHistory: TelemetryPoint[];
}

export const ZoneBPage: React.FC<ZoneBPageProps> = ({
  zoneB,
  thresholds,
  recentPackets,
  telemetryHistory,
}) => {
  const [showLatestPacket, setShowLatestPacket] = useState<boolean>(true);
  const isPowerSaving = zoneB.powerMode === 'POWER SAVING';

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="pb-2 border-b border-[#E5E7EB]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-[#171A21] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#2563EB]" />
              Zone B — Safety Controller & Power Management Unit
            </h2>
            <p className="text-xs text-[#697386] mt-0.5">
              Simulated wireless packet reception, cryptographic validation, automated hazard analysis, and adaptive energy throttling.
            </p>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-100 text-[#697386] border border-slate-200 self-start sm:self-auto">
            Mounting: Helmet Rear / Battery Housing
          </span>
        </div>
      </div>

      {/* Section A: Receiver Status & Vital Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {/* Receiver State */}
        <div className="ciklum-card p-4">
          <div className="flex items-center justify-between text-xs text-[#697386]">
            <span className="font-semibold text-[#171A21] flex items-center gap-1.5">
              <Radio className="w-4 h-4 text-[#06B6D4]" />
              Receiver State
            </span>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                zoneB.rxStatus === 'RECEIVED_OK'
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-red-50 text-red-700'
              }`}
            >
              {zoneB.rxStatus}
            </span>
          </div>
          <div className="text-2xl font-bold font-mono-num text-[#171A21] mt-2">
            {zoneB.packetsReceived} <span className="text-xs font-normal text-[#697386]">pkts</span>
          </div>
          <div className="text-xs text-[#697386] mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
            <span>Validation:</span>
            <span className="font-mono font-bold text-emerald-700">{zoneB.packetValidation}</span>
          </div>
        </div>

        {/* Packets Lost */}
        <div className="ciklum-card p-4">
          <div className="flex items-center justify-between text-xs text-[#697386]">
            <span className="font-semibold text-[#171A21]">Packet Loss</span>
            <span className="text-[10px] font-mono text-[#697386]">RF Channel</span>
          </div>
          <div className={`text-2xl font-bold font-mono-num mt-2 ${zoneB.packetsLost > 0 ? 'text-red-700' : 'text-[#171A21]'}`}>
            {zoneB.packetsLost} <span className="text-xs font-normal text-[#697386]">dropped</span>
          </div>
          <div className="text-xs text-[#697386] mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
            <span>Timeout Count:</span>
            <span className="font-mono">{zoneB.packetsLost} events</span>
          </div>
        </div>

        {/* Battery Capacity */}
        <div className="ciklum-card p-4">
          <div className="flex items-center justify-between text-xs text-[#697386]">
            <span className="font-semibold text-[#171A21] flex items-center gap-1.5">
              <Battery className="w-4 h-4 text-[#10B981]" />
              Battery Capacity
            </span>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                isPowerSaving ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'
              }`}
            >
              {zoneB.batteryLevel.toFixed(1)}%
            </span>
          </div>
          <div className="text-2xl font-bold font-mono-num text-[#171A21] mt-2">
            {zoneB.batteryLevel.toFixed(1)}%
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${isPowerSaving ? 'bg-amber-500' : 'bg-emerald-500'}`}
              style={{ width: `${Math.min(100, Math.max(0, zoneB.batteryLevel))}%` }}
            />
          </div>
        </div>

        {/* Adaptive Power Mode */}
        <div className="ciklum-card p-4">
          <div className="flex items-center justify-between text-xs text-[#697386]">
            <span className="font-semibold text-[#171A21] flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-[#F59E0B]" />
              Power Policy
            </span>
            <span className="text-[10px] font-mono text-[#697386]">Adaptive</span>
          </div>
          <div className={`text-xl font-bold font-mono-num mt-2 ${isPowerSaving ? 'text-amber-800' : 'text-emerald-800'}`}>
            {zoneB.powerMode}
          </div>
          <div className="text-[11px] text-[#697386] mt-2 pt-2 border-t border-slate-100 truncate">
            {isPowerSaving ? `Throttled (<${thresholds.batteryLow}%)` : `Full rate (> ${thresholds.batteryLow}%)`}
          </div>
        </div>
      </div>

      {/* Section F: Automated System Response Controller */}
      <div className="ciklum-card p-4 bg-[#F8FAFC]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#171A21] flex items-center gap-2">
            <Server className="w-4 h-4 text-[#2563EB]" />
            Automated Safety Controller Decision
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white border border-slate-200 text-[#697386]">
            ZONE B RULE EVALUATOR
          </span>
        </div>
        <div className="p-3 bg-white rounded-md border border-[#E5E7EB] font-mono text-xs text-[#171A21] leading-relaxed shadow-sm">
          {zoneB.systemResponse}
        </div>
      </div>

      {/* Section B: Packet Processing Pipeline */}
      <div className="ciklum-card p-4">
        <h3 className="text-sm font-bold text-[#171A21] mb-2 flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#2563EB]" />
          Zone B Packet Processing Pipeline
        </h3>
        <div className="flex items-center justify-between text-xs font-mono text-[#4A5568] overflow-x-auto py-2 gap-2">
          <div className="p-2.5 rounded bg-slate-50 border border-slate-200 text-center flex-1 min-w-[130px]">
            <span className="text-[10px] text-[#9CA3AF] block font-sans">Stage 1</span>
            LoRa Rx (Simulated)
          </div>
          <ArrowRight className="w-4 h-4 text-[#9CA3AF] flex-shrink-0" />
          <div className="p-2.5 rounded bg-cyan-50 border border-cyan-200 text-cyan-900 text-center flex-1 min-w-[130px] font-semibold">
            <span className="text-[10px] text-cyan-600 block font-sans">Stage 2</span>
            Checksum Validation
          </div>
          <ArrowRight className="w-4 h-4 text-[#9CA3AF] flex-shrink-0" />
          <div className="p-2.5 rounded bg-amber-50 border border-amber-200 text-amber-900 text-center flex-1 min-w-[130px] font-semibold">
            <span className="text-[10px] text-amber-600 block font-sans">Stage 3</span>
            Hazard Rules Engine
          </div>
          <ArrowRight className="w-4 h-4 text-[#9CA3AF] flex-shrink-0" />
          <div className="p-2.5 rounded bg-blue-50 border border-blue-200 text-blue-900 text-center flex-1 min-w-[130px] font-semibold">
            <span className="text-[10px] text-blue-600 block font-sans">Stage 4</span>
            Safety Controller
          </div>
          <ArrowRight className="w-4 h-4 text-[#9CA3AF] flex-shrink-0" />
          <div className="p-2.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-900 text-center flex-1 min-w-[130px] font-semibold">
            <span className="text-[10px] text-emerald-600 block font-sans">Stage 5</span>
            Alerts & Power Mgmt
          </div>
        </div>
      </div>

      {/* Section D: Adaptive Power Management & Battery Discharge Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Battery Discharge Trend */}
        <div className="ciklum-card p-4">
          <h3 className="text-sm font-bold text-[#171A21] mb-1">Simulated Battery Discharge Trend (%)</h3>
          <p className="text-[11px] text-[#697386] mb-3">Gradual depletion curve with low-battery threshold trigger</p>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={telemetryHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="batteryGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F2F5" />
                <XAxis dataKey="timeStr" tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB', borderRadius: '6px', fontSize: '11px' }} />
                <ReferenceLine y={thresholds.batteryLow} stroke="#F59E0B" strokeDasharray="3 3" label={{ value: `Low Batt (${thresholds.batteryLow}%)`, fill: '#F59E0B', fontSize: 10 }} />
                <Area type="monotone" dataKey="battery" stroke="#10B981" strokeWidth={2} fill="url(#batteryGrad)" isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Adaptive Power Policy Explanation */}
        <div className="ciklum-card p-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#171A21] mb-2 flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#F59E0B]" />
              Adaptive Energy Policy Specification
            </h3>
            <div className="space-y-3 text-xs text-[#4A5568]">
              <div className="p-3 rounded-lg border border-[#E5E7EB] bg-[#FAFBFC]">
                <div className="font-bold text-[#171A21] flex items-center justify-between mb-1">
                  <span>NORMAL POWER MODE (&gt; {thresholds.batteryLow}%)</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    ACTIVE IF CAPACITY SAFE
                  </span>
                </div>
                <p className="text-[11px] text-[#697386]">
                  Full-rate environmental sensor sampling (1.5-second tick), continuous audio/visual strobe readiness, unconstrained inter-unit radio handshakes.
                </p>
              </div>

              <div className="p-3 rounded-lg border border-amber-200 bg-amber-50/50">
                <div className="font-bold text-amber-900 flex items-center justify-between mb-1">
                  <span>POWER SAVING MODE (&le; {thresholds.batteryLow}%)</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-200 text-amber-900">
                    THROTTLED MODE
                  </span>
                </div>
                <p className="text-[11px] text-[#697386]">
                  Adaptive sensor sampling relaxation, non-critical background telemetry suppression, preserved emergency strobe beacon, battery discharge rate reduced by 60%.
                </p>
              </div>
            </div>
          </div>
          <div className="text-[11px] text-[#9CA3AF] mt-3 pt-2 border-t border-slate-100">
            * Demonstrated as software simulation logic. Measured physical milliwatt dissipation will be evaluated during hardware PCB testing.
          </div>
        </div>
      </div>

      {/* Section E: Packet Inspector */}
      <div className="ciklum-card p-4">
        <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-[#2563EB]" />
            <h3 className="text-sm font-bold text-[#171A21]">Zone B Received Packet Inspector</h3>
          </div>
          <button
            onClick={() => setShowLatestPacket(!showLatestPacket)}
            className="p-1 rounded hover:bg-slate-100 text-[#4A5568]"
          >
            {showLatestPacket ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {showLatestPacket && (
          <div className="mt-3 space-y-4">
            {zoneB.lastPacket ? (
              <div className="bg-[#1A1D24] text-cyan-400 p-3 rounded-lg font-mono text-xs overflow-x-auto shadow-inner leading-relaxed">
                <pre>{JSON.stringify(zoneB.lastPacket, null, 2)}</pre>
              </div>
            ) : (
              <div className="text-xs text-[#697386] italic py-4">No packet received yet.</div>
            )}

            {/* Recent Packets Inspection Table */}
            <div>
              <div className="text-xs font-bold text-[#171A21] mb-2 font-mono">
                Recent Packets Received by Zone B:
              </div>
              <div className="overflow-x-auto border border-[#E5E7EB] rounded-lg">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="bg-[#F8FAFC] text-[#697386] border-b border-[#E5E7EB]">
                      <th className="py-2 px-3">Packet ID</th>
                      <th className="py-2 px-3">Timestamp</th>
                      <th className="py-2 px-3">Gas (ppm)</th>
                      <th className="py-2 px-3">Temp (°C)</th>
                      <th className="py-2 px-3">IMU</th>
                      <th className="py-2 px-3">Validation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB]">
                    {recentPackets.slice(0, 5).map((pkt) => (
                      <tr key={pkt.packetId} className="hover:bg-slate-50">
                        <td className="py-2 px-3 font-bold text-[#171A21]">#{pkt.packetId}</td>
                        <td className="py-2 px-3 text-[#697386]">{pkt.timestamp}</td>
                        <td className="py-2 px-3">{pkt.gasLevel.toFixed(1)}</td>
                        <td className="py-2 px-3">{pkt.temperature.toFixed(1)}</td>
                        <td className="py-2 px-3">
                          {pkt.fallDetected ? (
                            <span className="text-red-700 font-bold">FALL</span>
                          ) : (
                            <span className="text-slate-500">Normal</span>
                          )}
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
