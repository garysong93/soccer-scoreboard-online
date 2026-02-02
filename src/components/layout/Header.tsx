import { useState } from 'react';
import {
  Settings,
  Download,
  History,
  Share2,
  Mic,
  Moon,
  Sun,
  Menu,
  X,
  HelpCircle,
} from 'lucide-react';
import { useSettingsStore } from '../../stores/useSettingsStore';
import { Modal } from '../ui/Modal';
import { SettingsPanel } from '../features/SettingsPanel';
import { ExportPanel } from '../features/ExportPanel';
import { HistoryPanel } from '../features/HistoryPanel';
import { SharePanel } from '../features/SharePanel';
import { VoiceControl } from '../features/VoiceControl';

type PanelType = 'settings' | 'export' | 'history' | 'share' | 'voice' | null;

export const Header = () => {
  const [activePanel, setActivePanel] = useState<PanelType>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useSettingsStore();

  const togglePanel = (panel: PanelType) => {
    setActivePanel((current) => (current === panel ? null : panel));
    setMobileMenuOpen(false);
  };

  const navItems = [
    { id: 'share' as const, icon: Share2, label: 'Share' },
    { id: 'export' as const, icon: Download, label: 'Export' },
    { id: 'history' as const, icon: History, label: 'History' },
    { id: 'voice' as const, icon: Mic, label: 'Voice' },
    { id: 'settings' as const, icon: Settings, label: 'Settings' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a href="/" className="flex items-center gap-2">
              <span className="text-2xl">⚽</span>
              <div>
                <h1 className="text-lg font-bold text-white leading-tight">
                  Soccer Scoreboard
                </h1>
                <p className="text-xs text-slate-400 hidden sm:block">
                  Free Online Score Tracker
                </p>
              </div>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  onClick={() => togglePanel(id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    activePanel === id
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{label}</span>
                </button>
              ))}

              <div className="w-px h-6 bg-slate-700 mx-2" />

              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>

              <a
                href="/how-to-use"
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="How to Use"
              >
                <HelpCircle className="w-5 h-5" />
              </a>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden mt-3 pt-3 border-t border-slate-800">
              <div className="grid grid-cols-3 gap-2">
                {navItems.map(({ id, icon: Icon, label }) => (
                  <button
                    key={id}
                    onClick={() => togglePanel(id)}
                    className={`flex flex-col items-center gap-1 p-3 rounded-lg transition-colors ${
                      activePanel === id
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs">{label}</span>
                  </button>
                ))}
                <button
                  onClick={toggleTheme}
                  className="flex flex-col items-center gap-1 p-3 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  {theme === 'dark' ? (
                    <Sun className="w-5 h-5" />
                  ) : (
                    <Moon className="w-5 h-5" />
                  )}
                  <span className="text-xs">Theme</span>
                </button>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Modals */}
      <Modal
        isOpen={activePanel === 'settings'}
        onClose={() => setActivePanel(null)}
        title="Settings"
        size="lg"
      >
        <SettingsPanel onClose={() => setActivePanel(null)} />
      </Modal>

      <Modal
        isOpen={activePanel === 'export'}
        onClose={() => setActivePanel(null)}
        title="Export Match"
        size="md"
      >
        <ExportPanel />
      </Modal>

      <Modal
        isOpen={activePanel === 'history'}
        onClose={() => setActivePanel(null)}
        title="Match History"
        size="lg"
      >
        <HistoryPanel />
      </Modal>

      <Modal
        isOpen={activePanel === 'share'}
        onClose={() => setActivePanel(null)}
        title="Share Match"
        size="md"
      >
        <SharePanel />
      </Modal>

      <Modal
        isOpen={activePanel === 'voice'}
        onClose={() => setActivePanel(null)}
        title="Voice Control"
        size="md"
      >
        <VoiceControl />
      </Modal>
    </>
  );
};
