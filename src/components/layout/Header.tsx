'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Locale } from '@/i18n/translations';
import {
  Leaf,
  Menu,
  X,
  Globe,
  ChevronDown,
  Home,
  Sprout,
  FlaskConical,
  ScanLine,
  BookOpen,
  LogOut,
  UserCircle,
} from 'lucide-react';
import Link from 'next/link';

const languages = [
  { code: 'en' as Locale, label: 'English', flag: '🇺🇸' },
  { code: 'mr' as Locale, label: 'मराठी', flag: '🇮🇳' },
  { code: 'hi' as Locale, label: 'हिन्दी', flag: '🇮🇳' },
];

export default function Header() {
  const { user, logout } = useAuth();
  const { t, locale, setLocale } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const selectedLang = languages.find(l => l.code === locale) || languages[0];

  const navLinks = [
    { href: '/', label: t('nav.dashboard'), icon: Home },
    { href: '#crop-recommendation', label: t('nav.predictCrop'), icon: Sprout },
    { href: '#farm-ledger', label: t('nav.farmLedger'), icon: BookOpen },
    { href: '#fertilizer', label: t('nav.fertilizer'), icon: FlaskConical },
    { href: '#disease', label: t('nav.scanDisease'), icon: ScanLine },
  ];

  return (
    <header className="sticky top-0 z-50 glass border-b border-farm-green-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-farm-green-600 to-farm-green-800 flex items-center justify-center shadow-lg group-hover:shadow-farm-green-300/50 transition-shadow duration-300">
              <Leaf className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-display text-lg font-bold text-farm-brown-800 leading-tight">
                {t('app.name')}
              </h1>
              <p className="text-[10px] text-farm-brown-400 font-medium tracking-wider uppercase">
                {t('app.tagline')}
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium text-farm-brown-600 hover:text-farm-green-700 hover:bg-farm-green-50 transition-all duration-200"
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Side: Language + Mobile Menu */}
          <div className="flex items-center gap-2">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-farm-brown-600 hover:bg-farm-green-50 transition-all duration-200 border border-farm-brown-100"
                aria-label={t('nav.selectLanguage')}
                aria-expanded={langDropdownOpen}
              >
                <Globe className="w-4 h-4 text-farm-green-600" />
                <span className="hidden sm:inline">{selectedLang.flag} {selectedLang.label}</span>
                <span className="sm:hidden">{selectedLang.flag}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${langDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-xl border border-farm-green-100 py-1.5 animate-fade-in z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLocale(lang.code);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors duration-150 ${
                        locale === lang.code
                          ? 'bg-farm-green-50 text-farm-green-700 font-semibold'
                          : 'text-farm-brown-600 hover:bg-farm-cream-dark'
                      }`}
                    >
                      <span className="text-lg">{lang.flag}</span>
                      {lang.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* User Info & Logout (Desktop) */}
            {user && (
              <div className="hidden md:flex items-center gap-2 border-l border-farm-brown-100 pl-3 ml-1">
                <div className="flex items-center gap-1.5 text-sm text-farm-brown-600">
                  <UserCircle className="w-5 h-5 text-farm-green-600" />
                  <span className="font-medium max-w-[100px] truncate">{user.name}</span>
                </div>
                <button
                  onClick={logout}
                  className="p-2 rounded-lg text-farm-brown-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
                  aria-label="Logout"
                  title="Logout"
                >
                  <LogOut className="w-4.5 h-4.5" />
                </button>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 rounded-lg text-farm-brown-600 hover:bg-farm-green-50 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? t('nav.closeMenu') : t('nav.openMenu')}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-farm-green-100 bg-white/95 backdrop-blur-sm animate-fade-in">
          <nav className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-medium text-farm-brown-600 hover:text-farm-green-700 hover:bg-farm-green-50 transition-all duration-200 active:scale-[0.98]"
              >
                <link.icon className="w-5 h-5" />
                {link.label}
              </Link>
            ))}

            {/* User Info & Logout (Mobile) */}
            {user && (
              <div className="border-t border-farm-green-100 mx-4 mt-2 pt-3 pb-1">
                <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-farm-cream">
                  <div className="flex items-center gap-2">
                    <UserCircle className="w-5 h-5 text-farm-green-600" />
                    <div>
                      <p className="text-sm font-semibold text-farm-brown-800">{user.name}</p>
                      <p className="text-[11px] text-farm-brown-400">{user.phone}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => { logout(); setMobileMenuOpen(false); }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    {t('common.logout')}
                  </button>
                </div>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
