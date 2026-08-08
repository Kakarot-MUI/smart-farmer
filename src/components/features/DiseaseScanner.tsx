'use client';

import { useState, useRef, useCallback, type DragEvent } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import {
  Camera,
  Upload,
  ScanLine,
  X,
  Leaf,
  Bug,
  ShieldCheck,
  Loader2,
  ImageIcon,
  FlaskConical,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';

interface Disease {
  name: string;
  confidence: number;
  severity: 'Low' | 'Moderate' | 'High' | 'Critical';
  emoji: string;
  description: string;
  organicTreatments: string[];
  chemicalTreatments: string[];
  prevention: string;
}

const mockDiseases: Disease[] = [
  {
    name: 'Tomato Early Blight',
    confidence: 94,
    severity: 'Moderate',
    emoji: '🍅',
    description:
      'Caused by the fungus Alternaria solani. Dark brown spots with concentric rings appear on lower, older leaves first. Can cause significant yield loss if untreated.',
    organicTreatments: [
      '🌿 Neem oil spray — 5ml per liter of water, spray every 7 days',
      '🦠 Trichoderma viride bio-fungicide — 5g per liter',
      '🔥 Remove and burn all infected leaves immediately',
      '🌾 Apply thick mulch around the base to prevent soil splash',
    ],
    chemicalTreatments: [
      '💊 Mancozeb 75% WP — 2.5g per liter, spray at 10-day intervals',
      '💊 Chlorothalonil 75% WP — 2g per liter at 7-day intervals',
      '💊 Copper Oxychloride 50% WP — 3g per liter as preventive spray',
    ],
    prevention:
      'Rotate crops every season. Avoid overhead watering. Ensure proper spacing (60cm) between plants for airflow. Use disease-resistant varieties like Arka Rakshak.',
  },
  {
    name: 'Rice Blast Disease',
    confidence: 89,
    severity: 'High',
    emoji: '🌾',
    description:
      'Caused by the fungus Magnaporthe oryzae. Diamond-shaped lesions with gray centers appear on leaves. Can destroy entire crop in severe cases.',
    organicTreatments: [
      '🌿 Pseudomonas fluorescens — 10g per liter as foliar spray',
      '🦠 Trichoderma harzianum — apply to soil before transplanting',
      '🔥 Destroy infected crop residue after harvest',
      '💧 Maintain proper water level (2-3cm) in paddy fields',
    ],
    chemicalTreatments: [
      '💊 Tricyclazole 75% WP — 0.6g per liter, spray at first symptoms',
      '💊 Isoprothiolane 40% EC — 1.5ml per liter',
      '💊 Carbendazim 50% WP — 1g per liter as preventive',
    ],
    prevention:
      'Use certified blast-resistant varieties. Avoid excess nitrogen fertilizer. Maintain balanced NPK nutrition. Split nitrogen application into 3 doses.',
  },
  {
    name: 'Powdery Mildew on Cucumber',
    confidence: 91,
    severity: 'Moderate',
    emoji: '🥒',
    description:
      'Caused by Podosphaera xanthii. White powdery patches appear on upper leaf surfaces. Reduces photosynthesis and fruit quality.',
    organicTreatments: [
      '🥛 Milk spray — mix 1 part milk to 9 parts water, spray weekly',
      '🌿 Neem oil — 3ml per liter with a drop of liquid soap',
      '🧄 Garlic extract spray — blend 10 cloves in 1 liter water, strain and spray',
      '✂️ Prune heavily infected leaves to improve airflow',
    ],
    chemicalTreatments: [
      '💊 Sulphur 80% WP — 3g per liter, avoid in temperatures above 35°C',
      '💊 Hexaconazole 5% EC — 2ml per liter at 15-day intervals',
      '💊 Dinocap 48% EC — 1ml per liter as early-stage spray',
    ],
    prevention:
      'Plant in areas with good sunlight and airflow. Avoid evening watering. Choose resistant varieties. Apply potassium-rich fertilizers to boost plant immunity.',
  },
];

export default function DiseaseScanner() {
  const { t } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [result, setResult] = useState<Disease | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showOrganic, setShowOrganic] = useState(true);
  const [showChemical, setShowChemical] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;
    setFileName(file.name);
    setResult(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleScan = async () => {
    if (!selectedImage) return;
    setScanning(true);
    setResult(null);
    setScanProgress(0);

    // Simulate scanning with progress
    for (let i = 0; i <= 100; i += 2) {
      await new Promise((r) => setTimeout(r, 50));
      setScanProgress(i);
    }

    // Pick a random mock disease
    const randomDisease = mockDiseases[Math.floor(Math.random() * mockDiseases.length)];
    setResult(randomDisease);
    setScanning(false);
  };

  const handleReset = () => {
    setSelectedImage(null);
    setFileName('');
    setResult(null);
    setScanning(false);
    setScanProgress(0);
  };

  const severityColor = (severity: string) => {
    switch (severity) {
      case 'Low': return 'bg-green-100 text-green-700 border-green-300';
      case 'Moderate': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'High': return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'Critical': return 'bg-red-100 text-red-700 border-red-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  return (
    <section id="disease" className="scroll-mt-20">
      <div className="bg-white rounded-2xl border border-farm-brown-100 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-5 sm:px-6 py-5 border-b border-farm-brown-50 bg-gradient-to-r from-farm-brown-50 to-farm-cream">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-farm-brown-400 to-farm-brown-600 flex items-center justify-center shadow-md">
              <ScanLine className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-farm-brown-800">
                {t('disease.title')}
              </h2>
              <p className="text-sm text-farm-brown-400 mt-0.5">
                {t('disease.subtitle')}
              </p>
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          {/* Upload Zone */}
          {!selectedImage && (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`relative border-3 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all duration-300 ${
                isDragOver
                  ? 'border-farm-green-500 bg-farm-green-50 scale-[1.01]'
                  : 'border-farm-brown-200 bg-farm-cream/50 hover:border-farm-brown-300 hover:bg-farm-cream'
              }`}
            >
              <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-farm-brown-100 flex items-center justify-center">
                <ImageIcon className="w-10 h-10 text-farm-brown-400" />
              </div>
              <h3 className="font-display text-lg font-bold text-farm-brown-700 mb-2">
                {isDragOver ? t('disease.dropHere') : t('disease.uploadPhoto')}
              </h3>
              <p className="text-sm text-farm-brown-400 mb-6 max-w-md mx-auto">
                {t('disease.uploadHint')}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {/* Choose File */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-farm-green-600 to-farm-green-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 active:scale-[0.98]"
                >
                  <Upload className="w-5 h-5" />
                  {t('disease.chooseFile')}
                </button>

                {/* Camera Capture */}
                <button
                  onClick={() => cameraInputRef.current?.click()}
                  className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border-2 border-farm-brown-200 text-farm-brown-600 font-semibold hover:bg-farm-brown-50 transition-all duration-200 active:scale-[0.98]"
                >
                  <Camera className="w-5 h-5" />
                  {t('disease.takePhoto')}
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFile(file);
                }}
                className="hidden"
                aria-label="Upload leaf image"
              />
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFile(file);
                }}
                className="hidden"
                aria-label="Capture leaf photo"
              />
            </div>
          )}

          {/* Image Preview + Scan */}
          {selectedImage && !result && (
            <div className="animate-fade-in-up">
              <div className="relative rounded-2xl overflow-hidden mb-5 bg-black/5">
                {/* Image */}
                <img
                  src={selectedImage}
                  alt="Uploaded leaf"
                  className="w-full max-h-[400px] object-contain mx-auto"
                />

                {/* Scanning Overlay */}
                {scanning && (
                  <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center">
                    <div className="absolute inset-x-0 top-0 h-1 bg-farm-green-200">
                      <div
                        className="h-full bg-farm-green-500 transition-all duration-100"
                        style={{ width: `${scanProgress}%` }}
                      />
                    </div>
                    {/* Scan line animation */}
                    <div className="absolute inset-x-4 h-0.5 bg-farm-green-400 shadow-[0_0_15px_rgba(76,175,80,0.8)] animate-scanning" />
                    <div className="bg-black/60 rounded-xl px-6 py-4 text-center">
                      <Loader2 className="w-8 h-8 text-farm-green-400 animate-spin mx-auto mb-2" />
                      <p className="text-white font-bold text-sm">
                        {t('disease.analyzing')} {scanProgress}%
                      </p>
                      <p className="text-white/60 text-xs mt-1">
                        {t('disease.checkingPatterns')}
                      </p>
                    </div>
                  </div>
                )}

                {/* Remove button */}
                {!scanning && (
                  <button
                    onClick={handleReset}
                    className="absolute top-3 right-3 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                    aria-label="Remove image"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* File info + Scan button */}
              {!scanning && (
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 flex items-center gap-2 px-4 py-3 rounded-xl bg-farm-cream border border-farm-brown-100">
                    <ImageIcon className="w-4 h-4 text-farm-brown-400" />
                    <span className="text-sm text-farm-brown-600 truncate">{fileName}</span>
                  </div>
                  <button
                    onClick={handleScan}
                    className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-farm-green-600 to-farm-green-700 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 active:scale-[0.98]"
                  >
                    <ScanLine className="w-5 h-5" />
                    {t('disease.scanBtn')}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Results */}
          {result && (
            <div className="animate-fade-in-up">
              {/* Image thumbnail + Reset */}
              <div className="flex items-center gap-3 mb-5">
                <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-farm-brown-100 shrink-0">
                  <img src={selectedImage!} alt="Scanned leaf" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-farm-brown-600 truncate">{fileName}</p>
                  <p className="text-xs text-farm-brown-400">{t('disease.scanComplete')}</p>
                </div>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-farm-brown-200 text-sm font-medium text-farm-brown-500 hover:bg-farm-brown-50 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  {t('disease.newScan')}
                </button>
              </div>

              {/* Diagnosis Card */}
              <div className="bg-gradient-to-br from-red-50 via-white to-farm-yellow-50 rounded-2xl border-2 border-red-200 overflow-hidden">
                {/* Diagnosis Header */}
                <div className="px-5 py-4 bg-red-500 text-white flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  <span className="font-bold text-sm">{t('disease.detected')}</span>
                  <span className={`ml-auto px-2.5 py-0.5 rounded-full text-xs font-bold border ${severityColor(result.severity)}`}>
                    {result.severity} {t('disease.severity')}
                  </span>
                </div>

                <div className="p-5 sm:p-6">
                  {/* Disease Name + Confidence */}
                  <div className="flex items-start gap-4 mb-5">
                    <div className="text-5xl">{result.emoji}</div>
                    <div className="flex-1">
                      <h3 className="font-display text-2xl font-bold text-farm-brown-900">
                        {result.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex-1 max-w-[200px] h-3 bg-red-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-red-400 to-red-600 rounded-full transition-all duration-1000"
                            style={{ width: `${result.confidence}%` }}
                          />
                        </div>
                        <span className="text-lg font-bold text-red-600">
                          {result.confidence}% Match
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="bg-white rounded-xl p-4 border border-farm-brown-100 mb-5">
                    <div className="flex items-center gap-2 mb-2">
                      <Bug className="w-4 h-4 text-red-500" />
                      <h4 className="text-sm font-bold text-farm-brown-700">{t('disease.aboutDisease')}</h4>
                    </div>
                    <p className="text-sm text-farm-brown-600 leading-relaxed">{result.description}</p>
                  </div>

                  {/* Organic Treatments */}
                  <div className="mb-4">
                    <button
                      onClick={() => setShowOrganic(!showOrganic)}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-green-50 border border-green-200 hover:bg-green-100 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Leaf className="w-5 h-5 text-green-600" />
                        <span className="font-bold text-green-800">{t('disease.organicTreatments')}</span>
                      </div>
                      {showOrganic ? <ChevronUp className="w-4 h-4 text-green-600" /> : <ChevronDown className="w-4 h-4 text-green-600" />}
                    </button>
                    {showOrganic && (
                      <div className="mt-2 space-y-2 animate-fade-in">
                        {result.organicTreatments.map((t, i) => (
                          <div key={i} className="flex items-start gap-2 px-4 py-2.5 rounded-lg bg-green-50/50">
                            <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                            <p className="text-sm text-farm-brown-700">{t}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Chemical Treatments */}
                  <div className="mb-5">
                    <button
                      onClick={() => setShowChemical(!showChemical)}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <FlaskConical className="w-5 h-5 text-blue-600" />
                        <span className="font-bold text-blue-800">{t('disease.chemicalTreatments')}</span>
                      </div>
                      {showChemical ? <ChevronUp className="w-4 h-4 text-blue-600" /> : <ChevronDown className="w-4 h-4 text-blue-600" />}
                    </button>
                    {showChemical && (
                      <div className="mt-2 space-y-2 animate-fade-in">
                        {result.chemicalTreatments.map((t, i) => (
                          <div key={i} className="flex items-start gap-2 px-4 py-2.5 rounded-lg bg-blue-50/50">
                            <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                            <p className="text-sm text-farm-brown-700">{t}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Prevention */}
                  <div className="bg-farm-yellow-50 rounded-xl p-4 border border-farm-yellow-200">
                    <div className="flex items-center gap-2 mb-2">
                      <ShieldCheck className="w-5 h-5 text-farm-yellow-700" />
                      <h4 className="font-bold text-farm-yellow-800 text-sm">{t('disease.preventionTips')}</h4>
                    </div>
                    <p className="text-sm text-farm-brown-600 leading-relaxed">{result.prevention}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
