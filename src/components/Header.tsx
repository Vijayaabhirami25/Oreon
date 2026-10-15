import React from 'react';
import { Play, Pause, RotateCcw, Sliders, Shield, AlertTriangle, AlertOctagon, CheckCircle2 } from 'lucide-react';
import { SystemStatus } from '../types/mineguard';

interface HeaderProps {
  isRunning: boolean;
  systemStatus: SystemStatus;
  activeScenario: string | null;
  onTogglePlay: () => void;
  onReset: () => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isRunning,
  systemStatus,
  activeScenario,
  onTogglePlay,
  onReset,
  onOpenSettings,
}) => {
  const getStatusBadge = () => {
    switch (systemStatus) {
      case 'CRITICAL':
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-950/80 border border-red-500/80 text-red-300 status-glow-red animate-pulse">
            <AlertOctagon className="w-4 h-4 text-red-400" />
            <span className="text-xs font-semibold tracking-wider uppercase">SIMULATED CRITICAL HAZARD</span>
          </div>
        );
      case 'WARNING':
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-950/80 border border-amber-500/80 text-amber-300 status-glow-amber">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-semibold tracking-wider uppercase">SIMULATED HAZARD WARNING</span>
          </div>
        );
      case 'NORMAL':
      default:
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-500/60 text-emerald-300 status-glow-green">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold tracking-wider uppercase">SIMULATED SYSTEM NORMAL</span>
          </div>
        );
    }
  };

  return (
    <header className="border-b border-slate-800/80 bg-charcoal-900/95 sticky top-0 z-40 backdrop-blur-md">
      {/* Top Warning Strip */}
      <div className="bg-gradient-to-r from-amber-950/70 via-amber-900/40 to-amber-950/70 border-b border-amber-500/30 px-4 py-1.5 text-center text-xs text-amber-300 flex items-center justify-center gap-2 font-medium">
        <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
        <span>
          <strong>SOFTWARE SIMULATION — NO PHYSICAL SENSORS CONNECTED.</strong> Demonstration using simulated data. LoRa transmission, gas, IMU, and battery metrics are simulated for concept validation.
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Left: Branding & Team Info */}
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500/20 to-blue-500/10 border border-amber-500/40 shadow-inner">
              <Shield className="w-7 h-7 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2 font-mono-num">
                  OREON
                  <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-blue-900/50 text-blue-300 border border-blue-700/50">
                    DUAL-ZONE V1.0
                  </span>
                </h1>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-400/10 border border-amber-400/40 text-amber-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                  SIMULATION MODE
                </span>
                {activeScenario && activeScenario !== 'NORMAL' && (
                  <span className="px-2 py-0.5 rounded text-xs font-mono bg-purple-900/40 border border-purple-500/40 text-purple-300">
                    Scenario: {activeScenario}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Intelligent Mining Safety Helmet • Dual-Zone Hardware Architecture & Adaptive Power Management
              </p>
              <div className="text-[11px] text-slate-400 flex items-center gap-3 mt-1 font-mono">
                <span>Team: <strong className="text-slate-200">VAYUJ NEXUS</strong></span>
                <span>•</span>
                <span>ID: <strong className="text-slate-200">HSN|TN|00803</strong></span>
                <span>•</span>
                <span>State: <strong className="text-slate-200">Tamil Nadu</strong></span>
              </div>
            </div>
          </div>

          {/* Right: Controls & Status */}
          <div className="flex items-center gap-3 flex-wrap">
            {getStatusBadge()}

            <div className="flex items-center bg-slate-900/90 rounded-lg p-1 border border-slate-700/60 shadow-sm">
              <button
                id="btn-toggle-simulation"
                onClick={onTogglePlay}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  isRunning
                    ? 'bg-amber-600/30 text-amber-200 hover:bg-amber-600/40 border border-amber-500/40'
                    : 'bg-emerald-600/30 text-emerald-200 hover:bg-emerald-600/40 border border-emerald-500/40'
                }`}
                title={isRunning ? 'Pause automatic simulation updates' : 'Resume simulation updates'}
              >
                {isRunning ? (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Start</span>
                  </>
                )}
              </button>

              <button
                id="btn-reset-simulation"
                onClick={onReset}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                title="Reset simulation parameters to default safe state"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>

              <button
                id="btn-threshold-settings"
                onClick={onOpenSettings}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                title="Configure demo simulation thresholds"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Thresholds</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
