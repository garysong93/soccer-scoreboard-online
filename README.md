# Soccer Scoreboard Online

A feature-rich free online soccer scoreboard with live sharing, match history, PDF export, voice control, and OBS streaming overlay.

## Features

- **Live Score Tracking** - Track goals, yellow/red cards, and match time
- **Real-time Sharing** - Share your scoreboard live with spectators via Firebase
- **Match History** - Automatically save and review past matches
- **Export Options** - Download as PNG, PDF report, or JSON data
- **Voice Control** - Hands-free scoring with voice commands
- **OBS Overlay** - Perfect for streamers with transparent overlay support
- **PWA Support** - Install as an app, works offline
- **Responsive Design** - Works on mobile, tablet, and desktop

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Firebase Setup (for Live Sharing)

To enable real-time sharing:

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Realtime Database
3. Copy `.env.example` to `.env` and fill in your Firebase credentials

```bash
cp .env.example .env
```

Required environment variables:
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_DATABASE_URL`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

## Generate PWA Icons

```bash
npm install sharp
node scripts/generate-icons.js
```

## Voice Commands

When voice control is enabled:
- "Home goal" / "Away goal" - Add a goal
- "Yellow card home/away" - Add yellow card
- "Red card home/away" - Add red card
- "Start timer" / "Stop timer" - Control timer
- "Half time" / "Next period" - Advance match period

## Routes

- `/` - Homepage
- `/scoreboard` - Main scoreboard
- `/view/:code` - Spectator view (live sharing)
- `/obs` - OBS overlay
- `/how-to-use` - Usage guide
- `/faq` - FAQ

## Tech Stack

- React 19
- TypeScript
- Vite 7
- Tailwind CSS 4
- Zustand (state management)
- Firebase Realtime Database (live sharing)
- PWA with Workbox

## License

MIT
