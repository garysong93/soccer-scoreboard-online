import { Play, Pause, SkipForward } from 'lucide-react';
import { useTimer } from '../../hooks/useTimer';
import { useGameStore } from '../../stores/useGameStore';
import { Button } from '../ui/Button';

export const MatchTimer = () => {
  const { seconds, addedTime, period, isRunning, toggleTimer, formatTime, getPeriodLabel } = useTimer();
  const { nextPeriod, setAddedTime } = useGameStore();

  const canStart = period !== 'not_started' && period !== 'half_time' && period !== 'finished';
  const canAdvance = period !== 'finished';

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Period Label */}
      <div className="text-sm font-medium text-slate-400 uppercase tracking-wider">
        {getPeriodLabel(period)}
      </div>

      {/* Timer Display */}
      <div className="relative">
        <div
          className={`text-5xl md:text-7xl font-mono font-bold tabular-nums tracking-tight ${
            isRunning ? 'text-green-400' : 'text-white'
          }`}
        >
          {formatTime(seconds, addedTime)}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <Button
          onClick={toggleTimer}
          disabled={!canStart}
          variant={isRunning ? 'danger' : 'primary'}
          size="lg"
          className="min-w-[120px]"
        >
          {isRunning ? (
            <>
              <Pause className="w-5 h-5 mr-2" />
              Pause
            </>
          ) : (
            <>
              <Play className="w-5 h-5 mr-2" />
              Start
            </>
          )}
        </Button>

        <Button
          onClick={nextPeriod}
          disabled={!canAdvance}
          variant="secondary"
          size="lg"
        >
          <SkipForward className="w-5 h-5 mr-2" />
          Next
        </Button>
      </div>

      {/* Added Time Control */}
      {(period === 'first_half' || period === 'second_half') && (
        <div className="flex items-center gap-2 mt-2">
          <span className="text-sm text-slate-400">Added Time:</span>
          <div className="flex items-center gap-1">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((mins) => (
              <button
                key={mins}
                onClick={() => setAddedTime(mins)}
                className={`w-8 h-8 text-sm font-medium rounded transition-colors ${
                  addedTime === mins
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                +{mins}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
