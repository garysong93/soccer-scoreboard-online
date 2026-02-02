import { Github, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="mt-auto py-6 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-sm text-slate-400">
            <a
              href="/how-to-use"
              className="hover:text-white transition-colors"
            >
              How to Use
            </a>
            <a
              href="/faq"
              className="hover:text-white transition-colors"
            >
              FAQ
            </a>
            <a
              href="/obs"
              className="hover:text-white transition-colors"
            >
              OBS Overlay
            </a>
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
            <span>for soccer fans</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-800/50 text-center text-xs text-slate-600">
          <p>
            Soccer Scoreboard Online - Free online soccer scoreboard with live sharing,
            match history, and more. No registration required.
          </p>
        </div>
      </div>
    </footer>
  );
};
