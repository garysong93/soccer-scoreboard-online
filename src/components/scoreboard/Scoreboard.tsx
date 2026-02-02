import { useState } from 'react';
import { Users, TrendingUp } from 'lucide-react';
import { useGameStore } from '../../stores/useGameStore';
import { useSettingsStore } from '../../stores/useSettingsStore';
import { useRosterStore } from '../../stores/useRosterStore';
import { MatchTimer } from './MatchTimer';
import { TeamPanel } from './TeamPanel';
import { StatsPanel } from './StatsPanel';
import { EventTimeline } from './EventTimeline';
import { PlayerManagement } from '../features/PlayerManagement';
import { PlayerSelector } from '../features/PlayerSelector';
import type { RosterPlayer } from '../../types';

type PendingAction = {
  type: 'goal' | 'yellow_card' | 'red_card';
  team: 'home' | 'away';
} | null;

export const Scoreboard = () => {
  const { match, addGoal, removeGoal, addYellowCard, removeYellowCard, addRedCard, removeRedCard, setTeamName, setTeamColor } = useGameStore();
  const { showStats } = useSettingsStore();
  const { teams, recordPlayerMatch } = useRosterStore();

  const [showPlayerManagement, setShowPlayerManagement] = useState(false);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);

  // Find matching roster team by name
  const findRosterTeam = (teamName: string) => {
    return teams.find(t =>
      t.name.toLowerCase() === teamName.toLowerCase() ||
      t.shortName.toLowerCase() === teamName.toLowerCase()
    );
  };

  const homeRoster = findRosterTeam(match.home.name);
  const awayRoster = findRosterTeam(match.away.name);

  // Handle action with player selection
  const handleActionWithPlayer = (type: 'goal' | 'yellow_card' | 'red_card', team: 'home' | 'away') => {
    const roster = team === 'home' ? homeRoster : awayRoster;
    if (roster && roster.players.length > 0) {
      setPendingAction({ type, team });
    } else {
      // No roster, execute action without player
      executeAction(type, team, null);
    }
  };

  const executeAction = (type: 'goal' | 'yellow_card' | 'red_card', team: 'home' | 'away', player: RosterPlayer | null) => {
    switch (type) {
      case 'goal':
        addGoal(team);
        if (player) {
          recordPlayerMatch(player.id, {
            matchId: match.id,
            matchDate: match.createdAt,
            opponent: team === 'home' ? match.away.name : match.home.name,
            goals: 1,
            assists: 0,
            yellowCards: 0,
            redCards: 0,
            minutesPlayed: Math.floor(match.timerSeconds / 60),
          });
        }
        break;
      case 'yellow_card':
        addYellowCard(team);
        if (player) {
          recordPlayerMatch(player.id, {
            matchId: match.id,
            matchDate: match.createdAt,
            opponent: team === 'home' ? match.away.name : match.home.name,
            goals: 0,
            assists: 0,
            yellowCards: 1,
            redCards: 0,
            minutesPlayed: Math.floor(match.timerSeconds / 60),
          });
        }
        break;
      case 'red_card':
        addRedCard(team);
        if (player) {
          recordPlayerMatch(player.id, {
            matchId: match.id,
            matchDate: match.createdAt,
            opponent: team === 'home' ? match.away.name : match.home.name,
            goals: 0,
            assists: 0,
            yellowCards: 0,
            redCards: 1,
            minutesPlayed: Math.floor(match.timerSeconds / 60),
          });
        }
        break;
    }
    setPendingAction(null);
  };

  const handlePlayerSelect = (player: RosterPlayer | null) => {
    if (pendingAction) {
      executeAction(pendingAction.type, pendingAction.team, player);
    }
  };

  const getCurrentRoster = () => {
    if (!pendingAction) return [];
    return pendingAction.team === 'home' ? homeRoster?.players || [] : awayRoster?.players || [];
  };

  const getCurrentTeamInfo = () => {
    if (!pendingAction) return { name: '', color: '' };
    return pendingAction.team === 'home'
      ? { name: match.home.name, color: match.home.color }
      : { name: match.away.name, color: match.away.color };
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Quick Actions Bar */}
      <div className="flex justify-center gap-4">
        <button
          onClick={() => setShowPlayerManagement(true)}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors text-sm"
        >
          <Users className="w-4 h-4" />
          Team Management
        </button>
        <a
          href="/player-stats"
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors text-sm"
        >
          <TrendingUp className="w-4 h-4" />
          Player Stats
        </a>
      </div>

      {/* Timer Section */}
      <div className="bg-slate-800/80 backdrop-blur rounded-2xl p-6 shadow-xl">
        <MatchTimer />
      </div>

      {/* Scoreboard Section */}
      <div className="bg-slate-800/80 backdrop-blur rounded-2xl p-6 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-4 items-center">
          {/* Home Team */}
          <TeamPanel
            team={match.home}
            side="home"
            onAddGoal={() => handleActionWithPlayer('goal', 'home')}
            onRemoveGoal={() => removeGoal('home')}
            onAddYellowCard={() => handleActionWithPlayer('yellow_card', 'home')}
            onRemoveYellowCard={() => removeYellowCard('home')}
            onAddRedCard={() => handleActionWithPlayer('red_card', 'home')}
            onRemoveRedCard={() => removeRedCard('home')}
            onNameChange={(name) => setTeamName('home', name)}
            onColorChange={(color) => setTeamColor('home', color)}
          />

          {/* VS Divider */}
          <div className="hidden md:flex flex-col items-center justify-center px-8">
            <div className="text-4xl font-bold text-slate-500">VS</div>
          </div>

          {/* Away Team */}
          <TeamPanel
            team={match.away}
            side="away"
            onAddGoal={() => handleActionWithPlayer('goal', 'away')}
            onRemoveGoal={() => removeGoal('away')}
            onAddYellowCard={() => handleActionWithPlayer('yellow_card', 'away')}
            onRemoveYellowCard={() => removeYellowCard('away')}
            onAddRedCard={() => handleActionWithPlayer('red_card', 'away')}
            onRemoveRedCard={() => removeRedCard('away')}
            onNameChange={(name) => setTeamName('away', name)}
            onColorChange={(color) => setTeamColor('away', color)}
          />
        </div>
      </div>

      {/* Stats and Events */}
      {showStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StatsPanel />
          <EventTimeline />
        </div>
      )}

      {/* Player Management Modal */}
      <PlayerManagement
        isOpen={showPlayerManagement}
        onClose={() => setShowPlayerManagement(false)}
      />

      {/* Player Selector Modal */}
      {pendingAction && (
        <PlayerSelector
          isOpen={true}
          onClose={() => setPendingAction(null)}
          onSelect={handlePlayerSelect}
          players={getCurrentRoster()}
          teamName={getCurrentTeamInfo().name}
          teamColor={getCurrentTeamInfo().color}
          actionType={pendingAction.type}
        />
      )}
    </div>
  );
};
