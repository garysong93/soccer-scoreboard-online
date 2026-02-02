import { useState, useEffect } from 'react';
import { useTheme } from './hooks/useTheme';
import { HomePage } from './components/pages/HomePage';
import { ScoreboardPage } from './components/pages/ScoreboardPage';
import { OBSPage } from './components/pages/OBSPage';
import { HowToUsePage } from './components/pages/HowToUsePage';
import { FAQPage } from './components/pages/FAQPage';
import { ViewerPage } from './components/pages/ViewerPage';
import { PlayerStatsPage } from './components/pages/PlayerStatsPage';

type Page = 'home' | 'scoreboard' | 'obs' | 'how-to-use' | 'faq' | 'view' | 'player-stats';

function App() {
  useTheme();
  const [page, setPage] = useState<Page>('home');
  const [viewerCode, setViewerCode] = useState<string | null>(null);

  useEffect(() => {
    const path = window.location.pathname;

    if (path === '/scoreboard' || path === '/app') {
      setPage('scoreboard');
    } else if (path === '/obs' || path === '/overlay') {
      setPage('obs');
    } else if (path === '/how-to-use' || path === '/help') {
      setPage('how-to-use');
    } else if (path === '/faq') {
      setPage('faq');
    } else if (path === '/player-stats' || path === '/stats') {
      setPage('player-stats');
    } else if (path.startsWith('/view/')) {
      const code = path.split('/view/')[1];
      if (code) {
        setViewerCode(code.toUpperCase());
        setPage('view');
      }
    } else if (path === '/') {
      const hasVisited = localStorage.getItem('soccer-scoreboard-visited');
      if (hasVisited) {
        setPage('scoreboard');
      } else {
        setPage('home');
      }
    }
  }, []);

  const navigateTo = (newPage: Page) => {
    setPage(newPage);
    const paths: Record<Page, string> = {
      home: '/',
      scoreboard: '/scoreboard',
      obs: '/obs',
      'how-to-use': '/how-to-use',
      faq: '/faq',
      view: '/view',
      'player-stats': '/player-stats',
    };
    window.history.pushState({}, '', paths[newPage]);
  };

  const handleStart = () => {
    localStorage.setItem('soccer-scoreboard-visited', 'true');
    navigateTo('scoreboard');
  };

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/scoreboard') setPage('scoreboard');
      else if (path === '/obs') setPage('obs');
      else if (path === '/how-to-use') setPage('how-to-use');
      else if (path === '/faq') setPage('faq');
      else if (path === '/player-stats') setPage('player-stats');
      else if (path.startsWith('/view/')) {
        const code = path.split('/view/')[1];
        if (code) {
          setViewerCode(code.toUpperCase());
          setPage('view');
        }
      } else setPage('home');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  switch (page) {
    case 'obs':
      return <OBSPage />;
    case 'how-to-use':
      return <HowToUsePage onBack={() => navigateTo('scoreboard')} />;
    case 'faq':
      return <FAQPage onBack={() => navigateTo('scoreboard')} />;
    case 'player-stats':
      return <PlayerStatsPage />;
    case 'view':
      return viewerCode ? <ViewerPage shareCode={viewerCode} /> : <HomePage onStart={handleStart} />;
    case 'scoreboard':
      return <ScoreboardPage />;
    case 'home':
    default:
      return <HomePage onStart={handleStart} />;
  }
}

export default App;
