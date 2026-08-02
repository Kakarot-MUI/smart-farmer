'use client';

import { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  IndianRupee,
  BarChart3,
  ChevronDown,
  LineChart as LineChartIcon,
  Sparkles,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

interface PriceData {
  date: string;
  price: number;
  isForecast?: boolean;
}

interface CropMarket {
  crop: string;
  emoji: string;
  price: number;
  unit: string;
  change: number;
  history: PriceData[];
  forecastText: string;
  aiRecommendation: string;
}

const generateHistory = (basePrice: number, volatility: number): PriceData[] => {
  const data: PriceData[] = [];
  const today = new Date();
  
  // 6 days of history
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    data.push({
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      price: Math.round(basePrice * (1 + (Math.random() - 0.5) * volatility)),
    });
  }
  
  // 3 days of forecast
  const lastPrice = data[data.length - 1].price;
  for (let i = 1; i <= 3; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    data.push({
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      price: Math.round(lastPrice * (1 + (Math.random() - 0.3) * volatility)),
      isForecast: true,
    });
  }
  
  return data;
};

const marketData: CropMarket[] = [
  {
    crop: 'Tomato',
    emoji: '🍅',
    price: 2800,
    unit: '₹/quintal',
    change: +8.3,
    history: generateHistory(2600, 0.15),
    forecastText: 'Prices expected to rise by 4-5% in the next week due to unseasonal rains affecting supply.',
    aiRecommendation: 'Hold your stock for 2-3 more days if quality permits.',
  },
  {
    crop: 'Wheat',
    emoji: '🌿',
    price: 2275,
    unit: '₹/quintal',
    change: -1.2,
    history: generateHistory(2300, 0.05),
    forecastText: 'Stable trend expected. Government procurement starting soon might establish a floor price.',
    aiRecommendation: 'Good time to sell at MSP or wait for open market demand next month.',
  },
  {
    crop: 'Soybean',
    emoji: '🫘',
    price: 4500,
    unit: '₹/quintal',
    change: +1.8,
    history: generateHistory(4400, 0.08),
    forecastText: 'International demand pushing prices up. Expected to touch ₹4600 next week.',
    aiRecommendation: 'Hold. Strong upward momentum detected.',
  },
  {
    crop: 'Cotton',
    emoji: '☁️',
    price: 6800,
    unit: '₹/quintal',
    change: +4.1,
    history: generateHistory(6500, 0.1),
    forecastText: 'Textile mill demand is peaking. Prices might stabilize around ₹6900.',
    aiRecommendation: 'Sell 50% now to lock in profits, hold rest for potential peak.',
  },
  {
    crop: 'Rice (Basmati)',
    emoji: '🌾',
    price: 3850,
    unit: '₹/quintal',
    change: +2.5,
    history: generateHistory(3750, 0.06),
    forecastText: 'Export orders are strong. Steady gradual increase expected.',
    aiRecommendation: 'Hold if you have safe storage facilities.',
  },
];

export default function MarketPrices() {
  const [selectedCrop, setSelectedCrop] = useState<CropMarket>(marketData[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white border border-farm-brown-200 shadow-xl rounded-xl p-3 z-50">
          <p className="font-semibold text-farm-brown-800 text-sm mb-1">{label}</p>
          <div className="flex items-center gap-1.5 text-farm-green-700 font-bold">
            <IndianRupee className="w-3.5 h-3.5" />
            {payload[0].value.toLocaleString()}
          </div>
          {data.isForecast && (
            <p className="text-[10px] font-bold text-farm-yellow-600 uppercase mt-1 tracking-wider">
              AI Forecast
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl border border-farm-brown-100 shadow-sm overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="px-5 py-4 border-b border-farm-brown-50 bg-farm-cream shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-farm-yellow-100 flex items-center justify-center">
              <LineChartIcon className="w-5 h-5 text-farm-yellow-700" />
            </div>
            <div>
              <h3 className="font-display text-base font-semibold text-farm-brown-800">
                Market Trends & AI Forecast
              </h3>
              <p className="text-[11px] text-farm-brown-400">
                Live prices & 3-day prediction
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Crop Selector Dropdown */}
        <div className="relative mb-6 z-50" style={{ zIndex: 50 }}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-farm-brown-200 bg-white hover:bg-farm-cream/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{selectedCrop.emoji}</span>
              <div className="text-left">
                <p className="font-semibold text-farm-brown-800">{selectedCrop.crop}</p>
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-bold flex items-center">
                    <IndianRupee className="w-3 h-3" />
                    {selectedCrop.price.toLocaleString()}
                  </span>
                  <span
                    className={`inline-flex items-center gap-0.5 text-xs font-semibold ${
                      selectedCrop.change > 0 ? 'text-green-600' : 'text-red-500'
                    }`}
                  >
                    {selectedCrop.change > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {Math.abs(selectedCrop.change)}%
                  </span>
                </div>
              </div>
            </div>
            <ChevronDown className={`w-5 h-5 text-farm-brown-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute z-50 top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-farm-brown-200 py-2 animate-fade-in max-h-60 overflow-y-auto">
              {marketData.map((item) => (
                <button
                  key={item.crop}
                  onClick={() => {
                    setSelectedCrop(item);
                    setDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 hover:bg-farm-cream transition-colors ${
                    selectedCrop.crop === item.crop ? 'bg-farm-green-50' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{item.emoji}</span>
                    <span className={`text-sm font-semibold ${selectedCrop.crop === item.crop ? 'text-farm-green-700' : 'text-farm-brown-700'}`}>
                      {item.crop}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-farm-brown-800 flex items-center">
                    ₹{item.price}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Chart Area */}
        <div className="h-48 sm:h-56 w-full mb-6 relative z-0" style={{ zIndex: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={selectedCrop.history} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E6E0D8" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 11, fill: '#8C7A6B' }}
                dy={10}
              />
              <YAxis 
                domain={['auto', 'auto']} 
                axisLine={false} 
                tickLine={false}
                tick={{ fontSize: 11, fill: '#8C7A6B' }}
                tickFormatter={(val) => `₹${val}`}
              />
              <Tooltip content={<CustomTooltip />} />
              
              {/* Vertical line separating history from forecast */}
              <ReferenceLine 
                x={selectedCrop.history[6].date} 
                stroke="#D4A017" 
                strokeDasharray="4 4" 
                label={{ position: 'top', value: 'Today', fill: '#D4A017', fontSize: 10, fontWeight: 'bold' }} 
              />

              <Line
                type="monotone"
                dataKey="price"
                stroke="#2E7D32"
                strokeWidth={3}
                dot={{ r: 4, fill: '#2E7D32', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 6, fill: '#4CAF50', stroke: '#fff', strokeWidth: 2 }}
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* AI Analysis Cards */}
        <div className="mt-auto space-y-3">
          <div className="bg-farm-cream/60 rounded-xl p-3.5 border border-farm-brown-100">
            <h4 className="text-xs font-bold text-farm-brown-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5" /> Market Trend
            </h4>
            <p className="text-sm text-farm-brown-700 leading-relaxed">
              {selectedCrop.forecastText}
            </p>
          </div>

          <div className="bg-gradient-to-r from-farm-green-50 to-green-50/30 rounded-xl p-3.5 border border-farm-green-200">
            <h4 className="text-xs font-bold text-farm-green-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> AI Recommendation
            </h4>
            <p className="text-sm font-medium text-farm-green-800 leading-relaxed">
              {selectedCrop.aiRecommendation}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
