import {
  collection,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  Unsubscribe,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { AthleteProfile, JournalEntry, ActionableTodo, ChatMessage } from '../types';

export const firestoreService = {
  // --- Athlete Profile ---
  async getProfile(userId: string): Promise<AthleteProfile | null> {
    const path = `users/${userId}`;
    try {
      const snap = await getDoc(doc(db, 'users', userId));
      if (snap.exists()) {
        const data = snap.data();
        return {
          name: data.name || '',
          primaryGoal: data.primaryGoal || 'Strength & Power',
          trainingExperience: data.trainingExperience || 'Intermediate',
          bodyWeightKg: data.bodyWeightKg || 75,
          sportOrDiscipline: data.sportOrDiscipline || 'General Fitness',
          injuryHistory: data.injuryHistory || '',
          preferredLanguage: data.preferredLanguage || 'en',
        };
      }
      return null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
    }
  },

  async saveProfile(userId: string, profile: AthleteProfile): Promise<void> {
    const path = `users/${userId}`;
    try {
      await setDoc(doc(db, 'users', userId), {
        userId,
        name: profile.name,
        primaryGoal: profile.primaryGoal,
        trainingExperience: profile.trainingExperience,
        bodyWeightKg: profile.bodyWeightKg,
        sportOrDiscipline: profile.sportOrDiscipline,
        injuryHistory: profile.injuryHistory || '',
        preferredLanguage: profile.preferredLanguage,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  // --- Journal Entries ---
  subscribeJournalEntries(
    userId: string,
    callback: (entries: JournalEntry[]) => void
  ): Unsubscribe {
    const path = `users/${userId}/journalEntries`;
    try {
      const q = query(collection(db, 'users', userId, 'journalEntries'), orderBy('date', 'desc'));
      return onSnapshot(
        q,
        (snapshot) => {
          const items: JournalEntry[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            items.push({
              id: docSnap.id,
              date: data.date,
              workoutType: data.workoutType,
              volumeSummary: data.volumeSummary || '',
              durationMinutes: data.durationMinutes || 0,
              rpe: data.rpe || 7,
              sleepHours: data.sleepHours || 7.5,
              sleepQuality: data.sleepQuality || 'Good',
              sorenessLevel: data.sorenessLevel || 2,
              soreMuscles: data.soreMuscles || [],
              notes: data.notes || '',
              evaluation: data.evaluation || undefined,
              createdAt: data.createdAt || new Date().toISOString(),
            });
          });
          callback(items);
        },
        (error) => {
          handleFirestoreError(error, OperationType.LIST, path);
        }
      );
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  },

  async saveJournalEntry(userId: string, entry: JournalEntry): Promise<void> {
    const path = `users/${userId}/journalEntries/${entry.id}`;
    try {
      await setDoc(doc(db, 'users', userId, 'journalEntries', entry.id), {
        id: entry.id,
        userId,
        date: entry.date,
        workoutType: entry.workoutType,
        volumeSummary: entry.volumeSummary,
        durationMinutes: entry.durationMinutes,
        rpe: entry.rpe,
        sleepHours: entry.sleepHours,
        sleepQuality: entry.sleepQuality,
        sorenessLevel: entry.sorenessLevel,
        soreMuscles: entry.soreMuscles,
        notes: entry.notes,
        evaluation: entry.evaluation || null,
        createdAt: entry.createdAt || new Date().toISOString(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async deleteJournalEntry(userId: string, entryId: string): Promise<void> {
    const path = `users/${userId}/journalEntries/${entryId}`;
    try {
      await deleteDoc(doc(db, 'users', userId, 'journalEntries', entryId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  // --- Habits ---
  subscribeHabits(
    userId: string,
    callback: (habits: ActionableTodo[]) => void
  ): Unsubscribe {
    const path = `users/${userId}/habits`;
    try {
      const q = query(collection(db, 'users', userId, 'habits'));
      return onSnapshot(
        q,
        (snapshot) => {
          const items: ActionableTodo[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            items.push({
              id: docSnap.id,
              title: data.title,
              category: data.category,
              specifics: data.specifics,
              timing: data.timing,
              completed: !!data.completed,
              date: data.date || '',
            });
          });
          callback(items);
        },
        (error) => {
          handleFirestoreError(error, OperationType.LIST, path);
        }
      );
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  },

  async saveHabit(userId: string, habit: ActionableTodo): Promise<void> {
    const path = `users/${userId}/habits/${habit.id}`;
    try {
      await setDoc(doc(db, 'users', userId, 'habits', habit.id), {
        id: habit.id,
        userId,
        title: habit.title,
        category: habit.category,
        specifics: habit.specifics,
        timing: habit.timing,
        completed: habit.completed,
        date: habit.date,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async updateHabitStatus(userId: string, habitId: string, completed: boolean): Promise<void> {
    const path = `users/${userId}/habits/${habitId}`;
    try {
      const ref = doc(db, 'users', userId, 'habits', habitId);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        await setDoc(ref, { ...snap.data(), completed }, { merge: true });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  },

  async deleteHabit(userId: string, habitId: string): Promise<void> {
    const path = `users/${userId}/habits/${habitId}`;
    try {
      await deleteDoc(doc(db, 'users', userId, 'habits', habitId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  // --- Chat Messages ---
  subscribeChatMessages(
    userId: string,
    callback: (messages: ChatMessage[]) => void
  ): Unsubscribe {
    const path = `users/${userId}/chatMessages`;
    try {
      const q = query(collection(db, 'users', userId, 'chatMessages'), orderBy('timestamp', 'asc'));
      return onSnapshot(
        q,
        (snapshot) => {
          const items: ChatMessage[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            items.push({
              id: docSnap.id,
              role: data.role,
              content: data.content,
              timestamp: data.timestamp,
            });
          });
          callback(items);
        },
        (error) => {
          handleFirestoreError(error, OperationType.LIST, path);
        }
      );
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  },

  async saveChatMessage(userId: string, message: ChatMessage): Promise<void> {
    const path = `users/${userId}/chatMessages/${message.id}`;
    try {
      await setDoc(doc(db, 'users', userId, 'chatMessages', message.id), {
        id: message.id,
        userId,
        role: message.role,
        content: message.content,
        timestamp: message.timestamp,
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },
};
