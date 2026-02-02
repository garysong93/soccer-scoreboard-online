import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TeamRoster, RosterPlayer, PlayerCareerStats, PlayerMatchRecord } from '../types';

const generateId = () => Math.random().toString(36).substring(2, 9);

interface RosterState {
  teams: TeamRoster[];
  playerStats: Record<string, PlayerCareerStats>;

  // Team actions
  createTeam: (name: string, shortName: string, color: string) => TeamRoster;
  updateTeam: (teamId: string, updates: Partial<Omit<TeamRoster, 'id' | 'players' | 'createdAt'>>) => void;
  deleteTeam: (teamId: string) => void;
  getTeam: (teamId: string) => TeamRoster | undefined;

  // Player actions
  addPlayer: (teamId: string, player: Omit<RosterPlayer, 'id' | 'teamId' | 'createdAt'>) => RosterPlayer | null;
  updatePlayer: (playerId: string, updates: Partial<Omit<RosterPlayer, 'id' | 'teamId' | 'createdAt'>>) => void;
  removePlayer: (playerId: string) => void;
  getPlayer: (playerId: string) => RosterPlayer | undefined;
  getTeamPlayers: (teamId: string) => RosterPlayer[];

  // Stats actions
  recordPlayerMatch: (playerId: string, record: Omit<PlayerMatchRecord, 'matchId'> & { matchId: string }) => void;
  getPlayerStats: (playerId: string) => PlayerCareerStats | undefined;
  getTopScorers: (limit?: number) => Array<{ player: RosterPlayer; stats: PlayerCareerStats }>;
}

export const useRosterStore = create<RosterState>()(
  persist(
    (set, get) => ({
      teams: [],
      playerStats: {},

      createTeam: (name, shortName, color) => {
        const newTeam: TeamRoster = {
          id: generateId(),
          name,
          shortName,
          color,
          players: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        set((state) => ({
          teams: [...state.teams, newTeam],
        }));
        return newTeam;
      },

      updateTeam: (teamId, updates) => {
        set((state) => ({
          teams: state.teams.map((team) =>
            team.id === teamId
              ? { ...team, ...updates, updatedAt: Date.now() }
              : team
          ),
        }));
      },

      deleteTeam: (teamId) => {
        set((state) => ({
          teams: state.teams.filter((team) => team.id !== teamId),
        }));
      },

      getTeam: (teamId) => {
        return get().teams.find((team) => team.id === teamId);
      },

      addPlayer: (teamId, playerData) => {
        const team = get().teams.find((t) => t.id === teamId);
        if (!team) return null;

        const newPlayer: RosterPlayer = {
          id: generateId(),
          teamId,
          createdAt: Date.now(),
          ...playerData,
        };

        set((state) => ({
          teams: state.teams.map((t) =>
            t.id === teamId
              ? { ...t, players: [...t.players, newPlayer], updatedAt: Date.now() }
              : t
          ),
          playerStats: {
            ...state.playerStats,
            [newPlayer.id]: {
              playerId: newPlayer.id,
              totalMatches: 0,
              totalGoals: 0,
              totalAssists: 0,
              totalYellowCards: 0,
              totalRedCards: 0,
              totalMinutesPlayed: 0,
              matchHistory: [],
            },
          },
        }));

        return newPlayer;
      },

      updatePlayer: (playerId, updates) => {
        set((state) => ({
          teams: state.teams.map((team) => ({
            ...team,
            players: team.players.map((player) =>
              player.id === playerId ? { ...player, ...updates } : player
            ),
            updatedAt: team.players.some((p) => p.id === playerId)
              ? Date.now()
              : team.updatedAt,
          })),
        }));
      },

      removePlayer: (playerId) => {
        set((state) => ({
          teams: state.teams.map((team) => ({
            ...team,
            players: team.players.filter((player) => player.id !== playerId),
            updatedAt: team.players.some((p) => p.id === playerId)
              ? Date.now()
              : team.updatedAt,
          })),
        }));
      },

      getPlayer: (playerId) => {
        for (const team of get().teams) {
          const player = team.players.find((p) => p.id === playerId);
          if (player) return player;
        }
        return undefined;
      },

      getTeamPlayers: (teamId) => {
        const team = get().teams.find((t) => t.id === teamId);
        return team?.players || [];
      },

      recordPlayerMatch: (playerId, record) => {
        set((state) => {
          const existingStats = state.playerStats[playerId] || {
            playerId,
            totalMatches: 0,
            totalGoals: 0,
            totalAssists: 0,
            totalYellowCards: 0,
            totalRedCards: 0,
            totalMinutesPlayed: 0,
            matchHistory: [],
          };

          // Check if match already recorded
          const matchExists = existingStats.matchHistory.some(
            (m) => m.matchId === record.matchId
          );

          if (matchExists) {
            // Update existing match record
            return {
              playerStats: {
                ...state.playerStats,
                [playerId]: {
                  ...existingStats,
                  matchHistory: existingStats.matchHistory.map((m) =>
                    m.matchId === record.matchId ? record : m
                  ),
                  totalGoals: existingStats.matchHistory.reduce(
                    (sum, m) => sum + (m.matchId === record.matchId ? record.goals : m.goals),
                    0
                  ),
                  totalAssists: existingStats.matchHistory.reduce(
                    (sum, m) => sum + (m.matchId === record.matchId ? record.assists : m.assists),
                    0
                  ),
                  totalYellowCards: existingStats.matchHistory.reduce(
                    (sum, m) => sum + (m.matchId === record.matchId ? record.yellowCards : m.yellowCards),
                    0
                  ),
                  totalRedCards: existingStats.matchHistory.reduce(
                    (sum, m) => sum + (m.matchId === record.matchId ? record.redCards : m.redCards),
                    0
                  ),
                  totalMinutesPlayed: existingStats.matchHistory.reduce(
                    (sum, m) => sum + (m.matchId === record.matchId ? record.minutesPlayed : m.minutesPlayed),
                    0
                  ),
                },
              },
            };
          }

          // Add new match record
          return {
            playerStats: {
              ...state.playerStats,
              [playerId]: {
                ...existingStats,
                totalMatches: existingStats.totalMatches + 1,
                totalGoals: existingStats.totalGoals + record.goals,
                totalAssists: existingStats.totalAssists + record.assists,
                totalYellowCards: existingStats.totalYellowCards + record.yellowCards,
                totalRedCards: existingStats.totalRedCards + record.redCards,
                totalMinutesPlayed: existingStats.totalMinutesPlayed + record.minutesPlayed,
                matchHistory: [...existingStats.matchHistory, record],
              },
            },
          };
        });
      },

      getPlayerStats: (playerId) => {
        return get().playerStats[playerId];
      },

      getTopScorers: (limit = 10) => {
        const { teams, playerStats } = get();
        const allPlayers: Array<{ player: RosterPlayer; stats: PlayerCareerStats }> = [];

        for (const team of teams) {
          for (const player of team.players) {
            const stats = playerStats[player.id];
            if (stats) {
              allPlayers.push({ player, stats });
            }
          }
        }

        return allPlayers
          .sort((a, b) => b.stats.totalGoals - a.stats.totalGoals)
          .slice(0, limit);
      },
    }),
    {
      name: 'soccer-scoreboard-roster',
    }
  )
);
