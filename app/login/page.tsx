'use client';

import React, { useState, useEffect, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../../services/authService';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import LanguageSelector from '../components/LanguageSelector';
import axios from 'axios';
import {
  Moon,
  Sun,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

const RESEND_AFTER_SECONDS = 30;

function extractErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const detail = err.response?.data?.detail;
    if (typeof detail === 'string') return detail;
    if (Array.isArray(detail)) {
      return detail
        .map((item: unknown) => {
          if (typeof item === 'string') return item;
          if (item && typeof item === 'object' && 'msg' in item && typeof item.msg === 'string') {
            return item.msg;
          }
          return '';
        })
        .filter(Boolean)
        .join(' | ');
    }
    return err.response?.data?.message || err.message || 'Server request failed';
  }
  if (err instanceof Error) return err.message;
  return 'An unexpected error occurred';
}

export default function LoginPage() {
  const router = useRouter();
  const { accent, resolvedMode, setThemeMode } = useTheme();
  const { t } = useLanguage();

  // 🟢 Safe Translation Helper
  const getT = (key: string, fallback: string) => {
    const val = t(key);
    return val && val !== key ? val : fallback;
  };

  const [step, setStep] = useState<'mobile' | 'code'>('mobile');
  const [mobile, setMobile] = useState('');
  const [code, setCode] = useState('');

  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [countdown, setCountdown] = useState(RESEND_AFTER_SECONDS);
  const [apiMessage, setApiMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const mobileValid = /^\d{10}$/.test(mobile);
  const isDark = resolvedMode === 'dark';

  useEffect(() => {
    if (step !== 'code' || countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [step, countdown]);

  const handleSendCode = async (event: FormEvent) => {
    event.preventDefault();
    if (!mobileValid || isSendingOtp) return;

    setIsSendingOtp(true);
    setApiMessage(null);

    try {
      const result = await authService.sendOtp(mobile.trim());
      setStep('code');
      setCountdown(RESEND_AFTER_SECONDS);

      if (result.data.otp) {
        setCode(result.data.otp);
        setApiMessage({ type: 'success', text: `OTP sent! (Test OTP: ${result.data.otp})` });
      } else {
        setApiMessage({
          type: 'success',
          text: result.data.detail || `6-digit code sent to +91 ${mobile}`,
        });
      }
    } catch (err) {
      setApiMessage({ type: 'error', text: extractErrorMessage(err) });
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerify = async (event: FormEvent) => {
    event.preventDefault();
    if (code.length !== 6 || isVerifyingOtp) return;

    setIsVerifyingOtp(true);
    setApiMessage(null);

    try {
      const user = await authService.loginWithOtp(mobile.trim(), code.trim());

      localStorage.setItem('access_token', user.access_token);
      localStorage.setItem('token_type', user.token_type);
      localStorage.setItem('user_role', user.role);
      localStorage.setItem('kognos_role', JSON.stringify({ id: user.role, label: user.user_name }));
      localStorage.setItem('kognos_user', user.user_name);
      localStorage.setItem('user_mobile', user.mobile);

      if (user.profile) {
        localStorage.setItem('user_profile', JSON.stringify(user.profile));
      } else {
        localStorage.removeItem('user_profile');
      }

      router.push('/dashboard');
    } catch (err) {
      setApiMessage({ type: 'error', text: extractErrorMessage(err) });
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  return (
    <div
      className={`relative flex min-h-dvh flex-col font-sans transition-colors duration-500 overflow-hidden ${
        isDark ? 'dark bg-[#070d18] text-slate-100' : 'bg-[#eef5f1] text-slate-800'
      }`}
    >
      {/* ========================================================= */}
      {/* 🚀 ADVANCED ERP AURORA & LINEAR GRID ANIMATION (NO DOTS)  */}
      {/* ========================================================= */}
      <style jsx global>{`
        @keyframes erpMesh1 {
          0% {
            transform: translate(0px, 0px) scale(1) rotate(0deg);
          }
          33% {
            transform: translate(80px, -60px) scale(1.15) rotate(120deg);
          }
          66% {
            transform: translate(-50px, 40px) scale(0.9) rotate(240deg);
          }
          100% {
            transform: translate(0px, 0px) scale(1) rotate(360deg);
          }
        }
        @keyframes erpMesh2 {
          0% {
            transform: translate(0px, 0px) scale(1) rotate(0deg);
          }
          33% {
            transform: translate(-90px, 70px) scale(1.18) rotate(-120deg);
          }
          66% {
            transform: translate(60px, -40px) scale(0.95) rotate(-240deg);
          }
          100% {
            transform: translate(0px, 0px) scale(1) rotate(-360deg);
          }
        }
        @keyframes erpMesh3 {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.25;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.25);
            opacity: 0.45;
          }
        }
        @keyframes sweepBeam {
          0% {
            transform: translateY(-100%);
            opacity: 0;
          }
          20% {
            opacity: 0.8;
          }
          80% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(1100%);
            opacity: 0;
          }
        }
        @keyframes auraPulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.4;
          }
          50% {
            transform: scale(1.04);
            opacity: 0.7;
          }
        }
        .anim-erp-mesh-1 {
          animation: erpMesh1 24s ease-in-out infinite;
        }
        .anim-erp-mesh-2 {
          animation: erpMesh2 28s ease-in-out infinite;
        }
        .anim-erp-mesh-3 {
          animation: erpMesh3 16s ease-in-out infinite;
        }
        .anim-sweep-beam {
          animation: sweepBeam 9s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        .anim-aura-pulse {
          animation: auraPulse 6s ease-in-out infinite;
        }
      `}</style>

      {/* Layer 1: Vibrant Fluid Aurora Mesh Orbs */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Emerald Glow (Rice Mill Plant) */}
        <div
          className="anim-erp-mesh-1 absolute -top-48 -right-32 w-[46rem] h-[46rem] rounded-full blur-[140px] opacity-60 dark:opacity-30"
          style={{
            background:
              'radial-gradient(circle, rgba(16,185,129,0.9) 0%, rgba(5,150,105,0.6) 45%, rgba(4,120,87,0.15) 70%, transparent 85%)',
          }}
        />

        {/* Warm Golden Harvest Amber Glow (Paddy Stock) */}
        <div
          className="anim-erp-mesh-2 absolute -bottom-48 -left-32 w-[44rem] h-[44rem] rounded-full blur-[150px] opacity-50 dark:opacity-25"
          style={{
            background:
              'radial-gradient(circle, rgba(245,158,11,0.85) 0%, rgba(217,119,6,0.5) 45%, rgba(180,83,9,0.15) 70%, transparent 85%)',
          }}
        />

        {/* Deep Cyan / Industrial Teal Center Glow */}
        <div
          className="anim-erp-mesh-3 absolute top-1/2 left-1/2 w-[42rem] h-[42rem] rounded-full blur-[160px] pointer-events-none"
          style={{
            background:
              'radial-gradient(circle, rgba(13,148,136,0.55) 0%, rgba(15,118,110,0.3) 50%, transparent 80%)',
          }}
        />
      </div>

      {/* Layer 2: Clean Architectural Grid Lines (NO DOTS) */}
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-40 dark:opacity-25"
        style={{
          backgroundImage: isDark
            ? 'linear-gradient(to right, rgba(52, 211, 153, 0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(52, 211, 153, 0.12) 1px, transparent 1px)'
            : 'linear-gradient(to right, rgba(5, 150, 105, 0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(5, 150, 105, 0.12) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse 85% 80% at 50% 50%, #000 65%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 85% 80% at 50% 50%, #000 65%, transparent 100%)',
        }}
      />

      {/* Layer 3: ERP Telemetry Scanning Laser Sweep (Zero dots, pure sweeping line) */}
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 dark:via-emerald-300 to-transparent pointer-events-none z-0 anim-sweep-beam shadow-[0_0_18px_rgba(52,211,153,0.85)]" />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-4 py-3 sm:px-8 sm:py-5 border-b border-slate-200/60 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <span
            aria-hidden="true"
            className="flex size-7 items-center justify-center rounded-lg text-sm font-bold text-white shadow-xs select-none"
            style={{ backgroundColor: accent.primary }}
          >
            {t('ui_a7ee38bb7be4')}</span>
          <span className="flex flex-col leading-tight">
            <span className="font-semibold text-slate-900 dark:text-white">{t('ui_66e83e42f8e1')}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">{t('ui_a651d805bc71')}</span>
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="scale-90 sm:scale-100 origin-right">
            <LanguageSelector />
          </div>

          <button
            type="button"
            onClick={() => setThemeMode(isDark ? 'light' : 'dark')}
            className="flex size-9 items-center justify-center rounded-lg border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-2xs cursor-pointer"
            title={isDark ? getT('switch_day_mode', 'Switch to Day Mode') : getT('switch_night_mode', 'Switch to Night Mode')}
          >
            {isDark ? (
              <Sun className="size-4 text-amber-400" />
            ) : (
              <Moon className="size-4 text-slate-600" />
            )}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 flex flex-1 items-start justify-center px-4 pt-12 pb-24 sm:items-center sm:pt-0">
        
        {/* Elevated ERP Card Container with Dynamic Aura Glow */}
        <div className="relative w-full max-w-sm">
          
          {/* Ambient Card Backlight Aura */}
          <div className="anim-aura-pulse absolute -inset-1.5 rounded-3xl bg-gradient-to-r from-emerald-500/30 via-teal-500/20 to-amber-500/30 blur-xl pointer-events-none" />

          {/* Main Card Surface */}
          <div className="relative w-full rounded-2xl border border-white/80 dark:border-slate-700/60 bg-white/85 dark:bg-slate-900/85 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl shadow-emerald-950/10 dark:shadow-black/70 transition-colors">
            
            {/* Top Enterprise Accent Line */}
            <div className="absolute top-0 inset-x-8 h-[2px] bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 rounded-full" />

            {apiMessage && (
              <div
                className={`mb-5 p-3 rounded-xl text-xs flex items-center gap-2.5 transition-all ${
                  apiMessage.type === 'success'
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                    : 'bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                }`}
              >
                {apiMessage.type === 'success' ? (
                  <CheckCircle2 className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <AlertCircle className="size-4 shrink-0 text-rose-600 dark:text-rose-400" />
                )}
                <span>{apiMessage.text}</span>
              </div>
            )}

            {step === 'mobile' ? (
              /* STEP 1: Enter Mobile Number */
              <form onSubmit={handleSendCode} noValidate>
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
                  {getT('sign_in', 'Sign in')}
                </h1>

                <p className="mt-1.5 mb-6 text-sm text-slate-500 dark:text-slate-400 leading-normal">
                  {getT(
                    'registered_mobile',
                    'We will send a 6-digit code to your registered mobile number.'
                  )}
                </p>

                <div>
                  <label
                    htmlFor="mobile"
                    className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                  >
                    {getT('mobile_number', 'Mobile number')}
                  </label>
                  <div className="flex">
                    <span className="flex items-center rounded-l-lg border border-r-0 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 text-base text-slate-600 dark:text-slate-300 tabular-nums md:text-sm select-none">
                      +91
                    </span>
                    <input
                      id="mobile"
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel-national"
                      maxLength={10}
                      placeholder={getT('phone_placeholder', '10-digit number')}
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                      className="w-full rounded-r-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-slate-500 dark:focus:border-slate-400 focus:ring-1 focus:ring-slate-500 dark:focus:ring-slate-400 tabular-nums"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!mobileValid || isSendingOtp}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium text-white transition-opacity disabled:opacity-50 cursor-pointer shadow-xs active:scale-[0.99]"
                  style={{ backgroundColor: accent.primary }}
                >
                  {isSendingOtp ? (
                    <>
                      <RefreshCw className="size-3.5 animate-spin" />
                      <span>{getT('sending_code', 'Sending code...')}</span>
                    </>
                  ) : (
                    <span>{getT('send_code', 'Send code')}</span>
                  )}
                </button>
              </form>
            ) : (
              /* STEP 2: Enter 6-Digit Code */
              <form onSubmit={handleVerify} noValidate>
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
                  {getT('enter_code', 'Enter the code')}
                </h1>
                <p className="mt-1.5 mb-6 text-sm text-slate-500 dark:text-slate-400 leading-normal">
                  {getT('code_sent_to', 'Sent to')} +91 {mobile.slice(0, 5)} {mobile.slice(5)}.{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setStep('mobile');
                      setCode('');
                      setApiMessage(null);
                    }}
                    className="font-medium underline underline-offset-2 transition-colors cursor-pointer"
                    style={{ color: accent.primary }}
                  >
                    {getT('change_number', 'Change number')}
                  </button>
                </p>

                <div>
                  <label
                    htmlFor="code"
                    className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                  >
                    {getT('six_digit_code', '6-digit code')}
                  </label>
                  <input
                    id="code"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-center text-xl tracking-[0.5em] tabular-nums text-slate-900 dark:text-white outline-none focus:border-slate-500 dark:focus:border-slate-400 focus:ring-1 focus:ring-slate-500 dark:focus:ring-slate-400 md:text-xl font-mono"
                  />
                </div>

                <button
                  type="submit"
                  disabled={code.length !== 6 || isVerifyingOtp}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium text-white transition-opacity disabled:opacity-50 cursor-pointer shadow-xs active:scale-[0.99]"
                  style={{ backgroundColor: accent.primary }}
                >
                  {isVerifyingOtp ? (
                    <>
                      <RefreshCw className="size-3.5 animate-spin" />
                      <span>{getT('verifying', 'Verifying...')}</span>
                    </>
                  ) : (
                    <span>{getT('verify_open_dashboard', 'Verify and sign in')}</span>
                  )}
                </button>

                {countdown > 0 ? (
                  <p className="mt-4 text-center text-xs text-slate-500 dark:text-slate-400">
                    {getT('resend_countdown', 'You can ask for a new code in {seconds} seconds.').replace('{seconds}', String(countdown))}
                  </p>
                ) : (
                  <p className="mt-4 text-center text-xs text-slate-500 dark:text-slate-400">
                    {getT('resend_prompt', "Didn't receive code?")}{' '}
                    <button
                      type="button"
                      onClick={(e) => {
                        handleSendCode(e);
                        setCountdown(RESEND_AFTER_SECONDS);
                      }}
                      className="font-medium underline cursor-pointer"
                      style={{ color: accent.primary }}
                    >
                      {getT('resend', 'Resend code')}
                    </button>
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}