import React from 'react';
import {
  Flame,
  Thermometer,
  Cpu,
  Radio,
  Wifi,
  BatteryCharging,
  BellRing,
  ArrowRight,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Activity,
  Layers,
} from 'lucide-react';
import { SimulationState, DemoScenarioType, NavTab } from '../../types/mineguard';
import { DemoScenarioBar } from '../common/DemoScenarioBar';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  ReferenceLine,
} from 'recharts';

interface OverviewPageProps {
  state: SimulationState;
  onNavigate: (tab: NavTab) => void;
  onTriggerScenario: (scenario: DemoScenarioType) => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
  state,
  onNavigate,
  onTriggerScenario,
}) => {
  const { zoneA, zoneB, comm, alerts, eventLog, telemetryHistory, thresholds, activeScenario } = state;

  const activeAlerts = alerts.filter((a) => a.status === 'ACTIVE');
  const activeAlertCount = activeAlerts.length;

  // Gas status
  const isGasCrit = zoneA.gasLevel >= thresholds.gasCritical;
  const isGasWarn = zoneA.gasLevel >= thresholds.gasWarning;

  // Temp status
  const isTempCrit = zoneA.temperature >= thresholds.tempCritical;
  const isTempWarn = zoneA.temperature >= thresholds.tempWarning;

  // Mini sparkline data
  const sparklineData = telemetryHistory.slice(-12);

  return (
    <div className="space-y-6">
      {/* Page Title & Intro */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-[#E5E7EB] gap-2">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#171A21]">
            Mining Safety Executive Overview
          </h2>
          <p className="text-xs text-[#697386] mt-0.5">
            Real-time telemetry and supervisory intelligence for the proposed OREON dual-zone helmet architecture.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-[#697386]">
            Cycle: <strong className="text-[#171A21]">#{zoneA.packetSequence}</strong>
          </span>
          <span className="text-xs text-slate-300">•</span>
          <span className="text-xs font-mono text-[#697386]">
            Updated: <strong className="text-[#171A21]">{zoneA.lastPacketTime || 'Now'}</strong>
          </span>
        </div>
      </div>

      {/* Interactive Scenario Bar */}
      <DemoScenarioBar
        activeScenario={activeScenario}
        onTriggerScenario={onTriggerScenario}
      />

      {/* KPI Summary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Gas Concentration */}
        <div className="ciklum-card p-4">
          <div className="flex items-center justify-between text-[#697386] text-xs">
            <span className="flex items-center gap-1.5 font-semibold text-[#171A21]">
              <Flame className="w-4 h-4 text-[#FF3B30]" />
              Gas Concentration
            </span>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                isGasCrit
                  ? 'bg-red-50 text-red-700 border border-red-200'
                  : isGasWarn
                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}
            >
              {isGasCrit ? 'CRITICAL' : isGasWarn ? 'WARNING' : 'NOMINAL'}
            </span>
          </div>

          <div className="mt-3 flex items-baseline justify-between">
            <div className="text-3xl font-bold font-mono-num text-[#171A21]">
              {zoneA.gasLevel.toFixed(1)}
              <span className="text-xs font-normal text-[#697386] ml-1">ppm</span>
            </div>
            <div className="text-[11px] text-[#697386] text-right font-mono">
              Limit: &lt;{thresholds.gasWarning} ppm
            </div>
          </div>

          {/* Mini Sparkline */}
          <div className="h-8 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparklineData}>
                <Line
                  type="monotone"
                  dataKey="gas"
                  stroke={isGasCrit ? '#EF4444' : isGasWarn ? '#F59E0B' : '#10B981'}
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[11px] text-[#697386] mt-1 pt-2 border-t border-slate-100 flex items-center justify-between">
            <span>Simulated gas sensor</span>
            <span className="font-mono text-[#171A21]">Zone A</span>
          </div>
        </div>

        {/* Card 2: Ambient Temperature */}
        <div className="ciklum-card p-4">
          <div className="flex items-center justify-between text-[#697386] text-xs">
            <span className="flex items-center gap-1.5 font-semibold text-[#171A21]">
              <Thermometer className="w-4 h-4 text-[#2563EB]" />
              Ambient Temperature
            </span>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                isTempCrit
                  ? 'bg-red-50 text-red-700 border border-red-200'
                  : isTempWarn
                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}
            >
              {isTempCrit ? 'HIGH TEMP' : isTempWarn ? 'WARM' : 'OPTIMAL'}
            </span>
          </div>

          <div className="mt-3 flex items-baseline justify-between">
            <div className="text-3xl font-bold font-mono-num text-[#171A21]">
              {zoneA.temperature.toFixed(1)}
              <span className="text-xs font-normal text-[#697386] ml-1">°C</span>
            </div>
            <div className="text-[11px] text-[#697386] text-right font-mono">
              Limit: &lt;{thresholds.tempWarning} °C
            </div>
          </div>

          {/* Mini Sparkline */}
          <div className="h-8 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparklineData}>
                <Line
                  type="monotone"
                  dataKey="temp"
                  stroke="#2563EB"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[11px] text-[#697386] mt-1 pt-2 border-t border-slate-100 flex items-center justify-between">
            <span>Helmet brim thermistor</span>
            <span className="font-mono text-[#171A21]">Zone A</span>
          </div>
        </div>

        {/* Card 3: LoRa Delivery Rate */}
        <div className="ciklum-card p-4">
          <div className="flex items-center justify-between text-[#697386] text-xs">
            <span className="flex items-center gap-1.5 font-semibold text-[#171A21]">
              <Wifi className="w-4 h-4 text-[#06B6D4]" />
              Proposed LoRa Link
            </span>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                comm.status === 'CONNECTED'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-red-50 text-red-700 border border-red-200 animate-pulse'
              }`}
            >
              {comm.status}
            </span>
          </div>

          <div className="mt-3 flex items-baseline justify-between">
            <div className="text-3xl font-bold font-mono-num text-[#171A21]">
              {comm.deliveryRate.toFixed(1)}
              <span className="text-xs font-normal text-[#697386] ml-1">%</span>
            </div>
            <div className="text-[11px] text-[#697386] text-right font-mono">
              Lost: {comm.packetsLost} pkts
            </div>
          </div>

          {/* Mini Sparkline */}
          <div className="h-8 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparklineData}>
                <Line
                  type="monotone"
                  dataKey="packetDeliveryRate"
                  stroke={comm.status === 'CONNECTED' ? '#06B6D4' : '#EF4444'}
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[11px] text-[#697386] mt-1 pt-2 border-t border-slate-100 flex items-center justify-between">
            <span>Sent: {comm.packetsSent}</span>
            <span className="font-mono text-[#171A21]">Recv: {comm.packetsReceived}</span>
          </div>
        </div>

        {/* Card 4: Zone B Battery & Power Mode */}
        <div className="ciklum-card p-4">
          <div className="flex items-center justify-between text-[#697386] text-xs">
            <span className="flex items-center gap-1.5 font-semibold text-[#171A21]">
              <BatteryCharging className="w-4 h-4 text-[#10B981]" />
              Zone B Battery
            </span>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                zoneB.powerMode === 'POWER SAVING'
                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}
            >
              {zoneB.powerMode}
            </span>
          </div>

          <div className="mt-3 flex items-baseline justify-between">
            <div className="text-3xl font-bold font-mono-num text-[#171A21]">
              {zoneB.batteryLevel.toFixed(1)}
              <span className="text-xs font-normal text-[#697386] ml-1">%</span>
            </div>
            <div className="text-[11px] text-[#697386] text-right font-mono">
              Throttle: &lt;{thresholds.batteryLow}%
            </div>
          </div>

          {/* Battery Progress Bar */}
          <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                zoneB.powerMode === 'POWER SAVING' ? 'bg-[#F59E0B]' : 'bg-[#10B981]'
              }`}
              style={{ width: `${Math.min(100, Math.max(0, zoneB.batteryLevel))}%` }}
            />
          </div>

          <div className="text-[11px] text-[#697386] mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
            <span>Adaptive policy:</span>
            <span className="font-semibold text-[#171A21]">{zoneB.powerMode}</span>
          </div>
        </div>
      </div>

      {/* System Health Architecture Diagram */}
      <div className="ciklum-card p-4">
        <div className="flex items-center justify-between mb-3 border-b border-[#E5E7EB] pb-2">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#FF3B30]" />
            <h3 className="text-sm font-bold text-[#171A21]">Dual-Zone Data Flow & Link Status</h3>
          </div>
          <span className="text-xs font-mono text-[#697386]">Proposed Architecture Flow</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center">
          {/* Step 1: Zone A */}
          <div
            onClick={() => onNavigate('zone-a')}
            className="p-3 rounded-lg border border-[#E5E7EB] bg-[#FAFBFC] hover:border-[#D1D5DB] hover:bg-white cursor-pointer transition-all"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-[#171A21] flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-[#10B981]" />
                Zone A: Sensor Unit
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700">
                {zoneA.status}
              </span>
            </div>
            <div className="text-xs text-[#697386] mt-1">
              Gas: <strong className="text-[#171A21]">{zoneA.gasLevel.toFixed(1)} ppm</strong> • Temp:{' '}
              <strong className="text-[#171A21]">{zoneA.temperature.toFixed(1)}°C</strong>
            </div>
            <div className="text-[10px] text-[#9CA3AF] mt-0.5">
              IMU: {zoneA.fallDetected ? 'Impact Detected' : 'Upright & Steady'}
            </div>
          </div>

          {/* Arrow 1 */}
          <div className="hidden md:flex justify-center text-[#9CA3AF]">
            <ArrowRight className="w-5 h-5 text-[#9CA3AF]" />
          </div>

          {/* Step 2: LoRa Channel */}
          <div
            onClick={() => onNavigate('lora')}
            className={`p-3 rounded-lg border cursor-pointer transition-all ${
              comm.status === 'CONNECTED'
                ? 'border-cyan-200 bg-cyan-50/30 hover:bg-cyan-50/60'
                : 'border-red-200 bg-red-50/30 hover:bg-red-50/60'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-[#171A21] flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-[#06B6D4]" />
                Proposed LoRa Link
              </span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${
                  comm.status === 'CONNECTED'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {comm.status}
              </span>
            </div>
            <div className="text-xs text-[#697386] mt-1">
              Delivery Rate: <strong className="text-[#171A21]">{comm.deliveryRate.toFixed(1)}%</strong>
            </div>
            <div className="text-[10px] text-[#9CA3AF] mt-0.5">
              Lost: {comm.packetsLost} / {comm.packetsSent} pkts
            </div>
          </div>

          {/* Arrow 2 */}
          <div className="hidden md:flex justify-center text-[#9CA3AF]">
            <ArrowRight className="w-5 h-5 text-[#9CA3AF]" />
          </div>

          {/* Step 3: Zone B */}
          <div
            onClick={() => onNavigate('zone-b')}
            className="p-3 rounded-lg border border-[#E5E7EB] bg-[#FAFBFC] hover:border-[#D1D5DB] hover:bg-white cursor-pointer transition-all"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-[#171A21] flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-[#2563EB]" />
                Zone B: Control Unit
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-blue-50 text-blue-700">
                {zoneB.rxStatus}
              </span>
            </div>
            <div className="text-xs text-[#697386] mt-1">
              Validation: <strong className="text-[#171A21]">{zoneB.packetValidation}</strong> • Batt:{' '}
              <strong className="text-[#171A21]">{zoneB.batteryLevel.toFixed(1)}%</strong>
            </div>
            <div className="text-[10px] text-[#9CA3AF] mt-0.5 truncate">
              Mode: {zoneB.powerMode}
            </div>
          </div>
        </div>
      </div>

      {/* Primary Telemetry Multi-Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Gas Chart */}
        <div className="ciklum-card p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-[#171A21] flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#FF3B30]" />
                Hazardous Gas Concentration Trend
              </h3>
              <p className="text-[11px] text-[#697386]">Time-series with warning & critical safety lines</p>
            </div>
            <button
              onClick={() => onNavigate('analytics')}
              className="text-xs text-[#FF3B30] hover:text-[#E02E24] font-medium flex items-center gap-1"
            >
              Analytics <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={telemetryHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gasGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF3B30" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#FF3B30" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F2F5" vertical={false} />
                <XAxis dataKey="timeStr" tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                <YAxis domain={[0, 'dataMax + 15']} tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                <Tooltip
                  formatter={(val: any) => [`${val.toFixed(1)} ppm`, 'Gas']}
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB', borderRadius: '6px', fontSize: '11px' }}
                />
                <ReferenceLine y={thresholds.gasWarning} stroke="#F59E0B" strokeDasharray="3 3" label={{ value: `Warn (${thresholds.gasWarning})`, fill: '#F59E0B', fontSize: 10 }} />
                <ReferenceLine y={thresholds.gasCritical} stroke="#EF4444" strokeDasharray="3 3" label={{ value: `Crit (${thresholds.gasCritical})`, fill: '#EF4444', fontSize: 10 }} />
                <Area type="monotone" dataKey="gas" stroke="#FF3B30" strokeWidth={2} fillOpacity={1} fill="url(#gasGradient)" isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Ambient Temperature Chart */}
        <div className="ciklum-card p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-[#171A21] flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-[#2563EB]" />
                Ambient Temperature Trend
              </h3>
              <p className="text-[11px] text-[#697386]">Subterranean ambient temperature (°C)</p>
            </div>
            <button
              onClick={() => onNavigate('analytics')}
              className="text-xs text-[#2563EB] hover:text-blue-800 font-medium flex items-center gap-1"
            >
              Analytics <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={telemetryHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F2F5" vertical={false} />
                <XAxis dataKey="timeStr" tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                <YAxis domain={['auto', 'auto']} tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                <Tooltip
                  formatter={(val: any) => [`${val.toFixed(1)} °C`, 'Temp']}
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB', borderRadius: '6px', fontSize: '11px' }}
                />
                <ReferenceLine y={thresholds.tempWarning} stroke="#F59E0B" strokeDasharray="3 3" label={{ value: `Warn (${thresholds.tempWarning}°C)`, fill: '#F59E0B', fontSize: 10 }} />
                <Area type="monotone" dataKey="temp" stroke="#2563EB" strokeWidth={2} fillOpacity={1} fill="url(#tempGradient)" isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent Alerts & Recent Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Alerts */}
        <div className="ciklum-card p-4">
          <div className="flex items-center justify-between mb-3 border-b border-[#E5E7EB] pb-2">
            <div className="flex items-center gap-2">
              <BellRing className="w-4 h-4 text-[#FF3B30]" />
              <h3 className="text-sm font-bold text-[#171A21]">Active Safety Alerts</h3>
              <span className="text-xs px-2 py-0.2 rounded-full font-bold bg-[#FEF2F2] text-[#DC2626]">
                {activeAlertCount}
              </span>
            </div>
            <button
              onClick={() => onNavigate('alerts')}
              className="text-xs text-[#FF3B30] hover:text-[#E02E24] font-medium flex items-center gap-1"
            >
              View All Alerts <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2 max-h-56 overflow-y-auto">
            {activeAlerts.length === 0 ? (
              <div className="py-8 text-center text-[#697386] text-xs">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-1.5 opacity-60" />
                All environmental and hardware parameters nominal. No active alerts.
              </div>
            ) : (
              activeAlerts.slice(0, 4).map((alert) => (
                <div
                  key={alert.id}
                  className={`p-2.5 rounded-lg border text-xs flex items-start justify-between gap-2 ${
                    alert.severity === 'CRITICAL'
                      ? 'bg-red-50/50 border-red-200'
                      : 'bg-amber-50/50 border-amber-200'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {alert.severity === 'CRITICAL' ? (
                      <AlertOctagon className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      <span className="font-bold text-[#171A21]">{alert.type}</span>
                      <p className="text-[#4A5568] mt-0.5 text-[11px] leading-tight">
                        {alert.description}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-[#697386] whitespace-nowrap">
                    {alert.timestamp}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Events */}
        <div className="ciklum-card p-4">
          <div className="flex items-center justify-between mb-3 border-b border-[#E5E7EB] pb-2">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#2563EB]" />
              <h3 className="text-sm font-bold text-[#171A21]">Recent System Events</h3>
            </div>
            <button
              onClick={() => onNavigate('logs')}
              className="text-xs text-[#2563EB] hover:text-blue-800 font-medium flex items-center gap-1"
            >
              Audit Logs <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2 max-h-56 overflow-y-auto font-mono text-xs">
            {eventLog.slice(0, 5).map((evt) => (
              <div
                key={evt.id}
                className="p-2 rounded bg-[#FAFBFC] border border-[#E5E7EB] text-[11px] flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="text-[#9CA3AF] whitespace-nowrap">[{evt.timestamp}]</span>
                  <span className="font-semibold text-[#171A21] px-1.5 py-0.2 rounded bg-white border border-slate-200 uppercase text-[9px]">
                    {evt.category}
                  </span>
                  <span className="text-[#4A5568] truncate">{evt.message}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
