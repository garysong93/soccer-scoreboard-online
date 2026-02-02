import { useState } from 'react';
import { Share2, Copy, Check, ExternalLink, QrCode, Loader2, AlertCircle, Wifi, WifiOff } from 'lucide-react';
import { useFirebaseSync } from '../../hooks/useFirebaseSync';
import { Button } from '../ui/Button';

export const SharePanel = () => {
  const {
    isSharing,
    shareCode,
    isConfigured,
    isLoading,
    error,
    startSharing,
    stopSharing,
  } = useFirebaseSync();

  const [copied, setCopied] = useState(false);

  const shareUrl = shareCode
    ? `${window.location.origin}/view/${shareCode}`
    : null;

  const copyShareLink = async () => {
    if (!shareUrl) return;

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleStartSharing = async () => {
    await startSharing();
  };

  const handleStopSharing = async () => {
    await stopSharing();
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">
        Live Sharing
      </h3>

      {/* Firebase Configuration Warning */}
      {!isConfigured && (
        <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-yellow-200 font-medium">
                Firebase Not Configured
              </p>
              <p className="text-xs text-yellow-300/70 mt-1">
                Real-time sharing requires Firebase. Add your Firebase credentials to enable this feature.
              </p>
              <p className="text-xs text-slate-400 mt-2">
                See .env.example for required environment variables.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-3">
          <div className="flex items-center gap-2 text-red-400 text-sm">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        </div>
      )}

      {!isSharing ? (
        <div className="text-center py-6">
          <Share2 className="w-12 h-12 mx-auto text-slate-600 mb-3" />
          <p className="text-slate-400 mb-4">
            Share this match live with spectators
          </p>
          <Button
            onClick={handleStartSharing}
            variant="primary"
            disabled={!isConfigured || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 mr-2" />
                Start Live Sharing
              </>
            )}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Connection Status */}
          <div className="flex items-center justify-center gap-2 text-green-400">
            <Wifi className="w-4 h-4" />
            <span className="text-sm font-medium">Live</span>
          </div>

          {/* Share Code */}
          <div className="bg-slate-700/50 rounded-lg p-4 text-center">
            <p className="text-xs text-slate-400 mb-2">Share Code</p>
            <p className="text-3xl font-mono font-bold text-blue-400 tracking-widest">
              {shareCode}
            </p>
          </div>

          {/* Spectator Link */}
          <div className="bg-slate-700/50 rounded-lg p-3">
            <p className="text-xs text-slate-400 mb-2">Spectator Link</p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={shareUrl || ''}
                readOnly
                className="flex-1 bg-slate-600 text-white text-sm px-3 py-2 rounded-lg"
              />
              <Button
                onClick={copyShareLink}
                variant="secondary"
                size="sm"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={() => window.open(shareUrl || '', '_blank')}
              variant="ghost"
              size="sm"
              className="flex-1"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button
              onClick={() => {}}
              variant="ghost"
              size="sm"
              className="flex-1"
              title="Coming soon"
              disabled
            >
              <QrCode className="w-4 h-4 mr-2" />
              QR Code
            </Button>
          </div>

          {/* Info Text */}
          <div className="text-xs text-slate-500 text-center">
            <p>Spectators see score updates in real-time.</p>
            <p className="mt-1 text-green-500/70">
              Changes sync automatically within 1 second.
            </p>
          </div>

          {/* Stop Sharing Button */}
          <Button
            onClick={handleStopSharing}
            variant="ghost"
            size="sm"
            className="w-full text-red-400 hover:text-red-300"
          >
            <WifiOff className="w-4 h-4 mr-2" />
            Stop Sharing
          </Button>
        </div>
      )}
    </div>
  );
};
