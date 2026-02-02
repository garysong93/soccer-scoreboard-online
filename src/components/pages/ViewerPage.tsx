import { useEffect, useState } from 'react';
import { Wifi, WifiOff, Loader2, AlertCircle, Clock } from 'lucide-react';
import { useFirebaseViewer } from '../../hooks/useFirebaseSync';
import type { ShareableMatch } from '../../lib/firebase';

interface ViewerPageProps {
  shareCode: string;
}

const formatTime = (seconds: number, addedTime: number = 0): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const timeStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  if (addedTime > 0 && (mins >= 45 || mins >= 90)) {
    return `${timeStr} +${addedTime}`;
  }
  return timeStr;
};

const getPeriodLabel = (period: string): string => {
  const labels: Record<string, string> = {
    not_started: 'Not Started',
    first_half: '1st Half',
    half_time: 'Half Time',
    second_half: '2nd Half',
    extra_time_1: 'Extra Time 1',
    extra_time_2: 'Extra Time 2',
    penalties: 'Penalties',
    finished: 'Full Time',
  };
  return labels[period] || period;
};

const ViewerScoreboard = ({ match }: { match: ShareableMatch }) => {
  const { home, away, timer, stats, events } = match;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Timer Section */}
      <div className="bg-slate-800/80 backdrop-blur rounded-2xl p-6 shadow-xl text-center">
        <div className="flex items-center justify-center gap-2 text-slate-400 mb-2">
          <Clock className="w-4 h-4" />
          <span className="text-sm uppercase tracking-wider">
            {getPeriodLabel(timer.period)}
          </span>
          {timer.isRunning && (
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          )}
        </div>
        <div className="text-5xl md:text-6xl font-mono font-bold text-white">
          {formatTime(timer.seconds, timer.addedTime)}
        </div>
      </div>

      {/* Scoreboard Section */}
      <div className="bg-slate-800/80 backdrop-blur rounded-2xl p-6 shadow-xl">
        <div className="grid grid-cols-3 gap-4 items-center">
          {/* Home Team */}
          <div className="text-center">
            <div
              className="w-16 h-16 md:w-20 md:h-20 rounded-full mx-auto mb-3 flex items-center justify-center"
              style={{ backgroundColor: home.color + '30' }}
            >
              <div
                className="w-10 h-10 md:w-12 md:h-12 rounded-full"
                style={{ backgroundColor: home.color }}
              />
            </div>
            <h2 className="text-lg md:text-xl font-bold text-white truncate">
              {home.name}
            </h2>
            <div className="flex items-center justify-center gap-1 mt-2">
              {Array.from({ length: home.yellowCards }).map((_, i) => (
                <div
                  key={`hy${i}`}
                  className="w-3 h-4 bg-yellow-400 rounded-sm"
                />
              ))}
              {Array.from({ length: home.redCards }).map((_, i) => (
                <div
                  key={`hr${i}`}
                  className="w-3 h-4 bg-red-600 rounded-sm"
                />
              ))}
            </div>
          </div>

          {/* Score */}
          <div className="text-center">
            <div className="text-6xl md:text-8xl font-bold text-white">
              {home.score}
              <span className="text-slate-500 mx-2">-</span>
              {away.score}
            </div>
          </div>

          {/* Away Team */}
          <div className="text-center">
            <div
              className="w-16 h-16 md:w-20 md:h-20 rounded-full mx-auto mb-3 flex items-center justify-center"
              style={{ backgroundColor: away.color + '30' }}
            >
              <div
                className="w-10 h-10 md:w-12 md:h-12 rounded-full"
                style={{ backgroundColor: away.color }}
              />
            </div>
            <h2 className="text-lg md:text-xl font-bold text-white truncate">
              {away.name}
            </h2>
            <div className="flex items-center justify-center gap-1 mt-2">
              {Array.from({ length: away.yellowCards }).map((_, i) => (
                <div
                  key={`ay${i}`}
                  className="w-3 h-4 bg-yellow-400 rounded-sm"
                />
              ))}
              {Array.from({ length: away.redCards }).map((_, i) => (
                <div
                  key={`ar${i}`}
                  className="w-3 h-4 bg-red-600 rounded-sm"
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-slate-800/80 backdrop-blur rounded-2xl p-6 shadow-xl">
        <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4 text-center">
          Match Statistics
        </h3>
        <div className="space-y-3">
          {/* Possession */}
          <StatRow
            label="Possession"
            homeValue={`${stats.possession.home}%`}
            awayValue={`${stats.possession.away}%`}
            homePercent={stats.possession.home}
            awayPercent={stats.possession.away}
            homeColor={home.color}
            awayColor={away.color}
          />
          {/* Shots */}
          <StatRow
            label="Shots"
            homeValue={stats.shots.home.toString()}
            awayValue={stats.shots.away.toString()}
            homePercent={stats.shots.home}
            awayPercent={stats.shots.away}
            homeColor={home.color}
            awayColor={away.color}
            maxValue={Math.max(stats.shots.home, stats.shots.away, 1)}
          />
          {/* Shots on Target */}
          <StatRow
            label="On Target"
            homeValue={stats.shotsOnTarget.home.toString()}
            awayValue={stats.shotsOnTarget.away.toString()}
            homePercent={stats.shotsOnTarget.home}
            awayPercent={stats.shotsOnTarget.away}
            homeColor={home.color}
            awayColor={away.color}
            maxValue={Math.max(stats.shotsOnTarget.home, stats.shotsOnTarget.away, 1)}
          />
          {/* Corners */}
          <StatRow
            label="Corners"
            homeValue={stats.corners.home.toString()}
            awayValue={stats.corners.away.toString()}
            homePercent={stats.corners.home}
            awayPercent={stats.corners.away}
            homeColor={home.color}
            awayColor={away.color}
            maxValue={Math.max(stats.corners.home, stats.corners.away, 1)}
          />
          {/* Fouls */}
          <StatRow
            label="Fouls"
            homeValue={stats.fouls.home.toString()}
            awayValue={stats.fouls.away.toString()}
            homePercent={stats.fouls.home}
            awayPercent={stats.fouls.away}
            homeColor={home.color}
            awayColor={away.color}
            maxValue={Math.max(stats.fouls.home, stats.fouls.away, 1)}
          />
        </div>
      </div>

      {/* Events Timeline */}
      {events.length > 0 && (
        <div className="bg-slate-800/80 backdrop-blur rounded-2xl p-6 shadow-xl">
          <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4 text-center">
            Match Events
          </h3>
          <div className="space-y-2">
            {events
              .filter((e) => e.type === 'goal' || e.type === 'yellow_card' || e.type === 'red_card')
              .slice(-10)
              .reverse()
              .map((event) => (
                <div
                  key={event.id}
                  className={`flex items-center gap-3 p-2 rounded-lg ${
                    event.team === 'home' ? 'justify-start' : 'justify-end'
                  }`}
                >
                  {event.team === 'home' && (
                    <>
                      <span className="text-slate-400 text-sm font-mono">
                        {event.minute}'
                      </span>
                      <EventIcon type={event.type} />
                      <span className="text-white text-sm">
                        {event.type === 'goal' ? 'Goal' : event.type === 'yellow_card' ? 'Yellow Card' : 'Red Card'}
                      </span>
                    </>
                  )}
                  {event.team === 'away' && (
                    <>
                      <span className="text-white text-sm">
                        {event.type === 'goal' ? 'Goal' : event.type === 'yellow_card' ? 'Yellow Card' : 'Red Card'}
                      </span>
                      <EventIcon type={event.type} />
                      <span className="text-slate-400 text-sm font-mono">
                        {event.minute}'
                      </span>
                    </>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

const StatRow = ({
  label,
  homeValue,
  awayValue,
  homePercent,
  awayPercent,
  homeColor,
  awayColor,
  maxValue,
}: {
  label: string;
  homeValue: string;
  awayValue: string;
  homePercent: number;
  awayPercent: number;
  homeColor: string;
  awayColor: string;
  maxValue?: number;
}) => {
  const max = maxValue || 100;
  const homeWidth = (homePercent / max) * 100;
  const awayWidth = (awayPercent / max) * 100;

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-white font-medium">{homeValue}</span>
        <span className="text-slate-400">{label}</span>
        <span className="text-white font-medium">{awayValue}</span>
      </div>
      <div className="flex gap-1 h-2">
        <div className="flex-1 flex justify-end bg-slate-700 rounded-l-full overflow-hidden">
          <div
            className="h-full rounded-l-full transition-all duration-500"
            style={{ width: `${homeWidth}%`, backgroundColor: homeColor }}
          />
        </div>
        <div className="flex-1 bg-slate-700 rounded-r-full overflow-hidden">
          <div
            className="h-full rounded-r-full transition-all duration-500"
            style={{ width: `${awayWidth}%`, backgroundColor: awayColor }}
          />
        </div>
      </div>
    </div>
  );
};

const EventIcon = ({ type }: { type: string }) => {
  if (type === 'goal') {
    return <span className="text-xl">⚽</span>;
  }
  if (type === 'yellow_card') {
    return <div className="w-3 h-4 bg-yellow-400 rounded-sm" />;
  }
  if (type === 'red_card') {
    return <div className="w-3 h-4 bg-red-600 rounded-sm" />;
  }
  return null;
};

export const ViewerPage = ({ shareCode }: ViewerPageProps) => {
  const { matchData, isLoading, error, isConnected } = useFirebaseViewer(shareCode);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    if (matchData) {
      setLastUpdate(new Date());
    }
  }, [matchData]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-900 to-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center gap-2">
              <span className="text-2xl">⚽</span>
              <div>
                <h1 className="text-lg font-bold text-white leading-tight">
                  Soccer Scoreboard
                </h1>
                <p className="text-xs text-slate-400">Live Viewer</p>
              </div>
            </a>

            <div className="flex items-center gap-3">
              {isConnected ? (
                <div className="flex items-center gap-2 text-green-400">
                  <Wifi className="w-4 h-4" />
                  <span className="text-sm">Live</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-400">
                  <WifiOff className="w-4 h-4" />
                  <span className="text-sm">Disconnected</span>
                </div>
              )}

              <div className="text-xs text-slate-500">
                Code: <span className="font-mono text-slate-400">{shareCode}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
            <p className="text-slate-400">Connecting to live match...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">
              Unable to Load Match
            </h2>
            <p className="text-slate-400 mb-4">{error}</p>
            <a
              href="/"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Homepage
            </a>
          </div>
        ) : matchData ? (
          <ViewerScoreboard match={matchData} />
        ) : null}
      </main>

      {/* Footer */}
      <footer className="py-4 px-4 border-t border-slate-800">
        <div className="max-w-7xl mx-auto text-center text-sm text-slate-500">
          <p>
            Last updated: {lastUpdate.toLocaleTimeString()}
          </p>
          <p className="mt-1">
            <a href="/" className="text-blue-400 hover:text-blue-300">
              Create your own scoreboard
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};
