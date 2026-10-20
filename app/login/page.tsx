'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { THEME_PRESETS, ThemeKey } from '../themeConfig';
import { authService, StaffRoleType } from '../../services/authService';
import axios from 'axios';
import {
  Smartphone,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Palette,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Target,
  Radio,
  Sparkles,
} from 'lucide-react';

function NeuralAiCanvas({ waveColor }: { waveColor: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 400);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 600);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    const nodeCount = 34;
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
      if (packets.length > 6) return;
      const from = Math.floor(Math.random() * nodes.length);
      for (let to = 0; to < nodes.length; to++) {
        if (from === to) continue;
        const dx = nodes[from].x - nodes[to].x;
        const dy = nodes[from].y - nodes[to].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 110) {
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

          if (dist < 110) {
            const alpha = (1 - dist / 110) * 0.3;
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
      className="absolute inset-0 pointer-events-none z-1 opacity-70 w-full h-full"
    />
  );
}

// Helper: Safely extract error string
function extractErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const detail = err.response?.data?.detail;
    if (typeof detail === 'string') return detail;
    if (Array.isArray(detail)) {
      return detail
        .map((item: any) => (typeof item === 'string' ? item : item.msg || JSON.stringify(item)))
        .join(' | ');
    }
    if (detail && typeof detail === 'object') return JSON.stringify(detail);
    return err.response?.data?.message || err.message || 'Server request failed';
  }
  if (err instanceof Error) return err.message;
  return 'An unexpected error occurred';
}

