import React from 'react';
import { 
  Activity, 
  ShieldCheck, 
  ShieldAlert, 
  AlertOctagon, 
  Sparkles, 
  ArrowRight, 
  CheckCircle, 
  BrainCircuit, 
  Flame, 
  HeartHandshake 
} from 'lucide-react';
import { JournalEvaluation, ActionableTodo, AthleteProfile } from '../types';
import { UI_TRANSLATIONS } from '../data/mockData';

interface EvaluationCardProps {
  evaluation: JournalEvaluation;
  profile: AthleteProfile;
  onAdoptHabits: (todos: Omit<ActionableTodo, 'completed'>[]) => void;
  habitsAdopted: boolean;
  onViewHabits?: () => void;
}

export const EvaluationCard: React.FC<EvaluationCardProps> = ({
  evaluation,
  profile,
  onAdoptHabits,
  habitsAdopted,
  onViewHabits,
}) => {
  const lang = profile.preferredLanguage;
  const t = UI_TRANSLATIONS[lang];

  const getInjuryRiskBadge = (risk: string) => {
    switch (risk) {
      case 'Low':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <ShieldCheck className="h-3.5 w-3.5" />
            {lang === 'my' ? 'ဒဏ်ရာရနိုင်ခြေ နည်းပါး (Low Risk)' : 'Low Injury Risk'}
          </span>
        );
      case 'Moderate':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-[0_0_8px_rgba(245,158,11,0.2)]">
            <ShieldAlert className="h-3.5 w-3.5" />
            {lang === 'my' ? 'အသင့်အတင့် သတိထားရန် (Moderate)' : 'Moderate Injury Risk'}
          </span>
        );
      case 'High':
      case 'Critical Deload Required':
      default:
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse shadow-[0_0_10px_rgba(244,63,94,0.3)]">
            <AlertOctagon className="h-3.5 w-3.5" />
            {lang === 'my' ? 'လေ့ကျင့်ခန်းလျှော့ချရန် လိုအပ် (Critical Deload)' : 'Critical Deload Required'}
          </span>
        );
    }
  };

  // SVG circular circumference: 2 * Math.PI * 72 ~= 452
  const circleRadius = 72;
  const circumference = 2 * Math.PI * circleRadius;
  const strokeOffset = circumference - (circumference * Math.min(100, Math.max(0, evaluation.readinessScore))) / 100;

  return (
    <div className="bg-gradient-to-br from-cyan-950/20 to-slate-900/40 border border-cyan-500/20 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden space-y-6">
      {/* Background Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(6,182,212,0.06)_0%,_transparent_75%)] pointer-events-none" />

      {/* Header Banner */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shadow-[0_0_12px_rgba(6,182,212,0.2)]">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white uppercase tracking-tight">
              {lang === 'my' ? 'AuraFit နည်းပြ၏ ဇီဝကမ္မဗေဒ အကဲဖြတ်ချက်' : 'AuraFit Physiological Evaluation'}
            </h3>
            <p className="text-[11px] font-mono text-slate-400">
              {lang === 'my' ? 'လေ့ကျင့်ခန်း ပမာဏနှင့် အာရုံကြော စနစ် သုံးသပ်ချက်' : 'Performance AI · Neuromuscular telemetry & recovery prescription'}
            </p>
          </div>
        </div>

        {getInjuryRiskBadge(evaluation.injuryRiskLevel)}
      </div>

      {/* Centerpiece Circular Readiness Ring */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center py-4">
        <div className="w-44 h-44 rounded-full border-[8px] border-slate-800/80 flex items-center justify-center relative mb-4 mx-auto shadow-inner">
          <svg className="absolute inset-[-8px] w-[calc(100%+16px)] h-[calc(100%+16px)] -rotate-90">
            <circle
              cx="88"
              cy="88"
              r={circleRadius}
              fill="transparent"
              stroke="#06b6d4"
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeOffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="flex flex-col items-center">
            <span className="text-4xl sm:text-5xl font-bold text-white font-mono tracking-tighter">
              {evaluation.readinessScore}%
            </span>
            <span className="text-[10px] text-slate-400 uppercase font-mono tracking-widest mt-0.5">
              {lang === 'my' ? 'ပြန်လည်ကောင်းမွန်မှု အမှတ်' : 'Recovery Score'}
            </span>
          </div>
        </div>

        {/* Readiness Recommendation Badge */}
        <div className="mb-2">
          {evaluation.readinessScore >= 80 ? (
            <div className="px-4 py-1.5 bg-cyan-500/10 border border-cyan-500/30 rounded-full inline-block shadow-[0_0_10px_rgba(6,182,212,0.2)]">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono">
                {lang === 'my' ? 'စွမ်းဆောင်ရည် အမြင့်ဆုံးလေ့ကျင့်နိုင် (Peak Ready)' : 'High Intensity Primed'}
              </span>
            </div>
          ) : evaluation.readinessScore >= 60 ? (
            <div className="px-4 py-1.5 bg-teal-500/10 border border-teal-500/30 rounded-full inline-block">
              <span className="text-xs font-bold text-teal-400 uppercase tracking-wider font-mono">
                {lang === 'my' ? 'ပုံမှန်လေ့ကျင့်နိုင် (Manage Strain)' : 'Moderate Load Recommended'}
              </span>
            </div>
          ) : (
            <div className="px-4 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-full inline-block shadow-[0_0_10px_rgba(245,158,11,0.25)]">
              <span className="text-xs font-bold text-amber-500 uppercase tracking-wider font-mono italic">
                {lang === 'my' ? 'အနားယူရန် လိုအပ်သည် (Active Recovery Advised)' : 'Active Recovery Advised'}
              </span>
            </div>
          )}
        </div>

        <p className="text-slate-300 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
          {evaluation.cnsRecoveryStatus} — {evaluation.injuryRiskAnalysis}
        </p>
      </div>

      {/* Physiological Insights & Coach Empathetic Verdict */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <h4 className="text-xs font-bold uppercase font-mono tracking-wider text-cyan-400 flex items-center gap-1.5 mb-2">
            <BrainCircuit className="h-4 w-4" />
            {t.physiologicalInsights}
          </h4>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {evaluation.physiologicalInsights}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#05070A]/80 border border-slate-800">
          <h4 className="text-xs font-bold uppercase font-mono tracking-wider text-cyan-400 flex items-center gap-1.5 mb-2">
            <HeartHandshake className="h-4 w-4 text-cyan-400" />
            {lang === 'my' ? 'နည်းပြ၏ အကြံပြုချက် (Coach Feedback)' : 'Coach Feedback'}
          </h4>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic">
            "{evaluation.coachSummary}"
          </p>
        </div>
      </div>

      {/* Actionable Protocols Section matching Immersive UI */}
      <div className="relative z-10 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h4 className="text-xs font-semibold text-cyan-400 uppercase tracking-[0.15em] flex items-center gap-2">
              <span className="w-1 h-3 bg-cyan-500 rounded-full" />
              {lang === 'my' ? '၃ ခုသော ပြန်လည်ကောင်းမွန်ရေး အလေ့အကျင့်များ' : '3 Actionable Recovery Habits'}
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {lang === 'my'
                ? 'Habits tab ထဲသို့ အလိုအလျောက် ထည့်သွင်းပေးထားပါသည်'
                : 'Automatically populated into the Actionable Recovery Habits tab'}
            </p>
          </div>
          
          {onViewHabits ? (
            <button
              id="view-habits-tab-btn"
              onClick={onViewHabits}
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30 hover:border-cyan-500/60 shadow-[0_0_12px_rgba(6,182,212,0.2)] transition-all cursor-pointer"
            >
              <CheckCircle className="h-4 w-4 text-cyan-400" />
              <span>{lang === 'my' ? 'Habits စာရင်းသို့ သွားမည်' : 'Open Habits Tab'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              id="adopt-habits-btn"
              onClick={() => onAdoptHabits(evaluation.actionableTodos)}
              disabled={habitsAdopted}
              className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-xl transition-all ${
                habitsAdopted
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 cursor-default'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.3)] cursor-pointer'
              }`}
            >
              {habitsAdopted ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  <span>{lang === 'my' ? 'ထည့်သွင်းပြီး' : 'Synced to Habits'}</span>
                </>
              ) : (
                <>
                  <span>{lang === 'my' ? 'စာရင်းသို့ ထည့်မည်' : 'Sync to Habits'}</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          )}
        </div>

        <div className="space-y-3">
          {evaluation.actionableTodos.map((todo, idx) => (
            <div
              key={todo.id || idx}
              className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-start gap-3.5 hover:border-slate-700 transition-colors"
            >
              <div className="w-6 h-6 rounded bg-cyan-500/20 border border-cyan-500/40 flex shrink-0 items-center justify-center text-cyan-400 font-bold text-xs font-mono">
                {idx + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                  <span className="text-sm font-semibold text-white">
                    {todo.title}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 uppercase">
                      {todo.category}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                      {todo.timing}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {todo.specifics}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

