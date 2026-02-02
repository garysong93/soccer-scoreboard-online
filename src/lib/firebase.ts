import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getDatabase, type Database, ref, set, get, onValue, remove, type Unsubscribe } from 'firebase/database';
import type { MatchState } from '../types';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

let app: FirebaseApp | null = null;
let database: Database | null = null;

export const isFirebaseConfigured = (): boolean => {
  return Boolean(
    import.meta.env.VITE_FIREBASE_API_KEY &&
    import.meta.env.VITE_FIREBASE_DATABASE_URL
  );
};

export const initializeFirebase = (): Database | null => {
  if (!isFirebaseConfigured()) {
    console.warn('Firebase is not configured. Real-time sharing will not work.');
    return null;
  }

  if (!app) {
    app = initializeApp(firebaseConfig);
    database = getDatabase(app);
  }

  return database;
};

export const getFirebaseDatabase = (): Database | null => {
  if (!database) {
    return initializeFirebase();
  }
  return database;
};

export interface ShareableMatch {
  home: {
    name: string;
    shortName: string;
    color: string;
    score: number;
    yellowCards: number;
    redCards: number;
  };
  away: {
    name: string;
    shortName: string;
    color: string;
    score: number;
    yellowCards: number;
    redCards: number;
  };
  timer: {
    seconds: number;
    isRunning: boolean;
    period: string;
    addedTime: number;
  };
  stats: {
    possession: { home: number; away: number };
    corners: { home: number; away: number };
    fouls: { home: number; away: number };
    offsides: { home: number; away: number };
    shots: { home: number; away: number };
    shotsOnTarget: { home: number; away: number };
  };
  events: Array<{
    id: string;
    type: string;
    team: string;
    minute: number;
    timestamp: number;
  }>;
  lastUpdated: number;
}

export const matchToShareable = (match: MatchState): ShareableMatch => ({
  home: {
    name: match.home.name,
    shortName: match.home.shortName,
    color: match.home.color,
    score: match.home.score,
    yellowCards: match.home.yellowCards,
    redCards: match.home.redCards,
  },
  away: {
    name: match.away.name,
    shortName: match.away.shortName,
    color: match.away.color,
    score: match.away.score,
    yellowCards: match.away.yellowCards,
    redCards: match.away.redCards,
  },
  timer: {
    seconds: match.timerSeconds,
    isRunning: match.isTimerRunning,
    period: match.period,
    addedTime: match.addedTime,
  },
  stats: match.stats,
  events: match.events.map((e) => ({
    id: e.id,
    type: e.type,
    team: e.team,
    minute: e.minute,
    timestamp: e.timestamp,
  })),
  lastUpdated: Date.now(),
});

export const generateShareCode = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

export const createShareSession = async (
  match: MatchState
): Promise<string | null> => {
  const db = getFirebaseDatabase();
  if (!db) return null;

  const code = generateShareCode();
  const matchRef = ref(db, `matches/${code}`);

  try {
    await set(matchRef, matchToShareable(match));
    return code;
  } catch (error) {
    console.error('Failed to create share session:', error);
    return null;
  }
};

export const updateShareSession = async (
  code: string,
  match: MatchState
): Promise<boolean> => {
  const db = getFirebaseDatabase();
  if (!db) return false;

  const matchRef = ref(db, `matches/${code}`);

  try {
    await set(matchRef, matchToShareable(match));
    return true;
  } catch (error) {
    console.error('Failed to update share session:', error);
    return false;
  }
};

export const deleteShareSession = async (code: string): Promise<boolean> => {
  const db = getFirebaseDatabase();
  if (!db) return false;

  const matchRef = ref(db, `matches/${code}`);

  try {
    await remove(matchRef);
    return true;
  } catch (error) {
    console.error('Failed to delete share session:', error);
    return false;
  }
};

export const getShareSession = async (
  code: string
): Promise<ShareableMatch | null> => {
  const db = getFirebaseDatabase();
  if (!db) return null;

  const matchRef = ref(db, `matches/${code}`);

  try {
    const snapshot = await get(matchRef);
    if (snapshot.exists()) {
      return snapshot.val() as ShareableMatch;
    }
    return null;
  } catch (error) {
    console.error('Failed to get share session:', error);
    return null;
  }
};

export const subscribeToMatch = (
  code: string,
  callback: (match: ShareableMatch | null) => void
): Unsubscribe => {
  const db = getFirebaseDatabase();
  if (!db) {
    callback(null);
    return () => {};
  }

  const matchRef = ref(db, `matches/${code}`);

  return onValue(
    matchRef,
    (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.val() as ShareableMatch);
      } else {
        callback(null);
      }
    },
    (error) => {
      console.error('Subscription error:', error);
      callback(null);
    }
  );
};
