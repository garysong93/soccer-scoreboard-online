import { useCallback, useRef } from 'react';
import { useSettingsStore } from '../stores/useSettingsStore';

type SoundType = 'goal' | 'whistle' | 'card';

const SOUND_PATHS: Record<SoundType, string> = {
  goal: '/sounds/goal.mp3',
  whistle: '/sounds/whistle.mp3',
  card: '/sounds/card.mp3',
};

export const useSound = () => {
  const audioRefs = useRef<Map<SoundType, HTMLAudioElement>>(new Map());
  const { soundEnabled } = useSettingsStore();

  const getAudio = useCallback((type: SoundType): HTMLAudioElement => {
    let audio = audioRefs.current.get(type);
    if (!audio) {
      audio = new Audio(SOUND_PATHS[type]);
      audio.preload = 'auto';
      audioRefs.current.set(type, audio);
    }
    return audio;
  }, []);

  const play = useCallback(
    (type: SoundType) => {
      if (!soundEnabled) return;

      try {
        const audio = getAudio(type);
        audio.currentTime = 0;
        audio.play().catch((err) => {
          // Autoplay may be blocked by browser
          console.warn('Sound playback failed:', err);
        });
      } catch (err) {
        console.warn('Failed to play sound:', err);
      }
    },
    [soundEnabled, getAudio]
  );

  const playGoal = useCallback(() => play('goal'), [play]);
  const playWhistle = useCallback(() => play('whistle'), [play]);
  const playCard = useCallback(() => play('card'), [play]);

  return {
    play,
    playGoal,
    playWhistle,
    playCard,
  };
};
