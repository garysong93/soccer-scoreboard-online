import { useEffect, useState } from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { useTimer } from '../../hooks/useTimer';

type Position = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center';

export const OBSPage = () => {
  const { match } = useGameStore();
  const { seconds, addedTime, formatTime, getPeriodLabel } = useTimer();
  const [position, setPosition] = useState<Position>('top-left');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pos = params.get('position') as Position;
    if (pos) setPosition(pos);
  }, []);

  const positionClasses: Record<Position, string> = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
  };

  return (
    <div className="min-h-screen bg-transparent">
      <div className={`fixed ${positionClasses[position]}`}>
        <div className="bg-slate-900/90 backdrop-blur rounded-lg shadow-2xl overflow-hidden">
          {/* Score Bar */}
          <div className="flex items-center">
            {/* Home Team */}
            <div className="flex items-center gap-2 px-4 py-2" style={{ backgroundColor: match.home.color + '40' }}>
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: match.home.color }}
              />
              <span className="text-white font-semibold text-sm min-w-[80px]">
                {match.home.shortName || match.home.name.substring(0, 3).toUpperCase()}
              </span>
              <span className="text-2xl font-bold text-white">{match.home.score}</span>
            </div>

            {/* Timer */}
            <div className="px-4 py-2 bg-slate-800 text-center">
              <div className="text-lg font-mono font-bold text-white">
                {formatTime(seconds, addedTime)}
              </div>
              <div className="text-xs text-slate-400">
                {getPeriodLabel(match.period)}
              </div>
            </div>

            {/* Away Team */}
            <div className="flex items-center gap-2 px-4 py-2" style={{ backgroundColor: match.away.color + '40' }}>
              <span className="text-2xl font-bold text-white">{match.away.score}</span>
              <span className="text-white font-semibold text-sm min-w-[80px]">
                {match.away.shortName || match.away.name.substring(0, 3).toUpperCase()}
              </span>
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: match.away.color }}
              />
            </div>
          </div>

          {/* Cards Row (if any) */}
          {(match.home.yellowCards > 0 || match.home.redCards > 0 ||
            match.away.yellowCards > 0 || match.away.redCards > 0) && (
            <div className="flex items-center justify-between px-4 py-1 bg-slate-800/50 text-xs">
              <div className="flex gap-1">
                {Array.from({ length: match.home.yellowCards }).map((_, i) => (
                  <div key={`hy${i}`} className="w-2 h-3 bg-yellow-400 rounded-sm" />
                ))}
                {Array.from({ length: match.home.redCards }).map((_, i) => (
                  <div key={`hr${i}`} className="w-2 h-3 bg-red-600 rounded-sm" />
                ))}
              </div>
              <div className="flex gap-1">
                {Array.from({ length: match.away.yellowCards }).map((_, i) => (
                  <div key={`ay${i}`} className="w-2 h-3 bg-yellow-400 rounded-sm" />
                ))}
                {Array.from({ length: match.away.redCards }).map((_, i) => (
                  <div key={`ar${i}`} className="w-2 h-3 bg-red-600 rounded-sm" />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
