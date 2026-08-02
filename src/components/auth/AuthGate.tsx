'use client';

import { useAuth } from '@/context/AuthContext';
import LoginPage from '@/components/auth/LoginPage';
import { Loader2, Leaf } from 'lucide-react';

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  // Show loading spinner while checking session
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-farm-cream">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-farm-green-500 to-farm-green-700 flex items-center justify-center shadow-xl mb-4 animate-pulse-glow">
          <Leaf className="w-8 h-8 text-white" />
        </div>
        <Loader2 className="w-6 h-6 text-farm-green-600 animate-spin mb-2" />
        <p className="text-sm text-farm-brown-400 font-medium">Loading...</p>
      </div>
    );
  }

  // Not logged in — show login page (replaces entire layout)
  if (!user) {
    return <LoginPage />;
  }

  // Logged in — show normal app
  return <>{children}</>;
}
