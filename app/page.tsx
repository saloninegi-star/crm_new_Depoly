'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { THEME_PRESETS, ThemeKey } from './themeConfig';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  ChevronDown,
  CheckCircle2,
  ShieldCheck,
  Truck,
  Scale,
  Warehouse,
  Cog,
  Package,
  Send,
  Calculator,
  Radio,
  Target,
  Sparkles,
  Palette,
} from 'lucide-react';

const ROLES = [
  { id: 'superadmin', label: 'SuperAdmin / Owner', desc: 'Live Dashboard & P&L', icon: ShieldCheck },
  { id: 'gate_guard', label: 'Gate Guard / Security', desc: 'Vehicle Entry & Token', icon: Truck },
  { id: 'weighbridge', label: 'Weighbridge Operator', desc: 'Gross & Tare Weighment', icon: Scale },
  { id: 'paddy_stock', label: 'Paddy Godown In-charge', desc: 'Lot Creation & FIFO', icon: Warehouse },
  { id: 'milling', label: 'Milling Supervisor', desc: 'Shift Batches & Recovery %', icon: Cog },
  { id: 'finished_stock', label: 'Packaging & Finished Stock', desc: '20/50kg Bagging & Godown', icon: Package },
  { id: 'sales_dispatch', label: 'Sales & Dispatch In-charge', desc: 'Sales Order & LR / Bilty', icon: Send },
  { id: 'accounts', label: 'Accounts Officer / Cashier', desc: 'Cash Book, Bank & GST', icon: Calculator },
];

