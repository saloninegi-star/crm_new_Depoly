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
  const { accent, mode, setThemeMode } = useTheme();
  const { t } = useLanguage();

  // 🟢 Safe Translation Helper (Agar translation na mile toh hamesha exact sentence aayega)
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
  const isDark = mode === 'dark';

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
      className={`flex min-h-dvh flex-col font-sans transition-colors duration-200 ${
        isDark ? 'dark bg-[#0b0f19] text-slate-100' : 'bg-[#f7f5ff] text-slate-800'
      }`}
    >
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 sm:px-7 sm:py-5">
        <div className="flex items-center gap-2.5">
          <span
            aria-hidden="true"
            className="flex size-7 items-center justify-center rounded-lg text-sm font-bold text-white shadow-xs select-none"
            style={{ backgroundColor: accent.primary }}
          >
            K
          </span>
          <span className="flex flex-col leading-tight">
            <span className="font-semibold text-slate-900 dark:text-white">Kognos</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">Rice Mill</span>
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
            title={isDark ? 'Switch to Day Mode' : 'Switch to Night Mode'}
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
      <main className="flex flex-1 items-start justify-center px-4 pt-12 pb-24 sm:items-center sm:pt-0">
        <div className="w-full max-w-sm sm:rounded-xl sm:border sm:border-slate-200/80 dark:sm:border-slate-800 sm:bg-white dark:sm:bg-slate-900 sm:p-8 sm:shadow-xs transition-colors">
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

              {/* 🟢 AB YEH HAMESHA EXACT SENTENCE RENDER KAREGA */}
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
                  You can ask for a new code in {countdown} seconds.
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
      </main>
    </div>
  );
}