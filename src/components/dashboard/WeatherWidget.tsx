'use client';

import {
  Sun,
  CloudRain,
  Droplets,
  Wind,
  Thermometer,
  Eye,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';

const weatherData = {
  location: 'Nashik, Maharashtra',
  temp: 28,
  tempHigh: 33,
  tempLow: 22,
  condition: 'Partly Cloudy',
  humidity: 72,
  windSpeed: 14,
  visibility: 8,
  rainChance: 40,
  forecast: [
    { day: 'Today', icon: Sun, temp: 28, rain: 10 },
    { day: 'Thu', icon: CloudRain, temp: 25, rain: 80 },
    { day: 'Fri', icon: CloudRain, temp: 24, rain: 65 },
    { day: 'Sat', icon: Sun, temp: 30, rain: 5 },
    { day: 'Sun', icon: Sun, temp: 31, rain: 0 },
  ],
};

export default function WeatherWidget() {
  return (
    <div className="bg-gradient-to-br from-farm-green-700 via-farm-green-800 to-farm-green-900 rounded-2xl p-5 sm:p-6 text-white shadow-xl relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full" />
      <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full" />

      {/* Header */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-farm-green-200 text-xs font-medium uppercase tracking-wider mb-0.5">
              Current Weather
            </p>
            <h3 className="font-display text-base sm:text-lg font-semibold">
              📍 {weatherData.location}
            </h3>
          </div>
          <div className="text-right">
            <div className="text-4xl sm:text-5xl font-display font-bold">
              {weatherData.temp}°
            </div>
            <p className="text-farm-green-200 text-xs mt-0.5">
              {weatherData.condition}
            </p>
          </div>
        </div>

        {/* Hi/Lo */}
        <div className="flex items-center gap-4 mb-5">
          <span className="flex items-center gap-1 text-sm text-farm-green-100">
            <ArrowUp className="w-3.5 h-3.5 text-farm-yellow-400" />
            {weatherData.tempHigh}°
          </span>
          <span className="flex items-center gap-1 text-sm text-farm-green-100">
            <ArrowDown className="w-3.5 h-3.5 text-blue-300" />
            {weatherData.tempLow}°
          </span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          {[
            { icon: Droplets, label: 'Humidity', value: `${weatherData.humidity}%`, color: 'text-blue-300' },
            { icon: Wind, label: 'Wind', value: `${weatherData.windSpeed} km/h`, color: 'text-farm-green-200' },
            { icon: Eye, label: 'Visibility', value: `${weatherData.visibility} km`, color: 'text-farm-yellow-300' },
            { icon: CloudRain, label: 'Rain', value: `${weatherData.rainChance}%`, color: 'text-blue-200' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white/10 rounded-xl p-3 text-center"
            >
              <stat.icon className={`w-5 h-5 mx-auto mb-1.5 ${stat.color}`} />
              <p className="text-[11px] text-farm-green-200 mb-0.5">{stat.label}</p>
              <p className="text-sm font-semibold">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* 5-Day Forecast */}
        <div>
          <h4 className="text-xs font-medium text-farm-green-200 uppercase tracking-wider mb-3">
            5-Day Forecast
          </h4>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {weatherData.forecast.map((day, i) => (
              <div
                key={day.day}
                className={`flex-1 min-w-[60px] text-center rounded-xl p-2.5 transition-colors ${
                  i === 0
                    ? 'bg-white/20 ring-1 ring-white/30'
                    : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                <p className="text-[11px] font-medium text-farm-green-200 mb-1.5">
                  {day.day}
                </p>
                <day.icon className="w-5 h-5 mx-auto mb-1.5 text-farm-yellow-300" />
                <p className="text-sm font-bold">{day.temp}°</p>
                <p className="text-[10px] text-blue-200 mt-0.5">
                  💧 {day.rain}%
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