function NeuralAiCanvas({ waveColor }: { waveColor: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 500);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 650);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    const nodeCount = 38;
    const nodes: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      pulse: number;
    }> = [];

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        radius: 1.8 + Math.random() * 2.2,
        pulse: Math.random() * Math.PI,
      });
    }

    const packets: Array<{
      fromIdx: number;
      toIdx: number;
      progress: number;
      speed: number;
    }> = [];

    const spawnPacket = () => {
      if (packets.length > 7) return;
      const from = Math.floor(Math.random() * nodes.length);
      for (let to = 0; to < nodes.length; to++) {
        if (from === to) continue;
        const dx = nodes[from].x - nodes[to].x;
        const dy = nodes[from].y - nodes[to].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 115) {
          packets.push({
            fromIdx: from,
            toIdx: to,
            progress: 0,
            speed: 0.012 + Math.random() * 0.02,
          });
          break;
        }
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      if (Math.random() < 0.08) spawnPacket();

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;
        n.pulse += 0.04;

        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;

        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const dx = n.x - n2.x;
          const dy = n.y - n2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 115) {
            const alpha = (1 - dist / 115) * 0.32;
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }

        const currentRadius = n.radius + Math.sin(n.pulse) * 0.6;
        ctx.beginPath();
        ctx.arc(n.x, n.y, Math.max(1, currentRadius), 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      for (let p = packets.length - 1; p >= 0; p--) {
        const pkt = packets[p];
        pkt.progress += pkt.speed;

        if (pkt.progress >= 1) {
          packets.splice(p, 1);
          continue;
        }

        const from = nodes[pkt.fromIdx];
        const to = nodes[pkt.toIdx];
        if (!from || !to) {
          packets.splice(p, 1);
          continue;
        }

        const px = from.x + (to.x - from.x) * pkt.progress;
        const py = from.y + (to.y - from.y) * pkt.progress;

        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = waveColor;
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [waveColor]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-1 opacity-70"
    />
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [currentThemeKey, setCurrentThemeKey] = useState<ThemeKey>('emerald');
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [selectedRole, setSelectedRole] = useState(ROLES[0]);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [email, setEmail] = useState('superadmin@kognosrice.com');
  const [password, setPassword] = useState('••••••••••••');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');

  const [synapsesActive, setSynapsesActive] = useState(42);
  const [lotIntegrity, setLotIntegrity] = useState(99.98);

  const currentTheme = THEME_PRESETS[currentThemeKey];

  useEffect(() => {
    const timer = setInterval(() => {
      setSynapsesActive(Math.floor(38 + Math.random() * 8));
      setLotIntegrity(+(99.9 + Math.random() * 0.08).toFixed(2));
    }, 2400);
    return () => clearInterval(timer);
  }, []);

  const handleRoleSelect = (role: (typeof ROLES)[0]) => {
    setSelectedRole(role);
    setIsRoleDropdownOpen(false);
    setEmail(`${role.id}@kognosrice.com`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (typeof window !== 'undefined') {
      localStorage.setItem('kognos_role', JSON.stringify(selectedRole));
      localStorage.setItem('kognos_theme', currentThemeKey);
      localStorage.setItem('kognos_user', email);
    }

    setTimeout(() => {
      setIsLoading(false);
      if (tab === 'login') {
        router.push('/dashboard');
      } else {
        alert('Staff enrollment request queued for approval!');
        setTab('login');
      }
    }, 900);
  };

  const cycleTheme = () => {
    const keys = Object.keys(THEME_PRESETS) as ThemeKey[];
    const nextIndex = (keys.indexOf(currentThemeKey) + 1) % keys.length;
    const nextTheme = keys[nextIndex];
    setCurrentThemeKey(nextTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('kognos_theme', nextTheme);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f8faf9] flex items-center justify-center p-3 sm:p-6 font-sans">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[590px] border border-slate-100 relative">

        <div className="lg:col-span-5 relative overflow-hidden flex flex-col justify-between p-8 sm:p-11 text-white min-h-[380px] lg:min-h-[590px]">
          <div className="absolute inset-0 pointer-events-none z-0">
            <svg
              className="w-full h-full object-cover"
              viewBox="0 0 500 700"
              preserveAspectRatio="none"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M 0,0 
                   L 320,0 
                   C 390,140 430,220 370,360 
                   C 310,500 370,590 280,700 
                   L 0,700 Z"
                fill={currentTheme.waveSecondary}
                opacity="0.45"
              />
              <path
                d="M 0,0 
                   L 270,0 
                   C 350,130 380,240 330,370 
                   C 280,490 340,590 240,700 
                   L 0,700 Z"
                fill={currentTheme.wavePrimary}
              />
            </svg>
          </div>

          <NeuralAiCanvas waveColor={currentTheme.waveSecondary} />

          <div className="absolute left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-white to-transparent pointer-events-none animate-ai-scanner shadow-[0_0_12px_#ffffff] z-1" />

          <div className="relative z-10 space-y-4 pt-1">
            <div className="flex items-center gap-4">
              <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-white/60 animate-ai-clockwise" />
                <div className="absolute inset-1.5 rounded-full border border-dotted border-white/80 animate-ai-counter" />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                  <Target className="w-12 h-12 text-white" />
                </div>
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-lg animate-ai-breathe">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: currentTheme.wavePrimary }}
                  />
                </div>
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight drop-shadow-sm leading-none">
                  Kognos Rice Mill CRM
                </h1>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  <span className="text-[10px] font-mono tracking-widest uppercase text-white/90">
                    AI SYNAPSE v4.0
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <p className="text-sm sm:text-base font-semibold leading-snug text-white/95">
                Autonomous Milling Operations
              </p>
              <p className="text-xs sm:text-[13px] text-white/85 leading-relaxed font-normal">
                Paddy Inward, Weighbridge Tare-Gross, Godown FIFO Ledger, Machine Recovery, aur Accounts realtime AI monitor mein synced hain.
              </p>
            </div>
          </div>

          <div className="relative z-10 pt-6 space-y-2">
            <div className="px-3.5 py-2.5 rounded-2xl bg-black/20 backdrop-blur-md border border-white/25 text-white flex items-center justify-between text-[11px] font-mono">
              <div className="flex items-center gap-2">
                <Radio className="w-3.5 h-3.5 text-white animate-pulse" />
                <span className="font-semibold tracking-wide">
                  SYNAPSES ACTIVE: {synapsesActive}
                </span>
              </div>
              <div className="flex items-center gap-1.5 font-bold">
                <Sparkles className="w-3 h-3 text-white" />
                <span>{lotIntegrity}% OK</span>
              </div>
            </div>

            <div className="text-[10px] font-mono text-white/70 flex items-center justify-between px-1">
              <span>NODE: #KOGNOS-MILL-01</span>
              <span>8 CERTIFIED ROLES</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 flex flex-col justify-center px-8 sm:px-14 py-10 sm:py-12 bg-white relative">
          <div className="absolute top-5 right-6 z-20 flex items-center gap-2">
            <button
              type="button"
              onClick={cycleTheme}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-sm cursor-pointer transition-all"
              title="Click to cycle color theme"
            >
              <Palette className="w-3.5 h-3.5" style={{ color: currentTheme.buttonBg }} />
              <span className="text-[11px]">{currentTheme.name}</span>
              <span
                className="w-2.5 h-2.5 rounded-full inline-block"
                style={{ backgroundColor: currentTheme.dotColor }}
              />
            </button>
          </div>

          <div className="max-w-md w-full mx-auto space-y-6 pt-2">
            <div className="text-center sm:text-left space-y-1">
              <div className="flex items-center justify-between">
                <h2
                  className="text-2xl sm:text-3xl font-bold tracking-tight"
                  style={{ color: currentTheme.headingColor }}
                >
                  {tab === 'login' ? 'Sign In to Kognos CRM' : 'Register to Kognos CRM'}
                </h2>
              </div>
              <p
                className="text-xs font-normal"
                style={{ color: currentTheme.subHeadingColor }}
              >
                {tab === 'login'
                  ? 'Apne operational role credentials se login karein'
                  : 'Naye staff enrollment approval ke liye form bharein'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-left text-xs transition-all border border-slate-200/60 hover:border-slate-300"
                  style={{ backgroundColor: currentTheme.inputBg }}
                >
                  <div className="flex items-center gap-3">
                    <selectedRole.icon
                      className="w-4 h-4 shrink-0"
                      style={{ color: currentTheme.buttonBg }}
                    />
                    <div>
                      <div className="font-semibold text-slate-800">{selectedRole.label}</div>
                      <div className="text-[10px] text-slate-400">{selectedRole.desc}</div>
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                      isRoleDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isRoleDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 max-h-56 overflow-y-auto rounded-xl bg-white border border-slate-100 shadow-xl z-50 p-1.5 space-y-1">
                    {ROLES.map((role) => {
                      const RoleIcon = role.icon;
                      const isSelected = role.id === selectedRole.id;
                      return (
                        <button
                          key={role.id}
                          type="button"
                          onClick={() => handleRoleSelect(role)}
                          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-xs transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-slate-100 text-slate-900 font-semibold'
                              : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <RoleIcon
                            className="w-3.5 h-3.5"
                            style={{ color: currentTheme.buttonBg }}
                          />
                          <div className="flex-1">
                            <div>{role.label}</div>
                            <div className="text-[10px] text-slate-400">{role.desc}</div>
                          </div>
                          {isSelected && (
                            <CheckCircle2
                              className="w-3.5 h-3.5"
                              style={{ color: currentTheme.buttonBg }}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {tab === 'register' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    className="flex items-center px-4 py-3 rounded-xl border border-slate-200/60"
                    style={{ backgroundColor: currentTheme.inputBg }}
                  >
                    <User className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Full Name"
                      className="w-full bg-transparent text-xs text-slate-800 placeholder-slate-400 outline-none"
                    />
                  </div>
                  <div
                    className="flex items-center px-4 py-3 rounded-xl border border-slate-200/60"
                    style={{ backgroundColor: currentTheme.inputBg }}
                  >
                    <Phone className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Mobile No."
                      className="w-full bg-transparent text-xs text-slate-800 placeholder-slate-400 outline-none"
                    />
                  </div>
                </div>
              )}

              <div
                className="flex items-center px-4 py-3.5 rounded-xl border border-slate-200/60 focus-within:border-slate-300 transition-all"
                style={{ backgroundColor: currentTheme.inputBg }}
              >
                <Mail className="w-4 h-4 text-slate-400 mr-3 shrink-0" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Official Email ID"
                  className="w-full bg-transparent text-xs text-slate-800 placeholder-slate-400 outline-none"
                />
              </div>

              <div
                className="flex items-center px-4 py-3.5 rounded-xl border border-slate-200/60 focus-within:border-slate-300 transition-all"
                style={{ backgroundColor: currentTheme.inputBg }}
              >
                <Lock className="w-4 h-4 text-slate-400 mr-3 shrink-0" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Security Password"
                  className="w-full bg-transparent text-xs text-slate-800 placeholder-slate-400 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-600 ml-2 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {tab === 'login' && (
                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-3.5 h-3.5 rounded border-slate-300 focus:ring-0"
                    />
                    <span>Remember Me</span>
                  </label>
                  <a
                    href="#forgot"
                    className="hover:underline transition-colors text-slate-400 hover:text-slate-700"
                  >
                    Forgot Password?
                  </a>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-full text-white font-bold text-xs tracking-wider uppercase transition-all duration-300 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
                  style={{
                    backgroundColor: currentTheme.buttonBg,
                    boxShadow: currentTheme.buttonShadow,
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = currentTheme.buttonHover)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = currentTheme.buttonBg)
                  }
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (
                    <span>{tab === 'login' ? 'LOG IN' : 'REGISTER'}</span>
                  )}
                </button>
              </div>
            </form>

            <div className="pt-4 text-center text-xs text-slate-400 border-t border-slate-100">
              {tab === 'login' ? (
                <>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setTab('register')}
                    className="font-bold hover:underline cursor-pointer"
                    style={{ color: currentTheme.buttonBg }}
                  >
                    Register here
                  </button>
                </>
              ) : (
                <>
                  Already registered?{' '}
                  <button
                    type="button"
                    onClick={() => setTab('login')}
                    className="font-bold hover:underline cursor-pointer"
                    style={{ color: currentTheme.buttonBg }}
                  >
                    Sign In
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}