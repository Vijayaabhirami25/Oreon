import React, { useState } from 'react';
import { X, Sliders, AlertTriangle, RotateCcw, Check } from 'lucide-react';
import { ThresholdConfig } from '../types/mineguard';
import { DEFAULT_THRESHOLDS } from '../services/simulationEngine';

interface ThresholdSettingsModalProps {
  isOpen: boolean;
  thresholds: ThresholdConfig;
  onClose: () => void;
  onSave: (newThresholds: ThresholdConfig) => void;
}

export const ThresholdSettingsModal: React.FC<ThresholdSettingsModalProps> = ({
  isOpen,
  thresholds,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<ThresholdConfig>({ ...thresholds });

  if (!isOpen) return null;

  const handleChange = (key: keyof ThresholdConfig, value: number) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleResetDefaults = () => {
    setFormData({ ...DEFAULT_THRESHOLDS });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md industrial-card p-6 border-slate-700 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-amber-400" />
            <h3 className="font-semibold text-white">Configure Demo Thresholds</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Disclaimer Strip */}
        <div className="my-3.5 p-2.5 rounded bg-amber-950/40 border border-amber-500/40 text-xs text-amber-300 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="leading-snug">
            <strong>DEMO THRESHOLDS ONLY:</strong> These values are configured for interactive software simulation demonstrations. They do not constitute legally validated occupational safety thresholds for mining operations.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Gas Warning */}
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">
              Gas Warning Threshold (ppm)
            </label>
            <input
              type="number"
              min="5"
              max="150"
              step="1"
              value={formData.gasWarning}
              onChange={(e) => handleChange('gasWarning', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Gas Critical */}
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">
              Gas Critical Threshold (ppm)
            </label>
            <input
              type="number"
              min="10"
              max="300"
              step="1"
              value={formData.gasCritical}
              onChange={(e) => handleChange('gasCritical', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-red-400"
            />
          </div>

          {/* Temp Warning */}
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">
              Temperature Warning Threshold (°C)
            </label>
            <input
              type="number"
              min="20"
              max="60"
              step="0.5"
              value={formData.tempWarning}
              onChange={(e) => handleChange('tempWarning', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Temp Critical */}
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">
              Temperature Critical Threshold (°C)
            </label>
            <input
              type="number"
              min="25"
              max="80"
              step="0.5"
              value={formData.tempCritical}
              onChange={(e) => handleChange('tempCritical', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-red-400"
            />
          </div>

          {/* Battery Low */}
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">
              Low Battery Threshold (% for Adaptive Power Mode)
            </label>
            <input
              type="number"
              min="5"
              max="50"
              step="1"
              value={formData.batteryLow}
              onChange={(e) => handleChange('batteryLow', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-yellow-400"
            />
          </div>

          {/* Modal Actions */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Defaults
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded text-xs text-slate-300 hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-1.5 rounded text-xs font-medium bg-amber-500 hover:bg-amber-400 text-black transition-colors"
              >
                <Check className="w-3.5 h-3.5" />
                Apply Thresholds
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
