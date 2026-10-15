import React, { useState } from 'react';
import { Activity, Flame, Thermometer, BatteryCharging } from 'lucide-react';
import { TelemetryPoint, ThresholdConfig } from '../types/mineguard';

interface LiveTelemetryChartProps {
  history: TelemetryPoint[];
  thresholds: ThresholdConfig;
}

export const LiveTelemetryChart: React.FC<LiveTelemetryChartProps> = ({
  history,
  thresholds,
}) => {
  const [activeMetric, setActiveMetric] = useState<'gas' | 'temp' | 'battery'>('gas');

  if (history.length < 2) {
    return null;
  }

  // SVG Chart dimensions
  const width = 800;
  const height = 180;
  const padding = { top: 20, right: 30, bottom: 25, left: 45 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Determine min & max depending on active metric
  let minVal = 0;
  let maxVal = 100;
  let unit = 'ppm';
  let metricColor = '#f59e0b'; // amber
  let warningVal: number | null = thresholds.gasWarning;
  let criticalVal: number | null = thresholds.gasCritical;

  if (activeMetric === 'gas') {
    const vals = history.map((h) => h.gas);
    minVal = 0;
    maxVal = Math.max(100, Math.max(...vals) + 15);
    unit = 'ppm';
    metricColor = '#f59e0b';
    warningVal = thresholds.gasWarning;
    criticalVal = thresholds.gasCritical;
  } else if (activeMetric === 'temp') {
    const vals = history.map((h) => h.temp);
    minVal = 15;
    maxVal = Math.max(55, Math.max(...vals) + 5);
    unit = '°C';
    metricColor = '#38bdf8'; // light blue
    warningVal = thresholds.tempWarning;
    criticalVal = thresholds.tempCritical;
  } else if (activeMetric === 'battery') {
    minVal = 0;
    maxVal = 100;
    unit = '%';
    metricColor = '#10b981'; // emerald
    warningVal = thresholds.batteryLow;
    criticalVal = null;
  }

  // Calculate points
  const points = history.map((d, index) => {
    const val = activeMetric === 'gas' ? d.gas : activeMetric === 'temp' ? d.temp : d.battery;
    const x = padding.left + (index / (history.length - 1)) * chartWidth;
    const normalizedY = (val - minVal) / (maxVal - minVal || 1);
    const y = padding.top + (1 - normalizedY) * chartHeight;
    return { x, y, val, timeStr: d.timeStr };
  });

  const pathD = points.reduce((acc, curr, idx) => {
    return idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
  }, '');

  // Fill gradient path
  const areaD = `${pathD} L ${points[points.length - 1].x} ${
    padding.top + chartHeight
  } L ${points[0].x} ${padding.top + chartHeight} Z`;

  // Threshold lines Y
  const getYForVal = (v: number) => {
    const normalized = (v - minVal) / (maxVal - minVal || 1);
    return padding.top + (1 - normalized) * chartHeight;
  };

  const warnY = warningVal !== null && warningVal >= minVal && warningVal <= maxVal ? getYForVal(warningVal) : null;
  const critY = criticalVal !== null && criticalVal >= minVal && criticalVal <= maxVal ? getYForVal(criticalVal) : null;

  return (
    <div id="telemetry-chart-card" className="industrial-card p-5 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300">
            <Activity className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-white tracking-wide">REAL-TIME SIMULATED TELEMETRY TRENDS</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400">
                Live Waveform
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Live trend evaluation against configurable demo safety thresholds
            </p>
          </div>
        </div>

        {/* Metric Selector Buttons */}
        <div className="flex items-center bg-slate-900/90 rounded-lg p-0.5 border border-slate-800 text-xs font-mono">
          <button
            onClick={() => setActiveMetric('gas')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded transition-colors ${
              activeMetric === 'gas'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            Gas (ppm)
          </button>
          <button
            onClick={() => setActiveMetric('temp')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded transition-colors ${
              activeMetric === 'temp'
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Thermometer className="w-3.5 h-3.5 text-blue-400" />
            Temp (°C)
          </button>
          <button
            onClick={() => setActiveMetric('battery')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded transition-colors ${
              activeMetric === 'battery'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
            Battery (%)
          </button>
        </div>
      </div>

      {/* Responsive SVG Chart */}
      <div className="mt-4 w-full overflow-hidden bg-charcoal-950/90 rounded-lg border border-slate-800/80 p-2">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-44 select-none overflow-visible"
        >
          <defs>
            <linearGradient id="metricGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={metricColor} stopOpacity="0.35" />
              <stop offset="100%" stopColor={metricColor} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines (horizontal) */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
            const y = padding.top + pct * chartHeight;
            const val = maxVal - pct * (maxVal - minVal);
            return (
              <g key={i}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="#1e293b"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
                <text
                  x={padding.left - 8}
                  y={y + 3}
                  textAnchor="end"
                  fill="#64748b"
                  fontSize="10"
                  fontFamily="JetBrains Mono"
                >
                  {val.toFixed(0)}
                </text>
              </g>
            );
          })}

          {/* Threshold Lines */}
          {critY !== null && (
            <g>
              <line
                x1={padding.left}
                y1={critY}
                x2={width - padding.right}
                y2={critY}
                stroke="#ef4444"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
              <text
                x={width - padding.right}
                y={critY - 5}
                textAnchor="end"
                fill="#ef4444"
                fontSize="9"
                fontFamily="JetBrains Mono"
                fontWeight="bold"
              >
                CRIT THRESHOLD ({criticalVal} {unit})
              </text>
            </g>
          )}

          {warnY !== null && (
            <g>
              <line
                x1={padding.left}
                y1={warnY}
                x2={width - padding.right}
                y2={warnY}
                stroke="#f59e0b"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
              <text
                x={width - padding.right}
                y={warnY - 5}
                textAnchor="end"
                fill="#f59e0b"
                fontSize="9"
                fontFamily="JetBrains Mono"
                fontWeight="bold"
              >
                WARN THRESHOLD ({warningVal} {unit})
              </text>
            </g>
          )}

          {/* Area Fill */}
          <path d={areaD} fill="url(#metricGradient)" />

          {/* Main Line */}
          <path
            d={pathD}
            fill="none"
            stroke={metricColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points */}
          {points.map((pt, i) => (
            <g key={i}>
              <circle
                cx={pt.x}
                cy={pt.y}
                r="3.5"
                fill="#0a0d14"
                stroke={metricColor}
                strokeWidth="2"
              />
            </g>
          ))}

          {/* Latest point value label */}
          {points.length > 0 && (
            <g>
              <circle
                cx={points[points.length - 1].x}
                cy={points[points.length - 1].y}
                r="5"
                fill={metricColor}
                className="animate-ping opacity-75"
              />
              <text
                x={points[points.length - 1].x - 10}
                y={points[points.length - 1].y - 12}
                textAnchor="end"
                fill="#ffffff"
                fontSize="11"
                fontFamily="JetBrains Mono"
                fontWeight="bold"
              >
                {points[points.length - 1].val.toFixed(1)} {unit}
              </text>
            </g>
          )}
        </svg>

        <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono px-2 mt-1">
          <span>{history[0]?.timeStr || ''}</span>
          <span className="text-slate-400">Simulation Time Axis (Updated every ~1.5s)</span>
          <span>{history[history.length - 1]?.timeStr || ''}</span>
        </div>
      </div>
    </div>
  );
};
