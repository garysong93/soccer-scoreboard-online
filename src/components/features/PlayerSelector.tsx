import { useState } from 'react';
import { User, Search, X } from 'lucide-react';
import type { RosterPlayer } from '../../types';
import { Modal } from '../ui/Modal';

interface PlayerSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (player: RosterPlayer | null) => void;
  players: RosterPlayer[];
  teamName: string;
  teamColor: string;
  actionType: 'goal' | 'assist' | 'yellow_card' | 'red_card';
}

const actionLabels = {
  goal: 'Goal Scorer',
  assist: 'Assist Provider',
  yellow_card: 'Yellow Card',
  red_card: 'Red Card',
};

const actionIcons = {
  goal: '⚽',
  assist: '👟',
  yellow_card: '🟨',
  red_card: '🟥',
};

const positionColors: Record<string, string> = {
  GK: 'bg-yellow-500',
  DF: 'bg-blue-500',
  MF: 'bg-green-500',
  FW: 'bg-red-500',
};

export function PlayerSelector({
  isOpen,
  onClose,
  onSelect,
  players,
  teamName,
  teamColor,
  actionType,
}: PlayerSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPlayers = players.filter(
    (player) =>
      player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      player.number.toString().includes(searchQuery)
  );

  const handleSelect = (player: RosterPlayer | null) => {
    onSelect(player);
    setSearchQuery('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setSearchQuery('');
        onClose();
      }}
      title={
        <div className="flex items-center gap-3">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: teamColor }}
          />
          <span>{teamName}</span>
          <span className="text-2xl">{actionIcons[actionType]}</span>
          <span className="text-slate-400">{actionLabels[actionType]}</span>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="w-4 h-4 text-slate-400" />
            </button>
          )}
        </div>

        {/* Skip player option */}
        <button
          onClick={() => handleSelect(null)}
          className="w-full p-3 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center gap-3 transition-colors text-slate-400"
        >
          <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
          <span>Unknown / Skip Player Selection</span>
        </button>

        {/* Player list */}
        <div className="max-h-[300px] overflow-y-auto space-y-2">
          {filteredPlayers.length > 0 ? (
            filteredPlayers
              .sort((a, b) => a.number - b.number)
              .map((player) => (
                <button
                  key={player.id}
                  onClick={() => handleSelect(player)}
                  className="w-full p-3 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center gap-3 transition-colors group"
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg"
                    style={{ backgroundColor: teamColor + '40', color: teamColor }}
                  >
                    {player.number}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium">{player.name}</div>
                    <span
                      className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium ${positionColors[player.position]} text-white`}
                    >
                      {player.position}
                    </span>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-2xl">
                    {actionIcons[actionType]}
                  </div>
                </button>
              ))
          ) : (
            <div className="text-center text-slate-500 py-8">
              {searchQuery
                ? 'No players found matching your search'
                : 'No players in this team. Add players in Team Management.'}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