export default function LoginPage() {
  const router = useRouter();

  // Valid ThemeKey: 'emerald' (Deep Forest Green)
  const [currentThemeKey, setCurrentThemeKey] = useState<ThemeKey>('emerald');

  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [detectedType, setDetectedType] = useState<StaffRoleType>('owner');
  const [apiMessage, setApiMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [synapsesActive, setSynapsesActive] = useState(42);
  const [lotIntegrity, setLotIntegrity] = useState(99.98);

  // Safe fallback to prevent undefined
  const currentTheme = THEME_PRESETS[currentThemeKey] || THEME_PRESETS.emerald;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('kognos_theme') as ThemeKey;
      if (savedTheme && THEME_PRESETS[savedTheme]) {
        setCurrentThemeKey(savedTheme);
      }
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setSynapsesActive(Math.floor(38 + Math.random() * 8));
      setLotIntegrity(+(99.9 + Math.random() * 0.08).toFixed(2));
    }, 2400);
    return () => clearInterval(timer);
  }, []);

  const handleSendOtp = async () => {
    if (!mobile || mobile.length < 10) {
      setApiMessage({ type: 'error', text: 'Please enter a valid 10-digit mobile number.' });
      return;
    }

    setIsSendingOtp(true);
    setApiMessage(null);

    try {
      const result = await authService.sendOtp(mobile.trim());
      setIsOtpSent(true);
      setDetectedType(result.detectedType);

      if (result.data.otp) {
        setOtp(result.data.otp);
        setApiMessage({
          type: 'success',
          text: `OTP sent successfully! (Test OTP: ${result.data.otp})`,
        });
      } else {
        setApiMessage({
          type: 'success',
          text: result.data.detail || `OTP has been sent to +91 ${mobile}.`,
        });
      }
    } catch (err: unknown) {
      setApiMessage({ type: 'error', text: extractErrorMessage(err) });
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtpAndLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isOtpSent) {
      handleSendOtp();
      return;
    }

    if (!otp || otp.length < 4) {
      setApiMessage({ type: 'error', text: 'Please enter the 6-digit OTP.' });
      return;
    }

    setIsVerifyingOtp(true);
    setApiMessage(null);

    try {
      const user = await authService.loginWithOtp(mobile.trim(), otp.trim(), detectedType);

      setApiMessage({
        type: 'success',
        text: `Authentication successful! Loading ${user.user_name} workspace...`,
      });

      localStorage.setItem('access_token', user.access_token);
      localStorage.setItem('token_type', user.token_type);
      localStorage.setItem('user_role', user.role);
      localStorage.setItem(
        'kognos_role',
        JSON.stringify({ id: user.role, label: user.user_name })
      );
      localStorage.setItem('kognos_user', user.user_name);

      if (user.profile) {
        localStorage.setItem('user_profile', JSON.stringify(user.profile));
      } else {
        localStorage.removeItem('user_profile');
      }

      localStorage.setItem('kognos_theme', currentThemeKey);

      setTimeout(() => {
        router.push('/dashboard');
      }, 500);
    } catch (err: unknown) {
      setApiMessage({ type: 'error', text: extractErrorMessage(err) });
    } finally {
      setIsVerifyingOtp(false);
    }
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
    <div className="min-h-screen w-full bg-[#f8faf9] flex items-center justify-center p-3 sm:p-6 font-sans relative">
      {/* Top Left: Back to Home Button */}
      <Link
        href="/"
        className="absolute top-4 left-4 sm:top-6 sm:left-6 z-40 inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-slate-900 border border-slate-200/80 shadow-xs text-xs font-bold backdrop-blur-md transition-all active:scale-95 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4 text-slate-600" />
        <span>Back to Home</span>
      </Link>

      {/* Main Container Card */}
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[580px] border border-slate-100 relative mt-12 sm:mt-0">
        {/* Left Side: Neural AI Branding */}
        <div className="lg:col-span-5 relative overflow-hidden flex flex-col justify-between p-6 sm:p-9 lg:p-10 text-white min-h-[360px] lg:min-h-[580px]">
          {/* Background SVG Wave */}
          <div className="absolute inset-0 pointer-events-none z-0 w-full h-full overflow-hidden">
            <svg
              className="w-full h-full object-cover"
              viewBox="0 0 500 700"
              preserveAspectRatio="none"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M 0,0 L 360,0 C 430,140 450,220 400,360 C 350,500 400,590 320,700 L 0,700 Z"
                fill={currentTheme.waveSecondary}
                opacity="0.45"
              />
              <path
                d="M 0,0 L 310,0 C 390,130 410,240 360,370 C 310,490 370,590 280,700 L 0,700 Z"
                fill={currentTheme.wavePrimary}
              />
            </svg>
          </div>

          <NeuralAiCanvas waveColor={currentTheme.waveSecondary} />
          <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent pointer-events-none animate-ai-scanner shadow-[0_0_12px_#ffffff] z-1" />

          {/* Text Content - Safe Padding & Width */}
          <div className="relative z-10 space-y-4 pt-1 pr-6 sm:pr-8 max-w-[88%] sm:max-w-[85%]">
            <div className="flex items-center gap-3.5">
              <div className="relative w-12 h-12 sm:w-13 sm:h-13 flex items-center justify-center shrink-0">
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-white/60 animate-ai-clockwise" />
                <div className="absolute inset-1.5 rounded-full border border-dotted border-white/80 animate-ai-counter" />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                  <Target className="w-10 h-10 text-white" />
                </div>
                <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center shadow-lg animate-ai-breathe">
                  <div
                    className="w-2 rounded-full h-2"
                    style={{ backgroundColor: currentTheme.wavePrimary }}
                  />
                </div>
              </div>

              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight leading-tight text-white drop-shadow-sm truncate sm:overflow-visible">
                  Kognos Mill CRM
                </h1>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  <span className="text-[10px] font-mono tracking-widest uppercase text-white/90">
                    AI SYNAPSE v4.0
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <p className="text-xs sm:text-sm font-bold leading-snug text-white/95 drop-shadow-sm">
                Autonomous Milling Operations
              </p>
              <p className="text-[11px] sm:text-xs text-white/90 leading-relaxed font-normal drop-shadow-sm">
                Paddy Inward, Weighbridge Tare-Gross, Godown FIFO Ledger, and Accounts synchronized in real-time.
              </p>
            </div>
          </div>

          {/* Bottom Metric Pill */}
          <div className="relative z-10 pt-4 space-y-2 pr-6 sm:pr-8 max-w-[90%]">
            <div className="px-3.5 py-2.5 rounded-2xl bg-black/25 backdrop-blur-md border border-white/20 text-white flex items-center justify-between text-[11px] font-mono">
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

            <div className="text-[10px] font-mono text-white/75 flex items-center justify-between px-1">
              <span>NODE: #KOGNOS-MILL-01</span>
              <span>LIVE AI MONITOR</span>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="lg:col-span-7 flex flex-col justify-center px-6 sm:px-12 lg:px-14 py-8 sm:py-12 bg-white relative">
          <div className="absolute top-4 right-5 z-20 flex items-center gap-2">
            <button
              type="button"
              onClick={cycleTheme}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-xs cursor-pointer transition-all"
            >
              <Palette className="w-3.5 h-3.5" style={{ color: currentTheme.buttonBg }} />
              <span className="text-[11px]">{currentTheme.name}</span>
            </button>
          </div>

          <div className="max-w-md w-full mx-auto space-y-6">
            <div className="space-y-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                <ShieldCheck className="w-5 h-5" style={{ color: currentTheme.buttonBg }} />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Authorized Sign In
                </span>
              </div>
              <h2
                className="text-2xl sm:text-3xl font-black tracking-tight"
                style={{ color: currentTheme.headingColor }}
              >
                Sign In to Kognos
              </h2>
              <p className="text-xs text-slate-500">
                Enter your registered mobile number to receive an OTP and sign in.
              </p>
            </div>

            {/* Notification Alert Box */}
            {apiMessage && (
              <div
                className={`p-3.5 rounded-2xl text-xs flex items-center gap-2.5 transition-all ${
                  apiMessage.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}
              >
                {apiMessage.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                )}
                <span>{apiMessage.text}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleVerifyOtpAndLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Registered Mobile Number</label>
                <div
                  className="flex items-center px-4 py-3 rounded-2xl border border-slate-200/80 focus-within:border-emerald-500 transition-all shadow-xs"
                  style={{ backgroundColor: currentTheme.inputBg }}
                >
                  <Smartphone className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" />
                  <span className="text-xs font-semibold text-slate-500 mr-1.5">+91</span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 10-digit number"
                    className="w-full bg-transparent text-sm font-mono font-bold text-slate-900 outline-none"
                  />
                  <button
                    type="button"
                    disabled={isSendingOtp || !mobile || mobile.length < 10}
                    onClick={handleSendOtp}
                    className="px-3.5 py-1.5 rounded-xl text-white text-xs font-bold shrink-0 cursor-pointer disabled:opacity-40 transition-all shadow-xs"
                    style={{ backgroundColor: currentTheme.buttonBg }}
                  >
                    {isSendingOtp ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : isOtpSent ? (
                      'Resend'
                    ) : (
                      'Send OTP'
                    )}
                  </button>
                </div>
              </div>

              {/* 6-Digit OTP Field */}
              {isOtpSent && (
                <div className="space-y-1.5 animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-700">Enter 6-Digit OTP</label>
                    <span className="text-[11px] text-emerald-600 font-mono font-semibold">
                      Sent to +91 {mobile}
                    </span>
                  </div>
                  <div
                    className="flex items-center px-4 py-3 rounded-2xl border border-slate-200/80 focus-within:border-emerald-500 transition-all shadow-xs"
                    style={{ backgroundColor: currentTheme.inputBg }}
                  >
                    <KeyRound className="w-4 h-4 text-slate-400 mr-3 shrink-0" />
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="e.g. 123456"
                      className="w-full bg-transparent text-base font-mono font-black tracking-widest text-slate-900 outline-none"
                    />
                  </div>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isVerifyingOtp || isSendingOtp}
                  className="w-full py-4 rounded-full text-white font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50 transition-all active:scale-[0.99]"
                  style={{
                    backgroundColor: currentTheme.buttonBg,
                    boxShadow: currentTheme.buttonShadow,
                  }}
                >
                  {isVerifyingOtp ? (
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : isOtpSent ? (
                    <span className="flex items-center gap-1.5">
                      <span>VERIFY & OPEN DASHBOARD</span>
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  ) : (
                    <span>SEND OTP TO LOGIN</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}