import React, { useState } from 'react';
import {
  Radio,
  ArrowRight,
  Battery,
  Zap,
  ChevronDown,
  ChevronUp,
  FileCode,
  ShieldCheck,
  Server,
} from 'lucide-react';
import { ZoneBState, ThresholdConfig } from '../types/mineguard';

interface ZoneBCardProps {
  zoneB: ZoneBState;
  thresholds: ThresholdConfig;
}

export const ZoneBCard: React.FC<ZoneBCardProps> = ({ zoneB, thresholds }) => {
  const [showPacketDetails, setShowPacketDetails] = useState<boolean>(false);
  const isPowerSaving = zoneB.powerMode === 'POWER SAVING';

  return (
    <div id="zone-b-card" className="industrial-card p-5 flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-white tracking-wide">ZONE B — CONTROL & POWER UNIT</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950/80 border border-blue-600/50 text-blue-300">
                  SIMULATED
                </span>
              </div>
              <p className="text-xs text-slate-400">Intelligent Safety Controller & Adaptive Power Manager</p>
            </div>
          </div>
          <span
            className={`px-2.5 py-1 rounded text-xs font-mono font-medium border ${
              zoneB.rxStatus === 'RECEIVED_OK'
                ? 'bg-blue-950/60 border-blue-600/50 text-blue-300'
                : 'bg-red-950/80 border-red-500 text-red-300'
            }`}
          >
            RX: {zoneB.rxStatus}
          </span>
        </div>

        {/* Architectural Data Flow Diagram */}
        <div className="my-3.5 p-2.5 rounded-lg bg-charcoal-950/70 border border-slate-800/80">
          <div className="text-[11px] font-mono text-slate-400 mb-1.5 flex items-center justify-between">
            <span>PROPOSED ZONE B DECISION PIPELINE:</span>
            <span className="text-[10px] text-blue-400 font-semibold">Simulated Pipeline</span>
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-300 gap-1 overflow-x-auto py-1">
            <div className="px-2 py-1 rounded bg-slate-800/80 border border-slate-700 text-center whitespace-nowrap">
              <span className="text-[10px] text-slate-400 block">Stage 1</span>
              LoRa Rx (Sim)
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
            <div className="px-2 py-1 rounded bg-blue-950/50 border border-blue-700/60 text-blue-300 text-center whitespace-nowrap">
              <span className="text-[10px] text-blue-400 block">Stage 2</span>
              Validation
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
            <div className="px-2 py-1 rounded bg-purple-950/50 border border-purple-700/60 text-purple-300 text-center whitespace-nowrap">
              <span className="text-[10px] text-purple-400 block">Stage 3</span>
              Hazard Analysis
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
            <div className="px-2 py-1 rounded bg-amber-950/50 border border-amber-700/60 text-amber-300 text-center whitespace-nowrap">
              <span className="text-[10px] text-amber-400 block">Stage 4</span>
              Alerts & Power
            </div>
          </div>
        </div>

        {/* Performance & Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 my-3">
          {/* Packet Validation & Counter */}
          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
            <div className="text-[11px] text-slate-400 flex items-center justify-between mb-1">
              <span className="flex items-center gap-1 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Packet Validation
              </span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${
                  zoneB.packetValidation === 'PASSED'
                    ? 'bg-emerald-950/60 border-emerald-600/50 text-emerald-300'
                    : 'bg-red-950/60 border-red-500 text-red-300'
                }`}
              >
                {zoneB.packetValidation}
              </span>
            </div>
            <div className="text-xl font-bold font-mono-num text-white">
              {zoneB.packetsReceived} <span className="text-xs font-normal text-slate-400">pkts recv</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
              <span>Packets Lost:</span>
              <span className={`font-mono ${zoneB.packetsLost > 0 ? 'text-red-400 font-bold' : 'text-slate-400'}`}>
                {zoneB.packetsLost}
              </span>
            </div>
          </div>

          {/* Simulated Battery & Adaptive Power */}
          <div
            className={`p-3 rounded-lg border ${
              isPowerSaving
                ? 'bg-amber-950/40 border-amber-500/60'
                : 'bg-slate-900/60 border-slate-800'
            }`}
          >
            <div className="text-[11px] text-slate-400 flex items-center justify-between mb-1">
              <span className="flex items-center gap-1 font-medium">
                {isPowerSaving ? (
                  <Zap className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                ) : (
                  <Battery className="w-3.5 h-3.5 text-emerald-400" />
                )}
                Adaptive Power
              </span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${
                  isPowerSaving
                    ? 'bg-amber-950/80 border-amber-500 text-amber-300 font-bold'
                    : 'bg-emerald-950/60 border-emerald-600 text-emerald-300'
                }`}
              >
                {zoneB.powerMode}
              </span>
            </div>
            <div className="text-xl font-bold font-mono-num text-white">
              {zoneB.batteryLevel.toFixed(1)}%
            </div>
            <div className="text-[10px] text-slate-400 mt-1 truncate">
              {isPowerSaving
                ? `Adaptive throttle enabled (<${thresholds.batteryLow}%)`
                : `Full sampling rate active (>${thresholds.batteryLow}%)`}
            </div>
          </div>
        </div>

        {/* Current Automated System Response */}
        <div className="p-3 rounded-lg bg-slate-900/70 border border-slate-800 text-xs text-slate-300">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center justify-between mb-1">
            <span className="flex items-center gap-1.5">
              <Server className="w-3 h-3 text-cyan-400" />
              Automated Safety Controller Response
            </span>
            <span className="text-[9px] text-slate-500">ZONE B LOGIC</span>
          </div>
          <p className="font-mono text-slate-200 text-[11px] leading-relaxed bg-charcoal-950/90 p-2 rounded border border-slate-800/80">
            {zoneB.systemResponse}
          </p>
        </div>
      </div>

      {/* Latest Packet Viewer (Collapsible) */}
      <div className="mt-4 pt-3 border-t border-slate-800/80">
        <button
          onClick={() => setShowPacketDetails(!showPacketDetails)}
          className="w-full flex items-center justify-between px-3 py-1.5 rounded bg-slate-900/90 hover:bg-slate-800 text-xs text-slate-300 border border-slate-800 transition-colors"
        >
          <span className="flex items-center gap-2 font-mono">
            <FileCode className="w-3.5 h-3.5 text-blue-400" />
            <span>Latest Received Packet (Simulated JSON)</span>
            {zoneB.lastPacket && (
              <span className="text-[11px] text-slate-400">#{zoneB.lastPacket.packetId}</span>
            )}
          </span>
          {showPacketDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showPacketDetails && (
          <div className="mt-2 p-2.5 rounded bg-charcoal-950 border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto">
            {zoneB.lastPacket ? (
              <pre className="text-emerald-400 leading-tight">
                {JSON.stringify(zoneB.lastPacket, null, 2)}
              </pre>
            ) : (
              <p className="text-slate-500 italic">No packet received yet.</p>
            )}
            <div className="mt-2 text-[10px] text-slate-500 border-t border-slate-900 pt-1">
              * Packet payload format is a software simulation model. Actual LoRa frame headers and physical radio registers will be finalized during hardware prototyping.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
