import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  Flame,
  Thermometer,
  Activity,
  WifiOff,
  Wifi,
  BatteryLow,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { DemoScenarioType } from '../../types/mineguard';

interface DemoScenarioBarProps {
  activeScenario: string | null;
  onTriggerScenario: (scenario: DemoScenarioType) => void;
  compact?: boolean;
}

export const DemoScenarioBar: React.FC<DemoScenarioBarProps> = ({
  activeScenario,
  onTriggerScenario,
  compact = false,
}) => {
  const scenarios: Array<{
    id: DemoScenarioType;
    label: string;
    description: string;
    icon: React.ReactNode;
    colorClass: string;
    activeBorderClass: string;
  }> = [
    {
      id: 'NORMAL',
      label: 'Normal Operation',
      description: 'Nominal telemetry & link',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
      colorClass: 'hover:border-emerald-300 hover:bg-emerald-50/50',
      activeBorderClass: 'border-emerald-500 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-400',
    },
    {
      id: 'GAS_WARNING',
      label: 'Gas Warning',
      description: 'Elevated gas > 35 ppm',
      icon: <AlertTriangle className="w-4 h-4 text-amber-600" />,
      colorClass: 'hover:border-amber-300 hover:bg-amber-50/50',
      activeBorderClass: 'border-amber-500 bg-amber-50 text-amber-900 ring-1 ring-amber-400',
    },
    {
      id: 'GAS_CRITICAL',
      label: 'Critical Gas Alert',
      description: 'Toxic hazard > 75 ppm',
      icon: <Flame className="w-4 h-4 text-red-600" />,
      colorClass: 'hover:border-red-300 hover:bg-red-50/50',
      activeBorderClass: 'border-red-500 bg-red-50 text-red-900 ring-1 ring-red-400',
    },
    {
      id: 'HIGH_TEMP',
      label: 'High Temperature',
      description: 'Ambient rise > 38°C',
      icon: <Thermometer className="w-4 h-4 text-amber-600" />,
      colorClass: 'hover:border-amber-300 hover:bg-amber-50/50',
      activeBorderClass: 'border-amber-500 bg-amber-50 text-amber-900 ring-1 ring-amber-400',
    },
    {
      id: 'FALL_IMPACT',
      label: 'Fall / Impact Detected',
      description: 'IMU 6-axis shock event',
      icon: <Activity className="w-4 h-4 text-red-600" />,
      colorClass: 'hover:border-red-300 hover:bg-red-50/50',
      activeBorderClass: 'border-red-500 bg-red-50 text-red-900 ring-1 ring-red-400',
    },
    {
      id: 'COMM_FAILURE',
      label: 'LoRa Communication Failure',
      description: 'Link severed, packets drop',
      icon: <WifiOff className="w-4 h-4 text-red-600" />,
      colorClass: 'hover:border-red-300 hover:bg-red-50/50',
      activeBorderClass: 'border-red-500 bg-red-50 text-red-900 ring-1 ring-red-400',
    },
    {
      id: 'RESTORE_COMM',
      label: 'Restore Communication',
      description: 'Resume packet flow',
      icon: <Wifi className="w-4 h-4 text-cyan-600" />,
      colorClass: 'hover:border-cyan-300 hover:bg-cyan-50/50',
      activeBorderClass: 'border-cyan-500 bg-cyan-50 text-cyan-900 ring-1 ring-cyan-400',
    },
    {
      id: 'LOW_BATTERY',
      label: 'Low Battery',
      description: '14% & Adaptive power mode',
      icon: <BatteryLow className="w-4 h-4 text-amber-600" />,
      colorClass: 'hover:border-amber-300 hover:bg-amber-50/50',
      activeBorderClass: 'border-amber-500 bg-amber-50 text-amber-900 ring-1 ring-amber-400',
    },
    {
      id: 'RESET',
      label: 'Reset Simulation',
      description: 'Restore clean defaults',
      icon: <RotateCcw className="w-4 h-4 text-slate-600" />,
      colorClass: 'hover:border-slate-400 hover:bg-slate-100',
      activeBorderClass: 'border-slate-400 bg-slate-100 text-slate-800',
    },
  ];

  return (
    <div className="bg-white rounded-lg border border-[#E5E7EB] p-3 shadow-sm mb-6">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#FF3B30]" />
          <span className="text-xs font-bold uppercase tracking-wider text-[#171A21]">
            Interactive Demo Scenarios
          </span>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-[#697386]">
            One-Click Hazard Injection
          </span>
        </div>
        <span className="text-[11px] text-[#697386] hidden sm:inline">
          Injected scenarios immediately update telemetry, charts, Zone B logic, and alerts
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-2">
        {scenarios.map((scen, idx) => {
          const isActive = activeScenario === scen.id || (scen.id === 'NORMAL' && activeScenario === null);
          return (
            <button
              key={scen.id}
              onClick={() => onTriggerScenario(scen.id)}
              className={`p-2.5 rounded-md border text-left transition-all flex flex-col justify-between ${
                isActive
                  ? scen.activeBorderClass
                  : `border-[#E5E7EB] bg-white text-[#171A21] ${scen.colorClass}`
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                {scen.icon}
                <span className="text-[10px] font-mono text-[#9CA3AF] font-bold">{idx + 1}</span>
              </div>
              <div>
                <div className="text-xs font-semibold leading-snug">{scen.label}</div>
                {!compact && (
                  <div className="text-[10px] text-[#697386] leading-tight mt-0.5">
                    {scen.description}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
