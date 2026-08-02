'use client';

import { useState } from 'react';
import {
  Sprout,
  Loader2,
  Leaf,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Info,
  Zap,
  Droplets,
  FlaskConical,
  TestTubeDiagonal,
  CloudRain,
  Gauge,
} from 'lucide-react';

interface FormData {
  nitrogen: string;
  phosphorus: string;
  potassium: string;
  ph: string;
  rainfall: string;
}

interface CropResult {
  crop: string;
  confidence: number;
  emoji: string;
  explanation: string;
  season: string;
  waterNeeds: string;
  soilType: string;
  alternatives: { name: string; confidence: number; emoji: string }[];
}

const mockResults: Record<string, CropResult> = {
  default: {
    crop: 'Rice (Oryza sativa)',
    confidence: 94,
    emoji: '🌾',
    explanation:
      'Your soil has high nitrogen levels with adequate moisture, making it ideal for paddy rice cultivation. The pH range is optimal for rice growth in waterlogged conditions.',
    season: 'Kharif (June–Nov)',
    waterNeeds: 'High (1200mm+)',
    soilType: 'Clay Loam',
    alternatives: [
      { name: 'Jute', confidence: 82, emoji: '🧵' },
      { name: 'Coconut', confidence: 76, emoji: '🥥' },
    ],
  },
  wheat: {
    crop: 'Wheat (Triticum aestivum)',
    confidence: 89,
    emoji: '🌿',
    explanation:
      'The moderate nitrogen and phosphorus levels combined with lower rainfall make wheat an excellent choice. Your soil pH is well-suited for Rabi season wheat cultivation.',
    season: 'Rabi (Nov–Apr)',
    waterNeeds: 'Moderate (400-650mm)',
    soilType: 'Loamy',
    alternatives: [
      { name: 'Barley', confidence: 78, emoji: '🌱' },
      { name: 'Mustard', confidence: 71, emoji: '🌼' },
    ],
  },
};

const inputFields = [
  {
    key: 'nitrogen' as const,
    label: 'Nitrogen (N)',
    icon: Zap,
    unit: 'kg/ha',
    placeholder: 'e.g. 85',
    min: 0,
    max: 200,
    color: 'farm-green',
    tip: 'Available nitrogen content in your soil',
  },
  {
    key: 'phosphorus' as const,
    label: 'Phosphorus (P)',
    icon: FlaskConical,
    unit: 'kg/ha',
    placeholder: 'e.g. 45',
    min: 0,
    max: 150,
    color: 'farm-yellow',
    tip: 'Available phosphorus in your soil',
  },
  {
    key: 'potassium' as const,
    label: 'Potassium (K)',
    icon: TestTubeDiagonal,
    unit: 'kg/ha',
    placeholder: 'e.g. 40',
    min: 0,
    max: 210,
    color: 'farm-brown',
    tip: 'Available potassium in your soil',
  },
  {
    key: 'ph' as const,
    label: 'pH Level',
    icon: Gauge,
    unit: 'pH',
    placeholder: 'e.g. 6.5',
    min: 0,
    max: 14,
    color: 'farm-green',
    tip: 'Soil acidity/alkalinity (0-14 scale)',
  },
  {
    key: 'rainfall' as const,
    label: 'Rainfall',
    icon: CloudRain,
    unit: 'mm',
    placeholder: 'e.g. 200',
    min: 0,
    max: 3000,
    color: 'farm-green',
    tip: 'Average annual rainfall in your region',
  },
];

