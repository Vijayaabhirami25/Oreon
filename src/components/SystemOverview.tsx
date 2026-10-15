import React from 'react';
import {
  Flame,
  Thermometer,
  Activity,
  Cpu,
  Radio,
  Wifi,
  BatteryCharging,
  BellRing,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { SimulationState } from '../types/mineguard';

interface SystemOverviewProps {
  state: SimulationState;
}

export const SystemOverview: React.FC<SystemOverviewProps> = ({ state }) => {
  const { zoneA, zoneB, comm, alerts, thresholds } = state;
  const activeAlertsCount = alerts.filter((a) => a.status === 'ACTIVE').length;

  // Gas status evaluation
  const getGasStatus = () => {
    if (zoneA.gasLevel >= thresholds.gasCritical) {
      return {
        label: 'CRITICAL',
        color: 'text-red-400',
        bg: 'bg-red-950/60 border-red-500/60',
        badge: 'Exceeds Critical Threshold',
      };
    }
    if (zoneA.gasLevel >= thresholds.gasWarning) {
      return {
        label: 'WARNING',
        color: 'text-amber-400',
        bg: 'bg-amber-950/60 border-amber-500/60',
        badge: 'Elevated Concentration',
      };
    }
    return {
      label: 'NORMAL',
      color: 'text-emerald-400',
      bg: 'bg-slate-900/60 border-slate-700/50',
      badge: 'Within Safe Demo Range',
    };
  };

  // Temp status evaluation
  const getTempStatus = () => {
    if (zoneA.temperature >= thresholds.tempCritical) {
      return {
        label: 'CRITICAL',
        color: 'text-red-400',
        bg: 'bg-red-950/60 border-red-500/60',
        badge: 'High Thermal Hazard',
      };
    }
    if (zoneA.temperature >= thresholds.tempWarning) {
      return {
        label: 'WARNING',
        color: 'text-amber-400',
        bg: 'bg-amber-950/60 border-amber-500/60',
        badge: 'Elevated Ambient Temp',
      };
    }
    return {
      label: 'NORMAL',
      color: 'text-emerald-400',
      bg: 'bg-slate-900/60 border-slate-700/50',
      badge: 'Optimal Demo Range',
    };
  };

  const gasInfo = getGasStatus();
  const tempInfo = getTempStatus();

  return (
    <section className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold tracking-wider uppercase text-slate-400 flex items-center gap-2">
          <span>System Telemetry Overview</span>
          <span className="text-[11px] font-mono font-normal px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
            All Values Simulated
          </span>
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
        {/* Card 1: Gas Concentration */}
        <div
          id="overview-gas-card"
          className={`industrial-card p-4 transition-all ${
            zoneA.gasLevel >= thresholds.gasCritical
              ? 'industrial-card-critical'
              : zoneA.gasLevel >= thresholds.gasWarning
              ? 'industrial-card-warning'
              : ''
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="flex items-center gap-1.5 font-medium">
              <Flame className="w-4 h-4 text-amber-500" />
              Gas Concentration
            </span>
            <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-800/80 border border-slate-700 text-slate-300">
              Simulated
            </span>
          </div>
          <div className="mt-2.5 flex items-baseline justify-between">
            <div className="text-2xl font-bold font-mono-num text-white">
              {zoneA.gasLevel.toFixed(1)}
              <span className="text-xs font-normal text-slate-400 ml-1">ppm</span>
            </div>
            <span className={`text-[11px] font-mono px-2 py-0.5 rounded border ${gasInfo.bg} ${gasInfo.color}`}>
              {gasInfo.label}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 truncate">
            Demo Thresholds: Warn &gt;{thresholds.gasWarning} | Crit &gt;{thresholds.gasCritical} ppm
          </div>
        </div>

        {/* Card 2: Temperature */}
        <div
          id="overview-temp-card"
          className={`industrial-card p-4 transition-all ${
            zoneA.temperature >= thresholds.tempCritical
              ? 'industrial-card-critical'
              : zoneA.temperature >= thresholds.tempWarning
              ? 'industrial-card-warning'
              : ''
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="flex items-center gap-1.5 font-medium">
              <Thermometer className="w-4 h-4 text-blue-400" />
              Ambient Temp
            </span>
            <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-800/80 border border-slate-700 text-slate-300">
              Simulated
            </span>
          </div>
          <div className="mt-2.5 flex items-baseline justify-between">
            <div className="text-2xl font-bold font-mono-num text-white">
              {zoneA.temperature.toFixed(1)}
              <span className="text-xs font-normal text-slate-400 ml-1">°C</span>
            </div>
            <span className={`text-[11px] font-mono px-2 py-0.5 rounded border ${tempInfo.bg} ${tempInfo.color}`}>
              {tempInfo.label}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 truncate">
            Demo Thresholds: Warn &gt;{thresholds.tempWarning} | Crit &gt;{thresholds.tempCritical} °C
          </div>
        </div>

        {/* Card 3: Fall / Impact */}
        <div
          id="overview-fall-card"
          className={`industrial-card p-4 transition-all ${
            zoneA.fallDetected ? 'industrial-card-critical' : ''
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="flex items-center gap-1.5 font-medium">
              <Activity className="w-4 h-4 text-purple-400" />
              Fall / Impact (IMU)
            </span>
            <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-800/80 border border-slate-700 text-slate-300">
              Simulated
            </span>
          </div>
          <div className="mt-2.5 flex items-baseline justify-between">
            <div className={`text-xl font-bold font-mono-num ${zoneA.fallDetected ? 'text-red-400' : 'text-slate-200'}`}>
              {zoneA.fallDetected ? 'IMPACT DETECTED' : 'NORMAL (UPRIGHT)'}
            </div>
            {zoneA.fallDetected ? (
              <span className="text-[11px] font-mono px-2 py-0.5 rounded border bg-red-950/80 border-red-500 text-red-300 animate-pulse">
                CRITICAL
              </span>
            ) : (
              <span className="text-[11px] font-mono px-2 py-0.5 rounded border bg-emerald-950/50 border-emerald-600/40 text-emerald-400">
                STABLE
              </span>
            )}
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            {zoneA.fallDetected ? 'Man-down alarm triggered' : '6-Axis IMU vector steady'}
          </div>
        </div>

        {/* Card 4: Zone A Status */}
        <div id="overview-zonea-card" className="industrial-card p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="flex items-center gap-1.5 font-medium">
              <Cpu className="w-4 h-4 text-emerald-400" />
              Zone A Unit
            </span>
            <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-800/80 border border-slate-700 text-slate-300">
              Sensor Unit
            </span>
          </div>
          <div className="mt-2.5 flex items-baseline justify-between">
            <div className="text-xl font-bold font-mono-num text-white">
              {zoneA.status}
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded border bg-emerald-950/60 border-emerald-500/50 text-emerald-300">
              Pkt #{zoneA.packetSequence}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 truncate">
            Tx Status: <span className="text-slate-200">{zoneA.txStatus}</span>
          </div>
        </div>

        {/* Card 5: Zone B Status */}
        <div id="overview-zoneb-card" className="industrial-card p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="flex items-center gap-1.5 font-medium">
              <Radio className="w-4 h-4 text-blue-400" />
              Zone B Unit
            </span>
            <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-800/80 border border-slate-700 text-slate-300">
              Control Unit
            </span>
          </div>
          <div className="mt-2.5 flex items-baseline justify-between">
            <div className="text-xl font-bold font-mono-num text-white">
              {zoneB.status}
            </div>
            <span className={`text-[11px] font-mono px-2 py-0.5 rounded border ${
              zoneB.rxStatus === 'RECEIVED_OK'
                ? 'bg-blue-950/60 border-blue-500/50 text-blue-300'
                : 'bg-red-950/60 border-red-500/50 text-red-300'
            }`}>
              Rx: {zoneB.rxStatus}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 truncate">
            Val: <span className="text-slate-200">{zoneB.packetValidation}</span> • Recv: {zoneB.packetsReceived}
          </div>
        </div>

        {/* Card 6: LoRa Communication Status */}
        <div
          id="overview-comm-card"
          className={`industrial-card p-4 ${
            comm.status === 'DISCONNECTED' ? 'industrial-card-warning' : ''
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="flex items-center gap-1.5 font-medium">
              <Wifi className="w-4 h-4 text-cyan-400" />
              Proposed LoRa Link
            </span>
            <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-800/80 border border-slate-700 text-slate-300">
              Simulated
            </span>
          </div>
          <div className="mt-2.5 flex items-baseline justify-between">
            <div className="text-xl font-bold font-mono-num flex items-center gap-1.5">
              {comm.status === 'CONNECTED' ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-300">CONNECTED</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-red-400" />
                  <span className="text-red-400">DISCONNECTED</span>
                </>
              )}
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded border bg-slate-800 border-slate-700 text-slate-300">
              {comm.qualitySimulated}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 truncate">
            Sent: {comm.packetsSent} • Lost: {comm.packetsLost}
          </div>
        </div>

        {/* Card 7: Zone B Simulated Battery */}
        <div
          id="overview-battery-card"
          className={`industrial-card p-4 ${
            zoneB.powerMode === 'POWER SAVING' ? 'industrial-card-warning' : ''
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="flex items-center gap-1.5 font-medium">
              <BatteryCharging className="w-4 h-4 text-yellow-400" />
              Zone B Battery
            </span>
            <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-800/80 border border-slate-700 text-slate-300">
              Simulated
            </span>
          </div>
          <div className="mt-2.5 flex items-baseline justify-between">
            <div className="text-2xl font-bold font-mono-num text-white">
              {zoneB.batteryLevel.toFixed(1)}
              <span className="text-xs font-normal text-slate-400 ml-1">%</span>
            </div>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                zoneB.powerMode === 'POWER SAVING'
                  ? 'bg-amber-950/80 border-amber-500/80 text-amber-300 font-semibold'
                  : 'bg-emerald-950/50 border-emerald-600/40 text-emerald-300'
              }`}
            >
              {zoneB.powerMode}
            </span>
          </div>
          {/* Battery bar */}
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2.5 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                zoneB.batteryLevel <= thresholds.batteryLow
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(100, Math.max(0, zoneB.batteryLevel))}%` }}
            ></div>
          </div>
        </div>

        {/* Card 8: Active Alerts */}
        <div
          id="overview-alerts-card"
          className={`industrial-card p-4 ${
            activeAlertsCount > 0 ? 'industrial-card-critical' : ''
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="flex items-center gap-1.5 font-medium">
              <BellRing className="w-4 h-4 text-red-400" />
              Active Alerts
            </span>
            <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-800/80 border border-slate-700 text-slate-300">
              Hazard Queue
            </span>
          </div>
          <div className="mt-2.5 flex items-baseline justify-between">
            <div className={`text-2xl font-bold font-mono-num ${activeAlertsCount > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
              {activeAlertsCount}
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded border bg-slate-800 border-slate-700 text-slate-300">
              Total: {alerts.length}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 truncate">
            {activeAlertsCount > 0 ? (
              <span className="text-red-400 font-medium">Requires Acknowledgment</span>
            ) : (
              <span className="text-emerald-400">All alerts cleared</span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
