import { useState, useEffect, useCallback, useRef } from 'react';
import { useGameStore } from '../stores/useGameStore';
import {
  isFirebaseConfigured,
  createShareSession,
  updateShareSession,
  deleteShareSession,
  subscribeToMatch,
  type ShareableMatch,
} from '../lib/firebase';

interface UseFirebaseSyncReturn {
  isSharing: boolean;
  shareCode: string | null;
  isConfigured: boolean;
  isLoading: boolean;
  error: string | null;
  startSharing: () => Promise<boolean>;
  stopSharing: () => Promise<void>;
}

export const useFirebaseSync = (): UseFirebaseSyncReturn => {
  const [isSharing, setIsSharing] = useState(false);
  const [shareCode, setShareCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { match } = useGameStore();
  const isConfigured = isFirebaseConfigured();
  const lastUpdateRef = useRef<number>(0);

  const startSharing = useCallback(async (): Promise<boolean> => {
    if (!isConfigured) {
      setError('Firebase is not configured. Please add Firebase credentials.');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const code = await createShareSession(match);
      if (code) {
        setShareCode(code);
        setIsSharing(true);
        lastUpdateRef.current = Date.now();
        return true;
      } else {
        setError('Failed to create sharing session');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isConfigured, match]);

  const stopSharing = useCallback(async (): Promise<void> => {
    if (shareCode) {
      await deleteShareSession(shareCode);
    }
    setIsSharing(false);
    setShareCode(null);
    setError(null);
  }, [shareCode]);

  // Auto-update Firebase when match changes (debounced)
  useEffect(() => {
    if (!isSharing || !shareCode) return;

    const now = Date.now();
    // Debounce updates to max once per 500ms
    if (now - lastUpdateRef.current < 500) {
      const timeoutId = setTimeout(() => {
        updateShareSession(shareCode, match);
        lastUpdateRef.current = Date.now();
      }, 500);
      return () => clearTimeout(timeoutId);
    }

    updateShareSession(shareCode, match);
    lastUpdateRef.current = now;
  }, [isSharing, shareCode, match]);

  return {
    isSharing,
    shareCode,
    isConfigured,
    isLoading,
    error,
    startSharing,
    stopSharing,
  };
};

interface UseFirebaseViewerReturn {
  matchData: ShareableMatch | null;
  isLoading: boolean;
  error: string | null;
  isConnected: boolean;
}

export const useFirebaseViewer = (code: string | null): UseFirebaseViewerReturn => {
  const [matchData, setMatchData] = useState<ShareableMatch | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!code) {
      setError('No share code provided');
      setIsLoading(false);
      return;
    }

    if (!isFirebaseConfigured()) {
      setError('Firebase is not configured');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const unsubscribe = subscribeToMatch(code, (data) => {
      setIsLoading(false);
      if (data) {
        setMatchData(data);
        setIsConnected(true);
        setError(null);
      } else {
        setError('Match not found or session ended');
        setIsConnected(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [code]);

  return {
    matchData,
    isLoading,
    error,
    isConnected,
  };
};
