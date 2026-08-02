'use client';

import { useState } from 'react';
import {
  Leaf,
  Phone,
  Lock,
  User,
  MapPin,
  Eye,
  EyeOff,
  LogIn,
  UserPlus,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [village, setVillage] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!phone || !password) {
      setError('Please enter your phone number and password.');
      return;
    }

    setLoading(true);
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 1000));

    const success = login(phone, password);
    if (!success) {
      setError('Invalid phone number or password. Please try again.');
    }
    setLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !phone || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (phone.length < 10) {
      setError('Please enter a valid 10-digit phone number.');
      return;
    }

    if (password.length < 4) {
      setError('Password must be at least 4 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));

    const success = signup(name, phone, village, password);
    if (!success) {
      setError('This phone number is already registered. Please login instead.');
    }
    setLoading(false);
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setError('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-farm-green-800 via-farm-green-900 to-farm-brown-900 px-4 py-8 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-farm-green-700/20 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-farm-yellow-700/10 rounded-full translate-x-1/3 translate-y-1/3" />
      <div className="absolute top-1/3 right-1/4 w-40 h-40 bg-farm-green-600/10 rounded-full" />

      {/* Logo */}
      <div className="relative z-10 text-center mb-8 animate-fade-in-up">
        <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-farm-green-500 to-farm-green-700 flex items-center justify-center shadow-2xl shadow-farm-green-900/50">
          <Leaf className="w-10 h-10 text-white" strokeWidth={2} />
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-1">
          CropAdvisor
        </h1>
        <p className="text-farm-green-300 text-sm">
          Smart Farming Made Simple
        </p>
      </div>

      {/* Login/Signup Card */}
      <div className="relative z-10 w-full max-w-md animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Tab Switcher */}
          <div className="flex border-b border-farm-brown-100">
            <button
              onClick={() => switchMode()}
              className={`flex-1 flex items-center justify-center gap-2 py-4 text-base font-semibold transition-all duration-200 ${
                mode === 'login'
                  ? 'text-farm-green-700 border-b-3 border-farm-green-600 bg-farm-green-50/50'
                  : 'text-farm-brown-400 hover:text-farm-brown-600'
              }`}
            >
              <LogIn className="w-5 h-5" />
              Login
            </button>
            <button
              onClick={() => switchMode()}
              className={`flex-1 flex items-center justify-center gap-2 py-4 text-base font-semibold transition-all duration-200 ${
                mode === 'signup'
                  ? 'text-farm-green-700 border-b-3 border-farm-green-600 bg-farm-green-50/50'
                  : 'text-farm-brown-400 hover:text-farm-brown-600'
              }`}
            >
              <UserPlus className="w-5 h-5" />
              Sign Up
            </button>
          </div>

          <div className="p-6 sm:p-8">
            {/* Welcome Text */}
            <div className="text-center mb-6">
              <h2 className="font-display text-xl font-bold text-farm-brown-800 mb-1">
                {mode === 'login' ? '👋 Welcome Back!' : '🌱 Create Account'}
              </h2>
              <p className="text-sm text-farm-brown-400">
                {mode === 'login'
                  ? 'Enter your phone number and password'
                  : 'Join thousands of smart farmers'}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl p-4 mb-5 animate-fade-in" role="alert">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={mode === 'login' ? handleLogin : handleSignup}>
              {/* Name (Signup only) */}
              {mode === 'signup' && (
                <div className="mb-4 animate-fade-in">
                  <label htmlFor="auth-name" className="block text-sm font-semibold text-farm-brown-700 mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-farm-brown-400" />
                    <input
                      id="auth-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rajesh Kumar"
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-farm-brown-200 text-base font-medium bg-farm-cream/50 placeholder:text-farm-brown-300 focus:outline-none focus:border-farm-green-500 focus:ring-2 focus:ring-farm-green-200 transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Phone Number */}
              <div className="mb-4">
                <label htmlFor="auth-phone" className="block text-sm font-semibold text-farm-brown-700 mb-2">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-farm-brown-400" />
                  <input
                    id="auth-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="e.g. 9876543210"
                    maxLength={10}
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-farm-brown-200 text-base font-medium bg-farm-cream/50 placeholder:text-farm-brown-300 focus:outline-none focus:border-farm-green-500 focus:ring-2 focus:ring-farm-green-200 transition-all"
                  />
                </div>
              </div>

              {/* Village (Signup only) */}
              {mode === 'signup' && (
                <div className="mb-4 animate-fade-in">
                  <label htmlFor="auth-village" className="block text-sm font-semibold text-farm-brown-700 mb-2">
                    Village / Town
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-farm-brown-400" />
                    <input
                      id="auth-village"
                      type="text"
                      value={village}
                      onChange={(e) => setVillage(e.target.value)}
                      placeholder="e.g. Nashik, Maharashtra"
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-farm-brown-200 text-base font-medium bg-farm-cream/50 placeholder:text-farm-brown-300 focus:outline-none focus:border-farm-green-500 focus:ring-2 focus:ring-farm-green-200 transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Password */}
              <div className="mb-4">
                <label htmlFor="auth-password" className="block text-sm font-semibold text-farm-brown-700 mb-2">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-farm-brown-400" />
                  <input
                    id="auth-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-12 pr-12 py-3.5 rounded-xl border-2 border-farm-brown-200 text-base font-medium bg-farm-cream/50 placeholder:text-farm-brown-300 focus:outline-none focus:border-farm-green-500 focus:ring-2 focus:ring-farm-green-200 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-farm-brown-400 hover:text-farm-brown-600 transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password (Signup only) */}
              {mode === 'signup' && (
                <div className="mb-4 animate-fade-in">
                  <label htmlFor="auth-confirm-password" className="block text-sm font-semibold text-farm-brown-700 mb-2">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-farm-brown-400" />
                    <input
                      id="auth-confirm-password"
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter your password"
                      className={`w-full pl-12 pr-12 py-3.5 rounded-xl border-2 text-base font-medium bg-farm-cream/50 placeholder:text-farm-brown-300 focus:outline-none focus:ring-2 transition-all ${
                        confirmPassword && confirmPassword === password
                          ? 'border-green-400 focus:border-green-500 focus:ring-green-200'
                          : confirmPassword && confirmPassword !== password
                          ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
                          : 'border-farm-brown-200 focus:border-farm-green-500 focus:ring-farm-green-200'
                      }`}
                    />
                    {confirmPassword && confirmPassword === password && (
                      <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                    )}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                id={mode === 'login' ? 'btn-login' : 'btn-signup'}
                className="w-full flex items-center justify-center gap-2.5 px-6 py-4 mt-2 rounded-xl bg-gradient-to-r from-farm-green-600 to-farm-green-700 text-white font-bold text-base shadow-lg shadow-farm-green-200/50 hover:from-farm-green-700 hover:to-farm-green-800 hover:shadow-xl transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {mode === 'login' ? 'Logging in...' : 'Creating account...'}
                  </>
                ) : (
                  <>
                    {mode === 'login' ? (
                      <LogIn className="w-5 h-5" />
                    ) : (
                      <UserPlus className="w-5 h-5" />
                    )}
                    {mode === 'login' ? 'Login' : 'Create Account'}
                  </>
                )}
              </button>
            </form>

            {/* Switch Mode Link */}
            <p className="text-center mt-5 text-sm text-farm-brown-400">
              {mode === 'login' ? (
                <>
                  New farmer?{' '}
                  <button
                    onClick={switchMode}
                    className="text-farm-green-600 font-semibold hover:text-farm-green-700 hover:underline transition-colors"
                  >
                    Create an account
                  </button>
                </>
              ) : (
                <>
                  Already registered?{' '}
                  <button
                    onClick={switchMode}
                    className="text-farm-green-600 font-semibold hover:text-farm-green-700 hover:underline transition-colors"
                  >
                    Login here
                  </button>
                </>
              )}
            </p>
          </div>
        </div>

        {/* Demo Hint */}
        <div className="text-center mt-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <p className="text-farm-green-300/70 text-xs">
            💡 This is a demo. Sign up with any phone number and password to get started.
          </p>
        </div>
      </div>
    </div>
  );
}
