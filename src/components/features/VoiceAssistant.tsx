'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Mic, MicOff, X, Volume2, Loader2, MessageSquare, Bot, User } from 'lucide-react';

// Web Speech API type declarations
interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  [index: number]: { transcript: string; confidence: number };
}

interface SpeechRecognitionResultList {
  readonly length: number;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
  readonly message: string;
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  onstart: ((this: SpeechRecognitionInstance, ev: Event) => void) | null;
  onresult: ((this: SpeechRecognitionInstance, ev: SpeechRecognitionEvent) => void) | null;
  onerror: ((this: SpeechRecognitionInstance, ev: SpeechRecognitionErrorEvent) => void) | null;
  onend: ((this: SpeechRecognitionInstance, ev: Event) => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

// Mock knowledge base — keyword matching for responses
const knowledgeBase = [
  {
    keywords: ['weather', 'rain', 'temperature', 'forecast', 'barish', 'mausam'],
    response:
      'Today\'s weather: 28°C, partly cloudy with 40% chance of rain. Tomorrow expects heavy rain (80% chance). I recommend delaying any fertilizer application until after the rain passes.',
  },
  {
    keywords: ['tomato', 'price', 'rate', 'bhav'],
    response:
      'Current tomato market price is ₹2,800 per quintal at Nashik Mandi. Prices have risen 8.3% this week due to supply shortage. Good time to sell if your harvest is ready!',
  },
  {
    keywords: ['wheat', 'price', 'rate', 'gehu'],
    response:
      'Wheat is currently trading at ₹2,275 per quintal, down 1.2% this week. The MSP (Minimum Support Price) is ₹2,275. Consider holding your stock if possible — prices usually rise in March-April.',
  },
  {
    keywords: ['rice', 'paddy', 'chawal', 'dhan'],
    response:
      'Basmati rice is at ₹3,850 per quintal, up 2.5%. Non-basmati is at ₹2,100. The export market is strong this season. Kharif sowing should begin in June with the onset of monsoon.',
  },
  {
    keywords: ['soybean', 'soy', 'price'],
    response:
      'Soybean is currently at ₹4,500 per quintal, up 1.8% this week. Market experts predict prices could rise further due to strong international demand. Consider holding if storage is not an issue.',
  },
  {
    keywords: ['cotton', 'kapas', 'price'],
    response:
      'Cotton is trading at ₹6,800 per quintal, up 4.1% this week. Strong demand from textile mills. Current prices are above MSP of ₹6,620. This is a good selling price.',
  },
  {
    keywords: ['fertilizer', 'urea', 'dap', 'khad'],
    response:
      'Current fertilizer prices: Urea ₹267/bag (50kg, subsidized), DAP ₹1,350/bag, MOP ₹870/bag. For exact dosage per acre, use our Fertilizer Calculator tool on the dashboard!',
  },
  {
    keywords: ['disease', 'blight', 'pest', 'rog', 'keet', 'insect', 'leaf', 'yellow'],
    response:
      'For plant diseases, I recommend using our Disease Scanner. Take a clear photo of the affected leaf and upload it. For immediate help: yellow leaves usually indicate nitrogen deficiency — try applying urea at 25g per liter as a foliar spray.',
  },
  {
    keywords: ['crop', 'recommend', 'suggest', 'what', 'grow', 'best', 'kya', 'ugayen'],
    response:
      'For crop recommendations based on your soil, use our Crop Recommendation tool. Enter your soil NPK values and rainfall data. Generally, for Kharif season: rice, maize, soybean. For Rabi: wheat, mustard, gram. For summer: vegetables, watermelon.',
  },
  {
    keywords: ['hello', 'hi', 'hey', 'namaste', 'help'],
    response:
      'Namaste! 🙏 I\'m your CropAdvisor assistant. You can ask me about: weather forecasts, crop prices, fertilizer advice, disease treatment, or which crop to grow. How can I help you today?',
  },
  {
    keywords: ['thank', 'thanks', 'dhanyavad', 'shukriya'],
    response:
      'You\'re welcome! 🌾 Feel free to ask me anytime. Happy farming! If you need more detailed analysis, check out our Crop Recommendation and Fertilizer Calculator tools on the dashboard.',
  },
];

function findResponse(query: string): string {
  const lowerQuery = query.toLowerCase();
  for (const entry of knowledgeBase) {
    if (entry.keywords.some((kw) => lowerQuery.includes(kw))) {
      return entry.response;
    }
  }
  return `I heard: "${query}". I'm still learning! Currently I can help with: weather, crop prices (tomato, wheat, rice, soybean, cotton), fertilizer advice, disease info, and crop recommendations. Try asking about any of these topics!`;
}

export default function VoiceAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: 'Namaste! 🙏 I\'m your CropAdvisor voice assistant. Tap the microphone and ask me anything about weather, prices, or farming advice!',
    },
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const processQueryRef = useRef<(query: string) => void>(() => {});

