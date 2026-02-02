import { useState } from 'react';
import { Image, FileText, FileJson, Copy, Check } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { useGameStore } from '../../stores/useGameStore';
import { Button } from '../ui/Button';

export const ExportPanel = () => {
  const { match } = useGameStore();
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState<string | null>(null);

  const formatMatchSummary = () => {
    const { home, away, period, timerSeconds } = match;
    const minutes = Math.floor(timerSeconds / 60);

    return `⚽ Match Result
${home.name} ${home.score} - ${away.score} ${away.name}
⏱️ ${minutes}' | ${period.replace('_', ' ').toUpperCase()}
🟨 Yellow: ${home.yellowCards} - ${away.yellowCards}
🟥 Red: ${home.redCards} - ${away.redCards}`;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(formatMatchSummary());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const exportAsImage = async (format: 'png' | 'jpg') => {
    setExporting(format);
    try {
      const element = document.getElementById('scoreboard-export');
      if (!element) return;

      const canvas = await html2canvas(element, {
        backgroundColor: '#0f172a',
        scale: 2,
      });

      const link = document.createElement('a');
      link.download = `match-${match.id}.${format}`;
      link.href = canvas.toDataURL(`image/${format === 'jpg' ? 'jpeg' : 'png'}`);
      link.click();
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setExporting(null);
    }
  };

  const exportAsPDF = async () => {
    setExporting('pdf');
    try {
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      const { home, away, events, stats } = match;

      // Title
      pdf.setFontSize(24);
      pdf.setTextColor(255, 255, 255);
      pdf.setFillColor(15, 23, 42);
      pdf.rect(0, 0, pdf.internal.pageSize.width, pdf.internal.pageSize.height, 'F');

      pdf.setTextColor(255, 255, 255);
      pdf.text('Match Report', 148, 20, { align: 'center' });

      // Score
      pdf.setFontSize(48);
      pdf.text(`${home.score} - ${away.score}`, 148, 50, { align: 'center' });

      // Teams
      pdf.setFontSize(18);
      pdf.text(home.name, 60, 50, { align: 'center' });
      pdf.text(away.name, 237, 50, { align: 'center' });

      // Stats
      pdf.setFontSize(12);
      let yPos = 80;
      pdf.text('Statistics', 148, yPos, { align: 'center' });
      yPos += 10;

      const statRows = [
        ['Possession', `${stats.possession.home}%`, `${stats.possession.away}%`],
        ['Shots', `${stats.shots.home}`, `${stats.shots.away}`],
        ['On Target', `${stats.shotsOnTarget.home}`, `${stats.shotsOnTarget.away}`],
        ['Corners', `${stats.corners.home}`, `${stats.corners.away}`],
        ['Fouls', `${stats.fouls.home}`, `${stats.fouls.away}`],
        ['Yellow Cards', `${home.yellowCards}`, `${away.yellowCards}`],
        ['Red Cards', `${home.redCards}`, `${away.redCards}`],
      ];

      statRows.forEach(([label, homeVal, awayVal]) => {
        pdf.text(homeVal, 100, yPos, { align: 'right' });
        pdf.text(label, 148, yPos, { align: 'center' });
        pdf.text(awayVal, 196, yPos, { align: 'left' });
        yPos += 8;
      });

      // Events
      yPos += 10;
      pdf.text('Match Events', 148, yPos, { align: 'center' });
      yPos += 10;

      const goalEvents = events.filter((e) => e.type === 'goal');
      goalEvents.forEach((event) => {
        const team = event.team === 'home' ? home.name : away.name;
        pdf.text(`${event.minute}' - Goal (${team})`, 148, yPos, { align: 'center' });
        yPos += 6;
      });

      pdf.save(`match-report-${match.id}.pdf`);
    } catch (err) {
      console.error('PDF export failed:', err);
    } finally {
      setExporting(null);
    }
  };

  const exportAsJSON = () => {
    const dataStr = JSON.stringify(match, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `match-${match.id}.json`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Export Match</h3>

      <div className="grid grid-cols-2 gap-3">
        <Button
          onClick={() => exportAsImage('png')}
          variant="secondary"
          disabled={exporting === 'png'}
          className="flex-col py-4"
        >
          <Image className="w-6 h-6 mb-1" />
          <span className="text-sm">PNG Image</span>
        </Button>

        <Button
          onClick={() => exportAsImage('jpg')}
          variant="secondary"
          disabled={exporting === 'jpg'}
          className="flex-col py-4"
        >
          <Image className="w-6 h-6 mb-1" />
          <span className="text-sm">JPG Image</span>
        </Button>

        <Button
          onClick={exportAsPDF}
          variant="secondary"
          disabled={exporting === 'pdf'}
          className="flex-col py-4"
        >
          <FileText className="w-6 h-6 mb-1" />
          <span className="text-sm">PDF Report</span>
        </Button>

        <Button
          onClick={exportAsJSON}
          variant="secondary"
          className="flex-col py-4"
        >
          <FileJson className="w-6 h-6 mb-1" />
          <span className="text-sm">JSON Data</span>
        </Button>
      </div>

      <div className="pt-4 border-t border-slate-700">
        <h4 className="text-sm text-slate-400 mb-2">Quick Share</h4>
        <div className="bg-slate-700/50 rounded-lg p-3 text-sm text-slate-300 font-mono whitespace-pre-wrap">
          {formatMatchSummary()}
        </div>
        <Button
          onClick={copyToClipboard}
          variant="ghost"
          size="sm"
          className="mt-2 w-full"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 mr-2 text-green-400" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 mr-2" />
              Copy to Clipboard
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
