import React, { useState } from 'react';
import { Activity, Flame, Shield, Globe, MessageSquare, ClipboardCheck, Dumbbell, User, LogIn, LogOut, Loader2 } from 'lucide-react';
import { AthleteProfile, ActionableTodo } from '../types';
import { UI_TRANSLATIONS } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

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
  const { user, signIn, signOut, loading: authLoading, isFirebaseConnected } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);

  const lang = profile.preferredLanguage;
  const t = UI_TRANSLATIONS[lang];
  const pendingTodos = activeTodos.filter((t) => !t.completed).length;

  const handleGoogleSignIn = async () => {
    try {
      setIsSigningIn(true);
      await signIn();
    } catch (err) {
      console.error('Sign in failed:', err);
    } finally {
      setIsSigningIn(false);
    }
  };

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
                {isFirebaseConnected && (
                  <span className="hidden lg:inline-flex items-center gap-1 text-[9px] font-mono text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Firestore Live
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-500 font-mono uppercase tracking-[0.2em]">
                Performance AI · v.2.4.0
              </p>
            </div>
          </div>

          {/* Athlete Profile, Auth & Quick Controls */}
          <div className="flex items-center flex-wrap gap-2.5 sm:gap-3 self-end sm:self-center">
            {/* Auth Button / User Chip */}
            {authLoading ? (
              <div className="h-9 px-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2 text-xs text-slate-400 font-mono">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-cyan-400" />
                <span>Auth...</span>
              </div>
            ) : user ? (
              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="w-6 h-6 rounded-full border border-cyan-500/40 object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-[11px]">
                    {(user.displayName || user.email || 'A')[0].toUpperCase()}
                  </div>
                )}
                <span className="text-slate-200 font-medium max-w-[100px] truncate hidden md:inline">
                  {user.displayName?.split(' ')[0] || user.email?.split('@')[0]}
                </span>
                <button
                  id="sign-out-btn"
                  onClick={signOut}
                  title="Sign out of Firebase"
                  className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-red-400 transition-colors"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <button
                id="sign-in-google-btn"
                onClick={handleGoogleSignIn}
                disabled={isSigningIn}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 hover:border-cyan-500/50 text-xs font-medium transition-all shadow-[0_0_12px_rgba(6,182,212,0.15)]"
                title="Sign in with Google to sync journal & habits to Cloud Firestore"
              >
                {isSigningIn ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <LogIn className="h-3.5 w-3.5" />
                )}
                <span>{lang === 'my' ? 'Google ဖြင့် ဝင်မည်' : 'Sign In'}</span>
              </button>
            )}

            {/* Streak Pill */}
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono font-medium text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.15)]">
              <Flame className="h-4 w-4 fill-amber-400/20 text-amber-400" />
              <span>{streakDays} {lang === 'my' ? 'ရက်' : 'D'}</span>
            </div>

            {/* Language Switcher */}
            <button
              id="language-toggle-btn"
              onClick={onToggleLanguage}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-xs font-medium text-slate-300 transition-colors"
              title="Switch between English and Myanmar"
            >
              <Globe className="h-3.5 w-3.5 text-cyan-400" />
              <span>{lang === 'en' ? 'မြန်မာ' : 'EN'}</span>
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
