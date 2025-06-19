
export interface JournalEntry {
  id: string;
  sessionId: string;
  sessionTitle: string;
  content: string;
  date: string;
  timestamp: any;
  emotionScale: number;
  wordCount: number;
  sleepQuality?: number;
  energyLevel?: number;
  goals?: string[];
  isDreamEntry?: boolean;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedDate?: string;
  progress?: number;
  maxProgress?: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  type: 'streak' | 'writing' | 'emotion' | 'goal' | 'special';
  progress: number;
  target: number;
  reward: string;
  unlocked: boolean;
}

export interface WeeklyChallenge {
  id: string;
  week: string;
  title: string;
  description: string;
  prompts: string[];
  completed: boolean;
  progress: number;
}
