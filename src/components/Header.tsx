import React from 'react';
import { Activity, Flame, Shield, Globe, MessageSquare, ClipboardCheck, Dumbbell, User } from 'lucide-react';
import { AthleteProfile, ActionableTodo } from '../types';
import { UI_TRANSLATIONS } from '../data/mockData';

interface HeaderProps {
  activeTab: 'journal' | 'habits' | 'chat' | 'profile';
  setActiveTab: (tab: 'journal' | 'habits' | 'chat' | 'profile') => void;
  profile: AthleteProfile;
  activeTodos: ActionableTodo[];
  streakDays: number;
  onToggleLanguage: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  profile,
  activeTodos,
  streakDays,
  onToggleLanguage,
}) => {
  const lang = profile.preferredLanguage;
  const t = UI_TRANSLATIONS[lang];
  const pendingTodos = activeTodos.filter((t) => !t.completed).length;

  return (
    <header className="border-b border-slate-800/60 bg-[#05070A]/90 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Logo & Identity matching Immersive UI */}
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.5)] shrink-0">
              <div className="w-4 h-4 border-2 border-white rounded-sm rotate-45" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white uppercase">
                  AuraFit <span className="text-cyan-400">Coach</span>
                </h1>
                <span className="text-[10px] text-cyan-400 font-mono font-semibold px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                  CSCS AI
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-mono uppercase tracking-[0.2em]">
                Performance AI · v.2.4.0
              </p>
            </div>
          </div>

          {/* Athlete Profile & Quick Controls */}
          <div className="flex items-center gap-4 self-end sm:self-center">
            {/* Athlete Profile Card */}
            <div className="hidden md:flex flex-col text-right">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">
                Athlete Profile
              </span>
              <span className="text-sm font-medium text-slate-200">
                {profile.name} <span className="text-slate-500 text-xs font-mono">({profile.trainingExperience === 'Advanced / Competitive Athlete' ? 'Pro' : 'Pro-Am'})</span>
              </span>
            </div>

            {/* Live Telemetry Pulse Dot */}
            <div className="w-10 h-10 rounded-lg bg-slate-800/80 border border-slate-700 flex items-center justify-center shadow-inner" title="Live Coaching Telemetry Connected">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
            </div>

            {/* Streak Pill */}
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono font-medium text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.15)]">
              <Flame className="h-4 w-4 fill-amber-400/20 text-amber-400" />
              <span>{streakDays} {lang === 'my' ? 'ရက်' : 'D'}</span>
            </div>

            {/* Language Switcher */}
            <button
              id="language-toggle-btn"
              onClick={onToggleLanguage}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-xs font-medium text-slate-300 transition-colors"
              title="Switch between English and Myanmar"
            >
              <Globe className="h-3.5 w-3.5 text-cyan-400" />
              <span>{lang === 'en' ? 'မြန်မာ' : 'English'}</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1.5 sm:gap-2 mt-4 overflow-x-auto pb-1 scrollbar-none border-t border-slate-800/50 pt-3">
          <button
            id="tab-journal-btn"
            onClick={() => setActiveTab('journal')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === 'journal'
                ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
            }`}
          >
            <Dumbbell className="h-4 w-4" />
            <span>{t.journalTab}</span>
          </button>

          <button
            id="tab-habits-btn"
            onClick={() => setActiveTab('habits')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all relative ${
              activeTab === 'habits'
                ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
            }`}
          >
            <ClipboardCheck className="h-4 w-4" />
            <span>{t.todosTab}</span>
            {pendingTodos > 0 && (
              <span className="ml-1 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-cyan-500 text-slate-950">
                {pendingTodos}
              </span>
            )}
          </button>

          <button
            id="tab-chat-btn"
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === 'chat'
                ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
            }`}
          >
            <MessageSquare className="h-4 w-4" />
            <span>{t.chatTab}</span>
          </button>

          <button
            id="tab-profile-btn"
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === 'profile'
                ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
            }`}
          >
            <User className="h-4 w-4" />
            <span>{t.profileTab}</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
