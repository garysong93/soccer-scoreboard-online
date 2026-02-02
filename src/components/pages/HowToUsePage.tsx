import { ArrowLeft, Play, Plus, Timer, Share2, Download, Mic } from 'lucide-react';
import { Button } from '../ui/Button';

interface HowToUsePageProps {
  onBack: () => void;
}

export const HowToUsePage = ({ onBack }: HowToUsePageProps) => {
  const steps = [
    {
      icon: Play,
      title: 'Start a New Match',
      description: 'Click "Start Scoreboard" on the home page or navigate to /scoreboard. The scoreboard loads with default team names and 0-0 score.',
    },
    {
      icon: Plus,
      title: 'Customize Teams',
      description: 'Click on team names to edit them. Click the colored circle next to each name to change team colors. These changes are saved automatically.',
    },
    {
      icon: Timer,
      title: 'Control the Timer',
      description: 'Use the "Start" button to begin the match timer. Click "Next" to advance through periods (1st Half → Half Time → 2nd Half → Full Time). Set added time using the +0 to +10 buttons.',
    },
    {
      icon: Plus,
      title: 'Track Scores & Cards',
      description: 'Use the + button to add goals for each team. The - button removes goals if needed. Click the yellow/red card buttons to track cards. Click existing cards to remove them.',
    },
    {
      icon: Share2,
      title: 'Share Your Match',
      description: 'Click "Share" in the header to generate a shareable link. Spectators can view the score in real-time at this link. (Note: Real-time sync requires Firebase setup)',
    },
    {
      icon: Download,
      title: 'Export Your Match',
      description: 'Click "Export" to save your match. Options include PNG/JPG screenshots, PDF match reports, and JSON data backup. Use "Copy to Clipboard" for quick text sharing.',
    },
    {
      icon: Mic,
      title: 'Voice Control',
      description: 'Enable voice control in Settings or the Voice panel. Say commands like "home goal", "away yellow card", or "start timer" to control the scoreboard hands-free.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <Button onClick={onBack} variant="ghost" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Scoreboard
        </Button>

        <h1 className="text-3xl font-bold text-white mb-2">How to Use Soccer Scoreboard</h1>
        <p className="text-slate-400 mb-8">
          Follow these steps to make the most of your free online soccer scoreboard.
        </p>

        <div className="space-y-6">
          {steps.map(({ icon: Icon, title, description }, index) => (
            <div
              key={title}
              className="flex gap-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50"
            >
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">
                  {index + 1}. {title}
                </h3>
                <p className="text-slate-400 text-sm">{description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 bg-blue-600/10 rounded-xl border border-blue-600/30">
          <h2 className="text-xl font-bold text-white mb-4">Pro Tips</h2>
          <ul className="space-y-2 text-slate-300 text-sm">
            <li>• Use keyboard shortcuts: Spacebar to toggle timer</li>
            <li>• The scoreboard works offline after first load (PWA)</li>
            <li>• Install as an app on your phone for quick access</li>
            <li>• Match history is saved automatically when a match ends</li>
            <li>• Use OBS Overlay mode for streaming: /obs</li>
            <li>• All data is stored locally in your browser</li>
          </ul>
        </div>

        <div className="mt-8 text-center">
          <Button onClick={onBack} size="lg">
            Start Using Scoreboard
          </Button>
        </div>
      </div>
    </div>
  );
};
