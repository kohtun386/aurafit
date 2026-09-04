import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
// Google Cloud Run uses process.env.PORT || 8080; AI Studio local dev proxy requires port 3000
const PORT: number = Number(
  process.env.NODE_ENV === 'production'
    ? (process.env.PORT || 8080)
    : (process.env.DEFAULT_APP_PORT || 3000)
);

app.use(express.json({ limit: '10mb' }));

// Rate Limiters to prevent quota depletion and automated API abuse
const evaluateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit each IP to 30 journal evaluations per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many evaluation requests from this IP. Please wait a few minutes.' },
});

const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 50 coaching chats per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many chat messages from this IP. Please wait a moment before sending more.' },
});

// Lazy getter for Google GenAI client
let genAIClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!genAIClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY is not set in environment. Gemini features will require key injection.');
    }
    genAIClient = new GoogleGenAI({
      apiKey: apiKey || '',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return genAIClient;
}

// Health check route
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'AuraFit Coach API',
    hasKey: Boolean(process.env.GEMINI_API_KEY),
    time: new Date().toISOString(),
  });
});

// Daily Journal Evaluation Endpoint
app.post('/api/coach/evaluate', evaluateLimiter, async (req, res) => {
  try {
    const { entry, profile, recentLogs, language = 'en' } = req.body;

    if (!entry || typeof entry !== 'object') {
      return res.status(400).json({ error: 'Valid journal entry data is required' });
    }

    // Numerical range validation
    const duration = Number(entry.durationMinutes);
    const rpe = Number(entry.rpe);
    const sleep = Number(entry.sleepHours);
    const soreness = Number(entry.sorenessLevel);

    if (isNaN(duration) || duration < 0 || duration > 1440) {
      return res.status(400).json({ error: 'Duration must be between 0 and 1440 minutes' });
    }
    if (isNaN(rpe) || rpe < 1 || rpe > 10) {
      return res.status(400).json({ error: 'RPE must be between 1 and 10' });
    }
    if (isNaN(sleep) || sleep < 0 || sleep > 24) {
      return res.status(400).json({ error: 'Sleep duration must be between 0 and 24 hours' });
    }
    if (isNaN(soreness) || soreness < 1 || soreness > 5) {
      return res.status(400).json({ error: 'Soreness level must be between 1 and 5' });
    }

    const ai = getGenAI();
    const isMyanmar = language === 'my' || /[\u1000-\u109F]/.test(entry.notes || '');

    const systemPrompt = `You are "AuraFit Coach", an elite AI athletic performance specialist, certified strength and conditioning coach (CSCS), and exercise physiologist.
Your core mission is to help athletes, gym-goers, and fitness enthusiasts balance high performance with optimal recovery, injury prevention, and daily habit consistency.

### Persona & Tone:
- Professional, motivating, scientifically grounded, and empathetic.
- Highly actionable: Do not provide vague fluff. Focus on specifics (sets, reps, rest periods, minutes, exact hydration amounts in ml/oz, electrolyte intake, specific mobility stretches with hold times, post-workout nutrition macros and timing).
- Safety-first: If the athlete reports high soreness (levels 4 or 5), sharp joint pain, or sleep deprivation (<6 hours), proactively advise active recovery or deloading to prevent injury. Flag injury risk clearly!
- Language: Respond in ${isMyanmar ? 'Myanmar / Burmese (မြန်မာဘာသာ)' : 'English'}. The tone should be natural, professional, and culturally fluent.

### Operational Mandate:
1. Review the athlete's workout volume, duration, RPE, sleep duration/quality, soreness level (1-5), sore muscle groups, and qualitative notes.
2. Calculate a scientifically informed Recovery Score / Readiness Score (0-100). (E.g., high soreness levels 4-5 or <6h sleep = low recovery score 35-55; moderate fatigue = 60-75; optimal sleep + low soreness = 85-98).
3. Provide personalized, motivating, and empathetic Coach Feedback in "coachSummary": Give a concise evaluation of their training volume vs recovery capacity, addressing their soreness, sleep, and next steps directly.
4. Evaluate Central Nervous System (CNS) status (e.g., "Optimum CNS Tone", "Mild Parasympathetic Fatigue", "Significant Neuromuscular Fatigue").
5. Determine Injury Risk Level: Exactly one of ["Low", "Moderate", "High", "Critical Deload Required"].
6. Extract and formulate EXACTLY 3 concrete, actionable recovery to-do items that the athlete must complete today or tomorrow:
   - Item 1 (Hydration): Exact water volume in ml/oz plus sodium/electrolyte restoration.
   - Item 2 (Mobility & Soft Tissue): Specific dynamic or static stretches/foam rolling targeting the sore muscles reported, with sets and hold times (e.g. 2x60s).
   - Item 3 (Nutrition or Sleep Protocol): Exact post-workout recovery macronutrients (protein/carbs in grams) or evening sleep protocol (e.g., magnesium, breathwork, blue-light mitigation).
7. Provide physiological insights explaining the "why" behind the recovery mechanics (e.g. myofibrillar micro-tears, glycogen replenishment, cortisol regulation, parasympathetic nervous activation).`;

    const userPromptContent = `Athlete Profile:
Name: ${profile?.name || 'Athlete'}
Primary Goal: ${profile?.primaryGoal || 'Strength & Performance'}
Experience: ${profile?.trainingExperience || 'Intermediate'}
Sport/Focus: ${profile?.sportOrDiscipline || 'Athletic Training'}
Known Injury History: ${profile?.injuryHistory || 'None reported'}

Today's Daily Journal Entry to Evaluate:
- Date: ${entry.date}
- Workout Type: ${entry.workoutType || 'General Workout'}
- Volume & Exercises: ${entry.volumeSummary || 'None reported'}
- Duration: ${entry.durationMinutes} minutes
- RPE Intensity (1-10): ${entry.rpe}/10
- Sleep Duration: ${entry.sleepHours} hours
- Sleep Quality: ${entry.sleepQuality}
- Soreness Level (1-5): ${entry.sorenessLevel}/5
- Sore Muscle Areas: ${(entry.soreMuscles || []).join(', ') || 'None specified'}
- Qualitative Notes: ${entry.notes || 'No extra notes'}

Recent Training Context:
${recentLogs && recentLogs.length > 0
  ? recentLogs.slice(0, 3).map((l: any) => `- [${l.date}] ${l.workoutType}, Soreness: ${l.sorenessLevel}/5, Sleep: ${l.sleepHours}h`).join('\n')
  : 'First recorded entry'}

Analyze this entry comprehensively. Return structured JSON matching the schema.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPromptContent,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            readinessScore: {
              type: Type.INTEGER,
              description: 'Athlete recovery and readiness score from 0 to 100',
            },
            cnsRecoveryStatus: {
              type: Type.STRING,
              description: 'Status of central nervous system and muscular recovery',
            },
            injuryRiskLevel: {
              type: Type.STRING,
              description: 'One of: Low, Moderate, High, Critical Deload Required',
            },
            injuryRiskAnalysis: {
              type: Type.STRING,
              description: 'Assessment of injury risks based on soreness and volume',
            },
            physiologicalInsights: {
              type: Type.STRING,
              description: 'Scientific exercise physiology explanation',
            },
            coachSummary: {
              type: Type.STRING,
              description: 'Coach verdict, encouraging, empathetic, and actionable advice',
            },
            actionableTodos: {
              type: Type.ARRAY,
              description: 'EXACTLY 3 concrete actionable recovery to-do items tailored for the athlete today or tomorrow',
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  category: {
                    type: Type.STRING,
                    description: 'One of: Hydration, Mobility, Nutrition, Sleep, Active Recovery, Workout Adjustment',
                  },
                  specifics: {
                    type: Type.STRING,
                    description: 'Precise numbers, sets, reps, ml, or duration',
                  },
                  timing: {
                    type: Type.STRING,
                    description: 'One of: Immediate, Today, Pre-Bed, Tomorrow Morning',
                  },
                },
                required: ['id', 'title', 'category', 'specifics', 'timing'],
              },
            },
          },
          required: [
            'readinessScore',
            'cnsRecoveryStatus',
            'injuryRiskLevel',
            'injuryRiskAnalysis',
            'physiologicalInsights',
            'coachSummary',
            'actionableTodos',
          ],
        },
      },
    });

    const text = response.text?.trim() || '{}';
    const parsedData = JSON.parse(text);

    // Ensure recovery readiness score is clamped between 0 and 100
    if (typeof parsedData.readinessScore === 'number') {
      parsedData.readinessScore = Math.max(0, Math.min(100, Math.round(parsedData.readinessScore)));
    } else {
      parsedData.readinessScore = entry.sorenessLevel >= 4 || entry.sleepHours < 6 ? 55 : 82;
    }

    // Ensure exactly 3 actionable recovery to-do items are populated
    const fallbackTemplates = [
      {
        id: `todo-${Date.now()}-1`,
        title: 'Targeted Hydration & Electrolytes',
        category: 'Hydration',
        specifics: `Drink 3.2L of mineral-rich water today with 400mg sodium to restore intracellular hydration following your ${entry.workoutType || 'workout'}.`,
        timing: 'Today',
      },
      {
        id: `todo-${Date.now()}-2`,
        title: 'Targeted Mobility & Soft Tissue Flush',
        category: 'Mobility',
        specifics: `Perform 10 minutes of gentle foam rolling and 2x45s static stretches on ${(entry.soreMuscles || []).join(', ') || 'sore muscle groups'}.`,
        timing: 'Today',
      },
      {
        id: `todo-${Date.now()}-3`,
        title: 'Muscle Synthesis & Glycogen Replenishment',
        category: 'Nutrition',
        specifics: 'Consume 30-40g high-quality leucine-rich protein paired with 50g complex carbohydrates within 2 hours.',
        timing: 'Immediate',
      },
    ];

    if (!Array.isArray(parsedData.actionableTodos) || parsedData.actionableTodos.length === 0) {
      parsedData.actionableTodos = fallbackTemplates;
    } else if (parsedData.actionableTodos.length > 3) {
      parsedData.actionableTodos = parsedData.actionableTodos.slice(0, 3);
    } else if (parsedData.actionableTodos.length < 3) {
      while (parsedData.actionableTodos.length < 3) {
        const nextIdx = parsedData.actionableTodos.length;
        parsedData.actionableTodos.push(fallbackTemplates[nextIdx]);
      }
    }

    return res.json({
      success: true,
      evaluation: parsedData,
    });
  } catch (error: any) {
    console.error('Error evaluating journal:', error);
    return res.status(500).json({
      error: 'Failed to evaluate journal entry with AuraFit Coach',
      details: error.message || String(error),
    });
  }
});

// Conversational Coaching Chat Endpoint
app.post('/api/coach/chat', chatLimiter, async (req, res) => {
  try {
    const { messages, athleteContext, language = 'en' } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Non-empty messages array is required' });
    }

    if (messages.length > 60) {
      return res.status(400).json({ error: 'Message history exceeds maximum limit (60 messages)' });
    }

    const ai = getGenAI();

    // Check if the latest user message or language preference is Myanmar
    const lastUserMessage = messages.filter((m) => m.role === 'user').slice(-1)[0]?.content || '';
    const isMyanmar = language === 'my' || /[\u1000-\u109F]/.test(lastUserMessage);

    const systemPrompt = `You are "AuraFit Coach", an elite AI athletic performance specialist, certified strength and conditioning coach (CSCS), and exercise physiologist.
Your core mission is to help athletes, gym-goers, and fitness enthusiasts balance high performance with optimal recovery, injury prevention, and daily habit consistency.

### Persona & Tone:
- Professional, motivating, scientifically grounded, and empathetic.
- Highly actionable: Do not provide vague fluff. Focus on specifics (exact sets, reps, minutes, hydration amounts in ml or oz, specific recovery protocols like contrast showers, PNF stretching, dynamic warmups, specific macronutrient timing).
- Safety-first: If a user reports high soreness, sharp pain, joint ache, or sleep deprivation, proactively advise active recovery or deloading to prevent injury. Always prioritize joint integrity and long-term athletic longevity.
- Language: Respond in the language used by the user. If the user asks in Myanmar (Burmese) or preferred language is Myanmar, respond fluently, naturally, and warmly in Myanmar (မြန်မာဘာသာ). If English, respond in English.

### Athlete Context:
- Athlete Name: ${athleteContext?.profile?.name || 'Athlete'}
- Primary Goal: ${athleteContext?.profile?.primaryGoal || 'Athletic Performance'}
- Experience Level: ${athleteContext?.profile?.trainingExperience || 'Intermediate'}
- Sport/Discipline: ${athleteContext?.profile?.sportOrDiscipline || 'General Training'}
- Bodyweight: ${athleteContext?.profile?.bodyWeightKg ? athleteContext.profile.bodyWeightKg + ' kg' : 'Not specified'}
- Known Injury History: ${athleteContext?.profile?.injuryHistory || 'None reported'}

${
  athleteContext?.latestEntry
    ? `Latest Logged Journal (${athleteContext.latestEntry.date}):
- Workout: ${athleteContext.latestEntry.workoutType} (Volume: ${athleteContext.latestEntry.volumeSummary || 'N/A'}, RPE: ${athleteContext.latestEntry.rpe}/10)
- Sleep: ${athleteContext.latestEntry.sleepHours}h (${athleteContext.latestEntry.sleepQuality})
- Soreness: ${athleteContext.latestEntry.sorenessLevel}/5 (Areas: ${(athleteContext.latestEntry.soreMuscles || []).join(', ') || 'None'})
- Notes: ${athleteContext.latestEntry.notes || 'None'}
- Readiness Score: ${athleteContext.latestEntry.evaluation?.readinessScore ?? 'N/A'}/100
- Injury Risk: ${athleteContext.latestEntry.evaluation?.injuryRiskLevel ?? 'N/A'}`
    : 'No recent workout journal logged yet.'
}

${
  athleteContext?.activeTodos && athleteContext.activeTodos.length > 0
    ? `Current Assigned Actionable Habits:
${athleteContext.activeTodos.map((t: any) => `- [${t.completed ? 'COMPLETED' : 'PENDING'}] ${t.title}: ${t.specifics} (${t.timing})`).join('\n')}`
    : ''
}

Always answer the user's questions dynamically, grounding your answer directly in their workout history, physiological load, and recovery metrics. Format with clean Markdown (bullet points, bold highlights, concise structured sections).`;

    // Prepare contents
    // Convert previous messages into contents array
    const contents = messages.map((m: any) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: contents,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      },
    });

    const reply = response.text || "I am here to coach you. Let's optimize your athletic performance and recovery.";

    return res.json({
      success: true,
      reply,
    });
  } catch (error: any) {
    console.error('Error in coach chat:', error);
    return res.status(500).json({
      error: 'AuraFit Coach conversation error',
      details: error.message || String(error),
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AuraFit Coach Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
