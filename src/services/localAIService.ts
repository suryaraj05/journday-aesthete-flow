
interface JournalEntry {
  content: string;
  emotionScale: number;
  date: string;
  sessionId: string;
  wordCount: number;
}

interface EmotionPattern {
  averageEmotion: number;
  trend: 'improving' | 'declining' | 'stable';
  patterns: string[];
}

interface AIInsight {
  type: 'emotion' | 'writing' | 'pattern' | 'goal';
  title: string;
  description: string;
  confidence: number;
}

// Simple keyword analysis for emotions
const emotionKeywords = {
  positive: ['happy', 'joy', 'excited', 'grateful', 'amazing', 'wonderful', 'great', 'good', 'love', 'beautiful', 'peaceful', 'calm', 'relaxed', 'accomplished', 'proud', 'confident'],
  negative: ['sad', 'angry', 'frustrated', 'worried', 'anxious', 'stressed', 'tired', 'overwhelmed', 'disappointed', 'hurt', 'afraid', 'lonely', 'depressed', 'exhausted'],
  goals: ['goal', 'achieve', 'accomplish', 'plan', 'target', 'objective', 'dream', 'aspire', 'hope', 'want', 'need', 'improve', 'better', 'change', 'grow']
};

export class LocalAIService {
  // Analyze emotion patterns over time
  static analyzeEmotionPatterns(entries: JournalEntry[]): EmotionPattern {
    if (entries.length === 0) {
      return { averageEmotion: 3, trend: 'stable', patterns: [] };
    }

    const sortedEntries = entries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const emotions = sortedEntries.map(e => e.emotionScale);
    const averageEmotion = emotions.reduce((sum, emotion) => sum + emotion, 0) / emotions.length;

    // Calculate trend (last 7 entries vs previous 7)
    let trend: 'improving' | 'declining' | 'stable' = 'stable';
    if (emotions.length >= 6) {
      const recent = emotions.slice(-3).reduce((sum, e) => sum + e, 0) / 3;
      const previous = emotions.slice(-6, -3).reduce((sum, e) => sum + e, 0) / 3;
      
      if (recent > previous + 0.3) trend = 'improving';
      else if (recent < previous - 0.3) trend = 'declining';
    }

    // Identify patterns
    const patterns: string[] = [];
    const sessionEmotions: { [key: string]: number[] } = {};
    
    sortedEntries.forEach(entry => {
      if (!sessionEmotions[entry.sessionId]) {
        sessionEmotions[entry.sessionId] = [];
      }
      sessionEmotions[entry.sessionId].push(entry.emotionScale);
    });

    // Find best performing session
    Object.entries(sessionEmotions).forEach(([sessionId, emotions]) => {
      const avg = emotions.reduce((sum, e) => sum + e, 0) / emotions.length;
      if (avg > 3.5) {
        patterns.push(`You tend to feel more positive during ${sessionId} sessions`);
      }
    });

    return { averageEmotion, trend, patterns };
  }

  // Generate writing insights
  static generateWritingInsights(entries: JournalEntry[]): AIInsight[] {
    const insights: AIInsight[] = [];

    if (entries.length === 0) return insights;

    // Word count analysis
    const totalWords = entries.reduce((sum, entry) => sum + entry.wordCount, 0);
    const avgWords = totalWords / entries.length;

    if (avgWords > 100) {
      insights.push({
        type: 'writing',
        title: 'Detailed Reflection',
        description: `You write an average of ${Math.round(avgWords)} words per entry, showing deep reflection.`,
        confidence: 0.8
      });
    }

    // Emotion trend analysis
    const emotionPattern = this.analyzeEmotionPatterns(entries);
    
    if (emotionPattern.trend === 'improving') {
      insights.push({
        type: 'emotion',
        title: 'Positive Trend',
        description: 'Your emotional well-being shows an improving trend over recent entries.',
        confidence: 0.9
      });
    } else if (emotionPattern.trend === 'declining') {
      insights.push({
        type: 'emotion',
        title: 'Needs Attention',
        description: 'Your recent entries suggest you might benefit from extra self-care.',
        confidence: 0.7
      });
    }

    // Consistency analysis
    const uniqueDays = new Set(entries.map(e => e.date)).size;
    const daysSinceFirst = entries.length > 0 ? 
      Math.ceil((new Date().getTime() - new Date(entries[0].date).getTime()) / (1000 * 60 * 60 * 24)) : 0;
    
    const consistency = daysSinceFirst > 0 ? uniqueDays / daysSinceFirst : 0;

    if (consistency > 0.7) {
      insights.push({
        type: 'pattern',
        title: 'Great Consistency',
        description: 'You maintain excellent journaling consistency, which supports mental clarity.',
        confidence: 0.95
      });
    }

    // Content analysis for goals
    const allContent = entries.map(e => e.content.toLowerCase()).join(' ');
    const goalWords = emotionKeywords.goals.filter(word => allContent.includes(word));
    
    if (goalWords.length > 5) {
      insights.push({
        type: 'goal',
        title: 'Goal-Oriented Mindset',
        description: 'Your entries frequently mention goals and aspirations, showing forward-thinking.',
        confidence: 0.75
      });
    }

    return insights.slice(0, 3); // Return top 3 insights
  }

  // Simple sentiment analysis using keyword matching
  static analyzeSentiment(text: string): { score: number; label: string } {
    const words = text.toLowerCase().split(/\W+/);
    let positiveCount = 0;
    let negativeCount = 0;

    words.forEach(word => {
      if (emotionKeywords.positive.includes(word)) positiveCount++;
      if (emotionKeywords.negative.includes(word)) negativeCount++;
    });

    const totalEmotionalWords = positiveCount + negativeCount;
    if (totalEmotionalWords === 0) {
      return { score: 0, label: 'Neutral' };
    }

    const score = (positiveCount - negativeCount) / totalEmotionalWords;
    
    let label = 'Neutral';
    if (score > 0.3) label = 'Positive';
    else if (score < -0.3) label = 'Negative';

    return { score, label };
  }

  // Generate personalized prompts based on patterns
  static generatePersonalizedPrompts(entries: JournalEntry[]): string[] {
    const defaultPrompts = [
      "What's one small thing that brought you joy today?",
      "How did you grow or learn something new recently?",
      "What are you most grateful for right now?"
    ];

    if (entries.length < 3) return defaultPrompts;

    const emotionPattern = this.analyzeEmotionPatterns(entries);
    const prompts: string[] = [];

    if (emotionPattern.trend === 'declining') {
      prompts.push(
        "What's one thing you can do today to nurture yourself?",
        "Who or what in your life brings you comfort and support?",
        "What's a small victory you can celebrate from this week?"
      );
    } else if (emotionPattern.trend === 'improving') {
      prompts.push(
        "What positive changes have you noticed in yourself lately?",
        "How can you build on the momentum you're feeling?",
        "What advice would you give to someone facing a similar challenge you overcame?"
      );
    }

    // Add session-specific prompts based on performance
    const recentContent = entries.slice(-5).map(e => e.content.toLowerCase()).join(' ');
    
    if (recentContent.includes('work') || recentContent.includes('job')) {
      prompts.push("How can you create better work-life balance?");
    }
    
    if (recentContent.includes('relationship') || recentContent.includes('friend')) {
      prompts.push("How do your relationships contribute to your well-being?");
    }

    return prompts.length > 0 ? prompts.slice(0, 3) : defaultPrompts;
  }
}
