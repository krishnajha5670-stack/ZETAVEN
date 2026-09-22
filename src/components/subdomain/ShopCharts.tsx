import React, { useState } from 'react';
import { ThemeConfig } from '../../utils/theme';

interface TimeSeriesPoint {
  label: string;
  value: number;
  dateStr?: string;
}

interface ContinuousLineTrendChartProps {
  data: TimeSeriesPoint[];
  theme: ThemeConfig;
  height?: number;
  valuePrefix?: string;
  valueSuffix?: string;
  title?: string;
}

export const ContinuousLineTrendChart: React.FC<ContinuousLineTrendChartProps> = ({
  data,
  theme,
  height = 240,
  valuePrefix = '₹',
  valueSuffix = '',
  title
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-xs text-slate-400">
        No chart points available
      </div>
    );
  }

  const paddingLeft = 55;
  const paddingRight = 25;
  const paddingTop = 25;
  const paddingBottom = 35;
  const width = 600;

  const values = data.map(d => d.value);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const range = maxVal - minVal || 1;
  const effectiveMin = Math.max(0, Math.floor(minVal - range * 0.15));
  const effectiveMax = Math.ceil(maxVal + range * 0.15);
  const effectiveRange = effectiveMax - effectiveMin || 1;

  const graphWidth = width - paddingLeft - paddingRight;
  const graphHeight = height - paddingTop - paddingBottom;

  // Coordinate mapping
  const points = data.map((d, i) => {
    const x = paddingLeft + (i / (data.length - 1 || 1)) * graphWidth;
    const y = paddingTop + graphHeight - ((d.value - effectiveMin) / effectiveRange) * graphHeight;
    return { x, y, ...d };
  });

  // Smooth Bézier curve generator for stock-market style financial line
  const createSmoothPath = (pts: { x: number; y: number }[]): string => {
    if (pts.length < 2) return '';
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i === 0 ? 0 : i - 1];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2 < pts.length ? i + 2 : i + 1];

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
    }
    return d;
  };

  const linePath = createSmoothPath(points);
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${paddingTop + graphHeight} L ${points[0].x} ${paddingTop + graphHeight} Z`;

  // Horizontal guide lines
  const gridSteps = 4;
  const gridLines = Array.from({ length: gridSteps + 1 }).map((_, i) => {
    const val = Math.round(effectiveMin + (i / gridSteps) * effectiveRange);
    const y = paddingTop + graphHeight - (i / gridSteps) * graphHeight;
    return { val, y };
  });

  return (
    <div className="w-full relative select-none">
      {title && (
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs font-bold text-slate-700">{title}</div>
          <div className="text-[11px] text-slate-500 font-mono">Financial Continuous Trend</div>
        </div>
      )}

      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible"
          style={{ minHeight: `${height}px` }}
        >
          <defs>
            <linearGradient id={`chart-grad-${theme.id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={theme.hex} stopOpacity="0.25" />
              <stop offset="85%" stopColor={theme.hex} stopOpacity="0.02" />
              <stop offset="100%" stopColor={theme.hex} stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Grid lines and Y labels */}
          {gridLines.map((gl, idx) => (
            <g key={idx}>
              <line
                x1={paddingLeft}
                y1={gl.y}
                x2={width - paddingRight}
                y2={gl.y}
                stroke="#e2e8f0"
                strokeDasharray={idx === 0 ? 'none' : '3 3'}
                strokeWidth="1"
              />
              <text
                x={paddingLeft - 8}
                y={gl.y + 3.5}
                textAnchor="end"
                className="text-[10px] fill-slate-400 font-mono"
              >
                {valuePrefix}{gl.val >= 1000 ? `${(gl.val / 1000).toFixed(1)}k` : gl.val}
              </text>
            </g>
          ))}

          {/* Gradient area */}
          <path d={areaPath} fill={`url(#chart-grad-${theme.id})`} />

          {/* Continuous trend line */}
          <path
            d={linePath}
            fill="none"
            stroke={theme.hex}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* X axis labels and data points */}
          {points.map((pt, idx) => {
            const isHovered = hoveredIdx === idx;
            return (
              <g key={idx} className="cursor-pointer">
                {/* Vertical hover guide */}
                {isHovered && (
                  <line
                    x1={pt.x}
                    y1={paddingTop}
                    x2={pt.x}
                    y2={paddingTop + graphHeight}
                    stroke={theme.hex}
                    strokeWidth="1"
                    strokeDasharray="2 2"
                    opacity="0.6"
                  />
                )}

                {/* Point circle */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? 5.5 : 3.5}
                  fill="white"
                  stroke={theme.hex}
                  strokeWidth={isHovered ? 3 : 2}
                  className="transition-all duration-150"
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                />

                {/* Larger transparent touch/hover target */}
                <rect
                  x={pt.x - 18}
                  y={paddingTop}
                  width="36"
                  height={graphHeight}
                  fill="transparent"
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                />

                {/* X axis label */}
                <text
                  x={pt.x}
                  y={height - 12}
                  textAnchor="middle"
                  className={`text-[10px] font-medium ${
                    isHovered ? 'fill-slate-900 font-bold' : 'fill-slate-500'
                  }`}
                >
                  {pt.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Floating Tooltip */}
      {hoveredIdx !== null && points[hoveredIdx] && (
        <div 
          className="absolute z-10 pointer-events-none bg-slate-950 text-white rounded-lg px-2.5 py-1.5 shadow-xl text-xs flex flex-col items-center -translate-x-1/2 -translate-y-full mb-2"
          style={{
            left: `${(points[hoveredIdx].x / width) * 100}%`,
            top: `${(points[hoveredIdx].y / height) * 100}%`
          }}
        >
          <span className="text-[10px] text-slate-400 font-mono">{points[hoveredIdx].label}</span>
          <span className="font-bold text-white font-mono">
            {valuePrefix}{points[hoveredIdx].value.toLocaleString('en-IN')}{valueSuffix}
          </span>
        </div>
      )}
    </div>
  );
};

interface BreakdownSlice {
  label: string;
  value: number;
  color?: string;
}

interface DonutBreakdownChartProps {
  data: BreakdownSlice[];
  theme: ThemeConfig;
  title?: string;
  totalLabel?: string;
  size?: number;
}

export const DonutBreakdownChart: React.FC<DonutBreakdownChartProps> = ({
  data,
  theme,
  title,
  totalLabel = 'Total Volume',
  size = 200
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const defaultColors = [theme.hex, '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#f43f5e'];

  const total = data.reduce((acc, item) => acc + item.value, 0) || 1;
  const radius = 70;
  const strokeWidth = 26;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 w-full">
      {/* Donut SVG */}
      <div className="relative shrink-0 flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-[-90deg]">
          {/* Base track */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="#f1f5f9"
            strokeWidth={strokeWidth}
          />

          {data.map((item, idx) => {
            const sliceColor = item.color || defaultColors[idx % defaultColors.length];
            const percent = item.value / total;
            const strokeDasharray = `${percent * circumference} ${circumference}`;
            const strokeDashoffset = -accumulatedPercent * circumference;
            accumulatedPercent += percent;

            const isHovered = hoveredIdx === idx;

            return (
              <circle
                key={idx}
                cx={center}
                cy={center}
                r={radius}
                fill="transparent"
                stroke={sliceColor}
                strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-200 cursor-pointer"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              />
            );
          })}
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2 pointer-events-none">
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
            {hoveredIdx !== null ? data[hoveredIdx].label : totalLabel}
          </span>
          <span className="text-base font-extrabold text-slate-900 font-mono tracking-tight">
            {hoveredIdx !== null 
              ? `${Math.round((data[hoveredIdx].value / total) * 100)}%`
              : total >= 1000 ? `₹${(total / 1000).toFixed(1)}k` : `₹${total}`
            }
          </span>
        </div>
      </div>

      {/* Legend list */}
      <div className="flex-1 space-y-2 w-full">
        {title && <div className="text-xs font-bold text-slate-700 pb-1">{title}</div>}
        {data.map((item, idx) => {
          const sliceColor = item.color || defaultColors[idx % defaultColors.length];
          const percent = Math.round((item.value / total) * 100);
          const isHovered = hoveredIdx === idx;

          return (
            <div
              key={idx}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              className={`flex items-center justify-between p-2 rounded-xl text-xs transition-colors cursor-pointer ${
                isHovered ? 'bg-slate-100/90 font-bold' : 'hover:bg-slate-50 text-slate-600'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: sliceColor }} />
                <span className="truncate max-w-[150px]">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-slate-400 text-[11px]">{percent}%</span>
                <span className="font-mono font-bold text-slate-800">
                  {item.value >= 1000 ? `₹${item.value.toLocaleString('en-IN')}` : item.value}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
