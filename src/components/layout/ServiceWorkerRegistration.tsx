'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('serviceWorker' in navigator)) {
      console.log('[SW] Service workers not supported');
      return;
    }

    // Register the service worker
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('[SW] Registered with scope:', registration.scope);

        // Check for updates periodically (every 30 minutes)
        setInterval(() => {
          registration.update();
        }, 30 * 60 * 1000);
      })
      .catch((error) => {
        console.log('[SW] Registration failed:', error);
      });
  }, []);

  // This component renders nothing
  return null;
}
