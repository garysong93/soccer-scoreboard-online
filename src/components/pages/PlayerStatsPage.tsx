import { useState } from 'react';
import { ArrowLeft, Trophy, Target, Clock, AlertTriangle, TrendingUp, Users } from 'lucide-react';
import { useRosterStore } from '../../stores/useRosterStore';
import { Header } from '../layout/Header';
import { Footer } from '../layout/Footer';

type SortField = 'goals' | 'assists' | 'matches' | 'yellowCards' | 'redCards' | 'minutes';

const positionColors: Record<string, string> = {
  GK: 'bg-yellow-500',
  DF: 'bg-blue-500',
  MF: 'bg-green-500',
  FW: 'bg-red-500',
};

export function PlayerStatsPage() {
  const { teams, playerStats } = useRosterStore();
  const [sortField, setSortField] = useState<SortField>('goals');
  const [selectedTeamId, setSelectedTeamId] = useState<string | 'all'>('all');

  // Get all players with their stats
  const allPlayers = teams.flatMap((team) =>
    team.players.map((player) => ({
      player,
      team,
      stats: playerStats[player.id] || {
        playerId: player.id,
        totalMatches: 0,
        totalGoals: 0,
        totalAssists: 0,
        totalYellowCards: 0,
        totalRedCards: 0,
        totalMinutesPlayed: 0,
        matchHistory: [],
      },
    }))
  );

  // Filter by team
  const filteredPlayers =
    selectedTeamId === 'all'
      ? allPlayers
      : allPlayers.filter((p) => p.team.id === selectedTeamId);

  // Sort players
  const sortedPlayers = [...filteredPlayers].sort((a, b) => {
    switch (sortField) {
      case 'goals':
        return b.stats.totalGoals - a.stats.totalGoals;
      case 'assists':
        return b.stats.totalAssists - a.stats.totalAssists;
      case 'matches':
        return b.stats.totalMatches - a.stats.totalMatches;
      case 'yellowCards':
        return b.stats.totalYellowCards - a.stats.totalYellowCards;
      case 'redCards':
        return b.stats.totalRedCards - a.stats.totalRedCards;
      case 'minutes':
        return b.stats.totalMinutesPlayed - a.stats.totalMinutesPlayed;
      default:
        return 0;
    }
  });

  const formatMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-white">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-6">
          <a
            href="/scoreboard"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Scoreboard
          </a>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-blue-500" />
              Player Statistics
            </h1>
            <p className="text-slate-400 mt-1">
              Career stats across all matches
            </p>
          </div>

          {/* Filters */}
          <div className="flex gap-4">
            <select
              value={selectedTeamId}
              onChange={(e) => setSelectedTeamId(e.target.value)}
              className="px-4 py-2 bg-slate-800 rounded-lg text-sm"
            >
              <option value="all">All Teams</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Top Scorers Card */}
        {sortedPlayers.length > 0 && sortedPlayers[0].stats.totalGoals > 0 && (
          <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              Top Scorer
            </h2>
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold"
                style={{
                  backgroundColor: sortedPlayers[0].team.color + '40',
                  color: sortedPlayers[0].team.color,
                }}
              >
                {sortedPlayers[0].player.number}
              </div>
              <div>
                <div className="text-2xl font-bold">{sortedPlayers[0].player.name}</div>
                <div className="flex items-center gap-2 text-slate-400">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: sortedPlayers[0].team.color }}
                  />
                  {sortedPlayers[0].team.name}
                </div>
              </div>
              <div className="ml-auto text-right">
                <div className="text-4xl font-bold text-yellow-500">
                  {sortedPlayers[0].stats.totalGoals}
                </div>
                <div className="text-slate-400">Goals</div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Table */}
        <div className="bg-slate-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-700/50">
                  <th className="text-left p-4 font-medium text-slate-400">Player</th>
                  <th className="text-left p-4 font-medium text-slate-400">Team</th>
                  <th
                    className={`text-center p-4 font-medium cursor-pointer transition-colors ${
                      sortField === 'matches' ? 'text-blue-400' : 'text-slate-400 hover:text-white'
                    }`}
                    onClick={() => setSortField('matches')}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <Users className="w-4 h-4" />
                      MP
                    </div>
                  </th>
                  <th
                    className={`text-center p-4 font-medium cursor-pointer transition-colors ${
                      sortField === 'goals' ? 'text-blue-400' : 'text-slate-400 hover:text-white'
                    }`}
                    onClick={() => setSortField('goals')}
                  >
                    ⚽ G
                  </th>
                  <th
                    className={`text-center p-4 font-medium cursor-pointer transition-colors ${
                      sortField === 'assists' ? 'text-blue-400' : 'text-slate-400 hover:text-white'
                    }`}
                    onClick={() => setSortField('assists')}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <Target className="w-4 h-4" />
                      A
                    </div>
                  </th>
                  <th
                    className={`text-center p-4 font-medium cursor-pointer transition-colors ${
                      sortField === 'yellowCards' ? 'text-blue-400' : 'text-slate-400 hover:text-white'
                    }`}
                    onClick={() => setSortField('yellowCards')}
                  >
                    🟨
                  </th>
                  <th
                    className={`text-center p-4 font-medium cursor-pointer transition-colors ${
                      sortField === 'redCards' ? 'text-blue-400' : 'text-slate-400 hover:text-white'
                    }`}
                    onClick={() => setSortField('redCards')}
                  >
                    🟥
                  </th>
                  <th
                    className={`text-center p-4 font-medium cursor-pointer transition-colors ${
                      sortField === 'minutes' ? 'text-blue-400' : 'text-slate-400 hover:text-white'
                    }`}
                    onClick={() => setSortField('minutes')}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <Clock className="w-4 h-4" />
                      Min
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedPlayers.map(({ player, team, stats }, index) => (
                  <tr
                    key={player.id}
                    className="border-t border-slate-700 hover:bg-slate-700/30 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="text-slate-500 w-6 text-center font-medium">
                          {index + 1}
                        </div>
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center font-bold"
                          style={{
                            backgroundColor: team.color + '40',
                            color: team.color,
                          }}
                        >
                          {player.number}
                        </div>
                        <div>
                          <div className="font-medium">{player.name}</div>
                          <span
                            className={`inline-block mt-0.5 px-2 py-0.5 rounded text-xs font-medium ${positionColors[player.position]} text-white`}
                          >
                            {player.position}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: team.color }}
                        />
                        <span className="text-slate-300">{team.shortName}</span>
                      </div>
                    </td>
                    <td className="p-4 text-center font-medium">{stats.totalMatches}</td>
                    <td className="p-4 text-center font-bold text-lg">{stats.totalGoals}</td>
                    <td className="p-4 text-center font-medium">{stats.totalAssists}</td>
                    <td className="p-4 text-center">
                      {stats.totalYellowCards > 0 && (
                        <span className="text-yellow-500 font-medium">
                          {stats.totalYellowCards}
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {stats.totalRedCards > 0 && (
                        <span className="text-red-500 font-medium">{stats.totalRedCards}</span>
                      )}
                    </td>
                    <td className="p-4 text-center text-slate-400">
                      {formatMinutes(stats.totalMinutesPlayed)}
                    </td>
                  </tr>
                ))}
                {sortedPlayers.length === 0 && (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-slate-500">
                      <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <div>No players found.</div>
                      <div className="text-sm mt-1">
                        Add teams and players in the Team Management panel.
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
