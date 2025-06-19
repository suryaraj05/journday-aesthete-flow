
import { JournalEntry, Badge, Achievement, WeeklyChallenge } from '@/types/journal';

export class GamificationService {
  static generateBadges(entries: JournalEntry[]): Badge[] {
    const badges: Badge[] = [
      {
        id: 'first-entry',
        name: 'First Steps',
        description: 'Wrote your first journal entry',
        icon: '🌱',
        earned: entries.length >= 1,
        earnedDate: entries.length >= 1 ? entries[entries.length - 1].date : undefined
      },
      {
        id: 'week-warrior',
        name: 'Week Warrior',
        description: 'Journaled for 7 days',
        icon: '⚔️',
        earned: entries.length >= 7,
        progress: entries.length,
        maxProgress: 7
      },
      {
        id: 'emotion-explorer',
        name: 'Emotion Explorer',
        description: 'Experienced the full range of emotions',
        icon: '🎭',
        earned: this.hasFullEmotionRange(entries),
        progress: this.getEmotionRangeProgress(entries),
        maxProgress: 5
      },
      {
        id: 'wordsmith',
        name: 'Wordsmith',
        description: 'Wrote over 1000 words total',
        icon: '✍️',
        earned: this.getTotalWordCount(entries) >= 1000,
        progress: this.getTotalWordCount(entries),
        maxProgress: 1000
      },
      {
        id: 'consistency-king',
        name: 'Consistency Champion',
        description: 'Maintained a 7-day streak',
        icon: '👑',
        earned: this.calculateStreak(entries) >= 7,
        progress: this.calculateStreak(entries),
        maxProgress: 7
      },
      {
        id: 'deep-thinker',
        name: 'Deep Thinker',
        description: 'Wrote an entry over 500 words',
        icon: '🧠',
        earned: entries.some(e => (e.wordCount || 0) >= 500),
        progress: Math.max(...entries.map(e => e.wordCount || 0)),
        maxProgress: 500
      },
      {
        id: 'morning-person',
        name: 'Morning Person',
        description: 'Completed 10 morning sessions',
        icon: '🌅',
        earned: entries.filter(e => e.sessionId === 'morning').length >= 10,
        progress: entries.filter(e => e.sessionId === 'morning').length,
        maxProgress: 10
      },
      {
        id: 'gratitude-guru',
        name: 'Gratitude Guru',
        description: 'Practiced gratitude 15 times',
        icon: '🙏',
        earned: entries.filter(e => e.sessionId === 'gratitude').length >= 15,
        progress: entries.filter(e => e.sessionId === 'gratitude').length,
        maxProgress: 15
      }
    ];

    return badges.map(badge => ({
      ...badge,
      earnedDate: badge.earned && !badge.earnedDate ? new Date().toISOString() : badge.earnedDate
    }));
  }

  static generateAchievements(entries: JournalEntry[]): Achievement[] {
    const achievements: Achievement[] = [
      {
        id: 'streak-master',
        title: 'Streak Master',
        description: 'Maintain a 30-day journaling streak',
        type: 'streak',
        progress: this.calculateStreak(entries),
        target: 30,
        reward: 'Master Journaler Badge',
        unlocked: this.calculateStreak(entries) >= 30
      },
      {
        id: 'emotion-balance',
        title: 'Emotional Balance',
        description: 'Maintain an average emotion score of 4+ for a week',
        type: 'emotion',
        progress: this.getRecentEmotionAverage(entries, 7),
        target: 4,
        reward: 'Zen Master Title',
        unlocked: this.getRecentEmotionAverage(entries, 7) >= 4
      },
      {
        id: 'prolific-writer',
        title: 'Prolific Writer',
        description: 'Write 10,000 words total',
        type: 'writing',
        progress: this.getTotalWordCount(entries),
        target: 10000,
        reward: 'Author Badge',
        unlocked: this.getTotalWordCount(entries) >= 10000
      },
      {
        id: 'session-completist',
        title: 'Session Completist',
        description: 'Complete all 5 daily sessions in one day',
        type: 'special',
        progress: this.getMaxSessionsInDay(entries),
        target: 5,
        reward: 'Mindfulness Master',
        unlocked: this.getMaxSessionsInDay(entries) >= 5
      },
      {
        id: 'growth-seeker',
        title: 'Growth Seeker',
        description: 'Show consistent emotional improvement over 14 days',
        type: 'emotion',
        progress: this.getEmotionGrowthProgress(entries),
        target: 100,
        reward: 'Personal Growth Champion',
        unlocked: this.getEmotionGrowthProgress(entries) >= 100
      }
    ];

    return achievements;
  }

