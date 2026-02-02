import { Mic, MicOff, AlertCircle } from 'lucide-react';
import { useVoiceRecognition } from '../../hooks/useVoiceRecognition';
import { useSettingsStore } from '../../stores/useSettingsStore';
import { Button } from '../ui/Button';

export const VoiceControl = () => {
  const { isListening, transcript, error, isSupported, toggleListening } = useVoiceRecognition();
  const { voiceControlEnabled, setVoiceControlEnabled } = useSettingsStore();

  if (!isSupported) {
    return (
      <div className="flex items-center gap-2 p-3 bg-yellow-500/10 rounded-lg text-yellow-400 text-sm">
        <AlertCircle className="w-4 h-4" />
        Voice control is not supported in this browser
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">
          Voice Control
        </h3>
        <Button
          onClick={() => {
            setVoiceControlEnabled(!voiceControlEnabled);
            if (!voiceControlEnabled) {
              toggleListening();
            }
          }}
          variant={voiceControlEnabled ? 'primary' : 'secondary'}
          size="sm"
        >
          {voiceControlEnabled ? (
            <>
              <Mic className="w-4 h-4 mr-2" />
              Enabled
            </>
          ) : (
            <>
              <MicOff className="w-4 h-4 mr-2" />
              Disabled
            </>
          )}
        </Button>
      </div>

      {voiceControlEnabled && (
        <>
          <Button
            onClick={toggleListening}
            variant={isListening ? 'danger' : 'primary'}
            className="w-full"
          >
            {isListening ? (
              <>
                <div className="w-3 h-3 bg-white rounded-full animate-pulse mr-2" />
                Listening...
              </>
            ) : (
              <>
                <Mic className="w-5 h-5 mr-2" />
                Start Listening
              </>
            )}
          </Button>

          {transcript && (
            <div className="p-3 bg-slate-700/50 rounded-lg">
              <span className="text-xs text-slate-400">Last heard:</span>
              <p className="text-white mt-1">{transcript}</p>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-500/10 rounded-lg text-red-400 text-sm">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          <div className="text-xs text-slate-500 space-y-1">
            <p className="font-medium text-slate-400">Available commands:</p>
            <ul className="space-y-0.5 ml-2">
              <li>"Home goal" / "Away goal"</li>
              <li>"Yellow card home/away"</li>
              <li>"Red card home/away"</li>
              <li>"Start timer" / "Stop timer"</li>
              <li>"Half time" / "Next period"</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
};
