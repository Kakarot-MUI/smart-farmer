'use client';

import { useEffect, useState } from 'react';
import { WifiOff, Wifi, X } from 'lucide-react';

export default function OfflineBanner() {
  const [isOnline, setIsOnline] = useState(true);
  const [showBanner, setShowBanner] = useState(false);
  const [justCameBack, setJustCameBack] = useState(false);

  useEffect(() => {
    // Set initial state
    setIsOnline(navigator.onLine);
    if (!navigator.onLine) {
      setShowBanner(true);
    }

    const handleOnline = () => {
      setIsOnline(true);
      setJustCameBack(true);
      setShowBanner(true);
      // Auto-hide the "back online" message after 4 seconds
      setTimeout(() => {
        setShowBanner(false);
        setJustCameBack(false);
      }, 4000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setJustCameBack(false);
      setShowBanner(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showBanner) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-sm z-[100] rounded-xl shadow-2xl border-2 p-4 flex items-center gap-3 animate-fade-in-up ${
        isOnline && justCameBack
          ? 'bg-green-50 border-green-300 text-green-800'
          : 'bg-farm-yellow-50 border-farm-yellow-400 text-farm-brown-800'
      }`}
    >
      {/* Icon */}
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
          isOnline && justCameBack
            ? 'bg-green-100'
            : 'bg-farm-yellow-100'
        }`}
      >
        {isOnline && justCameBack ? (
          <Wifi className="w-5 h-5 text-green-600" />
        ) : (
          <WifiOff className="w-5 h-5 text-farm-yellow-700 animate-bounce-gentle" />
        )}
      </div>

      {/* Message */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold">
          {isOnline && justCameBack ? '✅ Back Online!' : '📡 You are Offline'}
        </p>
        <p className="text-xs mt-0.5 opacity-80">
          {isOnline && justCameBack
            ? 'Your connection has been restored.'
            : 'Don\'t worry — your saved data, recommendations, and ledger still work.'}
        </p>
      </div>

      {/* Dismiss */}
      <button
        onClick={() => setShowBanner(false)}
        className="p-1.5 rounded-lg hover:bg-black/5 transition-colors shrink-0"
        aria-label="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
