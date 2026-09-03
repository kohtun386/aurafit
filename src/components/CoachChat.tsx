import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  Send, 
  Sparkles, 
  User, 
  Bot, 
  Activity, 
  AlertCircle, 
  Zap, 
  RefreshCw 
} from 'lucide-react';
import Markdown from 'react-markdown';
import { ChatMessage, AthleteProfile, JournalEntry, ActionableTodo } from '../types';
import { UI_TRANSLATIONS } from '../data/mockData';

interface CoachChatProps {
  profile: AthleteProfile;
  latestEntry?: JournalEntry;
  activeTodos: ActionableTodo[];
  messages: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  isLoading: boolean;
  onClearChat: () => void;
}

export const CoachChat: React.FC<CoachChatProps> = ({
  profile,
  latestEntry,
  activeTodos,
  messages,
  onSendMessage,
  isLoading,
  onClearChat,
}) => {
  const lang = profile.preferredLanguage;
  const t = UI_TRANSLATIONS[lang];

  const [inputMessage, setInputMessage] = useState('');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;
    const text = inputMessage.trim();
    setInputMessage('');
    await onSendMessage(text);
  };

  const handleQuickQuestion = (q: string) => {
    onSendMessage(q);
  };

  const quickQuestionsList = lang === 'my' 
    ? [
        'ဒူး/ပေါင် ကြွက်သား နာကျင်မှုအတွက် ဘာလုပ်ရမလဲ?',
        'ယနေ့အတွက် သောက်သုံးရန် လိုအပ်သော ရေပမာဏနှင့် ဆားဓာတ်',
        'အာရုံကြောစနစ် ပြန်လည်ကောင်းမွန်စေရန် အိပ်စက်နည်း',
        'နောက်လာမည့် လေ့ကျင့်ခန်းတွင် အလေးချိန် လျှော့ချရမလား (Deload)?',
      ]
    : [
        'How should I modify training for my knee/patellar soreness?',
        'Calculate my exact hydration & electrolyte protocol for today',
        'What are the best mobility stretches for tight hamstrings and hips?',
        'Do I need a deload week based on my recent training volume?',
      ];

  return (
    <div className="flex flex-col h-[750px] bg-[#05070A] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
      {/* Chat Header & Athlete Context Bar */}
      <div className="p-4 sm:px-6 border-b border-slate-800 bg-[#05070A]/90 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.25)]">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-white uppercase tracking-tight">
                AuraFit Coach Consultation
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
                CSCS / Physiologist
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {lang === 'my' ? 'အားကစားနှင့် ပြန်လည်ကောင်းမွန်ရေး တိုက်ရိုက်ဆွေးနွေးမှု' : 'Dynamic coaching grounded in your daily journal & readiness scores'}
            </p>
          </div>
        </div>

        {/* Live Context Badge */}
        <div className="flex items-center gap-2">
          {latestEntry?.evaluation && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
              <Activity className="h-3.5 w-3.5 text-cyan-400" />
              <span>Readiness: <strong className="text-cyan-400">{latestEntry.evaluation.readinessScore}%</strong></span>
            </div>
          )}

          <button
            onClick={onClearChat}
            className="p-2 text-slate-500 hover:text-slate-300 rounded-xl hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-colors"
            title="Reset Chat Session"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
            >
              {/* Avatar */}
              <div
                className={`h-8 w-8 rounded-xl shrink-0 flex items-center justify-center text-xs font-bold ${
                  isUser
                    ? 'bg-slate-800 text-slate-300 border border-slate-700'
                    : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                }`}
              >
                {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  isUser
                    ? 'bg-cyan-500 text-slate-950 font-medium rounded-tr-none shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                    : 'bg-slate-900/60 border border-slate-800 text-slate-200 rounded-tl-none shadow-sm'
                }`}
              >
                {isUser ? (
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                ) : (
                  <div className="prose prose-invert prose-sm max-w-none text-slate-200 space-y-2 leading-relaxed">
                    <Markdown>{msg.content}</Markdown>
                  </div>
                )}
                <div
                  className={`text-[10px] mt-1.5 font-mono ${
                    isUser ? 'text-slate-900/70 text-right' : 'text-slate-500'
                  }`}
                >
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading Bubble */}
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center shrink-0">
              <Bot className="h-4 w-4" />
            </div>
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
              <div className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse delay-150" />
              <div className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse delay-300" />
              <span className="text-xs text-slate-400 ml-1">
                {lang === 'my' ? 'AuraFit နည်းပြ စဉ်းစားနေပါသည်...' : 'AuraFit Coach is formulating specific protocol...'}
              </span>
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Quick Consultation Chips */}
      <div className="px-4 py-3 border-t border-slate-800/60 bg-[#05070A]/60">
        <div className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5" />
          {t.quickQuestions}:
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {quickQuestionsList.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleQuickQuestion(q)}
              className="text-xs px-3.5 py-1.5 rounded-xl bg-slate-900/70 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-cyan-500/30 whitespace-nowrap transition-colors cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <form onSubmit={handleSubmit} className="p-4 bg-[#05070A] border-t border-slate-800">
        <div className="flex items-center gap-2">
          <input
            type="text"
            id="chat-input-field"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={t.askCoachPrompt}
            disabled={isLoading}
            className="flex-1 bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:outline-none transition-colors"
          />
          <button
            type="submit"
            id="chat-send-btn"
            disabled={!inputMessage.trim() || isLoading}
            className="px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 disabled:opacity-40 transition-all cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.4)]"
          >
            <Send className="h-4 w-4" />
            <span className="hidden sm:inline">{t.send}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