  useEffect(() => {
    // Check speech API support
    const SR =
      (window as unknown as { SpeechRecognition?: SpeechRecognitionConstructor }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: SpeechRecognitionConstructor }).webkitSpeechRecognition;
    if (!SR) {
      setSpeechSupported(false);
    }
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const speak = useCallback((text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.lang = 'en-IN';
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }, []);

  const processQuery = useCallback(
    async (query: string) => {
      setTranscript('');
      const userMsg: Message = {
        id: Date.now().toString(),
        role: 'user',
        text: query,
      };
      setMessages((prev) => [...prev, userMsg]);
      setIsProcessing(true);

      // Simulate thinking delay
      await new Promise((r) => setTimeout(r, 800));

      const response = findResponse(query);
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: response,
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsProcessing(false);

      // Speak the response
      speak(response);
    },
    [speak]
  );

  // Keep the ref always up to date so the recognition callback never uses a stale closure
  useEffect(() => {
    processQueryRef.current = processQuery;
  }, [processQuery]);

  const startListening = useCallback(() => {
    const SR =
      (window as unknown as { SpeechRecognition?: SpeechRecognitionConstructor }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: SpeechRecognitionConstructor }).webkitSpeechRecognition;
    if (!SR) return;

    // Stop any existing recognition first
    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch { /* ignore */ }
    }

    const recognition = new SR();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-IN';
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript('');
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interimTranscript += result[0].transcript;
        }
      }

      // Always show what the user is saying in real-time
      setTranscript(finalTranscript || interimTranscript);

      // Once we have a final result, process it
      if (finalTranscript) {
        setIsListening(false);
        processQueryRef.current(finalTranscript.trim());
      }
    };

    recognition.onerror = (event) => {
      console.error('[Voice] Recognition error:', event.error);
      setIsListening(false);
      if (event.error === 'not-allowed') {
        setTranscript('⚠️ Microphone access denied. Please allow mic permission.');
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
    } catch (err) {
      console.error('[Voice] Failed to start recognition:', err);
      setIsListening(false);
    }
  }, []);

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (transcript.trim()) {
      processQuery(transcript.trim());
      setTranscript('');
    }
  };

  return (
    <>
      {/* Floating Mic Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 right-4 sm:bottom-8 sm:right-8 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-farm-green-600 to-farm-green-800 text-white shadow-2xl shadow-farm-green-900/30 flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 animate-bounce-gentle"
          aria-label="Open voice assistant"
        >
          <Mic className="w-7 h-7" />
        </button>
      )}

      {/* Voice Assistant Panel */}
      {isOpen && (
        <div className="fixed inset-0 sm:inset-auto sm:bottom-8 sm:right-8 z-50 sm:w-[400px] sm:h-[600px] flex flex-col bg-white sm:rounded-2xl sm:shadow-2xl sm:border sm:border-farm-brown-100 animate-fade-in-up overflow-hidden">
          {/* Header */}
          <div className="px-5 py-4 bg-gradient-to-r from-farm-green-700 to-farm-green-800 text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-sm">Farm Assistant</h3>
                <p className="text-[11px] text-farm-green-200">
                  {isListening ? '🎤 Listening...' : isSpeaking ? '🔊 Speaking...' : '🟢 Online'}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setIsOpen(false);
                stopListening();
                window.speechSynthesis?.cancel();
              }}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Close assistant"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-farm-cream/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    msg.role === 'user'
                      ? 'bg-farm-green-100'
                      : 'bg-farm-brown-100'
                  }`}
                >
                  {msg.role === 'user' ? (
                    <User className="w-4 h-4 text-farm-green-700" />
                  ) : (
                    <Bot className="w-4 h-4 text-farm-brown-600" />
                  )}
                </div>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-farm-green-600 text-white rounded-tr-sm'
                      : 'bg-white border border-farm-brown-100 text-farm-brown-700 rounded-tl-sm shadow-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isProcessing && (
              <div className="flex gap-2.5">
                <div className="w-8 h-8 rounded-full bg-farm-brown-100 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-farm-brown-600" />
                </div>
                <div className="bg-white border border-farm-brown-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-farm-brown-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-farm-brown-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-farm-brown-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <div className="shrink-0 border-t border-farm-brown-100 bg-white p-4">
            {!speechSupported && (
              <p className="text-xs text-farm-yellow-700 bg-farm-yellow-50 rounded-lg p-2 mb-3 text-center">
                ⚠️ Voice not supported in this browser. Use the text input below.
              </p>
            )}

            {/* Listening indicator */}
            {isListening && (
              <div className="flex items-center justify-center gap-2 mb-3 py-2 bg-red-50 rounded-xl border border-red-200">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                <span className="text-sm font-semibold text-red-600">
                  {transcript || 'Listening... speak now'}
                </span>
              </div>
            )}

            <div className="flex gap-2">
              {/* Text Input */}
              <form onSubmit={handleTextSubmit} className="flex-1 flex gap-2">
                <input
                  type="text"
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  placeholder="Type or tap mic to speak..."
                  className="flex-1 px-4 py-3 rounded-xl border-2 border-farm-brown-200 text-sm bg-farm-cream/50 placeholder:text-farm-brown-300 focus:outline-none focus:border-farm-green-500 focus:ring-2 focus:ring-farm-green-200 transition-all"
                />
                <button
                  type="submit"
                  disabled={!transcript.trim()}
                  className="px-4 py-3 rounded-xl bg-farm-green-600 text-white hover:bg-farm-green-700 disabled:opacity-40 transition-all"
                >
                  <MessageSquare className="w-5 h-5" />
                </button>
              </form>

              {/* Mic Button */}
              {speechSupported && (
                <button
                  onClick={isListening ? stopListening : startListening}
                  disabled={isProcessing}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 shrink-0 ${
                    isListening
                      ? 'bg-red-500 text-white shadow-lg shadow-red-200 animate-pulse'
                      : 'bg-farm-green-100 text-farm-green-700 hover:bg-farm-green-200'
                  }`}
                  aria-label={isListening ? 'Stop listening' : 'Start listening'}
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
              )}
            </div>

            {/* Speaker indicator */}
            {isSpeaking && (
              <div className="flex items-center justify-center gap-1.5 mt-2 text-xs text-farm-green-600">
                <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                Speaking response...
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
