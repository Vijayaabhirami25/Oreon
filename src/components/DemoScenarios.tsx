import React from 'react';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Thermometer,
  Activity,
  WifiOff,
  Wifi,
  BatteryLow,
  RotateCcw,
} from 'lucide-react';
import { DemoScenarioType } from '../types/mineguard';

interface DemoScenariosProps {
  activeScenario: string | null;
  onTriggerScenario: (scenario: DemoScenarioType) => void;
}

export const DemoScenarios: React.FC<DemoScenariosProps> = ({
  activeScenario,
  onTriggerScenario,
}) => {
  return (
    <section id="demo-scenarios-section" className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold tracking-wider uppercase text-slate-300 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Interactive Demo Scenarios</span>
          <span className="text-[11px] font-mono font-normal px-2 py-0.5 rounded bg-amber-400/10 text-amber-300 border border-amber-400/30">
            One-Click Hazard Injection
          </span>
        </h2>
        <span className="text-xs text-slate-400 font-mono hidden sm:inline">
          Click any scenario to inject simulated conditions
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-2.5">
        {/* 1. Normal Operation */}
        <button
          id="btn-scenario-normal"
          onClick={() => onTriggerScenario('NORMAL')}
          className={`p-3 rounded-lg border text-left transition-all flex flex-col justify-between ${
            activeScenario === 'NORMAL' || activeScenario === null
              ? 'bg-emerald-950/70 border-emerald-500/80 shadow-md ring-1 ring-emerald-500/50'
              : 'bg-slate-900/60 border-slate-800 hover:border-emerald-600/50 hover:bg-slate-800/80'
          }`}
        >
          <div className="flex items-center justify-between">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="text-[9px] font-mono text-emerald-400 font-semibold uppercase">1</span>
          </div>
          <div className="mt-2">
            <div className="text-xs font-semibold text-white">NORMAL OPERATION</div>
            <div className="text-[10px] text-slate-400 leading-tight mt-0.5">
              Safe baseline telemetry & nominal link
            </div>
          </div>
        </button>

        {/* 2. Gas Warning */}
        <button
          id="btn-scenario-gas-warn"
          onClick={() => onTriggerScenario('GAS_WARNING')}
          className={`p-3 rounded-lg border text-left transition-all flex flex-col justify-between ${
            activeScenario === 'GAS_WARNING'
              ? 'bg-amber-950/70 border-amber-500/80 shadow-md ring-1 ring-amber-500/50'
              : 'bg-slate-900/60 border-slate-800 hover:border-amber-600/50 hover:bg-slate-800/80'
          }`}
        >
          <div className="flex items-center justify-between">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span className="text-[9px] font-mono text-amber-400 font-semibold uppercase">2</span>
          </div>
          <div className="mt-2">
            <div className="text-xs font-semibold text-white">GAS WARNING</div>
            <div className="text-[10px] text-slate-400 leading-tight mt-0.5">
              Simulates elevated gas &gt; 35 ppm
            </div>
          </div>
        </button>

        {/* 3. Critical Gas Alert */}
        <button
          id="btn-scenario-gas-crit"
          onClick={() => onTriggerScenario('GAS_CRITICAL')}
          className={`p-3 rounded-lg border text-left transition-all flex flex-col justify-between ${
            activeScenario === 'GAS_CRITICAL'
              ? 'bg-red-950/70 border-red-500/80 shadow-md ring-1 ring-red-500/50'
              : 'bg-slate-900/60 border-slate-800 hover:border-red-600/50 hover:bg-slate-800/80'
          }`}
        >
          <div className="flex items-center justify-between">
            <Flame className="w-4 h-4 text-red-400" />
            <span className="text-[9px] font-mono text-red-400 font-semibold uppercase">3</span>
          </div>
          <div className="mt-2">
            <div className="text-xs font-semibold text-white">CRITICAL GAS ALERT</div>
            <div className="text-[10px] text-slate-400 leading-tight mt-0.5">
              Toxic hazard spike &gt; 75 ppm
            </div>
          </div>
        </button>

        {/* 4. High Temperature */}
        <button
          id="btn-scenario-high-temp"
          onClick={() => onTriggerScenario('HIGH_TEMP')}
          className={`p-3 rounded-lg border text-left transition-all flex flex-col justify-between ${
            activeScenario === 'HIGH_TEMP'
              ? 'bg-amber-950/70 border-amber-500/80 shadow-md ring-1 ring-amber-500/50'
              : 'bg-slate-900/60 border-slate-800 hover:border-amber-600/50 hover:bg-slate-800/80'
          }`}
        >
          <div className="flex items-center justify-between">
            <Thermometer className="w-4 h-4 text-amber-400" />
            <span className="text-[9px] font-mono text-amber-400 font-semibold uppercase">4</span>
          </div>
          <div className="mt-2">
            <div className="text-xs font-semibold text-white">HIGH TEMPERATURE</div>
            <div className="text-[10px] text-slate-400 leading-tight mt-0.5">
              Simulates ambient thermal rise &gt; 38°C
            </div>
          </div>
        </button>

        {/* 5. Fall / Impact Detected */}
        <button
          id="btn-scenario-fall"
          onClick={() => onTriggerScenario('FALL_IMPACT')}
          className={`p-3 rounded-lg border text-left transition-all flex flex-col justify-between ${
            activeScenario === 'FALL_IMPACT'
              ? 'bg-red-950/70 border-red-500/80 shadow-md ring-1 ring-red-500/50'
              : 'bg-slate-900/60 border-slate-800 hover:border-red-600/50 hover:bg-slate-800/80'
          }`}
        >
          <div className="flex items-center justify-between">
            <Activity className="w-4 h-4 text-red-400" />
            <span className="text-[9px] font-mono text-red-400 font-semibold uppercase">5</span>
          </div>
          <div className="mt-2">
            <div className="text-xs font-semibold text-white">FALL / IMPACT DETECTED</div>
            <div className="text-[10px] text-slate-400 leading-tight mt-0.5">
              Zone A IMU 6-axis shock event
            </div>
          </div>
        </button>

        {/* 6. LoRa Communication Failure (exact requested label) */}
        <button
          id="btn-scenario-comm-failure"
          onClick={() => onTriggerScenario('COMM_FAILURE')}
          className={`p-3 rounded-lg border text-left transition-all flex flex-col justify-between ${
            activeScenario === 'COMM_FAILURE'
              ? 'bg-red-950/70 border-red-500/80 shadow-md ring-1 ring-red-500/50'
              : 'bg-slate-900/60 border-slate-800 hover:border-red-600/50 hover:bg-slate-800/80'
          }`}
        >
          <div className="flex items-center justify-between">
            <WifiOff className="w-4 h-4 text-red-400" />
            <span className="text-[9px] font-mono text-red-400 font-semibold uppercase">6</span>
          </div>
          <div className="mt-2">
            <div className="text-xs font-semibold text-white">LoRa Communication Failure</div>
            <div className="text-[10px] text-slate-400 leading-tight mt-0.5">
              Sever proposed link & drop packets
            </div>
          </div>
        </button>

        {/* 7. Restore Communication */}
        <button
          id="btn-scenario-restore-comm"
          onClick={() => onTriggerScenario('RESTORE_COMM')}
          className={`p-3 rounded-lg border text-left transition-all flex flex-col justify-between ${
            activeScenario === 'RESTORE_COMM'
              ? 'bg-cyan-950/70 border-cyan-500/80 shadow-md ring-1 ring-cyan-500/50'
              : 'bg-slate-900/60 border-slate-800 hover:border-cyan-600/50 hover:bg-slate-800/80'
          }`}
        >
          <div className="flex items-center justify-between">
            <Wifi className="w-4 h-4 text-cyan-400" />
            <span className="text-[9px] font-mono text-cyan-400 font-semibold uppercase">7</span>
          </div>
          <div className="mt-2">
            <div className="text-xs font-semibold text-white">RESTORE COMMUNICATION</div>
            <div className="text-[10px] text-slate-400 leading-tight mt-0.5">
              Re-establish simulated link
            </div>
          </div>
        </button>

        {/* 8. Low Battery */}
        <button
          id="btn-scenario-low-battery"
          onClick={() => onTriggerScenario('LOW_BATTERY')}
          className={`p-3 rounded-lg border text-left transition-all flex flex-col justify-between ${
            activeScenario === 'LOW_BATTERY'
              ? 'bg-amber-950/70 border-amber-500/80 shadow-md ring-1 ring-amber-500/50'
              : 'bg-slate-900/60 border-slate-800 hover:border-amber-600/50 hover:bg-slate-800/80'
          }`}
        >
          <div className="flex items-center justify-between">
            <BatteryLow className="w-4 h-4 text-amber-400" />
            <span className="text-[9px] font-mono text-amber-400 font-semibold uppercase">8</span>
          </div>
          <div className="mt-2">
            <div className="text-xs font-semibold text-white">LOW BATTERY</div>
            <div className="text-[10px] text-slate-400 leading-tight mt-0.5">
              Zone B 14% & Adaptive Power Saving
            </div>
          </div>
        </button>

        {/* 9. Reset Simulation */}
        <button
          id="btn-scenario-reset"
          onClick={() => onTriggerScenario('RESET')}
          className="p-3 rounded-lg border border-slate-700 bg-slate-900/90 hover:bg-slate-800 text-left transition-all flex flex-col justify-between hover:border-slate-500"
        >
          <div className="flex items-center justify-between">
            <RotateCcw className="w-4 h-4 text-slate-400" />
            <span className="text-[9px] font-mono text-slate-400 font-semibold uppercase">9</span>
          </div>
          <div className="mt-2">
            <div className="text-xs font-semibold text-white">RESET SIMULATION</div>
            <div className="text-[10px] text-slate-400 leading-tight mt-0.5">
              Restore defaults & clear demo state
            </div>
          </div>
        </button>
      </div>
    </section>
  );
};
