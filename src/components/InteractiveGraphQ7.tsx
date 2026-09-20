import React from 'react';

export const InteractiveGraphQ7: React.FC = () => {
  // Coordinate domain: x from -4 to 4, y from -5 to 5
  // SVG dimensions: 440 x 360
  const width = 440;
  const height = 360;
  const padding = 35;

  const minX = -4;
  const maxX = 4;
  const minY = -5;
  const maxY = 5;

  const toSvgX = (x: number) => {
    return padding + ((x - minX) / (maxX - minX)) * (width - 2 * padding);
  };

  const toSvgY = (y: number) => {
    return height - padding - ((y - minY) / (maxY - minY)) * (height - 2 * padding);
  };

  // Grid tick marks
  const xTicks = [-4, -3, -2, -1, 1, 2, 3, 4];
  const yTicks = [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5];

  // Points on line: (-2, 0) and (0, -4)
  // Endpoints for line y = -2x - 4:
  // For y = 5 => 5 = -2x - 4 => 2x = -9 => x = -4.5 (clip to x = -4 => y = 4)
  // For y = -5 => -5 = -2x - 4 => 2x = 1 => x = 0.5
  const lineStart = { x: -4, y: 4 };
  const lineEnd = { x: 0.5, y: -5 };

  return (
    <div className="w-full max-w-lg mx-auto bg-white rounded-2xl border border-sky-200 shadow-sm p-3 my-4 overflow-hidden">
      <div className="text-center text-xs font-semibold text-slate-500 mb-1">
        מערכת צירים: ישר העובר בנקודות המודגשות
      </div>

      <div className="relative flex justify-center" dir="ltr">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full max-w-[440px] h-auto select-none"
        >
          {/* Background grid */}
          <rect
            x={padding}
            y={padding}
            width={width - 2 * padding}
            height={height - 2 * padding}
            fill="#f8fafc"
            stroke="#e2e8f0"
            strokeWidth="1"
            rx="4"
          />

          {/* Grid lines - X */}
          {[-4, -3, -2, -1, 0, 1, 2, 3, 4].map((x) => (
            <line
              key={`grid-x-${x}`}
              x1={toSvgX(x)}
              y1={padding}
              x2={toSvgX(x)}
              y2={height - padding}
              stroke={x === 0 ? '#334155' : '#e2e8f0'}
              strokeWidth={x === 0 ? 2 : 1}
            />
          ))}

          {/* Grid lines - Y */}
          {[-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5].map((y) => (
            <line
              key={`grid-y-${y}`}
              x1={padding}
              y1={toSvgY(y)}
              x2={width - padding}
              y2={toSvgY(y)}
              stroke={y === 0 ? '#334155' : '#e2e8f0'}
              strokeWidth={y === 0 ? 2 : 1}
            />
          ))}

          {/* Axis Labels */}
          {/* X Axis Ticks */}
          {xTicks.map((x) => (
            <text
              key={`lbl-x-${x}`}
              x={toSvgX(x)}
              y={toSvgY(0) + 16}
              fontSize="11"
              fontFamily="monospace"
              fontWeight="600"
              fill="#64748b"
              textAnchor="middle"
            >
              {x}
            </text>
          ))}

          {/* Y Axis Ticks */}
          {yTicks.map((y) => (
            <text
              key={`lbl-y-${y}`}
              x={toSvgX(0) - 8}
              y={toSvgY(y) + 4}
              fontSize="11"
              fontFamily="monospace"
              fontWeight="600"
              fill="#64748b"
              textAnchor="end"
            >
              {y}
            </text>
          ))}

          {/* Axis Name Letters */}
          <text
            x={width - padding + 14}
            y={toSvgY(0) + 4}
            fontSize="14"
            fontWeight="bold"
            fill="#0f172a"
          >
            x
          </text>
          <text
            x={toSvgX(0) - 4}
            y={padding - 10}
            fontSize="14"
            fontWeight="bold"
            fill="#0f172a"
          >
            y
          </text>

          {/* Linear Function Line */}
          <line
            x1={toSvgX(lineStart.x)}
            y1={toSvgY(lineStart.y)}
            x2={toSvgX(lineEnd.x)}
            y2={toSvgY(lineEnd.y)}
            stroke="#0284c7"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Key Point 1: (-2, 0) */}
          <circle
            cx={toSvgX(-2)}
            cy={toSvgY(0)}
            r="6"
            fill="#0284c7"
            stroke="#ffffff"
            strokeWidth="2"
            className="animate-pulse"
          />
          <rect
            x={toSvgX(-2) - 34}
            y={toSvgY(0) - 28}
            width="52"
            height="20"
            rx="4"
            fill="#0369a1"
          />
          <text
            x={toSvgX(-2) - 8}
            y={toSvgY(0) - 14}
            fill="#ffffff"
            fontSize="11"
            fontWeight="bold"
            textAnchor="middle"
          >
            (-2, 0)
          </text>

          {/* Key Point 2: (0, -4) */}
          <circle
            cx={toSvgX(0)}
            cy={toSvgY(-4)}
            r="6"
            fill="#0284c7"
            stroke="#ffffff"
            strokeWidth="2"
            className="animate-pulse"
          />
          <rect
            x={toSvgX(0) + 10}
            y={toSvgY(-4) - 10}
            width="52"
            height="20"
            rx="4"
            fill="#0369a1"
          />
          <text
            x={toSvgX(0) + 36}
            y={toSvgY(-4) + 4}
            fill="#ffffff"
            fontSize="11"
            fontWeight="bold"
            textAnchor="middle"
          >
            (0, -4)
          </text>
        </svg>
      </div>
    </div>
  );
};