export default function CropRecommendation() {
  const [formData, setFormData] = useState<FormData>({
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    ph: '',
    rainfall: '',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CropResult | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    let isValid = true;

    inputFields.forEach((field) => {
      const value = formData[field.key];
      if (!value || value.trim() === '') {
        newErrors[field.key] = `${field.label} is required`;
        isValid = false;
      } else {
        const num = parseFloat(value);
        if (isNaN(num)) {
          newErrors[field.key] = 'Must be a number';
          isValid = false;
        } else if (num < field.min || num > field.max) {
          newErrors[field.key] = `Must be between ${field.min} and ${field.max}`;
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    setResult(null);
    setSubmitted(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2500));

    const rainfall = parseFloat(formData.rainfall);
    const selectedResult = rainfall < 400 ? mockResults.wheat : mockResults.default;

    setResult(selectedResult);
    setLoading(false);
  };

  const handleReset = () => {
    setFormData({ nitrogen: '', phosphorus: '', potassium: '', ph: '', rainfall: '' });
    setResult(null);
    setSubmitted(false);
    setErrors({});
  };

  const handleInputChange = (key: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  return (
    <section
      id="crop-recommendation"
      className="scroll-mt-20"
    >
      <div className="bg-white rounded-2xl border border-farm-green-100 shadow-sm overflow-hidden">
        {/* Section Header */}
        <div className="px-5 sm:px-6 py-5 border-b border-farm-green-50 bg-gradient-to-r from-farm-green-50 to-farm-cream">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-farm-green-500 to-farm-green-700 flex items-center justify-center shadow-md">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-farm-brown-800">
                🌱 Crop Recommendation Engine
              </h2>
              <p className="text-sm text-farm-brown-400 mt-0.5">
                Enter your soil data and get AI-powered crop predictions
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6">
          {/* Info banner */}
          <div className="flex items-start gap-3 bg-farm-green-50 border border-farm-green-200 rounded-xl p-4 mb-6">
            <Info className="w-5 h-5 text-farm-green-600 mt-0.5 shrink-0" />
            <p className="text-sm text-farm-green-800 leading-relaxed">
              Enter your soil test values below. You can get these from your local agricultural office or a soil testing kit. All fields are required.
            </p>
          </div>

          {/* Input Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-6">
            {inputFields.map((field) => (
              <div key={field.key} className="group">
                <label
                  htmlFor={`input-${field.key}`}
                  className="flex items-center gap-2 text-sm font-semibold text-farm-brown-700 mb-2"
                >
                  <field.icon className={`w-4 h-4 text-${field.color}-600`} />
                  {field.label}
                </label>
                <div className="relative">
                  <input
                    id={`input-${field.key}`}
                    type="number"
                    step={field.key === 'ph' ? '0.1' : '1'}
                    value={formData[field.key]}
                    onChange={(e) => handleInputChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className={`w-full px-4 py-3.5 rounded-xl border-2 text-base font-medium transition-all duration-200 bg-farm-cream/50 placeholder:text-farm-brown-300 focus:outline-none ${
                      errors[field.key]
                        ? 'border-red-400 bg-red-50/50 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                        : submitted && formData[field.key]
                        ? 'border-farm-green-400 bg-farm-green-50/30 focus:border-farm-green-500 focus:ring-2 focus:ring-farm-green-200'
                        : 'border-farm-brown-200 focus:border-farm-green-500 focus:ring-2 focus:ring-farm-green-200 hover:border-farm-brown-300'
                    }`}
                    aria-describedby={errors[field.key] ? `error-${field.key}` : `tip-${field.key}`}
                    aria-invalid={!!errors[field.key]}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-farm-brown-400 pointer-events-none">
                    {field.unit}
                  </span>
                </div>
                {errors[field.key] ? (
                  <p
                    id={`error-${field.key}`}
                    className="flex items-center gap-1 mt-1.5 text-xs text-red-600 font-medium"
                    role="alert"
                  >
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors[field.key]}
                  </p>
                ) : (
                  <p
                    id={`tip-${field.key}`}
                    className="mt-1.5 text-[11px] text-farm-brown-400"
                  >
                    {field.tip}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={loading}
              id="btn-get-recommendation"
              className="flex-1 flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-gradient-to-r from-farm-green-600 to-farm-green-700 text-white font-bold text-base shadow-lg shadow-farm-green-200/50 hover:from-farm-green-700 hover:to-farm-green-800 hover:shadow-xl hover:shadow-farm-green-300/50 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing Soil Data...
                </>
              ) : (
                <>
                  <Sprout className="w-5 h-5" />
                  Get Recommendation
                </>
              )}
            </button>

            {submitted && (
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl border-2 border-farm-brown-200 text-farm-brown-600 font-semibold hover:bg-farm-brown-50 transition-all duration-200 active:scale-[0.98]"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
            )}
          </div>
        </form>

        {/* Loading Animation */}
        {loading && (
          <div className="px-5 sm:px-6 pb-6">
            <div className="bg-gradient-to-r from-farm-green-50 to-farm-yellow-50 rounded-xl p-8 text-center animate-pulse-glow">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-farm-green-100 flex items-center justify-center">
                <Leaf className="w-8 h-8 text-farm-green-600 animate-spin-slow" />
              </div>
              <h3 className="font-display text-lg font-bold text-farm-brown-800 mb-2">
                Analyzing Your Soil Data...
              </h3>
              <p className="text-sm text-farm-brown-500">
                Our AI is matching your soil profile with optimal crop databases
              </p>
              <div className="mt-4 w-48 h-2 mx-auto bg-farm-green-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-farm-green-400 to-farm-green-600 rounded-full animate-[scanning_2s_ease-in-out_infinite]" />
              </div>
            </div>
          </div>
        )}

        {/* Results Card */}
        {result && !loading && (
          <div className="px-5 sm:px-6 pb-6 animate-fade-in-up">
            <div className="bg-gradient-to-br from-farm-green-50 via-white to-farm-yellow-50 rounded-2xl border-2 border-farm-green-200 overflow-hidden">
              {/* Result Header */}
              <div className="px-5 py-4 bg-farm-green-600 text-white">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="text-sm font-semibold">
                    Analysis Complete — Best Match Found!
                  </span>
                </div>
              </div>

              <div className="p-5 sm:p-6">
                {/* Main Result */}
                <div className="flex items-start gap-4 mb-5">
                  <div className="text-5xl">{result.emoji}</div>
                  <div className="flex-1">
                    <h3 className="font-display text-2xl font-bold text-farm-brown-900">
                      {result.crop}
                    </h3>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex-1 max-w-[200px] h-3 bg-farm-green-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-farm-green-400 to-farm-green-600 rounded-full transition-all duration-1000"
                          style={{ width: `${result.confidence}%` }}
                        />
                      </div>
                      <span className="text-lg font-bold text-farm-green-700">
                        {result.confidence}% Match
                      </span>
                    </div>
                  </div>
                </div>

                {/* Why this crop */}
                <div className="bg-white rounded-xl p-4 border border-farm-green-100 mb-5">
                  <h4 className="text-sm font-bold text-farm-brown-700 mb-2 flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-farm-green-600" />
                    Why This Crop?
                  </h4>
                  <p className="text-sm text-farm-brown-600 leading-relaxed">
                    {result.explanation}
                  </p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-3 mb-5">
                  {[
                    { label: 'Season', value: result.season, icon: '📅' },
                    { label: 'Water Needs', value: result.waterNeeds, icon: '💧' },
                    { label: 'Soil Type', value: result.soilType, icon: '🏔️' },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="text-center bg-farm-cream rounded-xl p-3 border border-farm-brown-100"
                    >
                      <div className="text-xl mb-1">{stat.icon}</div>
                      <p className="text-[11px] text-farm-brown-400 mb-0.5">
                        {stat.label}
                      </p>
                      <p className="text-xs font-bold text-farm-brown-700">
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Alternatives */}
                <div>
                  <h4 className="text-sm font-bold text-farm-brown-700 mb-3">
                    Other Suitable Crops
                  </h4>
                  <div className="flex gap-3">
                    {result.alternatives.map((alt) => (
                      <div
                        key={alt.name}
                        className="flex-1 bg-white rounded-xl p-3 border border-farm-brown-100 text-center hover:border-farm-green-300 transition-colors"
                      >
                        <div className="text-2xl mb-1">{alt.emoji}</div>
                        <p className="text-sm font-semibold text-farm-brown-700">
                          {alt.name}
                        </p>
                        <p className="text-xs text-farm-green-600 font-medium">
                          {alt.confidence}% match
                        </p>
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
