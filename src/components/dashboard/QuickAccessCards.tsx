'use client';

import { Sprout, FlaskConical, ScanLine, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    id: 'predict-crop',
    title: 'Predict Crop',
    description: 'Get AI-powered crop recommendations based on your soil and weather data.',
    icon: Sprout,
    href: '#crop-recommendation',
    gradient: 'from-farm-green-500 to-farm-green-700',
    bgLight: 'bg-farm-green-50',
    borderColor: 'border-farm-green-200',
    hoverBg: 'hover:border-farm-green-400',
    iconColor: 'text-farm-green-600',
    emoji: '🌱',
  },
  {
    id: 'check-fertilizer',
    title: 'Check Fertilizer',
    description: 'Find the perfect fertilizer mix and exact dosage for your target crop.',
    icon: FlaskConical,
    href: '#fertilizer',
    gradient: 'from-farm-yellow-600 to-farm-yellow-800',
    bgLight: 'bg-farm-yellow-50',
    borderColor: 'border-farm-yellow-200',
    hoverBg: 'hover:border-farm-yellow-400',
    iconColor: 'text-farm-yellow-700',
    emoji: '🧪',
  },
  {
    id: 'scan-disease',
    title: 'Scan Disease',
    description: 'Upload a leaf photo and get instant disease diagnosis with treatment plans.',
    icon: ScanLine,
    href: '#disease',
    gradient: 'from-farm-brown-400 to-farm-brown-600',
    bgLight: 'bg-farm-brown-50',
    borderColor: 'border-farm-brown-200',
    hoverBg: 'hover:border-farm-brown-400',
    iconColor: 'text-farm-brown-500',
    emoji: '🔬',
  },
];

export default function QuickAccessCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {features.map((feature, i) => (
        <Link
          key={feature.id}
          href={feature.href}
          id={`quick-access-${feature.id}`}
          className={`group relative bg-white rounded-2xl border-2 ${feature.borderColor} ${feature.hoverBg} p-5 sm:p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 active:scale-[0.98] animate-fade-in-up stagger-${i + 1}`}
        >
          {/* Icon */}
          <div
            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform duration-300`}
          >
            <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" strokeWidth={2} />
          </div>

          {/* Content */}
          <h3 className="font-display text-lg font-bold text-farm-brown-800 mb-1.5 flex items-center gap-2">
            <span>{feature.emoji}</span>
            {feature.title}
          </h3>
          <p className="text-sm text-farm-brown-500 leading-relaxed mb-4">
            {feature.description}
          </p>

          {/* CTA */}
          <div className="flex items-center gap-1.5 text-sm font-semibold text-farm-green-700 group-hover:gap-3 transition-all duration-300">
            Get Started
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </div>
        </Link>
      ))}
    </div>
  );
}
