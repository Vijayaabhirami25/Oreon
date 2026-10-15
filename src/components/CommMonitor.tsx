import React from 'react';
import { Wifi, WifiOff, CheckCircle2, AlertOctagon, Activity, Radio, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { CommState } from '../types/mineguard';

interface CommMonitorProps {
  comm: CommState;
}

export const CommMonitor: React.FC<CommMonitorProps> = ({ comm }) => {
  const isConnected = comm.status === 'CONNECTED';
  const totalAttempted = comm.packetsSent;
  const lossRate = totalAttempted > 0 ? ((comm.packetsLost / totalAttempted) * 100).toFixed(1) : '0.0';

  return (
    <div id="comm-monitor-card" className="industrial-card p-5">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            {isConnected ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5 text-red-400" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-white tracking-wide">PROPOSED LoRa COMMUNICATION LINK</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-600/50 text-cyan-300">
                SIMULATED
              </span>
            </div>
            <p className="text-xs text-slate-400">Dual-Zone Inter-Unit Wireless Telemetry Channel</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium border ${
              isConnected
                ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300'
                : 'bg-red-950/80 border-red-500 text-red-300 animate-pulse'
            }`}
          >
            {isConnected ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                LINK: CONNECTED
              </>
            ) : (
              <>
                <AlertOctagon className="w-3.5 h-3.5 text-red-400" />
                LINK: DISCONNECTED
              </>
            )}
          </span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
        {/* Packets Sent */}
        <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
          <div className="text-[11px] text-slate-400 flex items-center justify-between">
            <span>Packets Sent</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="text-xl font-bold font-mono-num text-white mt-1">
            {comm.packetsSent}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">By Zone A transmitter</div>
        </div>

        {/* Packets Received */}
        <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
          <div className="text-[11px] text-slate-400 flex items-center justify-between">
            <span>Packets Received</span>
            <ArrowDownRight className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-bold font-mono-num text-emerald-400 mt-1">
            {comm.packetsReceived}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Validated by Zone B</div>
        </div>

        {/* Packets Lost */}
        <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
          <div className="text-[11px] text-slate-400 flex items-center justify-between">
            <span>Packets Lost</span>
            <Activity className="w-3.5 h-3.5 text-red-400" />
          </div>
          <div className={`text-xl font-bold font-mono-num mt-1 ${comm.packetsLost > 0 ? 'text-red-400' : 'text-slate-400'}`}>
            {comm.packetsLost}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Loss Rate: {lossRate}%</div>
        </div>

        {/* Simulated Quality */}
        <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
          <div className="text-[11px] text-slate-400 flex items-center justify-between">
            <span>Simulated Quality</span>
            <Radio className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className={`text-lg font-bold font-mono-num mt-1 ${isConnected ? 'text-cyan-300' : 'text-red-400'}`}>
            {comm.qualitySimulated}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            Last: {comm.lastPacketTime || 'None'}
          </div>
        </div>
      </div>

      {/* Notice Banner */}
      <div className="p-2.5 rounded-lg bg-charcoal-950/80 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
        <span className="text-cyan-400 font-bold font-mono">NOTICE:</span>
        <span className="leading-relaxed">
          LoRa transmission parameters, radio modulation schemes, frequencies, and physical signal strengths (RSSI/SNR) are part of the conceptual hardware specification and are simulated in this software release. Field validation is scheduled for subsequent hardware prototyping phases.
        </span>
      </div>
    </div>
  );
};
