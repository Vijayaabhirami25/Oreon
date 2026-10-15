import React from 'react';
import {
  Menu,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Sparkles,
} from 'lucide-react';
import { NavTab, SystemStatus } from '../../types/mineguard';

interface HeaderProps {
  activeTab: NavTab;
  isRunning: boolean;
  systemStatus: SystemStatus;
  activeScenario: string | null;
  onTogglePlay: () => void;
  onReset: () => void;
  onOpenMobileSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  isRunning,
  systemStatus,
  activeScenario,
  onTogglePlay,
  onReset,
  onOpenMobileSidebar,
}) => {
  const getTabTitle = (tab: NavTab) => {
    switch (tab) {
      case 'overview':
        return 'Mining Safety Overview';
      case 'zone-a':
        return 'Zone A — Sensor Unit';
      case 'zone-b':
        return 'Zone B — Control & Power Management';
      case 'lora':
        return 'Proposed LoRa Communication Link';
      case 'analytics':
        return 'Multi-Metric Telemetry Analytics';
      case 'alerts':
        return 'Hazard Alert Center';
      case 'logs':
        return 'System Event Audit Logs';
      case 'settings':
        return 'Simulation & Threshold Settings';
      default:
        return 'Safety Dashboard';
    }
  };

  const getStatusBadge = () => {
    switch (systemStatus) {
      case 'CRITICAL':
        return (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626]">
            <AlertOctagon className="w-3.5 h-3.5" />
            <span className="text-xs font-semibold tracking-wide uppercase">Critical Hazard</span>
          </div>
        );
      case 'WARNING':
        return (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#FFFBEB] border border-[#FDE68A] text-[#D97706]">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span className="text-xs font-semibold tracking-wide uppercase">Hazard Warning</span>
          </div>
        );
      case 'NORMAL':
      default:
        return (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#ECFDF5] border border-[#A7F3D0] text-[#059669]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span className="text-xs font-semibold tracking-wide uppercase">System Nominal</span>
          </div>
        );
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-[#E5E7EB] shadow-sm">
      {/* Simulation Disclaimer Strip */}
      <div className="bg-[#FFF8F7] border-b border-[#FF3B30]/15 px-4 py-1 text-center text-xs text-[#E02E24] flex items-center justify-center gap-2">
        <span className="w-2 h-2 rounded-full bg-[#FF3B30] inline-block animate-pulse"></span>
        <span className="font-semibold tracking-tight">SOFTWARE SIMULATION — NO PHYSICAL SENSORS CONNECTED.</span>
        <span className="text-[#697386] hidden sm:inline text-[11px]">
          All telemetry readings, LoRa transmissions, and battery metrics are simulated for concept validation.
        </span>
      </div>

      <div className="px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        {/* Left: Hamburger & Context Breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileSidebar}
            className="lg:hidden p-1.5 rounded-md text-[#4A5568] hover:bg-slate-100"
            title="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2 text-xs text-[#697386]">
              <span>OREON</span>
              <span>/</span>
              <span className="font-medium text-[#171A21]">{getTabTitle(activeTab)}</span>
            </div>
            <h1 className="text-base sm:text-lg font-bold text-[#171A21] tracking-tight leading-tight">
              {getTabTitle(activeTab)}
            </h1>
          </div>
        </div>

        {/* Right: Quick Controls & Simulation Status */}
        <div className="flex items-center gap-3 flex-wrap">
          {activeScenario && activeScenario !== 'NORMAL' && (
            <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono bg-purple-50 border border-purple-200 text-purple-700 font-medium">
              <Sparkles className="w-3 h-3 text-purple-600" />
              Active: {activeScenario}
            </span>
          )}

          {getStatusBadge()}

          {/* Runtime Controls */}
          <div className="flex items-center gap-1.5 bg-[#F7F8FA] p-1 rounded-lg border border-[#E5E7EB]">
            <button
              onClick={onTogglePlay}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
                isRunning
                  ? 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
              }`}
              title={isRunning ? 'Pause simulation engine' : 'Resume simulation engine'}
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
              onClick={onReset}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium text-[#4A5568] hover:text-[#171A21] hover:bg-white transition-colors"
              title="Reset simulation to initial nominal baseline"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
