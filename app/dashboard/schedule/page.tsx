'use client';

import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Truck,
  ArrowDownLeft,
  Coins,
  HardHat,
  Cog,
  Plus,
  Clock,
  CheckCircle2,
  X,
  Filter,
} from 'lucide-react';

interface MillEvent {
  id: string;
  day: number;
  time: string;
  title: string;
  subtitle: string;
  category: 'dispatch' | 'inward' | 'payment' | 'labour' | 'milling';
  amountOrQty?: string;
  badge: string;
}

const INITIAL_EVENTS: MillEvent[] = [
  // Today: 24 Oct
  {
    id: 'EV-1',
    day: 24,
    time: '08:50 AM',
    title: 'Truck Dispatch: SO-2210',
    subtitle: 'Shree Krishna Traders, Delhi · 20.0 t Basmati',
    category: 'dispatch',
    amountOrQty: '₹13,60,000',
    badge: 'Dispatched',
  },
  {
    id: 'EV-2',
    day: 24,
    time: '10:05 AM',
    title: 'Truck Dispatch: SO-2213',
    subtitle: 'Gupta Kirana Store, Karnal · 3.0 t Retail',
    category: 'dispatch',
    amountOrQty: '₹2,16,000',
    badge: 'Dispatched',
  },
  {
    id: 'EV-3',
    day: 24,
    time: '10:35 AM',
    title: 'Paddy Arrival: TK-4824',
    subtitle: 'Gurmeet Farm, Panipat · 716 bags 1509 Basmati',
    category: 'inward',
    amountOrQty: '35.8 MT',
    badge: 'Unloaded',
  },
  {
    id: 'EV-4',
    day: 24,
    time: '02:00 PM',
    title: 'Farmer RTGS Payment Due',
    subtitle: 'Baldev Singh (Taraori) · Lot L-0848 approval',
    category: 'payment',
    amountOrQty: '₹8,43,200',
    badge: 'Due Today',
  },

  // 26 Oct
  {
    id: 'EV-5',
    day: 26,
    time: '09:00 AM',
    title: 'Truck Slot: Aggarwal Foods',
    subtitle: 'SO-2211 · 30.0 t PR-126 Raw loading bay #2',
    category: 'dispatch',
    amountOrQty: '₹10,35,000',
    badge: 'Loading Slot',
  },
  {
    id: 'EV-6',
    day: 26,
    time: '11:30 AM',
    title: 'Mandi Procurement Arrival',
    subtitle: 'Hapur Mandi · 4 Trucks PR-114 scheduled',
    category: 'inward',
    amountOrQty: '120 MT',
    badge: 'Expected',
  },

  // 27 Oct
  {
    id: 'EV-7',
    day: 27,
    time: '03:00 PM',
    title: 'Farmer Due: Rameshwar Lal',
    subtitle: 'Lot L-0850 purchase settlement RTGS',
    category: 'payment',
    amountOrQty: '₹8,37,800',
    badge: 'Due 27 Oct',
  },

  // 28 Oct (Saturday)
  {
    id: 'EV-8',
    day: 28,
    time: '05:00 PM',
    title: 'Saturday Labour Wages Disbursement',
    subtitle: 'Gang A, B, C Palledar Hamali weekly payout',
    category: 'labour',
    amountOrQty: '₹18,530',
    badge: 'Weekly Payroll',
  },
  {
    id: 'EV-9',
    day: 28,
    time: '08:00 PM',
    title: 'Planned Boiler & Roller Maintenance',
    subtitle: 'Milling Line #1 shutdown & steam check',
    category: 'milling',
    amountOrQty: '6 hr window',
    badge: 'Maintenance',
  },

  // 29 Oct
  {
    id: 'EV-10',
    day: 29,
    time: '11:00 AM',
    title: 'Buyer Due: Aggarwal Foods',
    subtitle: 'Invoice INV-405 payment realization',
    category: 'payment',
    amountOrQty: '₹6,20,000',
    badge: 'Receivable',
  },
];