  static generateWeeklyChallenge(): WeeklyChallenge {
    const challenges = [
      {
        title: 'Gratitude Deep Dive',
        description: 'Write about 5 different things you\'re grateful for this week',
        prompts: [
          'What person in your life are you most grateful for and why?',
          'What simple pleasure brought you joy today?',
          'What challenge are you grateful for overcoming?',
          'What aspect of your health are you thankful for?',
          'What opportunity are you grateful to have?'
        ]
      },
      {
        title: 'Emotion Explorer',
        description: 'Experience and write about different emotions throughout the week',
        prompts: [
          'Describe a moment when you felt pure joy',
          'Write about something that made you feel peaceful',
          'Explore a time when you felt proud of yourself',
          'Reflect on a moment of curiosity or wonder',
          'Write about feeling connected to others'
        ]
      },
      {
        title: 'Future Self Visioning',
        description: 'Connect with your future self through intentional writing',
        prompts: [
          'Write a letter to yourself one year from now',
          'Describe your ideal typical day in 5 years',
          'What skills do you want to develop?',
          'What relationships do you want to nurture?',
          'What legacy do you want to create?'
        ]
      }
    ];

    const currentWeek = new Date().toISOString().split('T')[0];
    const randomChallenge = challenges[Math.floor(Math.random() * challenges.length)];

    return {
      id: `challenge-${currentWeek}`,
      week: currentWeek,
      title: randomChallenge.title,
      description: randomChallenge.description,
      prompts: randomChallenge.prompts,
      completed: false,
      progress: 0
    };
  }

  private static hasFullEmotionRange(entries: JournalEntry[]): boolean {
    const emotions = entries.map(e => e.emotionScale);
    return [1, 2, 3, 4, 5].every(emotion => emotions.includes(emotion));
  }

  private static getEmotionRangeProgress(entries: JournalEntry[]): number {
    const emotions = entries.map(e => e.emotionScale);
    const uniqueEmotions = new Set(emotions);
    return uniqueEmotions.size;
  }

  private static getTotalWordCount(entries: JournalEntry[]): number {
    return entries.reduce((sum, entry) => sum + (entry.wordCount || 0), 0);
  }

  private static calculateStreak(entries: JournalEntry[]): number {
    if (entries.length === 0) return 0;
    
    const today = new Date().toISOString().split('T')[0];
    const uniqueDates = [...new Set(entries.map(entry => entry.date))].sort().reverse();
    
    let streak = 0;
    let currentDate = new Date(today);
    
    for (const date of uniqueDates) {
      const entryDate = currentDate.toISOString().split('T')[0];
      if (date === entryDate) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    return streak;
  }

  private static getRecentEmotionAverage(entries: JournalEntry[], days: number): number {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    const recentEntries = entries.filter(e => new Date(e.date) >= cutoffDate);
    if (recentEntries.length === 0) return 0;
    
    return recentEntries.reduce((sum, e) => sum + e.emotionScale, 0) / recentEntries.length;
  }

  private static getMaxSessionsInDay(entries: JournalEntry[]): number {
    const sessionsByDay = entries.reduce((acc, entry) => {
      acc[entry.date] = (acc[entry.date] || new Set()).add(entry.sessionId);
      return acc;
    }, {} as Record<string, Set<string>>);

    return Math.max(0, ...Object.values(sessionsByDay).map(sessions => sessions.size));
  }

  private static getEmotionGrowthProgress(entries: JournalEntry[]): number {
    if (entries.length < 14) return 0;
    
    const sortedEntries = [...entries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const recent14 = sortedEntries.slice(-14);
    const first7 = recent14.slice(0, 7);
    const last7 = recent14.slice(7);
    
    const firstAvg = first7.reduce((sum, e) => sum + e.emotionScale, 0) / first7.length;
    const lastAvg = last7.reduce((sum, e) => sum + e.emotionScale, 0) / last7.length;
    
    return Math.max(0, Math.min(100, ((lastAvg - firstAvg) + 2) * 25)); // Normalize to 0-100
  }
}
