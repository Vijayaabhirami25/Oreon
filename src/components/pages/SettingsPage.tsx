import React, { useState } from 'react';
import {
  Settings,
  Sliders,
  AlertTriangle,
  RotateCcw,
  Check,
  Shield,
  Clock,
  Play,
  Pause,
} from 'lucide-react';
import { ThresholdConfig, AppSettings } from '../../types/mineguard';
import { DEFAULT_THRESHOLDS } from '../../services/simulationEngine';

interface SettingsPageProps {
  thresholds: ThresholdConfig;
  settings: AppSettings;
  isRunning: boolean;
  onSaveThresholds: (thresholds: ThresholdConfig) => void;
  onUpdateSettings: (settings: Partial<AppSettings>) => void;
  onTogglePlay: () => void;
  onResetSimulation: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  thresholds,
  settings,
  isRunning,
  onSaveThresholds,
  onUpdateSettings,
  onTogglePlay,
  onResetSimulation,
}) => {
  const [formData, setFormData] = useState<ThresholdConfig>({ ...thresholds });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const handleThresholdChange = (key: keyof ThresholdConfig, value: number) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setErrorMsg(null);
    setSaveSuccess(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate ordering
    if (formData.gasWarning >= formData.gasCritical) {
      setErrorMsg('Gas Warning threshold must be strictly less than Gas Critical threshold.');
      return;
    }
    if (formData.tempWarning >= formData.tempCritical) {
      setErrorMsg('Temperature Warning threshold must be strictly less than Temperature Critical threshold.');
      return;
    }
    if (formData.batteryLow < 5 || formData.batteryLow > 50) {
      setErrorMsg('Low Battery threshold must be between 5% and 50%.');
      return;
    }

    onSaveThresholds(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleResetDefaults = () => {
    setFormData({ ...DEFAULT_THRESHOLDS });
    onSaveThresholds({ ...DEFAULT_THRESHOLDS });
    setErrorMsg(null);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="pb-2 border-b border-[#E5E7EB]">
        <h2 className="text-xl font-bold tracking-tight text-[#171A21] flex items-center gap-2">
          <Settings className="w-5 h-5 text-[#2563EB]" />
          Simulation & Threshold Configuration
        </h2>
        <p className="text-xs text-[#697386] mt-0.5">
          Fine-tune simulated hazard evaluation limits, execution cycle rates, and view architectural metadata.
        </p>
      </div>

      {/* Section A: Demo Hazard Thresholds */}
      <div className="ciklum-card p-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#FF3B30]" />
            <h3 className="text-sm font-bold text-[#171A21]">Configurable Demo Safety Thresholds</h3>
          </div>
          <span className="text-xs font-mono text-[#697386]">Zone B Evaluation Rules</span>
        </div>

        {/* Disclaimer */}
        <div className="my-3 p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="leading-snug">
            <strong>DEMO THRESHOLDS ONLY:</strong> These values configure the software simulation state engine for demonstrations. They are illustrative and do not replace certified underground mining statutory regulations.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-3 p-2.5 rounded bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
            {errorMsg}
          </div>
        )}

        {saveSuccess && (
          <div className="mb-3 p-2.5 rounded bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium flex items-center gap-1.5">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Threshold parameters applied successfully.</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#171A21] mb-1">
                Hazardous Gas Warning Threshold (ppm)
              </label>
              <input
                type="number"
                min="5"
                max="120"
                step="1"
                value={formData.gasWarning}
                onChange={(e) => handleThresholdChange('gasWarning', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded border border-[#E5E7EB] bg-white text-xs font-mono text-[#171A21] focus:outline-none focus:border-[#FF3B30]"
              />
              <span className="text-[10px] text-[#697386] mt-0.5 block">Triggers WARNING alert level</span>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#171A21] mb-1">
                Hazardous Gas Critical Threshold (ppm)
              </label>
              <input
                type="number"
                min="20"
                max="300"
                step="1"
                value={formData.gasCritical}
                onChange={(e) => handleThresholdChange('gasCritical', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded border border-[#E5E7EB] bg-white text-xs font-mono text-[#171A21] focus:outline-none focus:border-[#FF3B30]"
              />
              <span className="text-[10px] text-[#697386] mt-0.5 block">Triggers CRITICAL evacuation alarm</span>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#171A21] mb-1">
                Ambient Temperature Warning (°C)
              </label>
              <input
                type="number"
                min="20"
                max="55"
                step="0.5"
                value={formData.tempWarning}
                onChange={(e) => handleThresholdChange('tempWarning', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded border border-[#E5E7EB] bg-white text-xs font-mono text-[#171A21] focus:outline-none focus:border-[#FF3B30]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#171A21] mb-1">
                Ambient Temperature Critical (°C)
              </label>
              <input
                type="number"
                min="30"
                max="75"
                step="0.5"
                value={formData.tempCritical}
                onChange={(e) => handleThresholdChange('tempCritical', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded border border-[#E5E7EB] bg-white text-xs font-mono text-[#171A21] focus:outline-none focus:border-[#FF3B30]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#171A21] mb-1">
                Low Battery Mode Threshold (%)
              </label>
              <input
                type="number"
                min="5"
                max="40"
                step="1"
                value={formData.batteryLow}
                onChange={(e) => handleThresholdChange('batteryLow', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded border border-[#E5E7EB] bg-white text-xs font-mono text-[#171A21] focus:outline-none focus:border-[#FF3B30]"
              />
              <span className="text-[10px] text-[#697386] mt-0.5 block">Activates Adaptive Power-Saving Mode</span>
            </div>
          </div>

          <div className="pt-3 border-t border-[#E5E7EB] flex items-center justify-between">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="px-3 py-1.5 rounded border border-[#E5E7EB] text-xs font-medium text-[#697386] hover:bg-slate-50 flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Defaults
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded bg-[#FF3B30] hover:bg-[#E02E24] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              Apply Changes
            </button>
          </div>
        </form>
      </div>

      {/* Section B: Simulation Engine Settings */}
      <div className="ciklum-card p-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#2563EB]" />
            <h3 className="text-sm font-bold text-[#171A21]">Simulation Engine Controls</h3>
          </div>
          <span className="text-xs font-mono text-[#697386]">State Machine Parameters</span>
        </div>

        <div className="space-y-4 mt-3 text-xs">
          {/* Update Rate Slider */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-[#171A21]">Telemetry Sample Interval:</span>
              <span className="font-mono font-bold text-[#2563EB]">{settings.updateIntervalMs} ms</span>
            </div>
            <input
              type="range"
              min="800"
              max="3500"
              step="100"
              value={settings.updateIntervalMs}
              onChange={(e) => onUpdateSettings({ updateIntervalMs: parseInt(e.target.value) })}
              className="w-full accent-[#2563EB]"
            />
            <div className="flex justify-between text-[10px] text-[#9CA3AF] mt-0.5">
              <span>Fast (800ms)</span>
              <span>Nominal (1500ms)</span>
              <span>Slow (3500ms)</span>
            </div>
          </div>

          {/* Engine State: Start/Pause */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-100">
            <div>
              <div className="font-bold text-[#171A21]">Simulation Execution State</div>
              <div className="text-[11px] text-[#697386]">Currently: {isRunning ? 'RUNNING' : 'PAUSED'}</div>
            </div>
            <button
              onClick={onTogglePlay}
              className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 border ${
                isRunning
                  ? 'bg-amber-50 border-amber-200 text-amber-800'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-800'
              }`}
            >
              {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isRunning ? 'Pause Engine' : 'Resume Engine'}</span>
            </button>
          </div>

          {/* Reset button */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-100">
            <div>
              <div className="font-bold text-[#171A21]">Reset Simulation Engine</div>
              <div className="text-[11px] text-[#697386]">Restores all telemetry, packets, and alerts to baseline</div>
            </div>
            <button
              onClick={onResetSimulation}
              className="px-3 py-1.5 rounded border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 text-xs font-semibold"
            >
              Reset All
            </button>
          </div>
        </div>
      </div>

      {/* Section D & E: System Information & Limitations */}
      <div className="ciklum-card p-5">
        <h3 className="text-sm font-bold text-[#171A21] mb-2 flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#10B981]" />
          System Information & Scope of Prototype
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono my-3 p-3 rounded bg-[#F8FAFC] border border-[#E5E7EB]">
          <div>
            <span className="text-[10px] text-[#9CA3AF] block font-sans">Project</span>
            <strong className="text-[#171A21]">OREON</strong>
          </div>
          <div>
            <span className="text-[10px] text-[#9CA3AF] block font-sans">Team Name</span>
            <strong className="text-[#171A21]">VAYUJ NEXUS</strong>
          </div>
          <div>
            <span className="text-[10px] text-[#9CA3AF] block font-sans">Team ID</span>
            <strong className="text-[#171A21]">HSN|TN|00803</strong>
          </div>
          <div>
            <span className="text-[10px] text-[#9CA3AF] block font-sans">State</span>
            <strong className="text-[#171A21]">Tamil Nadu</strong>
          </div>
        </div>

        <div className="space-y-2 text-xs text-[#697386] leading-relaxed pt-2">
          <p>
            <strong>Simulation Scope:</strong> This software is a functional prototype modeling the dual-zone architecture and adaptive power-saving concept. All gas readings, thermal metrics, IMU impact detections, and LoRa packet drop calculations are generated via deterministic frontend algorithms.
          </p>
          <p>
            <strong>Future Work:</strong> Physical PCB integration, enclosure ruggedization, and statutory intrinsic safety certification (e.g., DGMS / ATEX Zone 0/1) are scheduled for downstream research phases.
          </p>
        </div>
      </div>
    </div>
  );
};
