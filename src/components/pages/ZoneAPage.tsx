import React, { useState } from 'react';
import {
  Cpu,
  Flame,
  Thermometer,
  Activity,
  ArrowRight,
  Send,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import { ZoneAState, ThresholdConfig, DemoScenarioType, TelemetryPoint } from '../../types/mineguard';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

interface ZoneAPageProps {
  zoneA: ZoneAState;
  thresholds: ThresholdConfig;
  telemetryHistory: TelemetryPoint[];
  onTriggerScenario: (scenario: DemoScenarioType) => void;
}

export const ZoneAPage: React.FC<ZoneAPageProps> = ({
  zoneA,
  thresholds,
  telemetryHistory,
  onTriggerScenario,
}) => {
  const [showPacketPayload, setShowPacketPayload] = useState<boolean>(true);

  const isGasCrit = zoneA.gasLevel >= thresholds.gasCritical;
  const isGasWarn = zoneA.gasLevel >= thresholds.gasWarning;
  const isTempCrit = zoneA.temperature >= thresholds.tempCritical;
  const isTempWarn = zoneA.temperature >= thresholds.tempWarning;

  // Mock latest packet based on Zone A state
  const latestPacket = {
    packetId: zoneA.packetSequence,
    timestamp: zoneA.lastPacketTime,
    gasLevel: zoneA.gasLevel,
    temperature: zoneA.temperature,
    fallDetected: zoneA.fallDetected,
    sourceZone: 'ZONE_A_SENSOR',
    destinationZone: 'ZONE_B_CONTROL',
    checksumValid: true,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="pb-2 border-b border-[#E5E7EB]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-[#171A21] flex items-center gap-2">
              <Cpu className="w-5 h-5 text-[#10B981]" />
              Zone A — Environmental Sensor Unit
            </h2>
            <p className="text-xs text-[#697386] mt-0.5">
              Simulated environmental gas sensing, thermal acquisition, 6-axis IMU fall detection, and LoRa packet formatting.
            </p>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-100 text-[#697386] border border-slate-200 self-start sm:self-auto">
            Mounting: Helmet Brim / Forward Pod
          </span>
        </div>

        {/* Prototype Reality Notice */}
        <div className="mt-3 p-2.5 rounded bg-amber-50/70 border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>
              <strong>PROPOSED HARDWARE SPECIFICATION:</strong> Physical sensors (electrochemical MQ/Sensirion arrays & 6-axis MEMS IMU) are simulated. Physical fabrication and underground validation are part of scheduled future work.
            </span>
          </div>
        </div>
      </div>

      {/* Section E: Quick Sensor Scenario Injections */}
      <div className="ciklum-card p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#FF3B30]" />
            <h3 className="text-sm font-bold text-[#171A21]">Zone A Sensor Test Injections</h3>
          </div>
          <span className="text-[11px] text-[#697386]">Directly overrides simulated sensor inputs</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          <button
            onClick={() => onTriggerScenario('NORMAL')}
            className="px-3 py-2 rounded-md border border-[#E5E7EB] bg-white hover:bg-slate-50 text-xs font-medium text-[#171A21] flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Restore Normal</span>
          </button>
          <button
            onClick={() => onTriggerScenario('GAS_WARNING')}
            className="px-3 py-2 rounded-md border border-amber-200 bg-amber-50 hover:bg-amber-100/70 text-xs font-semibold text-amber-900 flex items-center gap-2"
          >
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Inject Gas Warning</span>
          </button>
          <button
            onClick={() => onTriggerScenario('GAS_CRITICAL')}
            className="px-3 py-2 rounded-md border border-red-200 bg-red-50 hover:bg-red-100/70 text-xs font-semibold text-red-900 flex items-center gap-2"
          >
            <Flame className="w-4 h-4 text-red-600" />
            <span>Inject Critical Gas</span>
          </button>
          <button
            onClick={() => onTriggerScenario('HIGH_TEMP')}
            className="px-3 py-2 rounded-md border border-amber-200 bg-amber-50 hover:bg-amber-100/70 text-xs font-semibold text-amber-900 flex items-center gap-2"
          >
            <Thermometer className="w-4 h-4 text-amber-600" />
            <span>Inject High Temp</span>
          </button>
          <button
            onClick={() => onTriggerScenario('FALL_IMPACT')}
            className="px-3 py-2 rounded-md border border-red-200 bg-red-50 hover:bg-red-100/70 text-xs font-semibold text-red-900 flex items-center gap-2 col-span-2 sm:col-span-1"
          >
            <Activity className="w-4 h-4 text-red-600" />
            <span>Inject Fall / Impact</span>
          </button>
        </div>
      </div>

      {/* Section A: Live Sensor Readings */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Gas Reading */}
        <div className={`ciklum-card p-4 ${isGasCrit ? 'ciklum-card-critical' : isGasWarn ? 'ciklum-card-warning' : 'ciklum-card-normal'}`}>
          <div className="flex items-center justify-between text-xs text-[#697386]">
            <span className="font-semibold text-[#171A21] flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-[#FF3B30]" />
              Hazardous Gas
            </span>
            <span className="font-mono text-[10px] uppercase px-1.5 py-0.2 rounded bg-slate-100 text-[#4A5568]">
              Simulated
            </span>
          </div>
          <div className="text-3xl font-bold font-mono-num text-[#171A21] mt-2">
            {zoneA.gasLevel.toFixed(1)} <span className="text-sm font-normal text-[#697386]">ppm</span>
          </div>
          <div className="text-xs text-[#697386] mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
            <span>Thresholds:</span>
            <span className="font-mono font-medium text-[#171A21]">
              Warn &gt;{thresholds.gasWarning} | Crit &gt;{thresholds.gasCritical}
            </span>
          </div>
        </div>

        {/* Ambient Temperature Reading */}
        <div className={`ciklum-card p-4 ${isTempCrit ? 'ciklum-card-critical' : isTempWarn ? 'ciklum-card-warning' : 'ciklum-card-normal'}`}>
          <div className="flex items-center justify-between text-xs text-[#697386]">
            <span className="font-semibold text-[#171A21] flex items-center gap-1.5">
              <Thermometer className="w-4 h-4 text-[#2563EB]" />
              Ambient Temperature
            </span>
            <span className="font-mono text-[10px] uppercase px-1.5 py-0.2 rounded bg-slate-100 text-[#4A5568]">
              Simulated
            </span>
          </div>
          <div className="text-3xl font-bold font-mono-num text-[#171A21] mt-2">
            {zoneA.temperature.toFixed(1)} <span className="text-sm font-normal text-[#697386]">°C</span>
          </div>
          <div className="text-xs text-[#697386] mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
            <span>Thresholds:</span>
            <span className="font-mono font-medium text-[#171A21]">
              Warn &gt;{thresholds.tempWarning} | Crit &gt;{thresholds.tempCritical}
            </span>
          </div>
        </div>

        {/* IMU Orientation & Fall Status */}
        <div className={`ciklum-card p-4 ${zoneA.fallDetected ? 'ciklum-card-critical' : 'ciklum-card-normal'}`}>
          <div className="flex items-center justify-between text-xs text-[#697386]">
            <span className="font-semibold text-[#171A21] flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-purple-600" />
              6-Axis IMU Orientation
            </span>
            <span className="font-mono text-[10px] uppercase px-1.5 py-0.2 rounded bg-slate-100 text-[#4A5568]">
              Simulated
            </span>
          </div>
          <div className="text-2xl font-bold font-mono-num text-[#171A21] mt-2 flex items-center gap-2">
            {zoneA.fallDetected ? (
              <>
                <ShieldAlert className="w-6 h-6 text-red-600 animate-bounce" />
                <span className="text-red-700">IMPACT DETECTED</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                <span className="text-[#171A21]">UPRIGHT / STABLE</span>
              </>
            )}
          </div>
          <div className="text-xs text-[#697386] mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
            <span>Kinetic Shock Vector:</span>
            <span className="font-mono font-bold text-[#171A21]">{zoneA.imuShockG.toFixed(2)} g</span>
          </div>
        </div>
      </div>

      {/* Section B: Sensor Telemetry Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Gas Time Series */}
        <div className="ciklum-card p-4">
          <h3 className="text-sm font-bold text-[#171A21] mb-1">Gas Concentration Time-Series (ppm)</h3>
          <p className="text-[11px] text-[#697386] mb-3">Live waveform with warning and critical threshold crossings</p>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={telemetryHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gasZoneAGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF3B30" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#FF3B30" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F2F5" />
                <XAxis dataKey="timeStr" tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                <YAxis domain={[0, 'dataMax + 10']} tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB', borderRadius: '6px', fontSize: '11px' }} />
                <ReferenceLine y={thresholds.gasWarning} stroke="#F59E0B" strokeDasharray="3 3" label={{ value: 'Warning', fill: '#F59E0B', fontSize: 10 }} />
                <ReferenceLine y={thresholds.gasCritical} stroke="#EF4444" strokeDasharray="3 3" label={{ value: 'Critical', fill: '#EF4444', fontSize: 10 }} />
                <Area type="monotone" dataKey="gas" stroke="#FF3B30" strokeWidth={2} fill="url(#gasZoneAGradient)" isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* IMU Kinetic Shock Timeline */}
        <div className="ciklum-card p-4">
          <h3 className="text-sm font-bold text-[#171A21] mb-1">IMU Kinetic Acceleration Vector (g)</h3>
          <p className="text-[11px] text-[#697386] mb-3">6-axis accelerometer/gyroscope magnitude (nominal ~1.0g)</p>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={telemetryHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F2F5" />
                <XAxis dataKey="timeStr" tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                <YAxis domain={[0, 6]} tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB', borderRadius: '6px', fontSize: '11px' }} />
                <ReferenceLine y={3.5} stroke="#EF4444" strokeDasharray="4 4" label={{ value: 'Impact Threshold (3.5g)', fill: '#EF4444', fontSize: 10 }} />
                <Line type="monotone" dataKey="imuShockG" stroke="#9333EA" strokeWidth={2} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Section D: Minimal Architectural Data Pipeline */}
      <div className="ciklum-card p-4">
        <h3 className="text-sm font-bold text-[#171A21] mb-2">Zone A Data Processing Pipeline</h3>
        <div className="flex items-center justify-between text-xs font-mono text-[#4A5568] overflow-x-auto py-2 gap-2">
          <div className="p-2.5 rounded bg-slate-50 border border-slate-200 text-center flex-1 min-w-[130px]">
            <span className="text-[10px] text-[#9CA3AF] block font-sans">Source</span>
            Simulated Sensors
          </div>
          <ArrowRight className="w-4 h-4 text-[#9CA3AF] flex-shrink-0" />
          <div className="p-2.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-900 text-center flex-1 min-w-[130px] font-semibold">
            <span className="text-[10px] text-emerald-600 block font-sans">Acquisition</span>
            Zone A MCU
          </div>
          <ArrowRight className="w-4 h-4 text-[#9CA3AF] flex-shrink-0" />
          <div className="p-2.5 rounded bg-blue-50 border border-blue-200 text-blue-900 text-center flex-1 min-w-[130px] font-semibold">
            <span className="text-[10px] text-blue-600 block font-sans">Framing</span>
            Packet Formatter
          </div>
          <ArrowRight className="w-4 h-4 text-[#9CA3AF] flex-shrink-0" />
          <div className="p-2.5 rounded bg-cyan-50 border border-cyan-200 text-cyan-900 text-center flex-1 min-w-[130px]">
            <span className="text-[10px] text-cyan-600 block font-sans">Wireless Channel</span>
            LoRa Tx (Simulated)
          </div>
          <ArrowRight className="w-4 h-4 text-[#9CA3AF] flex-shrink-0" />
          <div className="p-2.5 rounded bg-slate-50 border border-slate-200 text-center flex-1 min-w-[130px]">
            <span className="text-[10px] text-[#9CA3AF] block font-sans">Target</span>
            Zone B Controller
          </div>
        </div>
      </div>

      {/* Section C: Packet Generation & JSON Viewer */}
      <div className="ciklum-card p-4">
        <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
          <div className="flex items-center gap-2">
            <Send className="w-4 h-4 text-[#2563EB]" />
            <h3 className="text-sm font-bold text-[#171A21]">Latest Generated Telemetry Packet</h3>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold">
              #{zoneA.packetSequence}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-[#697386] font-mono">
            <span>Timestamp: <strong className="text-[#171A21]">{zoneA.lastPacketTime || 'Now'}</strong></span>
            <span>•</span>
            <span>Tx Status: <strong className="text-emerald-700">{zoneA.txStatus}</strong></span>
            <button
              onClick={() => setShowPacketPayload(!showPacketPayload)}
              className="p-1 rounded hover:bg-slate-100 text-[#4A5568]"
            >
              {showPacketPayload ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {showPacketPayload && (
          <div className="mt-3">
            <div className="bg-[#1A1D24] text-emerald-400 p-3 rounded-lg font-mono text-xs overflow-x-auto shadow-inner leading-relaxed">
              <pre>{JSON.stringify(latestPacket, null, 2)}</pre>
            </div>
            <div className="mt-2 text-[11px] text-[#697386]">
              * Checksum and payload encoding format is simulated. Physical LoRa frame serialization will be implemented in the C firmware for the Zone A microcontroller.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
