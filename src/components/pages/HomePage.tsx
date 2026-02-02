import { ArrowRight, Share2, History, Download, Mic, Tv, Smartphone } from 'lucide-react';
import { Button } from '../ui/Button';

interface HomePageProps {
  onStart: () => void;
}

export const HomePage = ({ onStart }: HomePageProps) => {
  const features = [
    {
      icon: Share2,
      title: 'Live Sharing',
      description: 'Share your scoreboard in real-time with spectators via a simple link.',
    },
    {
      icon: History,
      title: 'Match History',
      description: 'Automatically save completed matches and review them anytime.',
    },
    {
      icon: Download,
      title: 'Export Options',
      description: 'Download as PNG, PDF report, or JSON data for your records.',
    },
    {
      icon: Mic,
      title: 'Voice Control',
      description: 'Hands-free scoring with voice commands like "home goal".',
    },
    {
      icon: Tv,
      title: 'OBS Overlay',
      description: 'Perfect for streamers with transparent overlay support.',
    },
    {
      icon: Smartphone,
      title: 'Works Everywhere',
      description: 'Responsive design works on mobile, tablet, and desktop.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-16">
        <div className="text-6xl mb-6">⚽</div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Soccer Scoreboard Online
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mb-8">
          The most feature-rich free online soccer scoreboard. Track scores,
          manage cards, share live, and more. No registration required.
        </p>

        <Button onClick={onStart} size="xl" className="group">
          Start Scoreboard
          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>

        <p className="mt-4 text-sm text-slate-500">
          Free forever. No account needed.
        </p>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-slate-800/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-12">
            Everything You Need to Track Your Match
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="p-6 bg-slate-800/50 rounded-xl border border-slate-700/50 hover:border-slate-600 transition-colors"
              >
                <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
                <p className="text-slate-400 text-sm">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-12">
            How It Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-2xl font-bold text-white mb-4">
                1
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Set Team Names
              </h3>
              <p className="text-slate-400 text-sm">
                Click on team names to customize them. Choose team colors too.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-2xl font-bold text-white mb-4">
                2
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Track the Match
              </h3>
              <p className="text-slate-400 text-sm">
                Use + buttons for goals, card buttons for yellow/red cards.
                Timer tracks match time.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-2xl font-bold text-white mb-4">
                3
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Share & Export
              </h3>
              <p className="text-slate-400 text-sm">
                Share live with spectators or export as image/PDF when done.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-t from-blue-900/20 to-transparent">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to Track Your Match?
          </h2>
          <p className="text-slate-400 mb-8">
            Start using the most feature-rich soccer scoreboard online.
            Free, no registration, works on any device.
          </p>
          <Button onClick={onStart} size="lg">
            Start Now
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>
    </div>
  );
};
