import React, { useState } from 'react';
import { 
  ClipboardCheck, 
  Droplets, 
  Activity, 
  Apple, 
  Moon, 
  Zap, 
  ShieldCheck, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Circle, 
  Flame, 
  Clock 
} from 'lucide-react';
import { ActionableTodo, TodoCategory, AthleteProfile } from '../types';
import { UI_TRANSLATIONS } from '../data/mockData';

interface ActionableHabitsTrackerProps {
  todos: ActionableTodo[];
  onToggleTodo: (id: string) => void;
  onAddCustomTodo: (todo: Omit<ActionableTodo, 'id' | 'completed'>) => void;
  onDeleteTodo: (id: string) => void;
  profile: AthleteProfile;
  streakDays: number;
}

export const ActionableHabitsTracker: React.FC<ActionableHabitsTrackerProps> = ({
  todos,
  onToggleTodo,
  onAddCustomTodo,
  onDeleteTodo,
  profile,
  streakDays,
}) => {
  const lang = profile.preferredLanguage;
  const t = UI_TRANSLATIONS[lang];

  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Custom Habit Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<TodoCategory>('Hydration');
  const [newSpecifics, setNewSpecifics] = useState('');
  const [newTiming, setNewTiming] = useState<'Immediate' | 'Today' | 'Pre-Bed' | 'Tomorrow Morning'>('Today');

  const totalCount = todos.length;
  const completedCount = todos.filter((t) => t.completed).length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const filteredTodos = todos.filter((t) => {
    if (selectedFilter === 'pending') return !t.completed;
    if (selectedFilter === 'completed') return t.completed;
    return true;
  });

  const getCategoryIcon = (category: TodoCategory) => {
    switch (category) {
      case 'Hydration':
        return <Droplets className="h-4 w-4 text-cyan-400" />;
      case 'Mobility':
        return <Activity className="h-4 w-4 text-cyan-400" />;
      case 'Nutrition':
        return <Apple className="h-4 w-4 text-emerald-400" />;
      case 'Sleep':
        return <Moon className="h-4 w-4 text-indigo-400" />;
      case 'Active Recovery':
        return <Zap className="h-4 w-4 text-amber-400" />;
      case 'Workout Adjustment':
      default:
        return <ShieldCheck className="h-4 w-4 text-orange-400" />;
    }
  };

  const getCategoryStyle = (category: TodoCategory) => {
    switch (category) {
      case 'Hydration':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      case 'Mobility':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      case 'Nutrition':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Sleep':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
      case 'Active Recovery':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30 shadow-[0_0_8px_rgba(245,158,11,0.2)]';
      case 'Workout Adjustment':
      default:
        return 'bg-orange-500/15 text-orange-400 border-orange-500/30';
    }
  };

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newSpecifics.trim()) return;

    onAddCustomTodo({
      title: newTitle.trim(),
      category: newCategory,
      specifics: newSpecifics.trim(),
      timing: newTiming,
      date: new Date().toISOString().split('T')[0],
    });

    setNewTitle('');
    setNewSpecifics('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Progress & Consistency Card */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-1 h-3 bg-cyan-500 rounded-full" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                {lang === 'my' ? 'နည်းပြသတ်မှတ်ထားသော နေ့စဉ် အလေ့အကျင့်များ' : 'Daily Actionable Recovery & Habit Protocol'}
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {lang === 'my'
                ? 'လေ့ကျင့်ခန်းအပြီး ပြန်လည်ကောင်းမွန်ရေးအတွက် တိကျသော အလေ့အကျင့်များကို လုပ်ဆောင်ပါ'
                : 'Concrete physiological prescriptions: hydration quantities, precise mobility flows, and recovery nutrients.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-mono font-semibold shadow-[0_0_8px_rgba(245,158,11,0.2)]">
              <Flame className="h-4 w-4 fill-amber-400/20" />
              <span>{streakDays} {lang === 'my' ? 'ရက် စွဲမြဲမှု' : 'Days Consistency'}</span>
            </div>

            <button
              id="add-custom-habit-btn"
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold uppercase tracking-wider shadow-[0_0_12px_rgba(6,182,212,0.3)] transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4 stroke-[3]" />
              <span>{lang === 'my' ? 'အသစ်ထည့်မည်' : 'Add Habit'}</span>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6 pt-5 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs font-medium mb-2">
            <span className="text-slate-400 font-mono">
              {completedCount} of {totalCount} {lang === 'my' ? 'ခု ပြီးစီးပါပြီ' : 'Protocols Completed'}
            </span>
            <span className="text-cyan-400 font-mono font-bold">{progressPercent}%</span>
          </div>
          <div className="w-full h-2 bg-[#05070A] rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-cyan-500 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 mt-5">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors ${
              selectedFilter === 'all'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_8px_rgba(6,182,212,0.2)]'
                : 'bg-[#05070A] text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            {lang === 'my' ? 'အားလုံး' : 'All'} ({totalCount})
          </button>
          <button
            onClick={() => setSelectedFilter('pending')}
            className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors ${
              selectedFilter === 'pending'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_8px_rgba(6,182,212,0.2)]'
                : 'bg-[#05070A] text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            {lang === 'my' ? 'လုပ်ဆောင်ရန်ကျန်' : 'Pending'} ({totalCount - completedCount})
          </button>
          <button
            onClick={() => setSelectedFilter('completed')}
            className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors ${
              selectedFilter === 'completed'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_8px_rgba(6,182,212,0.2)]'
                : 'bg-[#05070A] text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            {lang === 'my' ? 'ပြီးစီးပြီး' : 'Completed'} ({completedCount})
          </button>
        </div>
      </div>

      {/* Habits List */}
      <div className="space-y-3">
        {filteredTodos.length === 0 ? (
          <div className="p-8 text-center bg-slate-900/40 border border-slate-800 rounded-2xl text-slate-400 text-sm">
            {lang === 'my'
              ? 'လုပ်ဆောင်ရန် အလေ့အကျင့် မရှိသေးပါ။ နေ့စဉ်မှတ်တမ်း ရေးသွင်း၍ နည်းပြထံမှ ရယူပါ!'
              : 'No habits found in this view. Log a daily workout journal to generate personalized recovery habits!'}
          </div>
        ) : (
          filteredTodos.map((todo) => (
            <div
              key={todo.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                todo.completed
                  ? 'bg-[#05070A]/80 border-slate-800/80 opacity-70'
                  : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 shadow-md'
              }`}
            >
              <div className="flex items-start gap-3.5">
                {/* Custom Checkbox Button */}
                <button
                  type="button"
                  id={`toggle-todo-${todo.id}`}
                  onClick={() => onToggleTodo(todo.id)}
                  className="mt-0.5 text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer shrink-0"
                >
                  {todo.completed ? (
                    <CheckCircle2 className="h-6 w-6 text-cyan-400 fill-cyan-500/20 shadow-[0_0_8px_rgba(6,182,212,0.4)]" />
                  ) : (
                    <Circle className="h-6 w-6 text-slate-600 hover:text-cyan-400 transition-colors" />
                  )}
                </button>

                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-mono font-semibold border ${getCategoryStyle(
                        todo.category
                      )}`}
                    >
                      {getCategoryIcon(todo.category)}
                      <span>{todo.category}</span>
                    </span>

                    <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-[#05070A] border border-slate-800 text-slate-400">
                      <Clock className="h-3 w-3 text-cyan-400" />
                      {todo.timing}
                    </span>
                  </div>

                  <h3
                    className={`text-sm sm:text-base font-semibold ${
                      todo.completed ? 'line-through text-slate-500' : 'text-white'
                    }`}
                  >
                    {todo.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 font-mono leading-relaxed bg-[#05070A]/80 px-3 py-2 rounded-xl border border-slate-800/80">
                    {todo.specifics}
                  </p>
                </div>
              </div>

              {/* Action: Delete habit */}
              <button
                type="button"
                onClick={() => onDeleteTodo(todo.id)}
                className="text-zinc-600 hover:text-rose-400 p-1.5 rounded-lg hover:bg-zinc-800 transition-colors shrink-0"
                title="Remove habit"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Add Custom Habit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#05070A] border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white uppercase flex items-center gap-2">
              <span className="w-1 h-3 bg-cyan-500 rounded-full" />
              {lang === 'my' ? 'စိတ်ကြိုက် အလေ့အကျင့် အသစ်ထည့်ရန်' : 'Add Custom Athletic Habit'}
            </h3>

            <form onSubmit={handleCreateCustom} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  {lang === 'my' ? 'ခေါင်းစဉ်' : 'Habit Title'}
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., Hip Flexor Mobility Routine"
                  className="w-full bg-slate-900/60 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    {lang === 'my' ? 'ကဏ္ဍ' : 'Category'}
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as TodoCategory)}
                    className="w-full bg-slate-900/60 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="Hydration">Hydration</option>
                    <option value="Mobility">Mobility</option>
                    <option value="Nutrition">Nutrition</option>
                    <option value="Sleep">Sleep</option>
                    <option value="Active Recovery">Active Recovery</option>
                    <option value="Workout Adjustment">Workout Adjustment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    {lang === 'my' ? 'အချိန်ကာလ' : 'Timing'}
                  </label>
                  <select
                    value={newTiming}
                    onChange={(e) => setNewTiming(e.target.value as any)}
                    className="w-full bg-slate-900/60 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="Immediate">Immediate</option>
                    <option value="Today">Today</option>
                    <option value="Pre-Bed">Pre-Bed</option>
                    <option value="Tomorrow Morning">Tomorrow Morning</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  {lang === 'my' ? 'တိကျသော ညွှန်ကြားချက် (Sets/Reps/ml/mins)' : 'Specifics (Sets, Reps, ml, grams)'}
                </label>
                <textarea
                  rows={2}
                  required
                  value={newSpecifics}
                  onChange={(e) => setNewSpecifics(e.target.value)}
                  placeholder="e.g., 2 sets of 60 seconds couch stretch per leg"
                  className="w-full bg-slate-900/60 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold uppercase text-xs tracking-wider shadow-[0_0_12px_rgba(6,182,212,0.3)]"
                >
                  Save Habit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
