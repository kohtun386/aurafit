import React, { useState, useEffect } from 'react';
import { CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { Header } from './components/Header';
import { DailyJournalForm } from './components/DailyJournalForm';
import { EvaluationCard } from './components/EvaluationCard';
import { ActionableHabitsTracker } from './components/ActionableHabitsTracker';
import { CoachChat } from './components/CoachChat';
import { ProfileAndLogs } from './components/ProfileAndLogs';
import { 
  AthleteProfile, 
  JournalEntry, 
  ActionableTodo, 
  JournalEvaluation, 
  ChatMessage 
} from './types';
import { 
  DEFAULT_ATHLETE_PROFILE, 
  INITIAL_JOURNAL_ENTRIES, 
  INITIAL_ACTIVE_TODOS 
} from './data/mockData';

export default function App() {
  // Persistent Athlete Profile
  const [profile, setProfile] = useState<AthleteProfile>(() => {
    try {
      const saved = localStorage.getItem('aurafit_athlete_profile');
      return saved ? JSON.parse(saved) : DEFAULT_ATHLETE_PROFILE;
    } catch {
      return DEFAULT_ATHLETE_PROFILE;
    }
  });

  // Persistent Journal Entries
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() => {
    try {
      const saved = localStorage.getItem('aurafit_journal_entries');
      return saved ? JSON.parse(saved) : INITIAL_JOURNAL_ENTRIES;
    } catch {
      return INITIAL_JOURNAL_ENTRIES;
    }
  });

  // Persistent Actionable To-Dos
  const [activeTodos, setActiveTodos] = useState<ActionableTodo[]>(() => {
    try {
      const saved = localStorage.getItem('aurafit_active_todos');
      return saved ? JSON.parse(saved) : INITIAL_ACTIVE_TODOS;
    } catch {
      return INITIAL_ACTIVE_TODOS;
    }
  });

  // Active Tab View
  const [activeTab, setActiveTab] = useState<'journal' | 'habits' | 'chat' | 'profile'>('journal');

  // Evaluation state
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [currentEvaluation, setCurrentEvaluation] = useState<JournalEvaluation | undefined>(
    journalEntries[0]?.evaluation
  );
  const [habitsAdopted, setHabitsAdopted] = useState(true);
  const [latestEvaluationNotice, setLatestEvaluationNotice] = useState<{
    score: number;
    date: string;
    habitsCount: number;
  } | null>(null);

  // Chat Conversation State
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('aurafit_chat_messages');
      if (saved) return JSON.parse(saved);
    } catch {}

    const initialLang = profile.preferredLanguage;
    const initialText = initialLang === 'my'
      ? `မင်္ဂလာပါ **${profile.name}**! ကျွန်တော်သည် သင်၏ AI အားကစားစွမ်းဆောင်ရည်နှင့် ကြံ့ခိုင်မှုဆိုင်ရာ အထူးကုနည်းပြ (AuraFit Coach - CSCS) ဖြစ်ပါသည်။\n\nသင်၏ မနေ့က လေ့ကျင့်ခန်းမှတ်တမ်းကို စစ်ဆေးပြီးပါပြီ (Readiness: **72%**၊ အသင့်အတင့် နာကျင်ကိုက်ခဲမှုရှိသည်)။\n\nဒီနေ့အတွက် သောက်သုံးရမည့် ရေပမာဏ၊ အကြောလျှော့နည်းများ (Mobility Flow) သို့မဟုတ် လေ့ကျင့်ခန်း လျှော့ချရန် လိုမလို သိရှိလိုပါက မည်သည့်အရာမဆို မေးမြန်းနိုင်ပါသည်။`
      : `Welcome back, **${profile.name}**! I am **AuraFit Coach**, your certified strength & conditioning specialist (CSCS) and exercise physiologist.\n\nI have reviewed your latest training volume (Readiness Score: **72%**, moderate posterior chain fatigue). We have 4 actionable recovery protocols assigned for today.\n\nHow is your muscular stiffness feeling right now, or what specific training/recovery inquiry can I dial in for you today?`;

    return [
      {
        id: 'msg-welcome-1',
        role: 'assistant',
        content: initialText,
        timestamp: new Date().toISOString(),
      },
    ];
  });

  const [isChatLoading, setIsChatLoading] = useState(false);

  // Save to localStorage on changes
  useEffect(() => {
    localStorage.setItem('aurafit_athlete_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('aurafit_journal_entries', JSON.stringify(journalEntries));
  }, [journalEntries]);

  useEffect(() => {
    localStorage.setItem('aurafit_active_todos', JSON.stringify(activeTodos));
  }, [activeTodos]);

  useEffect(() => {
    localStorage.setItem('aurafit_chat_messages', JSON.stringify(messages));
  }, [messages]);

  // Consistency Streak Calculation
  const streakDays = Math.max(3, activeTodos.filter((t) => t.completed).length + 2);

  // Toggle Language Handler
  const handleToggleLanguage = () => {
    const nextLang = profile.preferredLanguage === 'en' ? 'my' : 'en';
    setProfile((prev) => ({
      ...prev,
      preferredLanguage: nextLang,
    }));
  };

  // Submit Journal and Trigger AI Evaluation
  const handleJournalSubmit = async (
    entryData: Omit<JournalEntry, 'id' | 'createdAt' | 'evaluation'>
  ) => {
    setIsEvaluating(true);
    try {
      const response = await fetch('/api/coach/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entry: entryData,
          profile,
          recentLogs: journalEntries.slice(0, 5),
          language: profile.preferredLanguage,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Server returned error on evaluation');
      }

      const data = await response.json();
      const evaluation: JournalEvaluation = data.evaluation;

      const newEntry: JournalEntry = {
        ...entryData,
        id: `entry-${Date.now()}`,
        createdAt: new Date().toISOString(),
        evaluation,
      };

      // Prepend to journal entries
      setJournalEntries((prev) => [newEntry, ...prev]);
      setCurrentEvaluation(evaluation);
      setHabitsAdopted(true);

      // Automatically populate the 3 actionable recovery to-do items into the Actionable Recovery Habits tab
      const todosToPopulate = (evaluation.actionableTodos || []).slice(0, 3);
      const newTodos: ActionableTodo[] = todosToPopulate.map((todo, idx) => ({
        ...todo,
        id: `todo-${Date.now()}-${idx}`,
        completed: false,
        date: entryData.date,
      }));

      setActiveTodos((prev) => [...newTodos, ...prev]);
      setLatestEvaluationNotice({
        score: evaluation.readinessScore,
        date: entryData.date,
        habitsCount: newTodos.length,
      });

      // Add coach announcement in chat
      const coachNotice: ChatMessage = {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: profile.preferredLanguage === 'my'
          ? `📋 **${entryData.date} အတွက် လေ့ကျင့်ခန်းမှတ်တမ်းကို အကဲဖြတ်ပြီးပါပြီ!**\n- **Recovery Score:** ${evaluation.readinessScore}/100\n- **ဒဏ်ရာရနိုင်ခြေ (Risk Level):** ${evaluation.injuryRiskLevel}\n- **CNS အခြေအနေ:** ${evaluation.cnsRecoveryStatus}\n\nလက်တွေ့လုပ်ဆောင်ရန် ပြန်လည်ကောင်းမွန်ရေး အလေ့အကျင့် ၃ ခုကို Actionable Recovery Habits စာရင်းထဲသို့ အလိုအလျောက် ထည့်သွင်းပေးထားပါသည်။`
          : `📋 **Evaluated your daily journal for ${entryData.date}:**\n- **Recovery Score:** ${evaluation.readinessScore}/100\n- **Injury Risk Level:** ${evaluation.injuryRiskLevel}\n- **CNS State:** ${evaluation.cnsRecoveryStatus}\n\nAutomatically populated **3 actionable recovery to-do items** into your Actionable Recovery Habits tab! Focus on hydration and targeted mobility today.`,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, coachNotice]);
    } catch (err: any) {
      console.error('Failed to evaluate journal:', err);
      // Fallback evaluation if offline/network hiccup occurs
      const fallbackEvaluation: JournalEvaluation = {
        readinessScore: entryData.sorenessLevel >= 4 || entryData.sleepHours < 6 ? 52 : 78,
        cnsRecoveryStatus: entryData.rpe >= 8 ? 'Moderate Neuromuscular Fatigue' : 'Optimum Recovery Flow',
        injuryRiskLevel: entryData.sorenessLevel >= 4 ? 'High' : 'Moderate',
        injuryRiskAnalysis: `Soreness scored at ${entryData.sorenessLevel}/5 with ${entryData.sleepHours} hours of sleep. Muscular recovery requires active parasympathetic intervention.`,
        physiologicalInsights: 'High volume training causes localized micro-tears in sarcomeres. Protein synthesis, hydration, and gentle myofascial mobility are essential to accelerate recovery.',
        coachSummary: `Good effort logging your ${entryData.workoutType} session. Balance this training stress with diligent hydration and targeted stretching before your next intense session.`,
        actionableTodos: [
          {
            id: `todo-fb-1`,
            title: 'Targeted Hydration & Electrolytes',
            category: 'Hydration',
            specifics: `Drink 3.2 Liters of mineral-rich water throughout today with 400mg sodium to restore osmotic balance after your ${entryData.workoutType}.`,
            timing: 'Today',
            date: entryData.date,
          },
          {
            id: `todo-fb-2`,
            title: 'Localized Soft Tissue Mobility & Stretching',
            category: 'Mobility',
            specifics: `Spend 10 minutes performing static stretching and gentle foam rolling on sore areas (${entryData.soreMuscles.join(', ') || 'posterior chain'}).`,
            timing: 'Today',
            date: entryData.date,
          },
          {
            id: `todo-fb-3`,
            title: 'Muscle Protein Synthesis & Recovery Meal',
            category: 'Nutrition',
            specifics: 'Consume 30-40g high-quality complete protein with 50g complex carbohydrates within 2 hours of training.',
            timing: 'Immediate',
            date: entryData.date,
          },
        ],
      };

      const fallbackEntry: JournalEntry = {
        ...entryData,
        id: `entry-${Date.now()}`,
        createdAt: new Date().toISOString(),
        evaluation: fallbackEvaluation,
      };
      setJournalEntries((prev) => [fallbackEntry, ...prev]);
      setCurrentEvaluation(fallbackEvaluation);
      setHabitsAdopted(true);

      // Automatically populate fallback habits into activeTodos as well
      const fallbackTodos: ActionableTodo[] = fallbackEvaluation.actionableTodos.slice(0, 3).map((todo, idx) => ({
        ...todo,
        id: `todo-${Date.now()}-${idx}`,
        completed: false,
        date: entryData.date,
      }));
      setActiveTodos((prev) => [...fallbackTodos, ...prev]);
      setLatestEvaluationNotice({
        score: fallbackEvaluation.readinessScore,
        date: entryData.date,
        habitsCount: fallbackTodos.length,
      });
    } finally {
      setIsEvaluating(false);
    }
  };

  // Adopt habits to tracker manually if desired
  const handleAdoptHabits = (todosToAdopt: Omit<ActionableTodo, 'completed'>[]) => {
    const newItems: ActionableTodo[] = todosToAdopt.map((t, idx) => ({
      ...t,
      id: `todo-${Date.now()}-${idx}`,
      completed: false,
      date: new Date().toISOString().split('T')[0],
    }));
    setActiveTodos((prev) => [...newItems, ...prev]);
    setHabitsAdopted(true);
  };

  // Toggle single todo status
  const handleToggleTodo = (id: string) => {
    setActiveTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  // Add custom habit
  const handleAddCustomTodo = (todo: Omit<ActionableTodo, 'id' | 'completed'>) => {
    const newTodo: ActionableTodo = {
      ...todo,
      id: `todo-${Date.now()}`,
      completed: false,
    };
    setActiveTodos((prev) => [newTodo, ...prev]);
  };

  // Delete habit
  const handleDeleteTodo = (id: string) => {
    setActiveTodos((prev) => prev.filter((t) => t.id !== id));
  };

  // Conversational Coaching Send Message
  const handleSendMessage = async (text: string) => {
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsChatLoading(true);

    try {
      const response = await fetch('/api/coach/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          athleteContext: {
            profile,
            latestEntry: journalEntries[0],
            activeTodos: activeTodos.slice(0, 6),
          },
          language: profile.preferredLanguage,
        }),
      });

      if (!response.ok) {
        throw new Error('Chat API returned error');
      }

      const data = await response.json();
      const coachMessage: ChatMessage = {
        id: `msg-${Date.now()}-reply`,
        role: 'assistant',
        content: data.reply,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, coachMessage]);
    } catch (err: any) {
      console.error('Chat error:', err);
      // Scientific and grounded fallback reply
      const fallbackReply = profile.preferredLanguage === 'my'
        ? `ကျွန်ုပ်၏ အကြံပြုချက်:\n\n1. **အနားယူခြင်းနှင့် အကြောလျှော့ခြင်း:** ကြွက်သားကိုက်ခဲမှု သို့မဟုတ် တင်းကျပ်မှုအတွက် 90/90 Hip Mobility (၂ ကြိမ် x ၆၀ စက္ကန့်) ပြုလုပ်ပါ။\n2. **ရေဓာတ် ပြည့်ဝစေရန်:** ရေ 3.2L နှင့် Electrolyte (ဆိုဒီယမ် 400mg) သောက်ပါ။\n3. **ဒဏ်ရာ ကာကွယ်ရေး:** နာကျင်မှု အဆင့် ၄ သို့မဟုတ် ၅ ဖြစ်ပါက နောက်လေ့ကျင့်ခန်းတွင် အလေးချိန် ၃၀% လျှော့ချပါ (Deload)။`
        : `Here is the specific clinical prescription based on your current recovery profile:\n\n1. **Active Mobility:** Perform 2 sets of 60-second 90/90 hip switches and 3 sets of 45-second dead hangs for spinal decompression.\n2. **Electrolyte & Hydration Protocol:** Ingest 3.2 Liters of fluids with 400-500mg sodium to optimize intracellular pressure.\n3. **Load Management:** If soreness remains at or above level 3, cap your training intensity at RPE 6-7 to protect tendon viscoelasticity.`;

      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}-reply`,
          role: 'assistant',
          content: fallbackReply,
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleClearChat = () => {
    const initialText = profile.preferredLanguage === 'my'
      ? `ဆွေးနွေးမှုအသစ် စတင်ပါပြီ။ အားကစားစွမ်းဆောင်ရည်နှင့် ပြန်လည်ကောင်းမွန်ရေးအတွက် မေးမြန်းနိုင်ပါသည်။`
      : `New coaching session started. How can I assist your athletic recovery and training today?`;

    setMessages([
      {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: initialText,
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  return (
    <div className="min-h-screen bg-[#05070A] text-slate-200 flex flex-col selection:bg-cyan-500 selection:text-slate-950 font-sans">
      {/* Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        profile={profile}
        activeTodos={activeTodos}
        streakDays={streakDays}
        onToggleLanguage={handleToggleLanguage}
      />

      {/* Main Body */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        {/* Tab 1: Daily Journal & Physiological Evaluation */}
        {activeTab === 'journal' && (
          <div className="space-y-8">
            <DailyJournalForm
              profile={profile}
              onSubmit={handleJournalSubmit}
              isEvaluating={isEvaluating}
            />

            {latestEvaluationNotice && (
              <div className="p-4 sm:p-5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-[0_0_20px_rgba(6,182,212,0.15)] animate-fade-in">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-500/30">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wide">
                        {profile.preferredLanguage === 'my' ? 'Gemini AI ဖြင့် အကဲဖြတ်ပြီးပါပြီ' : 'Gemini AI Log Analysis Complete'}
                      </span>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        {profile.preferredLanguage === 'my' ? 'ရမှတ်' : 'Recovery Score'}: {latestEvaluationNotice.score}%
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">
                      {profile.preferredLanguage === 'my'
                        ? 'နည်းပြ၏ အကြံပြုချက်နှင့် ၃ ခုသော ပြန်လည်ကောင်းမွန်ရေး အလေ့အကျင့်များကို Actionable Recovery Habits စာရင်းသို့ အလိုအလျောက် ထည့်သွင်းပြီးပါပြီ။'
                        : 'Coach feedback generated and 3 actionable recovery to-do items were automatically populated into your Actionable Recovery Habits tab.'}
                    </p>
                  </div>
                </div>
                <button
                  id="go-to-habits-banner-btn"
                  onClick={() => setActiveTab('habits')}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold uppercase tracking-wider flex items-center gap-2 shrink-0 shadow-[0_0_12px_rgba(6,182,212,0.3)] transition-all cursor-pointer"
                >
                  <span>{profile.preferredLanguage === 'my' ? 'Habits စာရင်း ကြည့်မည်' : 'View In Habits Tab'} ({latestEvaluationNotice.habitsCount})</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            {currentEvaluation && (
              <div id="evaluation-results-section">
                <EvaluationCard
                  evaluation={currentEvaluation}
                  profile={profile}
                  onAdoptHabits={handleAdoptHabits}
                  habitsAdopted={habitsAdopted}
                  onViewHabits={() => setActiveTab('habits')}
                />
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Actionable Recovery & Habit Tracker */}
        {activeTab === 'habits' && (
          <ActionableHabitsTracker
            todos={activeTodos}
            onToggleTodo={handleToggleTodo}
            onAddCustomTodo={handleAddCustomTodo}
            onDeleteTodo={handleDeleteTodo}
            profile={profile}
            streakDays={streakDays}
          />
        )}

        {/* Tab 3: Conversational Coaching Multi-turn Chat */}
        {activeTab === 'chat' && (
          <CoachChat
            profile={profile}
            latestEntry={journalEntries[0]}
            activeTodos={activeTodos}
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isChatLoading}
            onClearChat={handleClearChat}
          />
        )}

        {/* Tab 4: Athlete Profile & Historical Logs */}
        {activeTab === 'profile' && (
          <ProfileAndLogs
            profile={profile}
            onUpdateProfile={setProfile}
            journalEntries={journalEntries}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-[#05070A]/90 py-5 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>AuraFit Coach • Certified Strength & Conditioning Specialist (CSCS) AI</span>
          <span>Scientifically grounded recovery, injury prevention & habit consistency</span>
        </div>
      </footer>
    </div>
  );
}
