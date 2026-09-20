import React from 'react';
import { Clock, Volume2, VolumeX } from 'lucide-react';
import { formatDuration } from '../utils/examUtils';

interface TimerBadgeProps {
  secondsElapsed?: number;
  secondsLeft?: number;
  overallElapsedSeconds: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const TimerBadge: React.FC<TimerBadgeProps> = ({
  secondsElapsed,
  secondsLeft,
  overallElapsedSeconds,
  soundEnabled,
  onToggleSound,
}) => {
  // תמיכה בערך הזמן שעבר (בין אם נשלח ב-secondsElapsed או ב-secondsLeft)
  const currentSeconds = secondsElapsed ?? secondsLeft ?? 0;

  return (
    <div className="flex items-center justify-between bg-sky-50/80 p-3.5 rounded-2xl border border-sky-100">
      <div className="flex items-center gap-2 text-sky-900 font-semibold text-sm">
        <Clock className="w-4 h-4 text-sky-600 animate-pulse" />
        <span>זמן לשאלה זו: {formatDuration(currentSeconds * 1000)}</span>
      </div>
      <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
        <span>זמן כולל במבחן: {formatDuration((overallElapsedSeconds || 0) * 1000)}</span>
        <button
          type="button"
          onClick={onToggleSound}
          className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          title={soundEnabled ? 'השתק צלילים' : 'אפשר צלילים'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-sky-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
        </button>
      </div>
    </div>
  );
};