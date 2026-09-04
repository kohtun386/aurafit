import React from 'react';
import { 
  Activity, 
  Flame, 
  Shield, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Dumbbell, 
  HeartHandshake, 
  Globe, 
  LogIn, 
  Cpu, 
  Zap, 
  ChevronRight,
  TrendingUp,
  Moon,
  Droplets
} from 'lucide-react';
import { AthleteProfile } from '../types';

interface LandingPageProps {
  onSignIn: () => Promise<any>;
  onContinueAsGuest: () => void;
  profile: AthleteProfile;
  onToggleLanguage: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onSignIn,
  onContinueAsGuest,
  profile,
  onToggleLanguage,
}) => {
  const lang = profile.preferredLanguage;

  return (
    <div className="min-h-screen bg-[#05070A] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950 font-sans relative overflow-hidden">
      {/* Ambient background glow accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-b from-cyan-500/10 via-cyan-900/5 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute top-[400px] right-[-100px] w-[500px] h-[500px] bg-indigo-500/5 blur-3xl pointer-events-none" />

      {/* Top Navbar */}
      <header className="border-b border-slate-800/80 bg-[#05070A]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-cyan-400 p-0.5 shadow-[0_0_15px_rgba(6,182,212,0.4)]">
              <div className="h-full w-full bg-[#05070A] rounded-[14px] flex items-center justify-center">
                <Activity className="h-5 w-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-white uppercase font-sans">
                  AuraFit <span className="text-cyan-400">Coach</span>
                </h1>
                <span className="text-[10px] text-cyan-400 font-mono font-semibold px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                  CSCS AI
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono uppercase tracking-[0.2em]">
                Google Cloud Gen AI Academy
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <button
              onClick={onToggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-mono text-slate-300 transition-colors"
              title="Switch language"
            >
              <Globe className="h-3.5 w-3.5 text-cyan-400" />
              <span>{lang === 'en' ? 'မြန်မာ' : 'EN'}</span>
            </button>

            {/* Quick Guest Access */}
            <button
              onClick={onContinueAsGuest}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-mono font-semibold transition-colors"
            >
              <span>{lang === 'my' ? 'ဧည့်သည်အဖြစ် စမ်းသပ်မည်' : 'Explore as Guest'}</span>
            </button>

            {/* Google Sign-In Header Button */}
            <button
              onClick={onSignIn}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all cursor-pointer"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span>{lang === 'my' ? 'Google ဖြင့် စတင်မည်' : 'Sign In'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-16">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono shadow-[0_0_12px_rgba(6,182,212,0.15)]">
            <Sparkles className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
            <span>
              {lang === 'my' 
                ? 'Gemini API & Google Cloud Run အခြေပြု အဆင့်မြင့် AI လေ့ကျင့်ရေးစနစ်'
                : 'Powered by Gemini 2.5 Flash on Google Cloud Run'}
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight leading-[1.1]">
            {lang === 'my' ? (
              <>
                ပြင်းထန်သော လေ့ကျင့်ခန်းနှင့် <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400">
                  သိပ္ပံနည်းကျ ပြန်လည်ကောင်းမွန်မှု
                </span>
              </>
            ) : (
              <>
                Elite Athletic Recovery & <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400">
                  Conditioning AI
                </span>
              </>
            )}
          </h2>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-sans">
            {lang === 'my'
              ? 'သင့်နေ့စဉ် လေ့ကျင့်ခန်း ပမာဏ၊ အိပ်စက်ချိန်၊ ကြွက်သားကိုက်ခဲမှုတို့ကို Gemini AI ဖြင့် တိကျစွာ တွက်ချက်ပြီး ဒဏ်ရာမရစေရန် ၃ ခုသော ပြန်လည်ကောင်းမွန်ရေး အလေ့အကျင့်များကို အလိုအလျောက် ရေးဆွဲပေးပါသည်။'
              : 'A production-grade athletic specialist and exercise physiologist in your pocket. Evaluates daily training strain, RPE, and muscle fatigue to auto-prescribe clinical recovery protocols and habit checklists.'}
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={onSignIn}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold uppercase tracking-wider text-sm shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all cursor-pointer"
            >
              <LogIn className="h-4 w-4" />
              <span>{lang === 'my' ? 'Google ဖြင့် အခမဲ့ စတင်မည်' : 'Get Started with Google'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              onClick={onContinueAsGuest}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 font-mono text-xs font-semibold uppercase tracking-wider transition-all"
            >
              <span>{lang === 'my' ? 'စမ်းသပ်အသုံးပြုကြည့်မည် (Guest Demo)' : 'Explore Live Demo (Guest)'}</span>
              <ChevronRight className="h-3.5 w-3.5 text-cyan-400" />
            </button>
          </div>

          <p className="text-[11px] text-slate-500 font-mono">
            {lang === 'my'
              ? 'Google Sign-In ဖြင့် ဝင်ရောက်ပါက Cloud Firestore တွင် သင့်မှတ်တမ်းများကို လုံခြုံစွာ သိမ်းဆည်းပေးမည်ဖြစ်ပါသည်။'
              : 'Sign in to sync your historical telemetry with Cloud Firestore, or test instantly in offline-first guest mode.'}
          </p>
        </div>

        {/* Interactive Telemetry Preview Mockup */}
        <div className="mt-14 max-w-4xl mx-auto rounded-3xl bg-slate-900/50 border border-slate-800 p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
                Live Telemetry Simulation
              </span>
            </div>
            <span className="text-xs font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
              CSCS Metric Engine
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Radial Dial Preview */}
            <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-[#05070A]/80 border border-slate-800">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="72"
                    cy="72"
                    r="58"
                    stroke="currentColor"
                    strokeWidth="10"
                    className="text-slate-800"
                    fill="transparent"
                  />
                  <circle
                    cx="72"
                    cy="72"
                    r="58"
                    stroke="currentColor"
                    strokeWidth="10"
                    strokeDasharray="364.4"
                    strokeDashoffset="43.7"
                    className="text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]"
                    fill="transparent"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-4xl font-black font-mono text-white">88%</span>
                  <span className="text-[9px] font-mono uppercase tracking-widest text-cyan-400">
                    Optimal Readiness
                  </span>
                </div>
              </div>
              <span className="mt-3 text-xs font-mono text-emerald-400 font-semibold px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20">
                Low Injury Risk
              </span>
            </div>

            {/* 3 Auto-Generated Habits */}
            <div className="md:col-span-2 space-y-3">
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                <span>Auto-Generated 3 Recovery Protocols</span>
              </div>

              <div className="p-3 rounded-xl bg-[#05070A] border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Droplets className="h-4 w-4 text-cyan-400" />
                  <div>
                    <p className="text-xs font-semibold text-slate-200">Electrolyte & Fluid Restoration</p>
                    <p className="text-[11px] text-slate-400 font-mono">3.2L water + 400mg sodium target</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  Today
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#05070A] border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Activity className="h-4 w-4 text-emerald-400" />
                  <div>
                    <p className="text-xs font-semibold text-slate-200">Targeted Posterior Chain Mobility</p>
                    <p className="text-[11px] text-slate-400 font-mono">2x60s hamstring flossing + 90/90 hips</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Pre-Bed
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#05070A] border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Moon className="h-4 w-4 text-indigo-400" />
                  <div>
                    <p className="text-xs font-semibold text-slate-200">Parasympathetic Sleep Optimization</p>
                    <p className="text-[11px] text-slate-400 font-mono">8.0 hrs target + 400mg magnesium</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  Tonight
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillars */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-16 border-t border-slate-800/80">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">
            Engineered for High-Performance
          </span>
          <h3 className="text-2xl sm:text-3xl font-bold uppercase text-white mt-2">
            Why Elite Athletes Use AuraFit Coach
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800 backdrop-blur-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Dumbbell className="h-6 w-6" />
            </div>
            <h4 className="text-base font-bold text-white uppercase tracking-tight">
              Daily Journal & Strain Analytics
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Log workout focus, volume, Rate of Perceived Exertion (RPE 1-10), sleep duration, and localized muscle soreness to detect neuromuscular fatigue.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800 backdrop-blur-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <Zap className="h-6 w-6" />
            </div>
            <h4 className="text-base font-bold text-white uppercase tracking-tight">
              Automated 3-Habit Protocol
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Gemini AI translates your physiological strain into 3 specific, non-negotiable habits for hydration, soft tissue mobility, and nutrition.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800 backdrop-blur-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <HeartHandshake className="h-6 w-6" />
            </div>
            <h4 className="text-base font-bold text-white uppercase tracking-tight">
              Conversational CSCS Coach
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Consult with AuraFit Coach in multi-turn chat for training volume adjustments, injury prevention, and deloading advice with text-to-speech audio.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-[#05070A]/90 py-8 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-cyan-400" />
            <span>AuraFit Coach • Certified Strength & Conditioning Specialist (CSCS) AI</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Google Cloud Run</span>
            <span>•</span>
            <span>Gemini 2.5 Flash</span>
            <span>•</span>
            <span>Cloud Firestore</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
