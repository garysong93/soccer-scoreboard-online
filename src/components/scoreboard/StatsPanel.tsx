import { Minus, Plus } from 'lucide-react';
import { useGameStore } from '../../stores/useGameStore';
import type { MatchStats } from '../../types';

interface StatRowProps {
  label: string;
  homeValue: number;
  awayValue: number;
  statKey: keyof MatchStats;
  suffix?: string;
}

const StatRow = ({ label, homeValue, awayValue, statKey, suffix = '' }: StatRowProps) => {
  const { updateStat } = useGameStore();
  const total = homeValue + awayValue || 1;
  const homePercent = (homeValue / total) * 100;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-1">
          <button
            onClick={() => updateStat(statKey, 'home', -1)}
            className="p-0.5 rounded hover:bg-slate-600 text-slate-400"
          >
            <Minus className="w-3 h-3" />
          </button>
          <span className="w-8 text-center font-medium text-white">
            {homeValue}{suffix}
          </span>
          <button
            onClick={() => updateStat(statKey, 'home', 1)}
            className="p-0.5 rounded hover:bg-slate-600 text-slate-400"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
        <span className="text-slate-400 text-xs">{label}</span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => updateStat(statKey, 'away', -1)}
            className="p-0.5 rounded hover:bg-slate-600 text-slate-400"
          >
            <Minus className="w-3 h-3" />
          </button>
          <span className="w-8 text-center font-medium text-white">
            {awayValue}{suffix}
          </span>
          <button
            onClick={() => updateStat(statKey, 'away', 1)}
            className="p-0.5 rounded hover:bg-slate-600 text-slate-400"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      </div>
      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-300"
          style={{ width: `${homePercent}%` }}
        />
      </div>
    </div>
  );
};

export const StatsPanel = () => {
  const { match } = useGameStore();
  const { stats } = match;

  return (
    <div className="bg-slate-800/50 rounded-xl p-4 space-y-4">
      <h3 className="text-center text-sm font-medium text-slate-400 uppercase tracking-wider">
        Match Statistics
      </h3>

      <div className="space-y-3">
        <StatRow
          label="Possession"
          homeValue={stats.possession.home}
          awayValue={stats.possession.away}
          statKey="possession"
          suffix="%"
        />
        <StatRow
          label="Shots"
          homeValue={stats.shots.home}
          awayValue={stats.shots.away}
          statKey="shots"
        />
        <StatRow
          label="On Target"
          homeValue={stats.shotsOnTarget.home}
          awayValue={stats.shotsOnTarget.away}
          statKey="shotsOnTarget"
        />
        <StatRow
          label="Corners"
          homeValue={stats.corners.home}
          awayValue={stats.corners.away}
          statKey="corners"
        />
        <StatRow
          label="Fouls"
          homeValue={stats.fouls.home}
          awayValue={stats.fouls.away}
          statKey="fouls"
        />
        <StatRow
          label="Offsides"
          homeValue={stats.offsides.home}
          awayValue={stats.offsides.away}
          statKey="offsides"
        />
      </div>
    </div>
  );
};
