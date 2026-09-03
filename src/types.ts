export type SorenessLevel = 1 | 2 | 3 | 4 | 5;

export type InjuryRiskLevel = 'Low' | 'Moderate' | 'High' | 'Critical Deload Required';

export type TodoCategory = 
  | 'Hydration' 
  | 'Mobility' 
  | 'Nutrition' 
  | 'Sleep' 
  | 'Active Recovery' 
  | 'Workout Adjustment';

export interface ActionableTodo {
  id: string;
  title: string;
  category: TodoCategory;
  specifics: string; // e.g. "3.2L water with 500mg sodium", "Couch stretch 2x90s per side"
  timing: 'Immediate' | 'Today' | 'Pre-Bed' | 'Tomorrow Morning';
  completed: boolean;
  date: string;
}

export interface JournalEvaluation {
  readinessScore: number; // 0 - 100
  cnsRecoveryStatus: string; // e.g. "Optimum CNS Tone", "Mild Parasympathetic Fatigue", "Significant Neuromuscular Fatigue"
  injuryRiskLevel: InjuryRiskLevel;
  injuryRiskAnalysis: string; // Scientific physiological analysis
  physiologicalInsights: string; // Exercise physiology rationale
  coachSummary: string; // Motivational, empathetic, specific coaching verdict
  actionableTodos: Omit<ActionableTodo, 'completed'>[];
}

export interface JournalEntry {
  id: string;
  date: string; // YYYY-MM-DD
  workoutType: string; // e.g. "Heavy Lower Body / Squats", "Tempo Run 8km", "Upper Push Hypertrophy", "Active Rest"
  volumeSummary: string; // e.g. "Back Squats 4x5 @ 120kg, Romanian Deadlifts 3x8 @ 100kg, Walking Lunges"
  durationMinutes: number;
  rpe: number; // 1 - 10 (Rate of Perceived Exertion)
  sleepHours: number;
  sleepQuality: 'Poor' | 'Fair' | 'Good' | 'Optimal';
  sorenessLevel: SorenessLevel; // 1-5
  soreMuscles: string[]; // e.g. ["Hamstrings", "Lower Back", "Quadriceps"]
  notes: string; // Qualitative notes: nutrition, hydration, life stress, joint sensations
  evaluation?: JournalEvaluation;
  createdAt: string;
}

export interface AthleteProfile {
  name: string;
  primaryGoal: 'Strength & Power' | 'Hypertrophy' | 'Endurance & Stamina' | 'Functional Athleticism' | 'Injury Recovery';
  trainingExperience: 'Beginner' | 'Intermediate' | 'Advanced / Competitive Athlete';
  bodyWeightKg: number;
  sportOrDiscipline: string;
  injuryHistory: string;
  preferredLanguage: 'en' | 'my'; // English or Myanmar (Burmese)
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  quickPills?: string[];
}
