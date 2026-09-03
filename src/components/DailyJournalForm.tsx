import React, { useState } from 'react';
import { 
  Dumbbell, 
  Moon, 
  Activity, 
  AlertTriangle, 
  Sparkles, 
  Clock, 
  Flame, 
  ShieldAlert, 
  CheckCircle2 
} from 'lucide-react';
import { JournalEntry, SorenessLevel, AthleteProfile } from '../types';
import { MUSCLE_GROUPS, WORKOUT_CATEGORIES, UI_TRANSLATIONS } from '../data/mockData';

interface DailyJournalFormProps {
  profile: AthleteProfile;
  onSubmit: (entry: Omit<JournalEntry, 'id' | 'createdAt' | 'evaluation'>) => Promise<void>;
  isEvaluating: boolean;
}

export const DailyJournalForm: React.FC<DailyJournalFormProps> = ({
  profile,
  onSubmit,
  isEvaluating,
}) => {
  const lang = profile.preferredLanguage;
  const t = UI_TRANSLATIONS[lang];

  const todayStr = new Date().toISOString().split('T')[0];

  const [date, setDate] = useState(todayStr);
  const [workoutType, setWorkoutType] = useState(WORKOUT_CATEGORIES[0]);
  const [volumeSummary, setVolumeSummary] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [rpe, setRpe] = useState(7);
  const [sleepHours, setSleepHours] = useState(7.5);
  const [sleepQuality, setSleepQuality] = useState<'Poor' | 'Fair' | 'Good' | 'Optimal'>('Good');
  const [sorenessLevel, setSorenessLevel] = useState<SorenessLevel>(2);
  const [soreMuscles, setSoreMuscles] = useState<string[]>(['Hamstrings']);
  const [notes, setNotes] = useState('');

  const toggleMuscle = (muscle: string) => {
    if (soreMuscles.includes(muscle)) {
      setSoreMuscles(soreMuscles.filter((m) => m !== muscle));
    } else {
      setSoreMuscles([...soreMuscles, muscle]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      date,
      workoutType,
      volumeSummary,
      durationMinutes: Number(durationMinutes),
      rpe: Number(rpe),
      sleepHours: Number(sleepHours),
      sleepQuality,
      sorenessLevel,
      soreMuscles,
      notes,
    });
  };

  const getSorenessColor = (level: number) => {
    switch (level) {
      case 1:
        return 'border-cyan-500/40 bg-cyan-500/10 text-cyan-400';
      case 2:
        return 'border-teal-500/40 bg-teal-500/10 text-teal-300';
      case 3:
        return 'border-amber-500/50 bg-amber-500/15 text-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.25)]';
      case 4:
        return 'border-amber-500/70 bg-amber-500/20 text-amber-300 font-semibold shadow-[0_0_12px_rgba(245,158,11,0.4)]';
      case 5:
        return 'border-rose-500/80 bg-rose-500/25 text-rose-300 font-bold shadow-[0_0_12px_rgba(244,63,94,0.4)]';
      default:
        return 'border-slate-800 bg-slate-950 text-slate-300';
    }
  };

  const getSorenessDescription = (level: number) => {
    if (lang === 'my') {
      switch (level) {
        case 1: return 'လုံးဝမကိုက်ခဲ / လန်းဆန်းသည် (Fresh)';
        case 2: return 'အနည်းငယ် တင်းကျပ်မှုရှိသည် (Mild)';
        case 3: return 'အသင့်အတင့် နာကျင်ကိုက်ခဲသည် (Moderate DOMS)';
        case 4: return 'အလွန်ကိုက်ခဲပြီး လှုပ်ရှားရခက်သည် (High)';
        case 5: return 'ပြင်းထန်စွာ နာကျင်သည် / ဒဏ်ရာဖြစ်နိုင်ခြေ (Severe)';
        default: return '';
      }
    }
    switch (level) {
      case 1: return 'Level 1: Completely fresh / No soreness';
      case 2: return 'Level 2: Mild muscular tightness';
      case 3: return 'Level 3: Moderate DOMS (Delayed-Onset Muscle Soreness)';
      case 4: return 'Level 4: High soreness (Impacting movement & gait)';
      case 5: return 'Level 5: Severe soreness / Potential joint injury';
      default: return '';
    }
  };

  const isSafetyWarningTriggered = sorenessLevel >= 4 || sleepHours < 6;

  return (
    <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-2xl backdrop-blur-sm">
      <div className="flex items-center justify-between pb-5 border-b border-slate-800/80 mb-6">
        <div>
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-2">
            <span className="w-1 h-3 bg-cyan-500 rounded-full" />
            <span>{t.logWorkoutTitle}</span>
          </h2>
          <p className="text-xs text-slate-400">
            {lang === 'my' 
              ? 'လေ့ကျင့်ခန်းပမာဏ၊ အိပ်စက်ချိန်နှင့် နာကျင်မှုတို့ကို အကဲဖြတ်ရန် မှတ်တမ်းတင်ပါ'
              : 'Evaluate daily strain, neuromuscular fatigue, and recovery status with AuraFit Coach.'}
          </p>
        </div>
        <input
          type="date"
          id="journal-date-input"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="bg-[#05070A] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Workout Category & Duration */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              {lang === 'my' ? 'လေ့ကျင့်ခန်း အမျိုးအစား' : 'Workout Type / Focus'}
            </label>
            <select
              id="workout-type-select"
              value={workoutType}
              onChange={(e) => setWorkoutType(e.target.value)}
              className="w-full bg-[#05070A] border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:border-cyan-500 focus:outline-none transition-colors"
            >
              {WORKOUT_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-cyan-400" />
                {lang === 'my' ? 'ကြာချိန် (မိနစ်)' : 'Duration (Minutes)'}
              </span>
            </label>
            <input
              type="number"
              id="duration-input"
              min="0"
              max="300"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full bg-[#05070A] border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:border-cyan-500 focus:outline-none transition-colors font-mono"
            />
          </div>
        </div>

        {/* Volume & Exercises Summary */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              {t.volumeLabel}
            </label>
            <span className="text-[11px] text-slate-500 font-mono">
              {lang === 'my' ? 'Barbell Squat 4x5 100kg, RDL 3x8' : 'e.g. Squats 4x5 @ 120kg, Deadlifts 3x5, 5km tempo run'}
            </span>
          </div>
          <textarea
            id="volume-summary-input"
            rows={2}
            value={volumeSummary}
            onChange={(e) => setVolumeSummary(e.target.value)}
            placeholder={
              lang === 'my'
                ? 'ပြုလုပ်ခဲ့သော လေ့ကျင့်ခန်းများ၊ အလေးချိန်နှင့် အကြိမ်အရေအတွက် (Sets x Reps @ Weight)'
                : 'List main lifts, accessory sets, running split, or conditioning volume...'
            }
            className="w-full bg-[#05070A] border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:border-cyan-500 focus:outline-none transition-colors"
          />
        </div>

        {/* Session RPE & Sleep Grid with Immersive UI styling */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-5 rounded-2xl bg-[#05070A]/80 border border-slate-800">
          {/* RPE Exertion */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Flame className="h-4 w-4 text-amber-500" />
                {t.rpeLabel}
              </label>
              <span className="text-sm font-bold font-mono px-2 py-0.5 rounded bg-slate-900 text-amber-400 border border-amber-500/30 shadow-[0_0_8px_rgba(245,158,11,0.2)]">
                RPE {rpe}/10
              </span>
            </div>
            <input
              type="range"
              id="rpe-slider"
              min="1"
              max="10"
              value={rpe}
              onChange={(e) => setRpe(parseInt(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer h-1.5 bg-slate-800 rounded-full appearance-none"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1.5 font-mono uppercase tracking-wider">
              <span>1 (Light)</span>
              <span>5 (Moderate)</span>
              <span>8 (Hard)</span>
              <span>10 (Max)</span>
            </div>
          </div>

          {/* Sleep Hours & Quality */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Moon className="h-4 w-4 text-cyan-400" />
                {t.sleepLabel}
              </label>
              <span className="text-sm font-bold font-mono px-2 py-0.5 rounded bg-slate-900 text-cyan-400 border border-cyan-500/30 shadow-[0_0_8px_rgba(6,182,212,0.2)]">
                {sleepHours} hrs • {sleepQuality}
              </span>
            </div>
            <input
              type="range"
              id="sleep-slider"
              min="3"
              max="12"
              step="0.5"
              value={sleepHours}
              onChange={(e) => setSleepHours(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-full appearance-none mt-1"
            />
            <div className="grid grid-cols-4 gap-1.5 mt-2.5">
              {(['Poor', 'Fair', 'Good', 'Optimal'] as const).map((q) => (
                <button
                  type="button"
                  key={q}
                  onClick={() => setSleepQuality(q)}
                  className={`py-1 text-[10px] font-mono uppercase rounded-lg transition-all ${
                    sleepQuality === q
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_8px_rgba(6,182,212,0.2)]'
                      : 'bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-850'
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Muscle Soreness 1 to 5 Selector */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <span className="w-1 h-3 bg-amber-500 rounded-full" />
              {t.sorenessLabel}
            </label>
            <span className="text-xs font-mono text-slate-400">
              {getSorenessDescription(sorenessLevel)}
            </span>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {([1, 2, 3, 4, 5] as SorenessLevel[]).map((level) => {
              const isSelected = sorenessLevel === level;
              return (
                <button
                  type="button"
                  id={`soreness-level-${level}-btn`}
                  key={level}
                  onClick={() => setSorenessLevel(level)}
                  className={`py-3 rounded-xl border text-center transition-all ${
                    isSelected
                      ? `${getSorenessColor(level)} ring-1 ring-white/20 shadow-md`
                      : 'bg-[#05070A] border-slate-800 text-slate-400 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="text-base sm:text-lg font-bold font-mono">{level}</div>
                  <div className="text-[10px] uppercase font-medium mt-0.5">
                    {level === 1 ? 'None' : level === 2 ? 'Mild' : level === 3 ? 'Moderate' : level === 4 ? 'High' : 'Severe'}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sore Muscles Tags */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            {t.soreMusclesLabel}
          </label>
          <div className="flex flex-wrap gap-1.5">
            {MUSCLE_GROUPS.map((muscle) => {
              const isSore = soreMuscles.includes(muscle);
              return (
                <button
                  type="button"
                  key={muscle}
                  onClick={() => toggleMuscle(muscle)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isSore
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_8px_rgba(6,182,212,0.25)]'
                      : 'bg-[#05070A] text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-slate-300'
                  }`}
                >
                  {muscle}
                </button>
              );
            })}
          </div>
        </div>

        {/* Qualitative Notes */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
            {t.notesLabel}
          </label>
          <textarea
            id="qualitative-notes-input"
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={
              lang === 'my'
                ? 'ရေသောက်နှုန်း၊ စိတ်ဖိစီးမှု၊ အဆစ်အမြစ် နာကျင်မှု သို့မဟုတ် ကိုယ်လက် မအီမသာ ခံစားချက်များကို ရေးပါ...'
                : 'Note any joint stiffness, hydration deficit, work stress, nutritional intake, or sensations...'
            }
            className="w-full bg-[#05070A] border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:border-cyan-500 focus:outline-none transition-colors"
          />
        </div>

        {/* Safety-First Alert Banner */}
        {isSafetyWarningTriggered && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs sm:text-sm shadow-[0_0_12px_rgba(245,158,11,0.15)]">
            <ShieldAlert className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-200 uppercase tracking-wide text-xs">
                {lang === 'my' ? 'လုံခြုံရေး သတိပေးချက်: အနားယူရန်နှင့် နာကျင်မှုလျှော့ချရန် လိုအပ်ပါသည်' : 'Active Recovery Advised: Strain & Fatigue Threshold Exceeded'}
              </p>
              <p className="text-amber-300/80 mt-1 text-xs">
                {lang === 'my'
                  ? 'ကြွက်သားအလွန်ကိုက်ခဲမှု သို့မဟုတ် အိပ်ရေးပျက်မှုကြောင့် ဒဏ်ရာရနိုင်ခြေ မြင့်မားနေပါသည်။ နည်းပြမှ လေ့ကျင့်ခန်း လျှော့ချခြင်း (Deload) နှင့် ပြန်လည်ကောင်းမွန်ရေး အစီအစဉ်များကို ထုတ်ပေးပါမည်။'
                  : 'Soreness score ≥4 or sleep <6h warrants active recovery or deloading protocols to protect tendon elasticity and prevent overuse micro-trauma.'}
              </p>
            </div>
          </div>
        )}

        {/* Submit & AI Evaluate Button matching Immersive UI */}
        <div className="pt-2">
          <button
            type="submit"
            id="evaluate-journal-btn"
            disabled={isEvaluating}
            className="w-full py-4 px-6 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold uppercase text-xs sm:text-sm tracking-widest flex items-center justify-center gap-2.5 shadow-[0_0_20px_rgba(6,182,212,0.4)] disabled:opacity-50 transition-all cursor-pointer"
          >
            {isEvaluating ? (
              <>
                <div className="h-5 w-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>{t.evaluatingCoach}</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 fill-slate-950" />
                <span>{t.submitLog}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
