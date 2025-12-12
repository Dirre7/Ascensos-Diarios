export interface Habit {
  id: string;
  title: string;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'pink' | 'cyan';
  current: number;
  target: number;
  unit: string;
  iconName: 'water' | 'book' | 'meditate' | 'workout' | 'journal' | 'walk';
  incrementValue: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconName: 'streak' | 'level' | 'earlybird' | 'master';
  unlocked: boolean;
  color: string;
  category: 'streak' | 'level' | 'earlybird' | 'master';
  targetValue: number;
}

export interface HistoryEntry {
  date: string;
  completedHabitIds: string[];
}

export interface UserStats {
  totalMeditationMinutes: number;
  lastLoginDate: string;
  currentStreak: number;
  lastCompletionDate: string | null;
  earlyBirdCount: number;
  history: HistoryEntry[]; // Added history log
}

export interface UserState {
  level: number;
  currentXP: number;
  xpToNextLevel: number;
  stats: UserStats;
}