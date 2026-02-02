import { useGameStore } from '../../stores/useGameStore';
import type { MatchEvent } from '../../types';

const EventIcon = ({ type }: { type: MatchEvent['type'] }) => {
  switch (type) {
    case 'goal':
      return <span className="text-lg">⚽</span>;
    case 'yellow_card':
      return <div className="w-3 h-4 bg-yellow-400 rounded-sm" />;
    case 'red_card':
      return <div className="w-3 h-4 bg-red-600 rounded-sm" />;
    case 'substitution':
      return <span className="text-lg">🔄</span>;
    case 'var':
      return <span className="text-xs font-bold text-blue-400">VAR</span>;
    default:
      return null;
  }
};

export const EventTimeline = () => {
  const { match } = useGameStore();
  const { events, home, away } = match;

  const displayEvents = events
    .filter((e) => ['goal', 'yellow_card', 'red_card'].includes(e.type))
    .slice(-10)
    .reverse();

  if (displayEvents.length === 0) {
    return (
      <div className="bg-slate-800/50 rounded-xl p-4">
        <h3 className="text-center text-sm font-medium text-slate-400 uppercase tracking-wider mb-3">
          Match Events
        </h3>
        <p className="text-center text-slate-500 text-sm">No events yet</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 rounded-xl p-4">
      <h3 className="text-center text-sm font-medium text-slate-400 uppercase tracking-wider mb-3">
        Match Events
      </h3>

      <div className="space-y-2">
        {displayEvents.map((event) => {
          const team = event.team === 'home' ? home : away;
          const isHome = event.team === 'home';

          return (
            <div
              key={event.id}
              className={`flex items-center gap-2 text-sm ${
                isHome ? 'flex-row' : 'flex-row-reverse'
              }`}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: team.color }}
              />
              <span className="text-slate-400 font-mono text-xs">
                {event.minute}'
                {event.addedTime && event.addedTime > 0 && `+${event.addedTime}`}
              </span>
              <EventIcon type={event.type} />
              <span className="text-white font-medium truncate">
                {team.shortName || team.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
