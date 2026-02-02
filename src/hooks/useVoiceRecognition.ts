import { useState, useEffect, useCallback, useRef } from 'react';
import { useGameStore } from '../stores/useGameStore';
import { useSettingsStore } from '../stores/useSettingsStore';

interface SpeechRecognitionEvent {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognitionInstance;
}

interface VoiceCommand {
  patterns: RegExp[];
  action: () => void;
}

export const useVoiceRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  const { voiceControlEnabled } = useSettingsStore();
  const {
    addGoal,
    addYellowCard,
    addRedCard,
    setTimerRunning,
    nextPeriod,
  } = useGameStore();

  const commands: VoiceCommand[] = [
    {
      patterns: [/home\s*(team)?\s*goal/i, /goal\s*(for)?\s*home/i, /主队进球/],
      action: () => addGoal('home'),
    },
    {
      patterns: [/away\s*(team)?\s*goal/i, /goal\s*(for)?\s*away/i, /客队进球/],
      action: () => addGoal('away'),
    },
    {
      patterns: [/yellow\s*card\s*home/i, /home\s*yellow/i, /主队黄牌/],
      action: () => addYellowCard('home'),
    },
    {
      patterns: [/yellow\s*card\s*away/i, /away\s*yellow/i, /客队黄牌/],
      action: () => addYellowCard('away'),
    },
    {
      patterns: [/red\s*card\s*home/i, /home\s*red/i, /主队红牌/],
      action: () => addRedCard('home'),
    },
    {
      patterns: [/red\s*card\s*away/i, /away\s*red/i, /客队红牌/],
      action: () => addRedCard('away'),
    },
    {
      patterns: [/start\s*timer/i, /开始计时/i, /start\s*clock/i],
      action: () => setTimerRunning(true),
    },
    {
      patterns: [/stop\s*timer/i, /pause\s*timer/i, /暂停计时/i, /stop\s*clock/i],
      action: () => setTimerRunning(false),
    },
    {
      patterns: [/half\s*time/i, /中场休息/i, /next\s*period/i],
      action: () => nextPeriod(),
    },
  ];

  const processTranscript = useCallback((text: string) => {
    const normalizedText = text.toLowerCase().trim();

    for (const command of commands) {
      for (const pattern of command.patterns) {
        if (pattern.test(normalizedText)) {
          command.action();
          return true;
        }
      }
    }
    return false;
  }, [commands]);

  const startListening = useCallback(() => {
    if (!voiceControlEnabled) return;

    const SpeechRecognitionAPI = (
      window as unknown as { SpeechRecognition?: SpeechRecognitionConstructor; webkitSpeechRecognition?: SpeechRecognitionConstructor }
    ).SpeechRecognition || (
      window as unknown as { webkitSpeechRecognition?: SpeechRecognitionConstructor }
    ).webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      setError('Speech recognition is not supported in this browser');
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const current = event.resultIndex;
      const result = event.results[current];

      if (result.isFinal) {
        const text = result[0].transcript;
        setTranscript(text);
        processTranscript(text);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      setError(event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [voiceControlEnabled, processTranscript]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, []);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const isSupported = typeof window !== 'undefined' &&
    Boolean((window as unknown as { SpeechRecognition?: unknown }).SpeechRecognition ||
    (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition);

  return {
    isListening,
    transcript,
    error,
    isSupported,
    startListening,
    stopListening,
    toggleListening,
  };
};
