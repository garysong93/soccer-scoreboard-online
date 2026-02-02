import { useState, useEffect, useRef } from 'react';
import { Plus, Minus, Edit2, Check } from 'lucide-react';
import type { Team } from '../../types';
import { useSound } from '../../hooks/useSound';

interface TeamPanelProps {
  team: Team;
  side: 'home' | 'away';
  onAddGoal: () => void;
  onRemoveGoal: () => void;
  onAddYellowCard: () => void;
  onRemoveYellowCard: () => void;
  onAddRedCard: () => void;
  onRemoveRedCard: () => void;
  onNameChange: (name: string) => void;
  onColorChange: (color: string) => void;
}

const PRESET_COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e',
  '#14b8a6', '#3b82f6', '#8b5cf6', '#ec4899',
  '#ffffff', '#64748b', '#1e293b', '#000000',
];

export const TeamPanel = ({
  team,
  side,
  onAddGoal,
  onRemoveGoal,
  onAddYellowCard,
  onRemoveYellowCard,
  onAddRedCard,
  onRemoveRedCard,
  onNameChange,
  onColorChange,
}: TeamPanelProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(team.name);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [scoreAnimation, setScoreAnimation] = useState(false);
  const [yellowCardAnimation, setYellowCardAnimation] = useState(false);
  const [redCardAnimation, setRedCardAnimation] = useState(false);

  const prevScoreRef = useRef(team.score);
  const prevYellowRef = useRef(team.yellowCards);
  const prevRedRef = useRef(team.redCards);

  const { playGoal, playCard } = useSound();

  // Detect score changes and trigger animation
  useEffect(() => {
    if (team.score > prevScoreRef.current) {
      setScoreAnimation(true);
      playGoal();
      setTimeout(() => setScoreAnimation(false), 1000);
    }
    prevScoreRef.current = team.score;
  }, [team.score, playGoal]);

  // Detect yellow card changes
  useEffect(() => {
    if (team.yellowCards > prevYellowRef.current) {
      setYellowCardAnimation(true);
      playCard();
      setTimeout(() => setYellowCardAnimation(false), 600);
    }
    prevYellowRef.current = team.yellowCards;
  }, [team.yellowCards, playCard]);

  // Detect red card changes
  useEffect(() => {
    if (team.redCards > prevRedRef.current) {
      setRedCardAnimation(true);
      playCard();
      setTimeout(() => setRedCardAnimation(false), 600);
    }
    prevRedRef.current = team.redCards;
  }, [team.redCards, playCard]);

  const handleSave = () => {
    onNameChange(editName);
    setIsEditing(false);
  };

  return (
    <div className={`flex flex-col items-center gap-4 p-4 ${side === 'away' ? 'md:items-end' : 'md:items-start'}`}>
      {/* Team Name & Color */}
      <div className="flex items-center gap-2">
        <div
          className="w-8 h-8 rounded-full cursor-pointer border-2 border-white/20 hover:border-white/50 transition-colors"
          style={{ backgroundColor: team.color }}
          onClick={() => setShowColorPicker(!showColorPicker)}
        />
        {isEditing ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="bg-slate-700 text-white px-3 py-1 rounded-lg text-lg font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            />
            <button
              onClick={handleSave}
              className="p-1 rounded-lg hover:bg-slate-700 text-green-400"
            >
              <Check className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <h2
              className="text-xl md:text-2xl font-bold text-white cursor-pointer hover:text-blue-400 transition-colors"
              onClick={() => setIsEditing(true)}
            >
              {team.name}
            </h2>
            <button
              onClick={() => setIsEditing(true)}
              className="p-1 rounded-lg hover:bg-slate-700 text-slate-400"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Color Picker */}
      {showColorPicker && (
        <div className="flex flex-wrap gap-2 p-2 bg-slate-700 rounded-lg max-w-[200px]">
          {PRESET_COLORS.map((color) => (
            <button
              key={color}
              className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                team.color === color ? 'border-white' : 'border-transparent'
              }`}
              style={{ backgroundColor: color }}
              onClick={() => {
                onColorChange(color);
                setShowColorPicker(false);
              }}
            />
          ))}
        </div>
      )}

      {/* Score with Animation */}
      <div
        className={`text-6xl md:text-8xl font-bold tabular-nums transition-all duration-300 ${
          scoreAnimation ? 'animate-goal-score' : ''
        }`}
        style={{
          color: team.color,
          textShadow: scoreAnimation ? `0 0 40px ${team.color}, 0 0 80px ${team.color}` : 'none',
        }}
      >
        {team.score}
      </div>

      {/* Score Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={onRemoveGoal}
          disabled={team.score === 0}
          className="p-3 rounded-full bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Minus className="w-6 h-6 text-white" />
        </button>
        <button
          onClick={onAddGoal}
          className="p-4 rounded-full bg-green-600 hover:bg-green-500 transition-colors shadow-lg hover:shadow-green-500/30 active:scale-95"
        >
          <Plus className="w-8 h-8 text-white" />
        </button>
      </div>

      {/* Cards */}
      <div className="flex items-center gap-4 mt-2">
        {/* Yellow Cards */}
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {Array.from({ length: team.yellowCards }).map((_, i) => (
              <div
                key={i}
                className={`w-4 h-6 bg-yellow-400 rounded-sm shadow-lg cursor-pointer hover:scale-110 transition-transform ${
                  i === team.yellowCards - 1 && yellowCardAnimation ? 'animate-card-fly-in' : ''
                }`}
                onClick={onRemoveYellowCard}
              />
            ))}
          </div>
          <button
            onClick={onAddYellowCard}
            className="p-2 rounded-lg bg-yellow-500/20 hover:bg-yellow-500/30 transition-colors active:scale-95"
            title="Add Yellow Card"
          >
            <div className="w-5 h-7 bg-yellow-400 rounded-sm" />
          </button>
        </div>

        {/* Red Cards */}
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {Array.from({ length: team.redCards }).map((_, i) => (
              <div
                key={i}
                className={`w-4 h-6 bg-red-600 rounded-sm shadow-lg cursor-pointer hover:scale-110 transition-transform ${
                  i === team.redCards - 1 && redCardAnimation ? 'animate-card-fly-in' : ''
                }`}
                onClick={onRemoveRedCard}
              />
            ))}
          </div>
          <button
            onClick={onAddRedCard}
            className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-colors active:scale-95"
            title="Add Red Card"
          >
            <div className="w-5 h-7 bg-red-600 rounded-sm" />
          </button>
        </div>
      </div>

      {/* Red Card Flash Overlay */}
      {redCardAnimation && (
        <div className="fixed inset-0 bg-red-600/20 pointer-events-none animate-flash z-50" />
      )}
    </div>
  );
};
