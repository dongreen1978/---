import React from 'react';

export const GeometryDiagramQ10a: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center my-6">
      <div className="relative w-full max-w-md bg-sky-100/70 border border-sky-300 rounded-2xl p-4 shadow-sm overflow-hidden" dir="ltr">
        <svg
          viewBox="0 0 400 260"
          className="w-full h-auto select-none"
        >
          {/* Subtle background */}
          <rect width="400" height="260" fill="#93c5fd" rx="12" opacity="0.35" />

          {/* Line a (top horizontal) */}
          <line x1="40" y1="80" x2="360" y2="80" stroke="#0284c7" strokeWidth="4.5" strokeLinecap="round" />
          <text x="50" y="70" fontFamily="Georgia, serif" fontStyle="italic" fontSize="26" fontWeight="bold" fill="#0f172a">
            a
          </text>

          {/* Line b (bottom horizontal) */}
          <line x1="40" y1="190" x2="360" y2="190" stroke="#0284c7" strokeWidth="4.5" strokeLinecap="round" />
          <text x="50" y="180" fontFamily="Georgia, serif" fontStyle="italic" fontSize="26" fontWeight="bold" fill="#0f172a">
            b
          </text>

          {/* Parallel line symbols (small arrows) */}
          <path d="M 120 75 L 128 80 L 120 85" stroke="#0369a1" strokeWidth="3" fill="none" />
          <path d="M 120 185 L 128 190 L 120 195" stroke="#0369a1" strokeWidth="3" fill="none" />

          {/* Transversal line (orange/red) */}
          <line x1="130" y1="245" x2="260" y2="25" stroke="#ea580c" strokeWidth="5" strokeLinecap="round" />

         
          
          {/* Angle text for 4x + 30 */}
          <text
            x="173"
            y="100"
            fontFamily="sans-serif"
            fontWeight="bold"
            fontSize="18"
            fill="#0f172a"
            textAnchor="middle"
          >
            4x + 30
          </text>

          
          {/* Angle text for 2x */}
          
          <text
            x="147"
            y="182"
            fontFamily="sans-serif"
            fontWeight="bold"
            fontSize="18"
            fill="#0f172a"
            textAnchor="middle"
          >
            2x
          </text>
        </svg>
      </div>
      <p className="text-xs text-slate-500 mt-2 text-center">
        הישרים a ו-b מקבילים (a ∥ b), הישר החותך יוצר זוויות כמסומן
      </p>
    </div>
  );
};
