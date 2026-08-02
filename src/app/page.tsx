'use client';

import WeatherWidget from '@/components/dashboard/WeatherWidget';
import MarketPrices from '@/components/dashboard/MarketPrices';
import QuickAccessCards from '@/components/dashboard/QuickAccessCards';
import CropRecommendation from '@/components/features/CropRecommendation';
import FarmLedger from '@/components/features/FarmLedger';
import DiseaseScanner from '@/components/features/DiseaseScanner';
import FertilizerCalculator from '@/components/features/FertilizerCalculator';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Hero / Welcome Section */}
      <section className="mb-8 animate-fade-in-up">
        <div className="bg-gradient-to-r from-farm-green-700 via-farm-green-800 to-farm-brown-700 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/4" />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-3xl">👋</span>
              <p className="text-farm-green-200 text-sm font-medium">
                Welcome back, {user?.name || 'Farmer'}!
              </p>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 leading-tight">
              Your Smart Crop Advisory
              <br />
              <span className="text-farm-yellow-400">Dashboard</span>
            </h1>
            <p className="text-farm-green-100 text-sm sm:text-base max-w-xl leading-relaxed">
              Get AI-powered crop recommendations, optimize fertilizer usage, and
              detect plant diseases — all in one place.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Access Cards */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="font-display text-lg font-bold text-farm-brown-800">
            ⚡ Quick Actions
          </h2>
        </div>
        <QuickAccessCards />
      </section>

      {/* Two Column Layout: Weather + Market Prices */}
      <section className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
        {/* Weather Widget - takes 3 cols */}
        <div className="lg:col-span-3 animate-fade-in-up stagger-1">
          <WeatherWidget />
        </div>

        {/* Market Prices - takes 2 cols */}
        <div className="lg:col-span-2 animate-fade-in-up stagger-2">
          <MarketPrices />
        </div>
      </section>

      {/* Crop Recommendation Engine */}
      <section className="mb-8 animate-fade-in-up stagger-3">
        <CropRecommendation />
      </section>

      {/* Farm Ledger - Expense Tracker */}
      <section className="mb-8 animate-fade-in-up stagger-4">
        <FarmLedger />
      </section>

      {/* Fertilizer Optimizer */}
      <section className="mb-8 animate-fade-in-up stagger-4">
        <FertilizerCalculator />
      </section>

      {/* Disease Scanner */}
      <section className="mb-8 animate-fade-in-up stagger-5">
        <DiseaseScanner />
      </section>
    </div>
  );
}
