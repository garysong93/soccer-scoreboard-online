import { useEffect, useRef, useCallback } from 'react';
import { useGameStore } from '../stores/useGameStore';

export const useTimer = () => {
  const intervalRef = useRef<number | null>(null);
  const { match, incrementTimer, setTimerRunning } = useGameStore();

  const startTimer = useCallback(() => {
    if (match.period === 'not_started' || match.period === 'half_time' || match.period === 'finished') {
      return;
    }
    setTimerRunning(true);
  }, [match.period, setTimerRunning]);

  const stopTimer = useCallback(() => {
    setTimerRunning(false);
  }, [setTimerRunning]);

  const toggleTimer = useCallback(() => {
    if (match.isTimerRunning) {
      stopTimer();
    } else {
      startTimer();
    }
  }, [match.isTimerRunning, startTimer, stopTimer]);

  useEffect(() => {
    if (match.isTimerRunning) {
      intervalRef.current = window.setInterval(() => {
        incrementTimer();
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [match.isTimerRunning, incrementTimer]);

  const formatTime = useCallback((seconds: number, addedTime: number = 0): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const timeStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

    if (addedTime > 0 && (mins >= 45 || mins >= 90)) {
      return `${timeStr} +${addedTime}`;
    }
    return timeStr;
  }, []);

  const getPeriodLabel = useCallback((period: string): string => {
    const labels: Record<string, string> = {
      not_started: 'Not Started',
      first_half: '1st Half',
      half_time: 'Half Time',
      second_half: '2nd Half',
      extra_time_1: 'Extra Time 1',
      extra_time_2: 'Extra Time 2',
      penalties: 'Penalties',
      finished: 'Full Time',
    };
    return labels[period] || period;
  }, []);

  return {
    isRunning: match.isTimerRunning,
    seconds: match.timerSeconds,
    addedTime: match.addedTime,
    period: match.period,
    startTimer,
    stopTimer,
    toggleTimer,
    formatTime,
    getPeriodLabel,
  };
};
