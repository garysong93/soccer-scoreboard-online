import { Scoreboard } from '../scoreboard/Scoreboard';
import { Header } from '../layout/Header';
import { Footer } from '../layout/Footer';

export const ScoreboardPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-900 to-slate-950">
      <Header />

      <main className="flex-1 px-4 py-6" id="scoreboard-export">
        <Scoreboard />
      </main>

      <Footer />
    </div>
  );
};
