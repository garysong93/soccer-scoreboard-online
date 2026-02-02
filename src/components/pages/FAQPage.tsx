import { useState } from 'react';
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '../ui/Button';

interface FAQPageProps {
  onBack: () => void;
}

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: 'Is Soccer Scoreboard Online completely free?',
    answer: 'Yes! Soccer Scoreboard Online is 100% free to use. No registration, no hidden fees, no premium features locked behind a paywall. All features are available to everyone.',
  },
  {
    question: 'Do I need to create an account?',
    answer: 'No account is needed. Your match data is stored locally in your browser. This means your data stays private and is instantly accessible without login.',
  },
  {
    question: 'Does it work on mobile devices?',
    answer: 'Yes, the scoreboard is fully responsive and works great on phones, tablets, and desktop computers. You can even install it as an app on your home screen for quick access.',
  },
  {
    question: 'How does real-time sharing work?',
    answer: 'When you generate a share link, spectators can view your scoreboard in real-time. Note: Full real-time sync requires Firebase configuration. Without it, viewers see a static snapshot.',
  },
  {
    question: 'Can I use this for live streaming?',
    answer: 'Absolutely! We have a dedicated OBS overlay mode at /obs with a transparent background. Add it as a browser source in OBS and position it wherever you like on your stream.',
  },
  {
    question: 'How do voice commands work?',
    answer: 'Enable voice control in Settings. Your browser will ask for microphone permission. Then say commands like "home goal", "away yellow card", "start timer", etc. Works in English and Chinese.',
  },
  {
    question: 'Where is my data stored?',
    answer: 'All data is stored locally in your browser using localStorage. This means: 1) Your data is private, 2) It persists between sessions, 3) It works offline. However, clearing browser data will erase it.',
  },
  {
    question: 'Can I export my match data?',
    answer: 'Yes! Export options include: PNG/JPG screenshots, PDF match reports with full statistics, and JSON data backups. You can also copy a text summary to your clipboard.',
  },
  {
    question: 'How do I track added time/stoppage time?',
    answer: 'During the first or second half, you\'ll see +0 to +10 buttons below the timer. Click the appropriate number to set added time. The display will show, for example, "45:00 +3".',
  },
  {
    question: 'Can I track individual player stats?',
    answer: 'The current version focuses on team-level statistics (goals, cards, possession, shots, etc.). Player-level tracking may be added in future updates.',
  },
  {
    question: 'Does it work offline?',
    answer: 'Yes! Soccer Scoreboard Online is a Progressive Web App (PWA). After your first visit, it works offline. Install it to your device for the best offline experience.',
  },
  {
    question: 'How do I reset or start a new match?',
    answer: 'Go to Settings (gear icon in header). You\'ll find "Reset Score" to clear the current match while keeping team names, and "New Match" to start completely fresh.',
  },
];

export const FAQPage = ({ onBack }: FAQPageProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <Button onClick={onBack} variant="ghost" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Scoreboard
        </Button>

        <h1 className="text-3xl font-bold text-white mb-2">Frequently Asked Questions</h1>
        <p className="text-slate-400 mb-8">
          Find answers to common questions about Soccer Scoreboard Online.
        </p>

        <div className="space-y-3">
          {faqItems.map((item, index) => (
            <div
              key={index}
              className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden"
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <span className="font-medium text-white pr-4">{item.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-slate-400 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-4 pb-4 text-slate-300 text-sm">
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 bg-slate-800/50 rounded-xl border border-slate-700/50 text-center">
          <h2 className="text-xl font-bold text-white mb-2">Still have questions?</h2>
          <p className="text-slate-400 text-sm mb-4">
            We're happy to help! Reach out to us on GitHub.
          </p>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
          >
            Open an Issue on GitHub
          </a>
        </div>

        <div className="mt-8 text-center">
          <Button onClick={onBack} size="lg">
            Back to Scoreboard
          </Button>
        </div>
      </div>

      {/* FAQ Schema for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqItems.map((item) => ({
              '@type': 'Question',
              name: item.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer,
              },
            })),
          }),
        }}
      />
    </div>
  );
};
