'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import {
  Plus,
  Minus,
  Trash2,
  TrendingUp,
  TrendingDown,
  Wallet,
  IndianRupee,
  CalendarDays,
  ChevronDown,
  BookOpen,
  ArrowDownCircle,
  ArrowUpCircle,
  X,
} from 'lucide-react';

interface LedgerEntry {
  id: string;
  type: 'income' | 'expense';
  category: string;
  description: string;
  amount: number;
  date: string;
}



const STORAGE_KEY = 'cropadvisor-farm-ledger';

export default function FarmLedger() {
  const { t } = useLanguage();

  const incomeCategories = [
    { label: t('ledger.cat.soldCrops'), emoji: '🌾' },
    { label: t('ledger.cat.soldVegetables'), emoji: '🥬' },
    { label: t('ledger.cat.soldFruits'), emoji: '🍎' },
    { label: t('ledger.cat.dairyMilk'), emoji: '🥛' },
    { label: t('ledger.cat.govSubsidy'), emoji: '🏛️' },
    { label: t('ledger.cat.otherIncome'), emoji: '💰' },
  ];

  const expenseCategories = [
    { label: t('ledger.cat.seeds'), emoji: '🌱' },
    { label: t('ledger.cat.fertilizer'), emoji: '🧪' },
    { label: t('ledger.cat.pesticide'), emoji: '🐛' },
    { label: t('ledger.cat.tractorEquip'), emoji: '🚜' },
    { label: t('ledger.cat.labourWorkers'), emoji: '👷' },
    { label: t('ledger.cat.waterIrrigation'), emoji: '💧' },
    { label: t('ledger.cat.transport'), emoji: '🚛' },
    { label: t('ledger.cat.otherExpense'), emoji: '📦' },
  ];

  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState<'income' | 'expense'>('income');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setEntries(JSON.parse(saved));
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  const totalIncome = entries
    .filter((e) => e.type === 'income')
    .reduce((sum, e) => sum + e.amount, 0);

  const totalExpense = entries
    .filter((e) => e.type === 'expense')
    .reduce((sum, e) => sum + e.amount, 0);

  const profit = totalIncome - totalExpense;

  const filteredEntries = entries
    .filter((e) => filter === 'all' || e.type === filter)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleAdd = () => {
    if (!category || !amount || parseFloat(amount) <= 0) return;

    const newEntry: LedgerEntry = {
      id: Date.now().toString(),
      type: formType,
      category,
      description: description.trim(),
      amount: parseFloat(amount),
      date,
    };

    setEntries((prev) => [newEntry, ...prev]);
    // Reset form
    setCategory('');
    setDescription('');
    setAmount('');
    setDate(new Date().toISOString().split('T')[0]);
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
    setDeleteConfirm(null);
  };

  const getCategoryEmoji = (categoryName: string, type: 'income' | 'expense') => {
    const list = type === 'income' ? incomeCategories : expenseCategories;
    return list.find((c) => c.label === categoryName)?.emoji || '📋';
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('en-IN');
  };

  const currentCategories = formType === 'income' ? incomeCategories : expenseCategories;

  return (
    <section id="farm-ledger" className="scroll-mt-20">
      <div className="bg-white rounded-2xl border border-farm-brown-100 shadow-sm overflow-hidden">
        {/* Section Header */}
        <div className="px-5 sm:px-6 py-5 border-b border-farm-brown-50 bg-gradient-to-r from-farm-yellow-50 to-farm-cream">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-farm-yellow-500 to-farm-yellow-700 flex items-center justify-center shadow-md">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-display text-xl font-bold text-farm-brown-800">
                  {t('ledger.title')}
                </h2>
                <p className="text-sm text-farm-brown-400 mt-0.5">
                  {t('ledger.subtitle')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="p-5 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            {/* Total Income */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <ArrowDownCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-700">
                  {t('ledger.totalIncome')}
                </span>
              </div>
              <div className="flex items-center text-2xl font-bold text-green-800">
                <IndianRupee className="w-5 h-5" />
                {formatCurrency(totalIncome)}
              </div>
            </div>

            {/* Total Expense */}
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 border border-red-200">
              <div className="flex items-center gap-2 mb-2">
                <ArrowUpCircle className="w-5 h-5 text-red-500" />
                <span className="text-sm font-medium text-red-600">
                  {t('ledger.totalExpense')}
                </span>
              </div>
              <div className="flex items-center text-2xl font-bold text-red-700">
                <IndianRupee className="w-5 h-5" />
                {formatCurrency(totalExpense)}
              </div>
            </div>

            {/* Profit / Loss */}
            <div
              className={`rounded-xl p-4 border ${
                profit >= 0
                  ? 'bg-gradient-to-br from-farm-green-50 to-farm-green-100 border-farm-green-200'
                  : 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Wallet className="w-5 h-5 text-farm-brown-600" />
                <span className="text-sm font-medium text-farm-brown-600">
                  {profit >= 0 ? t('ledger.profit') : t('ledger.loss')}
                </span>
              </div>
              <div
                className={`flex items-center text-2xl font-bold ${
                  profit >= 0 ? 'text-farm-green-800' : 'text-orange-700'
                }`}
              >
                {profit >= 0 ? (
                  <TrendingUp className="w-5 h-5 mr-1" />
                ) : (
                  <TrendingDown className="w-5 h-5 mr-1" />
                )}
                <IndianRupee className="w-5 h-5" />
                {formatCurrency(Math.abs(profit))}
              </div>
            </div>
          </div>

          {/* Add Entry Button */}
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              id="btn-add-ledger-entry"
              className="w-full flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-gradient-to-r from-farm-green-600 to-farm-green-700 text-white font-bold text-base shadow-lg shadow-farm-green-200/50 hover:from-farm-green-700 hover:to-farm-green-800 hover:shadow-xl transition-all duration-300 active:scale-[0.98] mb-6"
            >
              <Plus className="w-5 h-5" />
              {t('ledger.addEntry')}
            </button>
          )}

          {/* Add Entry Form */}
          {showForm && (
            <div className="bg-farm-cream rounded-xl border border-farm-brown-200 p-5 mb-6 animate-fade-in-up">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-lg font-bold text-farm-brown-800">
                  {t('ledger.addEntryTitle')}
                </h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-2 rounded-lg hover:bg-farm-brown-100 transition-colors"
                  aria-label="Close form"
                >
                  <X className="w-5 h-5 text-farm-brown-500" />
                </button>
              </div>

              {/* Type Toggle */}
              <div className="flex gap-2 mb-5">
                <button
                  onClick={() => { setFormType('income'); setCategory(''); }}
                  className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-base transition-all duration-200 active:scale-[0.98] ${
                    formType === 'income'
                      ? 'bg-green-600 text-white shadow-md'
                      : 'bg-white border-2 border-farm-brown-200 text-farm-brown-500 hover:border-green-400'
                  }`}
                >
                  <Plus className="w-5 h-5" />
                  {t('ledger.income')}
                </button>
                <button
                  onClick={() => { setFormType('expense'); setCategory(''); }}
                  className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-base transition-all duration-200 active:scale-[0.98] ${
                    formType === 'expense'
                      ? 'bg-red-500 text-white shadow-md'
                      : 'bg-white border-2 border-farm-brown-200 text-farm-brown-500 hover:border-red-400'
                  }`}
                >
                  <Minus className="w-5 h-5" />
                  {t('ledger.expense')}
                </button>
              </div>

              {/* Category Selection */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-farm-brown-700 mb-2">
                  {t('ledger.category')}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {currentCategories.map((cat) => (
                    <button
                      key={cat.label}
                      type="button"
                      onClick={() => setCategory(cat.label)}
                      className={`flex items-center gap-2 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 active:scale-[0.97] ${
                        category === cat.label
                          ? formType === 'income'
                            ? 'bg-green-100 border-2 border-green-500 text-green-800'
                            : 'bg-red-100 border-2 border-red-400 text-red-700'
                          : 'bg-white border-2 border-farm-brown-100 text-farm-brown-600 hover:border-farm-brown-300'
                      }`}
                    >
                      <span className="text-lg">{cat.emoji}</span>
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount */}
              <div className="mb-4">
                <label
                  htmlFor="ledger-amount"
                  className="block text-sm font-semibold text-farm-brown-700 mb-2"
                >
                  {t('ledger.amount')}
                </label>
                <div className="relative">
                  <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-farm-brown-400" />
                  <input
                    id="ledger-amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="e.g. 5000"
                    min="1"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border-2 border-farm-brown-200 text-lg font-bold bg-white placeholder:text-farm-brown-300 focus:outline-none focus:border-farm-green-500 focus:ring-2 focus:ring-farm-green-200 transition-all"
                  />
                </div>
              </div>

              {/* Description (optional) */}
              <div className="mb-4">
                <label
                  htmlFor="ledger-description"
                  className="block text-sm font-semibold text-farm-brown-700 mb-2"
                >
                  {t('ledger.note')}
                </label>
                <input
                  id="ledger-description"
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t('ledger.notePlaceholder')}
                  className="w-full px-4 py-3.5 rounded-xl border-2 border-farm-brown-200 text-base bg-white placeholder:text-farm-brown-300 focus:outline-none focus:border-farm-green-500 focus:ring-2 focus:ring-farm-green-200 transition-all"
                />
              </div>

              {/* Date */}
              <div className="mb-5">
                <label
                  htmlFor="ledger-date"
                  className="block text-sm font-semibold text-farm-brown-700 mb-2"
                >
                  {t('ledger.date')}
                </label>
                <div className="relative">
                  <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-farm-brown-400 pointer-events-none" />
                  <input
                    id="ledger-date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border-2 border-farm-brown-200 text-base bg-white focus:outline-none focus:border-farm-green-500 focus:ring-2 focus:ring-farm-green-200 transition-all"
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                onClick={handleAdd}
                disabled={!category || !amount || parseFloat(amount) <= 0}
                className={`w-full flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl font-bold text-base shadow-lg transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${
                  formType === 'income'
                    ? 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800'
                    : 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700'
                }`}
              >
                <Plus className="w-5 h-5" />
                {formType === 'income' ? t('ledger.addIncome') : t('ledger.addExpense')}
              </button>
            </div>
          )}

          {/* Filter Tabs */}
          {entries.length > 0 && (
            <div className="flex gap-2 mb-4">
              {(['all', 'income', 'expense'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    filter === f
                      ? 'bg-farm-brown-800 text-white'
                      : 'bg-farm-cream border border-farm-brown-200 text-farm-brown-500 hover:bg-farm-brown-50'
                  }`}
                >
                  {f === 'all' ? t('ledger.all') : f === 'income' ? t('ledger.incomeFilter') : t('ledger.expenseFilter')}
                </button>
              ))}
            </div>
          )}

          {/* Entries List */}
          {filteredEntries.length === 0 ? (
            <div className="text-center py-10">
              <div className="text-5xl mb-3">📒</div>
              <h3 className="font-display text-lg font-bold text-farm-brown-700 mb-1">
                {t('ledger.noEntries')}
              </h3>
              <p className="text-sm text-farm-brown-400">
                {t('ledger.noEntriesSubtitle')}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between bg-farm-cream/60 hover:bg-farm-cream rounded-xl p-4 border border-farm-brown-100 transition-colors duration-150 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-2xl shrink-0">
                      {getCategoryEmoji(entry.category, entry.type)}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-farm-brown-800 truncate">
                        {entry.category}
                      </p>
                      {entry.description && (
                        <p className="text-xs text-farm-brown-400 truncate">
                          {entry.description}
                        </p>
                      )}
                      <p className="text-[11px] text-farm-brown-300 mt-0.5 flex items-center gap-1">
                        <CalendarDays className="w-3 h-3" />
                        {new Date(entry.date).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className={`flex items-center text-base font-bold ${
                        entry.type === 'income' ? 'text-green-700' : 'text-red-600'
                      }`}
                    >
                      {entry.type === 'income' ? '+' : '−'}
                      <IndianRupee className="w-4 h-4" />
                      {formatCurrency(entry.amount)}
                    </span>

                    {/* Delete button */}
                    {deleteConfirm === entry.id ? (
                      <div className="flex items-center gap-1 animate-fade-in">
                        <button
                          onClick={() => handleDelete(entry.id)}
                          className="px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-bold hover:bg-red-600 transition-colors"
                        >
                          {t('common.delete')}
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="px-3 py-1.5 rounded-lg bg-farm-brown-200 text-farm-brown-600 text-xs font-bold hover:bg-farm-brown-300 transition-colors"
                        >
                          {t('common.cancel')}
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(entry.id)}
                        className="p-2 rounded-lg text-farm-brown-300 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                        aria-label={`Delete ${entry.category} entry`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
