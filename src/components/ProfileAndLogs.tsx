import React, { useState } from 'react';
import { 
  User, 
  Dumbbell, 
  Calendar, 
  Activity, 
  ShieldAlert, 
  Save, 
  Check, 
  Flame, 
  Moon, 
  ChevronDown, 
  ChevronUp,
  Trash2
} from 'lucide-react';
import { AthleteProfile, JournalEntry } from '../types';
import { UI_TRANSLATIONS } from '../data/mockData';

interface ProfileAndLogsProps {
  profile: AthleteProfile;
  onUpdateProfile: (updated: AthleteProfile) => void;
  journalEntries: JournalEntry[];
  onSelectEntryForViewing?: (entry: JournalEntry) => void;
  onDeleteEntry?: (id: string) => void;
}

export const ProfileAndLogs: React.FC<ProfileAndLogsProps> = ({
  profile,
  onUpdateProfile,
  journalEntries,
  onSelectEntryForViewing,
  onDeleteEntry,
}) => {
  const lang = profile.preferredLanguage;
  const t = UI_TRANSLATIONS[lang];

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<AthleteProfile>({ ...profile });
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [expandedEntryId, setExpandedEntryId] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(formData);
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const avgReadiness = journalEntries.length > 0
    ? Math.round(
        journalEntries.reduce((acc, curr) => acc + (curr.evaluation?.readinessScore || 70), 0) /
          journalEntries.length
      )
    : 75;

  const avgSleep = journalEntries.length > 0
    ? (
        journalEntries.reduce((acc, curr) => acc + curr.sleepHours, 0) /
        journalEntries.length
      ).toFixed(1)
    : '7.5';

  return (
    <div className="space-y-6">
      {/* Athlete Profile Card */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-cyan-400 p-0.5 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <div className="h-full w-full bg-[#05070A] rounded-[14px] flex items-center justify-center text-cyan-400 font-bold text-xl font-mono">
                {profile.name.charAt(0)}
              </div>
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white uppercase tracking-tight flex items-center gap-2">
                {profile.name}
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                {profile.trainingExperience} • {profile.sportOrDiscipline}
              </p>
            </div>
          </div>

          <button
            id="edit-profile-btn"
            onClick={() => setIsEditing(!isEditing)}
            className="self-start sm:self-center px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 transition-colors"
          >
            {isEditing ? (lang === 'my' ? 'ပယ်ဖျက်မည်' : 'Cancel') : (lang === 'my' ? 'ကိုယ်ရေးပြင်ဆင်မည်' : 'Edit Profile')}
          </button>
        </div>

        {savedSuccess && (
          <div className="mt-4 p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono flex items-center gap-2">
            <Check className="h-4 w-4" />
            <span>{lang === 'my' ? 'ကိုယ်ရေးအချက်အလက်ကို သိမ်းဆည်းပြီးပါပြီ!' : 'Athlete profile updated successfully!'}</span>
          </div>
        )}

        {isEditing ? (
          <form onSubmit={handleSave} className="mt-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Athlete Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-900/60 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-100 focus:border-cyan-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Primary Goal
                </label>
                <select
                  value={formData.primaryGoal}
                  onChange={(e) => setFormData({ ...formData, primaryGoal: e.target.value as any })}
                  className="w-full bg-slate-900/60 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-100 focus:border-cyan-500 focus:outline-none"
                >
                  <option value="Strength & Power">Strength & Power</option>
                  <option value="Hypertrophy">Hypertrophy</option>
                  <option value="Endurance & Stamina">Endurance & Stamina</option>
                  <option value="Functional Athleticism">Functional Athleticism</option>
                  <option value="Injury Recovery">Injury Recovery</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Training Experience
                </label>
                <select
                  value={formData.trainingExperience}
                  onChange={(e) => setFormData({ ...formData, trainingExperience: e.target.value as any })}
                  className="w-full bg-slate-900/60 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-100 focus:border-cyan-500 focus:outline-none"
                >
                  <option value="Beginner">Beginner (0-1 year)</option>
                  <option value="Intermediate">Intermediate (1-4 years)</option>
                  <option value="Advanced / Competitive Athlete">Advanced / Competitive (4+ years)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Bodyweight (kg)
                </label>
                <input
                  type="number"
                  value={formData.bodyWeightKg}
                  onChange={(e) => setFormData({ ...formData, bodyWeightKg: parseFloat(e.target.value) || 75 })}
                  className="w-full bg-slate-900/60 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-100 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Sport or Discipline
                </label>
                <input
                  type="text"
                  value={formData.sportOrDiscipline}
                  onChange={(e) => setFormData({ ...formData, sportOrDiscipline: e.target.value })}
                  placeholder="e.g. Powerlifting, Running, CrossFit, General Fitness"
                  className="w-full bg-slate-900/60 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-100 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Injury History & Vulnerabilities (Safety Consideration)
                </label>
                <textarea
                  rows={2}
                  value={formData.injuryHistory}
                  onChange={(e) => setFormData({ ...formData, injuryHistory: e.target.value })}
                  placeholder="e.g. Lower back disc herniation L4-L5 in 2023, shoulder impingement..."
                  className="w-full bg-slate-900/60 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-100 focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold uppercase text-xs tracking-wider shadow-[0_0_12px_rgba(6,182,212,0.3)]"
              >
                <Save className="h-4 w-4" />
                <span>{lang === 'my' ? 'အချက်အလက် သိမ်းမည်' : 'Save Changes'}</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            <div className="p-4 rounded-2xl bg-[#05070A]/80 border border-slate-800">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Primary Goal</span>
              <p className="text-sm font-semibold text-slate-200 mt-1">{profile.primaryGoal}</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#05070A]/80 border border-slate-800">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Bodyweight</span>
              <p className="text-sm font-semibold text-slate-200 mt-1 font-mono">{profile.bodyWeightKg} kg</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#05070A]/80 border border-slate-800">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Avg Readiness</span>
              <p className="text-sm font-semibold text-cyan-400 mt-1 font-mono">{avgReadiness}%</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#05070A]/80 border border-slate-800">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Avg Sleep</span>
              <p className="text-sm font-semibold text-indigo-400 mt-1 font-mono">{avgSleep} hrs</p>
            </div>
          </div>
        )}
      </div>

      {/* Historical Logs List */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl backdrop-blur-sm">
        <div className="flex items-center justify-between pb-5 border-b border-slate-800 mb-5">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white uppercase tracking-tight flex items-center gap-2">
              <span className="w-1 h-3 bg-cyan-500 rounded-full" />
              {lang === 'my' ? 'ယခင် လေ့ကျင့်ခန်း မှတ်တမ်းများ' : 'Logged Training & Evaluation History'}
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              {lang === 'my' ? 'ရက်စွဲအလိုက် စွမ်းဆောင်ရည်နှင့် ပြန်လည်ကောင်းမွန်မှု အခြေအနေ' : 'Chronological archive of workouts, sleep, and recovery metrics'}
            </p>
          </div>
          <span className="text-xs font-mono font-bold px-3 py-1 rounded-xl bg-[#05070A] border border-slate-800 text-cyan-400">
            {journalEntries.length} {lang === 'my' ? 'ခု' : 'Entries'}
          </span>
        </div>

        <div className="space-y-3">
          {journalEntries.map((entry) => {
            const isExpanded = expandedEntryId === entry.id;
            return (
              <div
                key={entry.id}
                className="rounded-2xl border border-slate-800 bg-[#05070A]/80 overflow-hidden transition-colors"
              >
                <div
                  onClick={() => setExpandedEntryId(isExpanded ? null : entry.id)}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-slate-900/50 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-cyan-400">
                        {entry.date}
                      </span>
                      <span className="text-sm font-bold text-white">
                        {entry.workoutType}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-1">
                      {entry.volumeSummary || 'No specific exercises recorded'}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    {entry.evaluation && (
                      <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                        Readiness: {entry.evaluation.readinessScore}%
                      </span>
                    )}
                    <span className="text-xs text-slate-400 font-mono">
                      Soreness: {entry.sorenessLevel}/5
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="p-4 border-t border-slate-800 bg-slate-900/40 text-xs space-y-3">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-300">
                      <div>
                        <span className="text-slate-500 font-mono">Duration:</span> {entry.durationMinutes}m
                      </div>
                      <div>
                        <span className="text-slate-500 font-mono">RPE:</span> {entry.rpe}/10
                      </div>
                      <div>
                        <span className="text-slate-500 font-mono">Sleep:</span> {entry.sleepHours}h ({entry.sleepQuality})
                      </div>
                      <div>
                        <span className="text-slate-500 font-mono">Sore Areas:</span> {(entry.soreMuscles || []).join(', ') || 'None'}
                      </div>
                    </div>

                    {entry.notes && (
                      <div className="p-3 rounded-xl bg-[#05070A] border border-slate-800 text-slate-300">
                        <strong className="text-slate-400">Notes:</strong> {entry.notes}
                      </div>
                    )}

                    {entry.evaluation && (
                      <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/20 text-slate-300 space-y-1.5">
                        <div className="font-semibold text-cyan-400 flex items-center justify-between">
                          <span>Coach Verdict:</span>
                          <span className="font-mono text-[11px] text-slate-400">
                            Risk: {entry.evaluation.injuryRiskLevel}
                          </span>
                        </div>
                        <p className="italic text-slate-200">"{entry.evaluation.coachSummary}"</p>
                      </div>
                    )}

                    {onDeleteEntry && (
                      <div className="flex justify-end pt-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm(lang === 'my' ? 'ဤမှတ်တမ်းကို ဖျက်ရန် သေချာပါသလား?' : 'Are you sure you want to delete this log entry?')) {
                              onDeleteEntry(entry.id);
                            }
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-colors cursor-pointer"
                          title="Delete this training log"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>{lang === 'my' ? 'မှတ်တမ်းဖျက်မည်' : 'Delete Log'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
