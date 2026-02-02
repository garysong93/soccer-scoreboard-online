import { Moon, Sun, Volume2, VolumeX, Mic, BarChart3, Save, RotateCcw } from 'lucide-react';
import { useSettingsStore } from '../../stores/useSettingsStore';
import { useGameStore } from '../../stores/useGameStore';
import { Toggle } from '../ui/Toggle';
import { Button } from '../ui/Button';

interface SettingsPanelProps {
  onClose?: () => void;
}

export const SettingsPanel = ({ onClose: _onClose }: SettingsPanelProps) => {
  void _onClose;
  const settings = useSettingsStore();
  const { resetMatch, newMatch, undo, redo, canUndo, canRedo } = useGameStore();

  return (
    <div className="space-y-6">
      {/* Theme */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Appearance</h3>
        <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
          <div className="flex items-center gap-3">
            {settings.theme === 'dark' ? (
              <Moon className="w-5 h-5 text-blue-400" />
            ) : (
              <Sun className="w-5 h-5 text-yellow-400" />
            )}
            <span className="text-white">Dark Mode</span>
          </div>
          <Toggle
            enabled={settings.theme === 'dark'}
            onChange={() => settings.toggleTheme()}
          />
        </div>
      </div>

      {/* Features */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Features</h3>

        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
            <div className="flex items-center gap-3">
              {settings.soundEnabled ? (
                <Volume2 className="w-5 h-5 text-green-400" />
              ) : (
                <VolumeX className="w-5 h-5 text-slate-400" />
              )}
              <span className="text-white">Sound Effects</span>
            </div>
            <Toggle
              enabled={settings.soundEnabled}
              onChange={settings.setSoundEnabled}
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
            <div className="flex items-center gap-3">
              <Mic className={`w-5 h-5 ${settings.voiceControlEnabled ? 'text-green-400' : 'text-slate-400'}`} />
              <div>
                <span className="text-white">Voice Control</span>
                <p className="text-xs text-slate-400">Say "home goal" or "away yellow"</p>
              </div>
            </div>
            <Toggle
              enabled={settings.voiceControlEnabled}
              onChange={settings.setVoiceControlEnabled}
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
            <div className="flex items-center gap-3">
              <BarChart3 className={`w-5 h-5 ${settings.showStats ? 'text-blue-400' : 'text-slate-400'}`} />
              <span className="text-white">Show Statistics</span>
            </div>
            <Toggle
              enabled={settings.showStats}
              onChange={settings.setShowStats}
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
            <div className="flex items-center gap-3">
              <Save className={`w-5 h-5 ${settings.autoSaveHistory ? 'text-green-400' : 'text-slate-400'}`} />
              <span className="text-white">Auto-save History</span>
            </div>
            <Toggle
              enabled={settings.autoSaveHistory}
              onChange={settings.setAutoSaveHistory}
            />
          </div>
        </div>
      </div>

      {/* Match Duration */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Match Duration</h3>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-slate-700/50 rounded-lg">
            <label className="text-xs text-slate-400">Period (minutes)</label>
            <select
              value={settings.periodDuration}
              onChange={(e) => settings.setPeriodDuration(Number(e.target.value))}
              className="w-full mt-1 bg-slate-600 text-white rounded px-2 py-1 text-sm"
            >
              {[30, 35, 40, 45].map((m) => (
                <option key={m} value={m}>{m} min</option>
              ))}
            </select>
          </div>

          <div className="p-3 bg-slate-700/50 rounded-lg">
            <label className="text-xs text-slate-400">Extra Time (minutes)</label>
            <select
              value={settings.extraTimeDuration}
              onChange={(e) => settings.setExtraTimeDuration(Number(e.target.value))}
              className="w-full mt-1 bg-slate-600 text-white rounded px-2 py-1 text-sm"
            >
              {[10, 15].map((m) => (
                <option key={m} value={m}>{m} min</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Match Actions */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Match Actions</h3>

        <div className="flex flex-wrap gap-2">
          <Button
            onClick={undo}
            disabled={!canUndo()}
            variant="ghost"
            size="sm"
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            Undo
          </Button>

          <Button
            onClick={redo}
            disabled={!canRedo()}
            variant="ghost"
            size="sm"
          >
            <RotateCcw className="w-4 h-4 mr-1 scale-x-[-1]" />
            Redo
          </Button>

          <Button
            onClick={resetMatch}
            variant="secondary"
            size="sm"
          >
            Reset Score
          </Button>

          <Button
            onClick={() => {
              if (confirm('Start a new match? Current data will be saved to history.')) {
                newMatch();
              }
            }}
            variant="danger"
            size="sm"
          >
            New Match
          </Button>
        </div>
      </div>
    </div>
  );
};
