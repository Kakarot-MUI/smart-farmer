'use client';

import { useState } from 'react';
import {
  FlaskConical,
  Calculator,
  Loader2,
  CheckCircle2,
  RotateCcw,
  Info,
  Wheat,
  ChevronDown,
  Package,
  Scale,
  IndianRupee,
  Sprout,
} from 'lucide-react';

interface CropRequirement {
  name: string;
  emoji: string;
  optimalN: number;
  optimalP: number;
  optimalK: number;
}

interface FertilizerResult {
  crop: string;
  emoji: string;
  farmSize: number;
  fertilizers: {
    name: string;
    emoji: string;
    totalKg: number;
    bags: number;
    bagSize: number;
    purpose: string;
    pricePerBag: number;
  }[];
  totalCost: number;
  schedule: string[];
}

const cropOptions: CropRequirement[] = [
  { name: 'Rice (Paddy)', emoji: '🌾', optimalN: 120, optimalP: 60, optimalK: 40 },
  { name: 'Wheat', emoji: '🌿', optimalN: 120, optimalP: 60, optimalK: 40 },
  { name: 'Maize (Corn)', emoji: '🌽', optimalN: 150, optimalP: 60, optimalK: 40 },
  { name: 'Cotton', emoji: '☁️', optimalN: 120, optimalP: 60, optimalK: 60 },
  { name: 'Sugarcane', emoji: '🎋', optimalN: 300, optimalP: 85, optimalK: 85 },
  { name: 'Soybean', emoji: '🫘', optimalN: 30, optimalP: 60, optimalK: 40 },
  { name: 'Tomato', emoji: '🍅', optimalN: 120, optimalP: 80, optimalK: 80 },
  { name: 'Potato', emoji: '🥔', optimalN: 180, optimalP: 80, optimalK: 100 },
  { name: 'Onion', emoji: '🧅', optimalN: 100, optimalP: 50, optimalK: 50 },
  { name: 'Chilli', emoji: '🌶️', optimalN: 100, optimalP: 50, optimalK: 50 },
];

