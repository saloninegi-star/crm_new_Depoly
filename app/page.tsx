'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Wheat,
  Truck,
  Scale,
  Warehouse,
  Cog,
  Package,
  Send,
  Calculator,
  Users,
  CheckCircle2,
  ChevronDown,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Clock,
  Layers,
  ArrowUpRight,
  Lock,
  Menu,
  X,
  FileText,
  Activity,
  Cpu,
  Droplets,
  HardHat,
  Banknote,
  Check,
} from 'lucide-react';

const FAQS = [
  {
    question: 'How does the weighbridge integration with automated moisture deduction work?',
    answer:
      'The platform captures gross weight from the weighbridge sensor directly. When moisture content exceeds the standard 14.0% base, our auto-calc formula automatically computes and applies the deduction in kilograms before transferring the lot to Godown stock.',
  },
  {
    question: 'How does the FIFO (First-In, First-Out) queue improve milling yield?',
    answer:
      'Paddy lots that arrive earlier are prioritized for machine lines to prevent moisture loss, yellowing, and breakage during storage. The Godown In-charge can monitor queue priority ranks and issue lots directly to milling shifts.',
  },
  {
    question: 'Are staff roles restricted from viewing confidential profit and banking data?',
    answer:
      'Yes. Gate Guards, Weighbridge Operators, Godown In-charges, and HR Managers only have access to their operational desks. Sensitive financial statements, bank RTGS balances, and net profit margins are strictly reserved for the Mill Owner/SuperAdmin.',
  },
  {
    question: 'How are Palledar and hamali contractor wages calculated?',
    answer:
      'The HR & Labour desk tracks daily piece-rate handling per bag (e.g., ₹4.50 for unloading and ₹5.00 for loading). Multiplying total bags handled by the gang rate computes daily wages and syncs directly into the mill running expenses ledger.',
  },
  {
    question: 'Can the system be accessed using mobile OTP without remembering passwords?',
    answer:
      'Yes. Our unified login system lets authorized personnel simply enter their registered 10-digit mobile number to receive and verify a secure 6-digit OTP, automatically directing them to their specific workspace.',
  },
  {
    question: 'Does the sales module auto-generate Bilty and Lorry Receipts (LR)?',
    answer:
      'Yes. When a sales order is dispatched, the system reserves stock from the finished inventory, records vehicle tare/gross weighment, and generates printable LR and Loading Slips with full batch traceability.',
  },
];

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#f8faf9] text-slate-800 font-sans selection:bg-emerald-500 selection:text-white scroll-smooth">
      
      {/* ========================================================= */}
      {/* NAVBAR */}
      {/* ========================================================= */}
      <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
              <Wheat className="w-5 h-5" />
            </div>
            <div>
              <span className="font-black text-base tracking-tight text-slate-900 block leading-tight">
                KOGNOS
              </span>
              <span className="text-[10px] text-emerald-700 font-bold tracking-wider uppercase block">
                Rice Mill ERP
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-600">
            <a href="#features" className="hover:text-emerald-600 transition-colors">Features</a>
            <a href="#pipeline" className="hover:text-emerald-600 transition-colors">Process Flow</a>
            <a href="#roles" className="hover:text-emerald-600 transition-colors">Role Desks</a>
            <a href="#faq" className="hover:text-emerald-600 transition-colors">FAQ</a>
          </nav>

          {/* Top Right Login CTA */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/login"
              className="px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/25 flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Login to Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-200 bg-white px-4 py-4 space-y-3 animate-in fade-in slide-in-from-top-2">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-xs font-semibold text-slate-700 py-1"
            >
              Features
            </a>
            <a
              href="#pipeline"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-xs font-semibold text-slate-700 py-1"
            >
              Process Flow
            </a>
            <a
              href="#roles"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-xs font-semibold text-slate-700 py-1"
            >
              Role Desks
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-xs font-semibold text-slate-700 py-1"
            >
              FAQ
            </a>
            <div className="pt-2 border-t border-slate-100">
              <Link
                href="/login"
                className="w-full py-2.5 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Login to Portal</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ========================================================= */}
      {/* HERO SECTION */}
      {/* ========================================================= */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24">
        <div className="absolute inset-0 pointer-events-none -z-10">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-200/40 rounded-full blur-3xl" />
          <div className="absolute top-60 -left-20 w-80 h-80 bg-teal-200/30 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Autonomous Agro-Tech Milling ERP</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto leading-[1.15]">
            Run Your Entire Rice Mill from{' '}
            <span className="text-emerald-600">Gate Inward</span> to{' '}
            <span className="text-emerald-600">Accounts Ledger</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
            Eliminate operational leakages with real-time weighbridge IoT integration, FIFO paddy godown queue, 60–65% milling recovery tracking, and complete accounts governance.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <span>Launch ERP System</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#pipeline"
              className="w-full sm:w-auto px-7 py-3.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs"
            >
              <span>View Mill Flowchart</span>
            </a>
          </div>

          {/* Quick Metrics Strip */}
          <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-0.5">
              <span className="text-xs text-slate-400 font-semibold">Today Paddy Inward</span>
              <div className="text-2xl font-black text-slate-900">428.5 MT</div>
              <div className="text-[11px] text-emerald-600 font-bold">+14% vs Target</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-0.5">
              <span className="text-xs text-slate-400 font-semibold">Head Rice Yield</span>
              <div className="text-2xl font-black text-emerald-600">64.8%</div>
              <div className="text-[11px] text-slate-400">Target 60-65% OK</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-0.5">
              <span className="text-xs text-slate-400 font-semibold">FIFO Godown Stock</span>
              <div className="text-2xl font-black text-blue-600">2,410 MT</div>
              <div className="text-[11px] text-slate-400">3 Godowns Active</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-0.5">
              <span className="text-xs text-slate-400 font-semibold">Sales Dispatches</span>
              <div className="text-2xl font-black text-purple-700">₹42.8 Lakh</div>
              <div className="text-[11px] text-emerald-600 font-bold">12 Trucks Cleared</div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION: CORE FEATURES (ID="FEATURES" FIXED)             */}
      {/* ========================================================= */}
      <section id="features" className="py-20 bg-white border-t border-slate-200/80 scroll-mt-18">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
              Enterprise Milling Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Engineered Exclusively for Modern Rice Mills
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Every feature is built directly around real grain mandi arrivals, boiler operations, automated weighment calibrations, and cash-book reconciliation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-7 rounded-3xl bg-slate-50 border border-slate-100 space-y-4 hover:border-emerald-500/50 hover:bg-white hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shadow-xs">
                <Scale className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-slate-900">Digital Weighbridge Integration</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Direct electronic sensor capture for Gross and Tare weights. Prevents manual slip tampering and automatically syncs net weight into purchase records.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-semibold text-emerald-700">
                <span>Auto Zero & Gross Capture</span>
                <Check className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Feature 2 */}
            <div className="p-7 rounded-3xl bg-slate-50 border border-slate-100 space-y-4 hover:border-blue-500/50 hover:bg-white hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center shadow-xs">
                <Droplets className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-slate-900">Smart Moisture Deduction Engine</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Paddy arrivals above the standard 14.0% moisture base automatically compute exact kilogram deductions to safeguard your milling recovery margins.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-semibold text-blue-700">
                <span>Standard 14.0% Base Cut</span>
                <Check className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Feature 3 */}
            <div className="p-7 rounded-3xl bg-slate-50 border border-slate-100 space-y-4 hover:border-amber-500/50 hover:bg-white hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shadow-xs">
                <Warehouse className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-slate-900">FIFO Godown Stacking & Lots</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  First-In, First-Out lot queues across Basmati, PR, and Sharbati chambers prevent grain aging, yellowing, and optimize milling shift intake.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-semibold text-amber-700">
                <span>Milling Queue Prioritization</span>
                <Check className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Feature 4 */}
            <div className="p-7 rounded-3xl bg-slate-50 border border-slate-100 space-y-4 hover:border-purple-500/50 hover:bg-white hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center shadow-xs">
                <Cog className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-slate-900">Milling Recovery Yield (60–65%)</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Real-time machine line recovery ratios for Grade A Head Rice, 10–12% Broken Rice split, and lucrative byproduct margins (Husk boiler fuel and Bran).
                </p>
              </div>
              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-semibold text-purple-700">
                <span>Byproduct Profit Contributions</span>
                <Check className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Feature 5 */}
            <div className="p-7 rounded-3xl bg-slate-50 border border-slate-100 space-y-4 hover:border-teal-500/50 hover:bg-white hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center shadow-xs">
                <HardHat className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-slate-900">Loading, Unloading & Labour Charges</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Per-bag piece-rate calculation for unloading gangs, godown stacking, and truck dispatch loading. Tracks weekly advances (kharcha) automatically.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-semibold text-teal-700">
                <span>Per-Bag Piece Rate Tracking</span>
                <Check className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Feature 6 */}
            <div className="p-7 rounded-3xl bg-slate-50 border border-slate-100 space-y-4 hover:border-rose-500/50 hover:bg-white hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-800 flex items-center justify-center shadow-xs">
                <Calculator className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-slate-900">Integrated Accounts & GST Layer</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Denomination-wise daily cash book closing, farmer RTGS auto-linking, party-wise overdue aging alerts, and GSTR compliance statements.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-semibold text-rose-700">
                <span>Direct Cash/Bank Auto-Sync</span>
                <Check className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 6-STAGE MILL PIPELINE FLOWCHART                          */}
      {/* ========================================================= */}
      <section id="pipeline" className="py-18 bg-[#f8faf9] border-t border-slate-200/80 scroll-mt-18">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
              Operations Lifecycle
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              End-to-End Milling Architecture
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Structured strictly according to real mill checkpoints for complete lot traceability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                title: 'Gate Inward & Tokens',
                icon: Truck,
                desc: 'First physical checkpoint. Captures vehicle number, farmer details, crop variety, and issues computerized token.',
                tag: 'Traceability Start',
              },
              {
                step: '02',
                title: 'Weighbridge & Moisture Cut',
                icon: Scale,
                desc: 'Digital scale integration captures gross weight. Automatically computes moisture cut deductions and net paddy weight.',
                tag: 'Auto-Calc Net Wt',
              },
              {
                step: '03',
                title: 'Paddy Stock (FIFO Queue)',
                icon: Warehouse,
                desc: 'Chamber and stack allocation across Godowns #01, #02, #03. 1st In, 1st Out queue prioritizes lots for milling.',
                tag: 'FIFO Stock Tracking',
              },
              {
                step: '04',
                title: 'Milling Shift & Yield Recovery',
                icon: Cog,
                desc: 'Tracks 60–65% Grade A Head Rice, 10–12% Broken Rice split, and byproducts (Husk boiler fuel and Bran oil extraction).',
                tag: 'Yield Monitoring',
              },
              {
                step: '05',
                title: 'Packaging & Finished Godown',
                icon: Package,
                desc: 'Central finished warehouse cataloging 20kg retail bags and 50kg master packs for ready-to-sell inventory.',
                tag: '20/50kg Bagging',
              },
              {
                step: '06',
                title: 'Sales, LR & Dispatch',
                icon: Send,
                desc: 'Converts sales orders to loading slips, completes dispatch tare-gross weighment, and issues computerized Lorry Receipts (LR).',
                tag: 'Bilty & Settlement',
              },
            ].map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.step}
                  className="p-6 rounded-2xl bg-white border border-slate-100 space-y-3 hover:border-emerald-500/50 hover:shadow-sm transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-emerald-600 shadow-xs">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-black font-mono text-slate-300">{card.step}</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{card.title}</h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{card.desc}</p>
                  </div>
                  <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {card.tag}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* ROLE DESKS & ACCESS CONTROL                              */}
      {/* ========================================================= */}
      <section id="roles" className="py-18 bg-white border-t border-slate-200/80 scroll-mt-18">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
              Role-Based Access
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Tailored Desks for Every Department
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Every staff member sees only what they need. Zero confidential leaks, 100% operational focus.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                title: 'Mill Owner / SuperAdmin',
                badge: 'Full Access',
                desc: 'Audits P&L, approving payments, monitoring 6 pipelines, and viewing real-time bank reconciliation.',
                color: 'border-emerald-200 bg-emerald-50/50',
              },
              {
                title: 'Gate Security Guard',
                badge: 'Checkpoint #1',
                desc: 'Captures incoming truck entries, farmer Mandi details, and generates computerized gate passes.',
                color: 'border-slate-200 bg-white',
              },
              {
                title: 'Paddy Godown In-Charge',
                badge: 'FIFO Queue',
                desc: 'Maps lots to godown chambers, oversees unloading bays, and issues batches to the milling plant.',
                color: 'border-slate-200 bg-white',
              },
              {
                title: 'HR & Labour Manager',
                badge: 'Workforce Desk',
                desc: 'Tracks Shift #1 & #2 staff biometric attendance, Palledar bag piece rates, and worker advances.',
                color: 'border-slate-200 bg-white',
              },
            ].map((role) => (
              <div key={role.title} className={`p-5 rounded-2xl border shadow-xs space-y-2.5 ${role.color}`}>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-900 text-white">
                    {role.badge}
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">{role.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{role.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* FAQ SECTION                                              */}
      {/* ========================================================= */}
      <section id="faq" className="py-18 bg-[#f8faf9] border-t border-slate-200/80 scroll-mt-18">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
              Frequently Asked Questions
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Everything You Need to Know
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Clear answers regarding ERP operations, hardware integrations, and security.
            </p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className={`rounded-2xl border transition-all overflow-hidden ${
                    isOpen ? 'border-emerald-500/60 bg-emerald-50/20' : 'border-slate-200/80 bg-white'
                  }`}
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span className="text-xs sm:text-sm font-bold text-slate-900">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-emerald-600' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed animate-in fade-in duration-200 border-t border-slate-100 pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* CTA BANNER                                               */}
      {/* ========================================================= */}
      <section className="py-16 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            <span>Ready for Production Deployment</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black tracking-tight max-w-2xl mx-auto">
            Streamline Your Mill Operations Today
          </h2>

          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
            Access your department desk with authenticated mobile OTP credentials.
          </p>

          <div className="pt-2">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/30 transition-all active:scale-95 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Go to Login Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* FOOTER                                                   */}
      {/* ========================================================= */}
      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Wheat className="w-4 h-4 text-emerald-600" />
            <span className="font-bold text-slate-800">Kognos Rice Mill ERP</span>
            <span>• Season 2026-27</span>
          </div>

          <div>
            Built strictly for modern automated rice milling facilities. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}