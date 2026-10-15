import React, { useState } from 'react';
import {
  BarChart3,
  Flame,
  Thermometer,
  Battery,
  Wifi,
  Activity,
  GitCommit,
  Layers,
} from 'lucide-react';
import { TelemetryPoint, ThresholdConfig, DemoScenarioType } from '../../types/mineguard';
import { DemoScenarioBar } from '../common/DemoScenarioBar';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
} from 'recharts';

interface AnalyticsPageProps {
  telemetryHistory: TelemetryPoint[];
  thresholds: ThresholdConfig;
  activeScenario: string | null;
  onTriggerScenario: (scenario: DemoScenarioType) => void;
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({
  telemetryHistory,
  thresholds,
  activeScenario,
  onTriggerScenario,
}) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState<'all' | 'recent'>('all');

  const chartData = selectedTimeRange === 'recent' ? telemetryHistory.slice(-15) : telemetryHistory;

  // Format system status for step chart (0 = NORMAL, 1 = WARNING, 2 = CRITICAL)
  const statusStepData = chartData.map((d) => ({
    ...d,
    statusLevel: d.status === 'CRITICAL' ? 2 : d.status === 'WARNING' ? 1 : 0,
  }));

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-[#E5E7EB] gap-2">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#171A21] flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#FF3B30]" />
            Multi-Metric Telemetry Analytics
          </h2>
          <p className="text-xs text-[#697386] mt-0.5">
            Deterministic time-series waveform analysis, sensor correlation, packet delivery performance, and hazard event timelines.
          </p>
        </div>

        {/* Time Window Selector */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-mono self-start sm:self-auto">
          <button
            onClick={() => setSelectedTimeRange('all')}
            className={`px-3 py-1 rounded transition-colors ${
              selectedTimeRange === 'all'
                ? 'bg-white text-[#171A21] font-bold shadow-sm'
                : 'text-[#697386] hover:text-[#171A21]'
            }`}
          >
            Full Window ({telemetryHistory.length} pts)
          </button>
          <button
            onClick={() => setSelectedTimeRange('recent')}
            className={`px-3 py-1 rounded transition-colors ${
              selectedTimeRange === 'recent'
                ? 'bg-white text-[#171A21] font-bold shadow-sm'
                : 'text-[#697386] hover:text-[#171A21]'
            }`}
          >
            Recent (15 pts)
          </button>
        </div>
      </div>

      {/* Interactive Scenario Bar */}
      <DemoScenarioBar
        activeScenario={activeScenario}
        onTriggerScenario={onTriggerScenario}
      />

      {/* Analytics Grid: Row 1 — Primary Sensors (Gas & Temperature) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* CHART 1: Gas Concentration */}
        <div className="ciklum-card p-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-xs font-bold text-[#9CA3AF] uppercase font-mono">CHART 01</span>
              <h3 className="text-sm font-bold text-[#171A21] flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#FF3B30]" />
                Hazardous Gas Concentration Waveform
              </h3>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200 font-bold">
              Unit: ppm
            </span>
          </div>
          <p className="text-[11px] text-[#697386] mb-3">
            Real-time organic fluctuation with warning threshold ({thresholds.gasWarning} ppm) & critical limit ({thresholds.gasCritical} ppm)
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="chartGasGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF3B30" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#FF3B30" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F2F5" />
                <XAxis dataKey="timeStr" tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                <YAxis domain={[0, 'dataMax + 15']} tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                <Tooltip
                  formatter={(val: any) => [`${val.toFixed(1)} ppm`, 'Gas Concentration']}
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB', borderRadius: '6px', fontSize: '11px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                />
                <ReferenceLine y={thresholds.gasWarning} stroke="#F59E0B" strokeDasharray="3 3" label={{ value: `Warn: ${thresholds.gasWarning} ppm`, fill: '#F59E0B', fontSize: 10 }} />
                <ReferenceLine y={thresholds.gasCritical} stroke="#EF4444" strokeDasharray="3 3" label={{ value: `Crit: ${thresholds.gasCritical} ppm`, fill: '#EF4444', fontSize: 10 }} />
                <Area type="monotone" dataKey="gas" stroke="#FF3B30" strokeWidth={2.5} fill="url(#chartGasGrad)" isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 2: Ambient Temperature */}
        <div className="ciklum-card p-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-xs font-bold text-[#9CA3AF] uppercase font-mono">CHART 02</span>
              <h3 className="text-sm font-bold text-[#171A21] flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-[#2563EB]" />
                Subterranean Ambient Temperature
              </h3>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-bold">
              Unit: °C
            </span>
          </div>
          <p className="text-[11px] text-[#697386] mb-3">
            Thermal drift curve with warning line ({thresholds.tempWarning}°C) & critical threshold ({thresholds.tempCritical}°C)
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="chartTempGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F2F5" />
                <XAxis dataKey="timeStr" tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                <YAxis domain={['auto', 'auto']} tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                <Tooltip
                  formatter={(val: any) => [`${val.toFixed(1)} °C`, 'Temperature']}
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB', borderRadius: '6px', fontSize: '11px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                />
                <ReferenceLine y={thresholds.tempWarning} stroke="#F59E0B" strokeDasharray="3 3" label={{ value: `Warn: ${thresholds.tempWarning}°C`, fill: '#F59E0B', fontSize: 10 }} />
                <ReferenceLine y={thresholds.tempCritical} stroke="#EF4444" strokeDasharray="3 3" label={{ value: `Crit: ${thresholds.tempCritical}°C`, fill: '#EF4444', fontSize: 10 }} />
                <Area type="monotone" dataKey="temp" stroke="#2563EB" strokeWidth={2.5} fill="url(#chartTempGrad)" isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Analytics Grid: Row 2 — Battery Discharge & RF Packet Delivery */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* CHART 3: Battery Discharge Curve */}
        <div className="ciklum-card p-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-xs font-bold text-[#9CA3AF] uppercase font-mono">CHART 03</span>
              <h3 className="text-sm font-bold text-[#171A21] flex items-center gap-2">
                <Battery className="w-4 h-4 text-[#10B981]" />
                Simulated Battery Discharge & Power Mode Transition
              </h3>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
              Capacity: %
            </span>
          </div>
          <p className="text-[11px] text-[#697386] mb-3">
            Gradual consumption rate; triggers adaptive power saving mode below {thresholds.batteryLow}%
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="chartBattGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F2F5" />
                <XAxis dataKey="timeStr" tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                <Tooltip
                  formatter={(val: any) => [`${val.toFixed(1)}%`, 'Battery Level']}
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB', borderRadius: '6px', fontSize: '11px' }}
                />
                <ReferenceLine y={thresholds.batteryLow} stroke="#F59E0B" strokeDasharray="3 3" label={{ value: `Power Save Threshold (${thresholds.batteryLow}%)`, fill: '#F59E0B', fontSize: 10 }} />
                <Area type="monotone" dataKey="battery" stroke="#10B981" strokeWidth={2.5} fill="url(#chartBattGrad)" isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 4: Packet Delivery Performance */}
        <div className="ciklum-card p-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-xs font-bold text-[#9CA3AF] uppercase font-mono">CHART 04</span>
              <h3 className="text-sm font-bold text-[#171A21] flex items-center gap-2">
                <Wifi className="w-4 h-4 text-[#06B6D4]" />
                Packet Delivery Performance & Loss Outages
              </h3>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-50 text-cyan-700 border border-cyan-200 font-bold">
              Rate: %
            </span>
          </div>
          <p className="text-[11px] text-[#697386] mb-3">
            Real-time delivery percentage, dropping during communication severance and recovering upon reconnect
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F2F5" />
                <XAxis dataKey="timeStr" tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                <YAxis domain={[0, 105]} tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                <Tooltip
                  formatter={(val: any) => [`${val.toFixed(1)}%`, 'Delivery Rate']}
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB', borderRadius: '6px', fontSize: '11px' }}
                />
                <ReferenceLine y={90} stroke="#10B981" strokeDasharray="2 2" label={{ value: 'Target 90%', fill: '#10B981', fontSize: 10 }} />
                <Line type="stepAfter" dataKey="packetDeliveryRate" stroke="#06B6D4" strokeWidth={2.5} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Analytics Grid: Row 3 — Multi-Variable Correlation & IMU Acceleration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* CHART 6: Sensor Correlation (Gas vs Temp) */}
        <div className="ciklum-card p-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-xs font-bold text-[#9CA3AF] uppercase font-mono">CHART 05</span>
              <h3 className="text-sm font-bold text-[#171A21] flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#FF3B30]" />
                Dual-Axis Sensor Correlation (Gas vs. Temperature)
              </h3>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 text-[#697386] font-bold">
              Dual-Y
            </span>
          </div>
          <p className="text-[11px] text-[#697386] mb-3">
            Overlaying gas concentration (left axis, red) against thermal rise (right axis, blue)
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F2F5" />
                <XAxis dataKey="timeStr" tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                <YAxis yAxisId="left" tick={{ fontSize: 10, fill: '#FF3B30' }} domain={[0, 'dataMax + 10']} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: '#2563EB' }} domain={['auto', 'auto']} />
                <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB', borderRadius: '6px', fontSize: '11px' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Line yAxisId="left" type="monotone" name="Gas (ppm)" dataKey="gas" stroke="#FF3B30" strokeWidth={2} dot={false} isAnimationActive={false} />
                <Line yAxisId="right" type="monotone" name="Temperature (°C)" dataKey="temp" stroke="#2563EB" strokeWidth={2} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 8: IMU Kinetic Acceleration / Shock Waveform */}
        <div className="ciklum-card p-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-xs font-bold text-[#9CA3AF] uppercase font-mono">CHART 06</span>
              <h3 className="text-sm font-bold text-[#171A21] flex items-center gap-2">
                <Activity className="w-4 h-4 text-purple-600" />
                IMU 6-Axis Acceleration Shock Vector (g)
              </h3>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 font-bold">
              Shock: g
            </span>
          </div>
          <p className="text-[11px] text-[#697386] mb-3">
            Static posture baseline (~1.0g) vs sudden kinetic impact spikes triggering man-down alarms
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="chartImuGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#9333EA" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#9333EA" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F2F5" />
                <XAxis dataKey="timeStr" tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                <YAxis domain={[0, 6]} tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                <Tooltip
                  formatter={(val: any) => [`${val.toFixed(2)} g`, 'IMU Shock Vector']}
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB', borderRadius: '6px', fontSize: '11px' }}
                />
                <ReferenceLine y={3.5} stroke="#EF4444" strokeDasharray="4 4" label={{ value: 'Fall Threshold (3.5g)', fill: '#EF4444', fontSize: 10 }} />
                <Area type="monotone" dataKey="imuShockG" stroke="#9333EA" strokeWidth={2.5} fill="url(#chartImuGrad)" isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* CHART 7: System Status History (Step Timeline) */}
      <div className="ciklum-card p-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <span className="text-xs font-bold text-[#9CA3AF] uppercase font-mono">CHART 07</span>
            <h3 className="text-sm font-bold text-[#171A21] flex items-center gap-2">
              <GitCommit className="w-4 h-4 text-[#171A21]" />
              System Status State Machine Transition History
            </h3>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-mono">
            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">0 = NORMAL</span>
            <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800">1 = WARNING</span>
            <span className="px-2 py-0.5 rounded bg-red-100 text-red-800">2 = CRITICAL</span>
          </div>
        </div>
        <p className="text-[11px] text-[#697386] mb-3">
          Step chart showing discrete system safety state transitions based on hazard evaluation rules
        </p>

        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={statusStepData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F2F5" />
              <XAxis dataKey="timeStr" tick={{ fontSize: 10, fill: '#9CA3AF' }} />
              <YAxis domain={[0, 2]} ticks={[0, 1, 2]} tick={{ fontSize: 10, fill: '#9CA3AF' }} />
              <Tooltip
                formatter={(val: any) => [
                  val === 2 ? 'CRITICAL HAZARD' : val === 1 ? 'HAZARD WARNING' : 'NORMAL OPERATION',
                  'System State',
                ]}
                contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB', borderRadius: '6px', fontSize: '11px' }}
              />
              <Line type="stepAfter" dataKey="statusLevel" stroke="#171A21" strokeWidth={2.5} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
