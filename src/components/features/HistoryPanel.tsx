import { Trash2, Play, Calendar } from 'lucide-react';
import { useHistoryStore } from '../../stores/useHistoryStore';
import { useGameStore } from '../../stores/useGameStore';
import { Button } from '../ui/Button';

export const HistoryPanel = () => {
  const { savedMatches, deleteMatch, clearHistory } = useHistoryStore();
  const { loadMatch: loadMatchToStore } = useGameStore();

  const handleLoadMatch = (matchId: string) => {
    const historyEntry = savedMatches.find((m) => m.id === matchId);
    if (historyEntry) {
      if (confirm('Load this match? Current match data will be replaced.')) {
        loadMatchToStore(historyEntry.match);
      }
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (savedMatches.length === 0) {
    return (
      <div className="text-center py-8">
        <Calendar className="w-12 h-12 mx-auto text-slate-600 mb-3" />
        <p className="text-slate-400">No saved matches yet</p>
        <p className="text-sm text-slate-500 mt-1">
          Completed matches are automatically saved here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">
          Match History ({savedMatches.length})
        </h3>
        <Button
          onClick={() => {
            if (confirm('Clear all match history?')) {
              clearHistory();
            }
          }}
          variant="ghost"
          size="sm"
          className="text-red-400 hover:text-red-300"
        >
          <Trash2 className="w-4 h-4 mr-1" />
          Clear All
        </Button>
      </div>

      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
        {savedMatches.map((entry) => {
          const { match } = entry;
          return (
            <div
              key={entry.id}
              className="bg-slate-700/50 rounded-lg p-3 hover:bg-slate-700 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400">
                  {formatDate(entry.savedAt)}
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded ${
                    match.period === 'finished'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}
                >
                  {match.period === 'finished' ? 'Finished' : 'In Progress'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: match.home.color }}
                    />
                    <span className="text-white font-medium truncate">
                      {match.home.name}
                    </span>
                    <span className="text-xl font-bold text-white">
                      {match.home.score}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: match.away.color }}
                    />
                    <span className="text-white font-medium truncate">
                      {match.away.name}
                    </span>
                    <span className="text-xl font-bold text-white">
                      {match.away.score}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => handleLoadMatch(entry.id)}
                    variant="ghost"
                    size="sm"
                    title="Load Match"
                  >
                    <Play className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => {
                      if (confirm('Delete this match from history?')) {
                        deleteMatch(entry.id);
                      }
                    }}
                    variant="ghost"
                    size="sm"
                    className="text-red-400 hover:text-red-300"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
