import React from 'react';
import { CheckCircle2, Clock } from 'lucide-react';

interface SidebarProgressProps {
  currentStep: number;
  totalSteps: number;
  stepTitles: string[];
}

export const SidebarProgress: React.FC<SidebarProgressProps> = ({
  currentStep,
  totalSteps,
  stepTitles,
}) => {
  const percentage = Math.min(
    100,
    Math.max(0, Math.round((currentStep / (totalSteps - 1)) * 100))
  );

  return (
    <>
      {/* Desktop Left Sidebar */}
      <aside
        aria-label="התקדמות במבחן"
        className="hidden lg:flex fixed top-1/2 left-6 -translate-y-1/2 flex-col items-center gap-4 z-40 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-sky-100 transition-all"
      >
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
            {percentage}%
          </span>
          <span className="text-[11px] font-semibold text-slate-400">התקדמות</span>
        </div>

        {/* Vertical Track */}
        <div className="w-2.5 h-64 bg-slate-100 rounded-full relative overflow-hidden shadow-inner border border-slate-200/60">
          <div
            className="w-full bg-gradient-to-t from-sky-600 to-sky-400 rounded-full transition-all duration-500 ease-out"
            style={{ height: `${percentage}%` }}
          />
        </div>

        {/* Step Dots List */}
        <div className="flex flex-col gap-1.5 max-h-[220px] overflow-y-auto py-1 scrollbar-none">
          {stepTitles.map((title, idx) => {
            const isCompleted = idx < currentStep;
            const isActive = idx === currentStep;

            return (
              <div
                key={idx}
                className="group relative flex items-center justify-center cursor-default"
                title={`${idx + 1}. ${title}`}
              >
                <div
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    isActive
                      ? 'bg-sky-600 ring-4 ring-sky-200 scale-125'
                      : isCompleted
                      ? 'bg-sky-500'
                      : 'bg-slate-200'
                  }`}
                />

                {/* Floating tooltip */}
                <div className="absolute right-6 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-xs font-medium py-1 px-2.5 rounded-lg shadow-md whitespace-nowrap z-50">
                  {title}
                </div>
              </div>
            );
          })}
        </div>
      </aside>

      {/* Mobile Sticky Top Progress Bar */}
      <div className="lg:hidden sticky top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-sky-100 px-4 py-2.5 shadow-sm">
        <div className="max-w-xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-sky-800">
            <span className="bg-sky-100 text-sky-700 px-2 py-0.5 rounded-md">
              שלב {currentStep + 1} מתוך {totalSteps}
            </span>
            <span className="truncate max-w-[160px] text-slate-600 font-medium">
              {stepTitles[currentStep] || ''}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-24 sm:w-36 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
              <div
                className="h-full bg-sky-500 rounded-full transition-all duration-300"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <span className="text-xs font-bold text-sky-700 w-8 text-left">{percentage}%</span>
          </div>
        </div>
      </div>
    </>
  );
};
