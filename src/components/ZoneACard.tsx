import React from 'react';
import { Cpu, ArrowRight, Wind, Thermometer, ShieldAlert, CheckCircle, Send } from 'lucide-react';
import { ZoneAState, ThresholdConfig } from '../types/mineguard';

interface ZoneACardProps {
  zoneA: ZoneAState;
  thresholds: ThresholdConfig;
}

export const ZoneACard: React.FC<ZoneACardProps> = ({ zoneA, thresholds }) => {
  const isGasWarn = zoneA.gasLevel >= thresholds.gasWarning;
  const isGasCrit = zoneA.gasLevel >= thresholds.gasCritical;
  const isTempWarn = zoneA.temperature >= thresholds.tempWarning;
  const isTempCrit = zoneA.temperature >= thresholds.tempCritical;

  return (
    <div id="zone-a-card" className="industrial-card p-5 flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-white tracking-wide">ZONE A — SENSOR UNIT</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-600/50 text-emerald-300">
                  SIMULATED
                </span>
              </div>
              <p className="text-xs text-slate-400">Helmet Brim / Shell Mounted Sensors & Microcontroller</p>
            </div>
          </div>
          <span
            className={`px-2.5 py-1 rounded text-xs font-mono font-medium border ${
              zoneA.status === 'CRITICAL'
                ? 'bg-red-950/80 border-red-500 text-red-300'
                : zoneA.status === 'WARNING'
                ? 'bg-amber-950/80 border-amber-500 text-amber-300'
                : 'bg-emerald-950/60 border-emerald-600/50 text-emerald-300'
            }`}
          >
            STATUS: {zoneA.status}
          </span>
        </div>

        {/* Architectural Data Flow Diagram */}
        <div className="my-3.5 p-2.5 rounded-lg bg-charcoal-950/70 border border-slate-800/80">
          <div className="text-[11px] font-mono text-slate-400 mb-1.5 flex items-center justify-between">
            <span>PROPOSED ZONE A DATA PIPELINE:</span>
            <span className="text-[10px] text-amber-400 font-semibold">Simulated Flow</span>
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-300 gap-1 overflow-x-auto py-1">
            <div className="px-2 py-1 rounded bg-slate-800/80 border border-slate-700 text-center whitespace-nowrap">
              <span className="text-[10px] text-slate-400 block">Source</span>
              Sensors (Simulated)
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
            <div className="px-2 py-1 rounded bg-emerald-950/50 border border-emerald-700/60 text-emerald-300 text-center whitespace-nowrap">
              <span className="text-[10px] text-emerald-400 block">Processing</span>
              Zone A (Packet Gen)
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
            <div className="px-2 py-1 rounded bg-blue-950/50 border border-blue-700/60 text-blue-300 text-center whitespace-nowrap">
              <span className="text-[10px] text-blue-400 block">Proposed Link</span>
              LoRa (Simulated)
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
            <div className="px-2 py-1 rounded bg-slate-800/80 border border-slate-700 text-center whitespace-nowrap">
              <span className="text-[10px] text-slate-400 block">Target</span>
              Zone B
            </div>
          </div>
        </div>

        {/* Readings Grid */}
        <div className="grid grid-cols-2 gap-3 my-3">
          <div
            className={`p-3 rounded-lg border ${
              isGasCrit
                ? 'bg-red-950/40 border-red-500/60'
                : isGasWarn
                ? 'bg-amber-950/40 border-amber-500/60'
                : 'bg-slate-900/60 border-slate-800'
            }`}
          >
            <div className="text-[11px] text-slate-400 flex items-center justify-between mb-1">
              <span className="flex items-center gap-1 font-medium">
                <Wind className="w-3.5 h-3.5 text-amber-400" />
                Simulated Gas
              </span>
              <span className="text-[10px] font-mono">PPM</span>
            </div>
            <div className="text-xl font-bold font-mono-num text-white">
              {zoneA.gasLevel.toFixed(1)}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              {isGasCrit ? 'CRITICAL HAZARD' : isGasWarn ? 'WARNING LEVEL' : 'Nominal Safe Range'}
            </div>
          </div>

          <div
            className={`p-3 rounded-lg border ${
              isTempCrit
                ? 'bg-red-950/40 border-red-500/60'
                : isTempWarn
                ? 'bg-amber-950/40 border-amber-500/60'
                : 'bg-slate-900/60 border-slate-800'
            }`}
          >
            <div className="text-[11px] text-slate-400 flex items-center justify-between mb-1">
              <span className="flex items-center gap-1 font-medium">
                <Thermometer className="w-3.5 h-3.5 text-blue-400" />
                Simulated Temp
              </span>
              <span className="text-[10px] font-mono">°C</span>
            </div>
            <div className="text-xl font-bold font-mono-num text-white">
              {zoneA.temperature.toFixed(1)}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              {isTempCrit ? 'THERMAL CRITICAL' : isTempWarn ? 'HIGH TEMP' : 'Comfort Band'}
            </div>
          </div>
        </div>

        {/* Fall / Impact Status Banner */}
        <div
          className={`p-3 rounded-lg border flex items-center justify-between ${
            zoneA.fallDetected
              ? 'bg-red-950/60 border-red-500 text-red-200'
              : 'bg-slate-900/40 border-slate-800 text-slate-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {zoneA.fallDetected ? (
              <ShieldAlert className="w-5 h-5 text-red-400 animate-bounce" />
            ) : (
              <CheckCircle className="w-5 h-5 text-emerald-400" />
            )}
            <div>
              <div className="text-xs font-medium">
                {zoneA.fallDetected ? 'IMU FALL / IMPACT DETECTED' : 'IMU Orientation Normal'}
              </div>
              <div className="text-[10px] text-slate-400">
                {zoneA.fallDetected
                  ? 'High acceleration vector registered (simulated man-down)'
                  : 'No abrupt kinetic shock detected'}
              </div>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
            {zoneA.fallDetected ? 'FLAG: TRUE' : 'FLAG: FALSE'}
          </span>
        </div>
      </div>

      {/* Packet Transmission Metadata */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 text-xs text-slate-400 flex flex-col gap-1.5 font-mono">
        <div className="flex items-center justify-between">
          <span>Packet Sequence Number:</span>
          <span className="font-semibold text-slate-200">#{zoneA.packetSequence}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Last Packet Creation Time:</span>
          <span className="text-slate-200">{zoneA.lastPacketTime || 'Awaiting transmission...'}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1">
            <Send className="w-3.5 h-3.5 text-blue-400" />
            Simulated Transmission Status:
          </span>
          <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 text-[11px]">
            {zoneA.txStatus}
          </span>
        </div>
        <div className="mt-1 text-[10px] text-slate-500 italic">
          * Zone A physical hardware & sensor board integration: Planned future work.
        </div>
      </div>
    </div>
  );
};
