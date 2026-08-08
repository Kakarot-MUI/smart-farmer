'use client';

import { AuthProvider, useAuth } from '@/context/AuthContext';
import LoginPage from '@/components/auth/LoginPage';
import Header from '@/components/layout/Header';
import VoiceAssistant from '@/components/features/VoiceAssistant';
import OfflineBanner from '@/components/layout/OfflineBanner';
import ServiceWorkerRegistration from '@/components/layout/ServiceWorkerRegistration';
import { Loader2, Leaf } from 'lucide-react';
import { LanguageProvider, useLanguage } from '@/context/LanguageContext';

function AppContent({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const { t } = useLanguage();

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-farm-cream">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-farm-green-500 to-farm-green-700 flex items-center justify-center shadow-xl mb-4 animate-pulse-glow">
          <Leaf className="w-8 h-8 text-white" />
        </div>
        <Loader2 className="w-6 h-6 text-farm-green-600 animate-spin mb-2" />
        <p className="text-sm text-farm-brown-400 font-medium">{t('common.loading')}</p>
      </div>
    );
  }

  // Not logged in — show login page (full screen, no header/footer)
  if (!user) {
    return <LoginPage />;
  }

  // Logged in — show full app with header and footer
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <footer className="bg-farm-brown-900 text-farm-brown-200 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🌾</span>
              <span className="font-display font-bold text-white text-lg">
                {t('app.name')}
              </span>
            </div>
            <p className="text-sm text-farm-brown-400 text-center">
              {t('footer.copyright')}
            </p>
            <div className="flex items-center gap-4 text-sm">
              <a href="#" className="hover:text-farm-green-300 transition-colors">
                {t('common.about')}
              </a>
              <a href="#" className="hover:text-farm-green-300 transition-colors">
                {t('common.help')}
              </a>
              <a href="#" className="hover:text-farm-green-300 transition-colors">
                {t('common.contact')}
              </a>
            </div>
          </div>
        </div>
      </footer>
      <VoiceAssistant />
    </>
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <AuthProvider>
        <ServiceWorkerRegistration />
        <AppContent>{children}</AppContent>
        <OfflineBanner />
      </AuthProvider>
    </LanguageProvider>
  );
}