export default function FertilizerCalculator() {
  const [selectedCrop, setSelectedCrop] = useState('');
  const [currentN, setCurrentN] = useState('');
  const [currentP, setCurrentP] = useState('');
  const [currentK, setCurrentK] = useState('');
  const [farmSize, setFarmSize] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FertilizerResult | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const selectedCropData = cropOptions.find((c) => c.name === selectedCrop);

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCrop || !currentN || !currentP || !currentK || !farmSize) return;

    setLoading(true);
    setResult(null);

    await new Promise((r) => setTimeout(r, 1800));

    const crop = cropOptions.find((c) => c.name === selectedCrop)!;
    const acres = parseFloat(farmSize);
    const nCurrent = parseFloat(currentN);
    const pCurrent = parseFloat(currentP);
    const kCurrent = parseFloat(currentK);

    // Calculate nutrient deficit per hectare (1 acre ≈ 0.4 hectare)
    const nDeficit = Math.max(0, crop.optimalN - nCurrent);
    const pDeficit = Math.max(0, crop.optimalP - pCurrent);
    const kDeficit = Math.max(0, crop.optimalK - kCurrent);

    // Convert to fertilizer quantities
    // Urea: 46% N
    const ureaKg = Math.round((nDeficit / 0.46) * acres);
    const ureaBags = Math.ceil(ureaKg / 50);

    // DAP: 18% N + 46% P2O5 (≈ 20% P)
    const dapKg = Math.round((pDeficit / 0.20) * acres);
    const dapBags = Math.ceil(dapKg / 50);

    // MOP: 60% K2O (≈ 50% K)
    const mopKg = Math.round((kDeficit / 0.50) * acres);
    const mopBags = Math.ceil(mopKg / 50);

    const fertilizers = [];

    if (ureaBags > 0) {
      fertilizers.push({
        name: 'Urea (46-0-0)',
        emoji: '⚪',
        totalKg: ureaKg,
        bags: ureaBags,
        bagSize: 50,
        purpose: 'Supplies Nitrogen for leaf growth and green color',
        pricePerBag: 267,
      });
    }

    if (dapBags > 0) {
      fertilizers.push({
        name: 'DAP (18-46-0)',
        emoji: '🟤',
        totalKg: dapKg,
        bags: dapBags,
        bagSize: 50,
        purpose: 'Supplies Phosphorus for root growth and flowering',
        pricePerBag: 1350,
      });
    }

    if (mopBags > 0) {
      fertilizers.push({
        name: 'MOP (0-0-60)',
        emoji: '🔴',
        totalKg: mopKg,
        bags: mopBags,
        bagSize: 50,
        purpose: 'Supplies Potassium for fruit quality and disease resistance',
        pricePerBag: 870,
      });
    }

    // If all nutrients are sufficient
    if (fertilizers.length === 0) {
      fertilizers.push({
        name: 'No additional fertilizer needed!',
        emoji: '✅',
        totalKg: 0,
        bags: 0,
        bagSize: 0,
        purpose: 'Your soil already has sufficient nutrients for this crop',
        pricePerBag: 0,
      });
    }

    const totalCost = fertilizers.reduce((sum, f) => sum + f.bags * f.pricePerBag, 0);

    const schedule = [
      '📅 Basal dose: Apply all DAP + MOP + 1/3 Urea before sowing/transplanting',
      '📅 1st Top dressing: Apply 1/3 Urea at 25-30 days after sowing',
      '📅 2nd Top dressing: Apply remaining 1/3 Urea at 50-55 days after sowing',
    ];

    setResult({
      crop: crop.name,
      emoji: crop.emoji,
      farmSize: acres,
      fertilizers,
      totalCost,
      schedule,
    });

    setLoading(false);
  };

  const handleReset = () => {
    setSelectedCrop('');
    setCurrentN('');
    setCurrentP('');
    setCurrentK('');
    setFarmSize('');
    setResult(null);
  };

  return (
    <section id="fertilizer" className="scroll-mt-20">
      <div className="bg-white rounded-2xl border border-farm-yellow-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-5 sm:px-6 py-5 border-b border-farm-yellow-100 bg-gradient-to-r from-farm-yellow-50 to-farm-cream">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-farm-yellow-500 to-farm-yellow-700 flex items-center justify-center shadow-md">
              <FlaskConical className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-farm-brown-800">
                🧪 Precision Fertilizer Calculator
              </h2>
              <p className="text-sm text-farm-brown-400 mt-0.5">
                Get exact fertilizer bags and dosage for your farm
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleCalculate} className="p-5 sm:p-6">
          {/* Info Banner */}
          <div className="flex items-start gap-3 bg-farm-yellow-50 border border-farm-yellow-200 rounded-xl p-4 mb-6">
            <Info className="w-5 h-5 text-farm-yellow-700 mt-0.5 shrink-0" />
            <p className="text-sm text-farm-brown-700 leading-relaxed">
              Select your target crop and enter your current soil NPK levels.
              We&apos;ll calculate exactly how many bags of each fertilizer you need to buy.
            </p>
          </div>

          {/* Crop Selection */}
          <div className="mb-5">
            <label className="flex items-center gap-2 text-sm font-semibold text-farm-brown-700 mb-2">
              <Wheat className="w-4 h-4 text-farm-yellow-600" />
              Target Crop
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl border-2 border-farm-brown-200 bg-farm-cream/50 text-left hover:border-farm-brown-300 focus:outline-none focus:border-farm-green-500 focus:ring-2 focus:ring-farm-green-200 transition-all"
              >
                {selectedCropData ? (
                  <span className="flex items-center gap-2 text-base font-medium text-farm-brown-800">
                    <span className="text-xl">{selectedCropData.emoji}</span>
                    {selectedCropData.name}
                  </span>
                ) : (
                  <span className="text-farm-brown-300">Select a crop...</span>
                )}
                <ChevronDown className={`w-5 h-5 text-farm-brown-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute z-20 w-full mt-2 bg-white rounded-xl shadow-xl border border-farm-brown-100 py-1.5 max-h-60 overflow-y-auto animate-fade-in">
                  {cropOptions.map((crop) => (
                    <button
                      key={crop.name}
                      type="button"
                      onClick={() => {
                        setSelectedCrop(crop.name);
                        setDropdownOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left text-sm transition-colors ${
                        selectedCrop === crop.name
                          ? 'bg-farm-green-50 text-farm-green-700 font-semibold'
                          : 'text-farm-brown-600 hover:bg-farm-cream'
                      }`}
                    >
                      <span className="text-xl">{crop.emoji}</span>
                      <span>{crop.name}</span>
                      <span className="ml-auto text-[11px] text-farm-brown-400">
                        N:{crop.optimalN} P:{crop.optimalP} K:{crop.optimalK}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Current Soil NPK + Farm Size */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {[
              { key: 'N', label: 'Current N', value: currentN, setter: setCurrentN, color: 'text-farm-green-600', unit: 'kg/ha' },
              { key: 'P', label: 'Current P', value: currentP, setter: setCurrentP, color: 'text-farm-yellow-600', unit: 'kg/ha' },
              { key: 'K', label: 'Current K', value: currentK, setter: setCurrentK, color: 'text-farm-brown-500', unit: 'kg/ha' },
              { key: 'size', label: 'Farm Size', value: farmSize, setter: setFarmSize, color: 'text-farm-green-700', unit: 'acres' },
            ].map((field) => (
              <div key={field.key}>
                <label htmlFor={`fert-${field.key}`} className={`block text-sm font-semibold text-farm-brown-700 mb-2`}>
                  {field.label}
                </label>
                <div className="relative">
                  <input
                    id={`fert-${field.key}`}
                    type="number"
                    step="1"
                    min="0"
                    value={field.value}
                    onChange={(e) => field.setter(e.target.value)}
                    placeholder="0"
                    className="w-full px-4 py-3.5 rounded-xl border-2 border-farm-brown-200 text-base font-bold bg-farm-cream/50 placeholder:text-farm-brown-300 focus:outline-none focus:border-farm-green-500 focus:ring-2 focus:ring-farm-green-200 transition-all"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-medium text-farm-brown-400">
                    {field.unit}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={loading || !selectedCrop || !currentN || !currentP || !currentK || !farmSize}
              className="flex-1 flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-gradient-to-r from-farm-yellow-600 to-farm-yellow-700 text-white font-bold text-base shadow-lg hover:from-farm-yellow-700 hover:to-farm-yellow-800 hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Calculating...
                </>
              ) : (
                <>
                  <Calculator className="w-5 h-5" />
                  Calculate Fertilizer
                </>
              )}
            </button>
            {result && (
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl border-2 border-farm-brown-200 text-farm-brown-600 font-semibold hover:bg-farm-brown-50 transition-all active:scale-[0.98]"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
            )}
          </div>
        </form>

        {/* Loading */}
        {loading && (
          <div className="px-5 sm:px-6 pb-6">
            <div className="bg-gradient-to-r from-farm-yellow-50 to-farm-cream rounded-xl p-8 text-center animate-pulse-glow">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-farm-yellow-100 flex items-center justify-center">
                <FlaskConical className="w-8 h-8 text-farm-yellow-600 animate-bounce-gentle" />
              </div>
              <h3 className="font-display text-lg font-bold text-farm-brown-800 mb-1">
                Calculating Fertilizer Requirements...
              </h3>
              <p className="text-sm text-farm-brown-400">
                Comparing your soil levels with optimal crop requirements
              </p>
            </div>
          </div>
        )}

        {/* Results */}
        {result && !loading && (
          <div className="px-5 sm:px-6 pb-6 animate-fade-in-up">
            <div className="bg-gradient-to-br from-farm-yellow-50 via-white to-farm-green-50 rounded-2xl border-2 border-farm-yellow-200 overflow-hidden">
              {/* Result Header */}
              <div className="px-5 py-4 bg-farm-yellow-600 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-bold text-sm">Fertilizer Plan Ready!</span>
                  </div>
                  <span className="text-sm">
                    {result.emoji} {result.crop} · {result.farmSize} acre{result.farmSize > 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              <div className="p-5 sm:p-6">
                {/* Fertilizer Cards */}
                <div className="space-y-3 mb-6">
                  {result.fertilizers.map((fert) => (
                    <div
                      key={fert.name}
                      className="flex items-center justify-between bg-white rounded-xl p-4 border border-farm-brown-100 hover:border-farm-yellow-300 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-farm-yellow-100 flex items-center justify-center text-2xl shrink-0">
                          {fert.emoji}
                        </div>
                        <div>
                          <p className="font-bold text-farm-brown-800">{fert.name}</p>
                          <p className="text-xs text-farm-brown-400 mt-0.5">{fert.purpose}</p>
                        </div>
                      </div>
                      {fert.bags > 0 && (
                        <div className="text-right shrink-0 ml-3">
                          <div className="flex items-center gap-1 text-xl font-bold text-farm-brown-800">
                            <Package className="w-5 h-5 text-farm-yellow-600" />
                            {fert.bags}
                            <span className="text-sm font-normal text-farm-brown-400">
                              bag{fert.bags > 1 ? 's' : ''}
                            </span>
                          </div>
                          <p className="text-xs text-farm-brown-400">
                            ({fert.totalKg} kg × {fert.bagSize}kg bags)
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Total Cost */}
                {result.totalCost > 0 && (
                  <div className="bg-farm-green-50 rounded-xl p-4 border border-farm-green-200 mb-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Scale className="w-5 h-5 text-farm-green-600" />
                        <span className="font-bold text-farm-brown-700">Estimated Total Cost</span>
                      </div>
                      <div className="flex items-center text-2xl font-bold text-farm-green-700">
                        <IndianRupee className="w-5 h-5" />
                        {result.totalCost.toLocaleString('en-IN')}
                      </div>
                    </div>
                    <p className="text-xs text-farm-brown-400 mt-1.5">
                      *Prices based on government-subsidized rates. Actual cost may vary.
                    </p>
                  </div>
                )}

                {/* Application Schedule */}
                <div>
                  <h4 className="flex items-center gap-2 font-bold text-farm-brown-700 text-sm mb-3">
                    <Sprout className="w-4 h-4 text-farm-green-600" />
                    Application Schedule
                  </h4>
                  <div className="space-y-2">
                    {result.schedule.map((step, i) => (
                      <div key={i} className="flex items-start gap-2 px-4 py-2.5 rounded-lg bg-farm-cream/60">
                        <span className="text-farm-green-600 font-bold text-sm mt-0.5">{i + 1}.</span>
                        <p className="text-sm text-farm-brown-600">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