export default function OperationsSchedulePage() {
  const { accent } = useTheme();

  const [events, setEvents] = useState<MillEvent[]>(INITIAL_EVENTS);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDay, setSelectedDay] = useState<number>(24); // Today: 24 Oct

  // New Event Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDay, setNewEventDay] = useState('26');
  const [newEventTime, setNewEventTime] = useState('10:00 AM');
  const [newEventCategory, setNewEventCategory] = useState<'dispatch' | 'inward' | 'payment' | 'labour' | 'milling'>('dispatch');
  const [newEventSubtitle, setNewEventSubtitle] = useState('');
  const [newEventAmount, setNewEventAmount] = useState('');

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle) return;

    const created: MillEvent = {
      id: `EV-${Date.now()}`,
      day: Number(newEventDay) || 24,
      time: newEventTime,
      title: newEventTitle,
      subtitle: newEventSubtitle || 'Scheduled Mill Operation',
      category: newEventCategory,
      amountOrQty: newEventAmount,
      badge: 'Scheduled',
    };

    setEvents([...events, created]);
    setIsModalOpen(false);
    setNewEventTitle('');
    setNewEventSubtitle('');
    setNewEventAmount('');
  };

  const filteredEvents = events.filter((ev) => {
    if (selectedCategory === 'all') return true;
    return ev.category === selectedCategory;
  });

  const selectedDayEvents = filteredEvents.filter((ev) => ev.day === selectedDay);

  // Month Calendar Days (October 2026: 1 to 31)
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  // Category Color Helpers
  const getBadgeStyle = (cat: MillEvent['category']) => {
    switch (cat) {
      case 'dispatch':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
      case 'inward':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border-amber-200 dark:border-amber-800';
      case 'payment':
        return 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border-rose-200 dark:border-rose-800';
      case 'labour':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 border-blue-200 dark:border-blue-800';
      case 'milling':
        return 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400 border-purple-200 dark:border-purple-800';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  const getDotColor = (cat: MillEvent['category']) => {
    switch (cat) {
      case 'dispatch':
        return 'bg-emerald-500';
      case 'inward':
        return 'bg-amber-500';
      case 'payment':
        return 'bg-rose-500';
      case 'labour':
        return 'bg-blue-500';
      case 'milling':
        return 'bg-purple-500';
      default:
        return 'bg-slate-400';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl animate-in fade-in duration-200">
      {/* 0. Top Action Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
        <div>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            October 2026 · Master Mill Operations Schedule & Logistics Planner
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-transform active:scale-95 hover:opacity-95"
          style={{ backgroundColor: accent?.primary || '#0d9488' }}
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Schedule event</span>
        </button>
      </div>

      {/* 1. TOP 4-CARD OPERATIONS STRIP */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Schedule */}
        <div className="bg-white dark:bg-[#111726] rounded-2xl border border-violet-100/90 dark:border-slate-800 p-5 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Today's Schedule (24 Oct)</span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <Clock className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              4
            </span>
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">events</span>
          </div>
          <p className="text-xs text-teal-700 dark:text-teal-400 font-medium">
            2 Dispatches · 1 Inward · 1 Payment
          </p>
        </div>

        {/* Planned Dispatches */}
        <div className="bg-white dark:bg-[#111726] rounded-2xl border border-violet-100/90 dark:border-slate-800 p-5 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Planned Dispatches</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Truck className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              3
            </span>
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">truck slots</span>
          </div>
          <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
            53.0 MT · Delhi, Jaipur, Kanpur
          </p>
        </div>

        {/* Expected Paddy Inward */}
        <div className="bg-white dark:bg-[#111726] rounded-2xl border border-violet-100/90 dark:border-slate-800 p-5 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Expected Paddy Inward</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <ArrowDownLeft className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              155
            </span>
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">MT</span>
          </div>
          <p className="text-xs text-amber-700 dark:text-amber-400 font-medium">
            5 Trucks from Hapur & Panipat
          </p>
        </div>

        {/* Saturday Wage & Dues */}
        <div className="bg-white dark:bg-[#111726] rounded-2xl border border-violet-100/90 dark:border-slate-800 p-5 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Upcoming Payout</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Coins className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight font-mono">
              ₹18,530
            </span>
          </div>
          <p className="text-xs text-blue-700 dark:text-blue-400 font-medium">
            Saturday 28 Oct · 24 Labourers
          </p>
        </div>
      </div>

      {/* 2. CATEGORY FILTER CHIPS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs font-semibold">
        {[
          { id: 'all', label: 'All Operations' },
          { id: 'dispatch', label: '🟢 Truck Dispatches' },
          { id: 'inward', label: '🟡 Paddy Arrivals' },
          { id: 'payment', label: '🔴 Payment Dues' },
          { id: 'labour', label: '🔵 Labour Wages' },
          { id: 'milling', label: '🟣 Machine Maintenance' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setSelectedCategory(tab.id)}
            className={`px-3.5 py-1.5 rounded-xl border transition-all cursor-pointer whitespace-nowrap shadow-2xs ${
              selectedCategory === tab.id
                ? 'border-slate-900 dark:border-white bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold'
                : 'border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 hover:bg-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 3. CALENDAR GRID + DAY TIMELINE (TWO COLUMNS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Month Calendar Grid (8 Columns) */}
        <div className="lg:col-span-8 bg-white dark:bg-[#111726] rounded-2xl border border-violet-100/90 dark:border-slate-800 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">October 2026</h2>
              <p className="text-xs text-slate-400">Harvest Peak Season & Active Milling Cycles</p>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 text-center text-xs font-bold text-slate-400 dark:text-slate-500 pb-2">
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
          </div>

          {/* Date Grid */}
          <div className="grid grid-cols-7 gap-2">
            {daysInMonth.map((dayNum) => {
              const dayEvents = filteredEvents.filter((e) => e.day === dayNum);
              const isSelected = selectedDay === dayNum;
              const isToday = dayNum === 24;

              return (
                <div
                  key={dayNum}
                  onClick={() => setSelectedDay(dayNum)}
                  className={`min-h-[85px] p-2 rounded-xl border flex flex-col justify-between transition-all cursor-pointer ${
                    isSelected
                      ? 'border-teal-500 bg-teal-50/40 dark:bg-teal-950/20 shadow-2xs ring-1 ring-teal-500'
                      : isToday
                      ? 'border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40'
                      : 'border-slate-100 dark:border-slate-800/80 hover:bg-slate-50/70 dark:hover:bg-slate-800/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-mono font-bold ${
                        isToday
                          ? 'w-5 h-5 rounded-full flex items-center justify-center text-white text-[11px]'
                          : isSelected
                          ? 'text-teal-700 dark:text-teal-300 font-black'
                          : 'text-slate-800 dark:text-slate-300'
                      }`}
                      style={{ backgroundColor: isToday ? accent?.primary || '#0d9488' : undefined }}
                    >
                      {dayNum}
                    </span>

                    {dayEvents.length > 0 && (
                      <span className="text-[10px] font-bold text-slate-400">
                        {dayEvents.length}
                      </span>
                    )}
                  </div>

                  {/* Micro Event Dots / Badges inside the cell */}
                  <div className="space-y-1 pt-1">
                    {dayEvents.slice(0, 2).map((ev) => (
                      <div
                        key={ev.id}
                        className={`text-[9px] px-1 py-0.5 rounded truncate font-medium border ${getBadgeStyle(
                          ev.category
                        )}`}
                      >
                        {ev.title.split(':')[1]?.trim() || ev.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <span className="text-[9px] text-slate-400 font-bold block pl-0.5">
                        +{dayEvents.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Day Timeline Details (4 Columns) */}
        <div className="lg:col-span-4 bg-white dark:bg-[#111726] rounded-2xl border border-violet-100/90 dark:border-slate-800 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                {selectedDay} October Schedule
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                {selectedDay === 24 ? 'Today · Operations Live' : 'Scheduled Logistics'}
              </p>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {selectedDayEvents.length} Tasks
            </span>
          </div>

          {selectedDayEvents.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <CalendarDays className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
              <p className="text-xs text-slate-400">No scheduled operations for {selectedDay} Oct.</p>
              <button
                type="button"
                onClick={() => {
                  setNewEventDay(String(selectedDay));
                  setIsModalOpen(true);
                }}
                className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline"
              >
                + Schedule operation on this date
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedDayEvents.map((ev) => (
                <div
                  key={ev.id}
                  className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/40 space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${getDotColor(ev.category)}`} />
                      <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-200">
                        {ev.time}
                      </span>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getBadgeStyle(
                        ev.category
                      )}`}
                    >
                      {ev.badge}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">{ev.title}</h4>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                      {ev.subtitle}
                    </p>
                  </div>

                  {ev.amountOrQty && (
                    <div className="pt-1.5 border-t border-slate-200/50 dark:border-slate-700/50 flex justify-between items-center text-[11px]">
                      <span className="text-slate-400">Volume / Value:</span>
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                        {ev.amountOrQty}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 4. MODAL: SCHEDULE NEW OPERATION */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#111726] rounded-3xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Schedule New Mill Operation
                </h3>
                <p className="text-[11px] text-slate-400">
                  Plan dispatch truck, paddy arrival, or payment due date
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Operation Category
                </label>
                <select
                  value={newEventCategory}
                  onChange={(e) => setNewEventCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-white outline-none"
                >
                  <option value="dispatch">🟢 Truck Dispatch (Sales Order)</option>
                  <option value="inward">🟡 Paddy Arrival (Mandi Inward)</option>
                  <option value="payment">🔴 Payment Due (Farmer RTGS)</option>
                  <option value="labour">🔵 Labour Wage Payout</option>
                  <option value="milling">🟣 Milling Line Maintenance</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Event Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Truck Slot: Jain Traders (32 MT)"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Day in October *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    required
                    value={newEventDay}
                    onChange={(e) => setNewEventDay(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none font-mono font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Planned Time *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 11:30 AM"
                    value={newEventTime}
                    onChange={(e) => setNewEventTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Description / Subtitle
                </label>
                <input
                  type="text"
                  placeholder="e.g. Loading at Bay #2, Driver assigned"
                  value={newEventSubtitle}
                  onChange={(e) => setNewEventSubtitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Volume / Value (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 32 MT / ₹11,20,000"
                  value={newEventAmount}
                  onChange={(e) => setNewEventAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none font-mono"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-white text-xs font-bold shadow-xs cursor-pointer active:scale-95 transition-transform"
                  style={{ backgroundColor: accent?.primary || '#0d9488' }}
                >
                  Save Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}