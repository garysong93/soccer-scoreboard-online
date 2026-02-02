import { useState } from 'react';
import { Users, Plus, Trash2, Edit2, Save, X, UserPlus } from 'lucide-react';
import { useRosterStore } from '../../stores/useRosterStore';
import type { RosterPlayer } from '../../types';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';

interface PlayerManagementProps {
  isOpen: boolean;
  onClose: () => void;
}

type Position = 'GK' | 'DF' | 'MF' | 'FW';

const positionLabels: Record<Position, string> = {
  GK: 'Goalkeeper',
  DF: 'Defender',
  MF: 'Midfielder',
  FW: 'Forward',
};

const positionColors: Record<Position, string> = {
  GK: 'bg-yellow-500',
  DF: 'bg-blue-500',
  MF: 'bg-green-500',
  FW: 'bg-red-500',
};

export function PlayerManagement({ isOpen, onClose }: PlayerManagementProps) {
  const { teams, createTeam, deleteTeam, addPlayer, updatePlayer, removePlayer } = useRosterStore();
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [isAddingTeam, setIsAddingTeam] = useState(false);
  const [isAddingPlayer, setIsAddingPlayer] = useState(false);
  const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);

  // Team form
  const [teamName, setTeamName] = useState('');
  const [teamShortName, setTeamShortName] = useState('');
  const [teamColor, setTeamColor] = useState('#ef4444');

  // Player form
  const [playerName, setPlayerName] = useState('');
  const [playerNumber, setPlayerNumber] = useState('');
  const [playerPosition, setPlayerPosition] = useState<Position>('MF');

  const selectedTeam = teams.find(t => t.id === selectedTeamId);

  const handleCreateTeam = () => {
    if (teamName && teamShortName) {
      const newTeam = createTeam(teamName, teamShortName, teamColor);
      setSelectedTeamId(newTeam.id);
      setIsAddingTeam(false);
      setTeamName('');
      setTeamShortName('');
      setTeamColor('#ef4444');
    }
  };

  const handleAddPlayer = () => {
    if (selectedTeamId && playerName && playerNumber) {
      addPlayer(selectedTeamId, {
        name: playerName,
        number: parseInt(playerNumber),
        position: playerPosition,
      });
      setIsAddingPlayer(false);
      setPlayerName('');
      setPlayerNumber('');
      setPlayerPosition('MF');
    }
  };

  const handleUpdatePlayer = (player: RosterPlayer) => {
    updatePlayer(player.id, {
      name: playerName || player.name,
      number: playerNumber ? parseInt(playerNumber) : player.number,
      position: playerPosition,
    });
    setEditingPlayerId(null);
    setPlayerName('');
    setPlayerNumber('');
  };

  const startEditPlayer = (player: RosterPlayer) => {
    setEditingPlayerId(player.id);
    setPlayerName(player.name);
    setPlayerNumber(player.number.toString());
    setPlayerPosition(player.position);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Team & Player Management" size="lg">
      <div className="flex h-[500px]">
        {/* Teams sidebar */}
        <div className="w-1/3 border-r border-slate-700 pr-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-300 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Teams
            </h3>
            <button
              onClick={() => setIsAddingTeam(true)}
              className="p-1 hover:bg-slate-700 rounded transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {isAddingTeam && (
            <div className="mb-4 p-3 bg-slate-800 rounded-lg space-y-2">
              <input
                type="text"
                placeholder="Team name"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="w-full px-2 py-1 bg-slate-700 rounded text-sm"
              />
              <input
                type="text"
                placeholder="Short name (3-4 chars)"
                value={teamShortName}
                onChange={(e) => setTeamShortName(e.target.value.toUpperCase().slice(0, 4))}
                className="w-full px-2 py-1 bg-slate-700 rounded text-sm"
              />
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={teamColor}
                  onChange={(e) => setTeamColor(e.target.value)}
                  className="w-8 h-8 rounded cursor-pointer"
                />
                <span className="text-sm text-slate-400">Team color</span>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleCreateTeam}>
                  <Save className="w-3 h-3 mr-1" />
                  Save
                </Button>
                <Button size="sm" variant="secondary" onClick={() => setIsAddingTeam(false)}>
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-2 overflow-y-auto max-h-[400px]">
            {teams.map((team) => (
              <div
                key={team.id}
                onClick={() => setSelectedTeamId(team.id)}
                className={`p-3 rounded-lg cursor-pointer transition-colors flex items-center gap-3 ${
                  selectedTeamId === team.id
                    ? 'bg-slate-700'
                    : 'bg-slate-800 hover:bg-slate-750'
                }`}
              >
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: team.color }}
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{team.name}</div>
                  <div className="text-xs text-slate-400">
                    {team.players.length} players
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm('Delete this team?')) {
                      deleteTeam(team.id);
                      if (selectedTeamId === team.id) setSelectedTeamId(null);
                    }
                  }}
                  className="p-1 hover:bg-slate-600 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-3 h-3 text-red-400" />
                </button>
              </div>
            ))}
            {teams.length === 0 && (
              <div className="text-center text-slate-500 py-8">
                No teams yet. Create one to get started.
              </div>
            )}
          </div>
        </div>

        {/* Players panel */}
        <div className="w-2/3 pl-4">
          {selectedTeam ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: selectedTeam.color }}
                  />
                  <h3 className="font-semibold">{selectedTeam.name}</h3>
                </div>
                <Button size="sm" onClick={() => setIsAddingPlayer(true)}>
                  <UserPlus className="w-4 h-4 mr-1" />
                  Add Player
                </Button>
              </div>

              {isAddingPlayer && (
                <div className="mb-4 p-3 bg-slate-800 rounded-lg">
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Name"
                      value={playerName}
                      onChange={(e) => setPlayerName(e.target.value)}
                      className="col-span-2 px-2 py-1 bg-slate-700 rounded text-sm"
                    />
                    <input
                      type="number"
                      placeholder="#"
                      value={playerNumber}
                      onChange={(e) => setPlayerNumber(e.target.value)}
                      className="px-2 py-1 bg-slate-700 rounded text-sm"
                      min="1"
                      max="99"
                    />
                  </div>
                  <div className="flex gap-2 mb-2">
                    {(['GK', 'DF', 'MF', 'FW'] as Position[]).map((pos) => (
                      <button
                        key={pos}
                        onClick={() => setPlayerPosition(pos)}
                        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                          playerPosition === pos
                            ? `${positionColors[pos]} text-white`
                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        }`}
                      >
                        {pos}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleAddPlayer}>
                      <Save className="w-3 h-3 mr-1" />
                      Add
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => setIsAddingPlayer(false)}>
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-2 overflow-y-auto max-h-[380px]">
                {selectedTeam.players
                  .sort((a, b) => a.number - b.number)
                  .map((player) => (
                    <div
                      key={player.id}
                      className="p-3 bg-slate-800 rounded-lg flex items-center gap-3 group"
                    >
                      <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-sm">
                        {player.number}
                      </div>
                      {editingPlayerId === player.id ? (
                        <div className="flex-1 flex gap-2">
                          <input
                            type="text"
                            value={playerName}
                            onChange={(e) => setPlayerName(e.target.value)}
                            className="flex-1 px-2 py-1 bg-slate-700 rounded text-sm"
                          />
                          <input
                            type="number"
                            value={playerNumber}
                            onChange={(e) => setPlayerNumber(e.target.value)}
                            className="w-16 px-2 py-1 bg-slate-700 rounded text-sm"
                          />
                          <select
                            value={playerPosition}
                            onChange={(e) => setPlayerPosition(e.target.value as Position)}
                            className="px-2 py-1 bg-slate-700 rounded text-sm"
                          >
                            {(['GK', 'DF', 'MF', 'FW'] as Position[]).map((pos) => (
                              <option key={pos} value={pos}>{pos}</option>
                            ))}
                          </select>
                          <button
                            onClick={() => handleUpdatePlayer(player)}
                            className="p-1 hover:bg-slate-600 rounded text-green-400"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingPlayerId(null)}
                            className="p-1 hover:bg-slate-600 rounded text-slate-400"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="flex-1">
                            <div className="font-medium">{player.name}</div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`px-2 py-0.5 rounded text-xs font-medium ${positionColors[player.position]} text-white`}>
                                {positionLabels[player.position]}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => startEditPlayer(player)}
                              className="p-1 hover:bg-slate-600 rounded"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm('Remove this player?')) {
                                  removePlayer(player.id);
                                }
                              }}
                              className="p-1 hover:bg-slate-600 rounded text-red-400"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                {selectedTeam.players.length === 0 && (
                  <div className="text-center text-slate-500 py-8">
                    No players yet. Add your first player.
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500">
              Select a team to manage players
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
