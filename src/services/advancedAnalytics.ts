
import { JournalEntry } from '@/types/journal';

export interface PersonalGrowthMilestone {
  date: string;
  type: 'emotional' | 'writing' | 'consistency' | 'goal';
  title: string;
  description: string;
  emotionBefore: number;
  emotionAfter: number;
  significance: number;
}

export interface TriggerPattern {
  trigger: string;
  frequency: number;
  averageEmotionImpact: number;
  timePattern: string[];
  relatedWords: string[];
}

export interface WritingDNA {
  averageWordCount: number;
  vocabularyRichness: number;
  emotionalRange: number;
  consistencyScore: number;
  growthTrend: 'improving' | 'stable' | 'declining';
  personalityTraits: string[];
}

export interface EnergyPattern {
  timeOfDay: string;
  averageEmotion: number;
  wordCount: number;
  frequency: number;
  suggestedPrompt: string;
}

export class AdvancedAnalytics {
  static generatePersonalGrowthTimeline(entries: JournalEntry[]): PersonalGrowthMilestone[] {
    const milestones: PersonalGrowthMilestone[] = [];
    const sortedEntries = [...entries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    // Emotional breakthroughs (significant emotion improvements)
    for (let i = 7; i < sortedEntries.length; i++) {
      const recentWeek = sortedEntries.slice(i - 7, i);
      const currentWeek = sortedEntries.slice(i, i + 7);
      
      const recentAvg = recentWeek.reduce((sum, e) => sum + e.emotionScale, 0) / recentWeek.length;
      const currentAvg = currentWeek.reduce((sum, e) => sum + e.emotionScale, 0) / currentWeek.length;
      
      if (currentAvg - recentAvg >= 1.5) {
        milestones.push({
          date: sortedEntries[i].date,
          type: 'emotional',
          title: 'Emotional Breakthrough',
          description: 'Significant improvement in emotional well-being',
          emotionBefore: recentAvg,
          emotionAfter: currentAvg,
          significance: currentAvg - recentAvg
        });
      }
    }

    // Writing evolution milestones
    const wordCounts = sortedEntries.map(e => e.wordCount || 0);
    const avgWordCount = wordCounts.reduce((sum, count) => sum + count, 0) / wordCounts.length;
    
    sortedEntries.forEach((entry, index) => {
      if ((entry.wordCount || 0) > avgWordCount * 2 && index > 10) {
        milestones.push({
          date: entry.date,
          type: 'writing',
          title: 'Writing Expansion',
          description: 'Reached new depths in self-expression',
          emotionBefore: 0,
          emotionAfter: 0,
          significance: (entry.wordCount || 0) / avgWordCount
        });
      }
    });

    return milestones.slice(0, 10); // Return top 10 milestones
  }

  static detectTriggerPatterns(entries: JournalEntry[]): TriggerPattern[] {
    const commonTriggers = ['work', 'family', 'stress', 'health', 'relationship', 'money', 'sleep', 'weather'];
    const patterns: TriggerPattern[] = [];

    commonTriggers.forEach(trigger => {
      const relatedEntries = entries.filter(entry => 
        entry.content.toLowerCase().includes(trigger.toLowerCase())
      );

      if (relatedEntries.length >= 3) {
        const avgEmotion = relatedEntries.reduce((sum, e) => sum + e.emotionScale, 0) / relatedEntries.length;
        const overallAvg = entries.reduce((sum, e) => sum + e.emotionScale, 0) / entries.length;
        
        patterns.push({
          trigger,
          frequency: relatedEntries.length,
          averageEmotionImpact: avgEmotion - overallAvg,
          timePattern: relatedEntries.map(e => new Date(e.date).toLocaleDateString()),
          relatedWords: this.extractRelatedWords(relatedEntries, trigger)
        });
      }
    });

    return patterns.sort((a, b) => Math.abs(b.averageEmotionImpact) - Math.abs(a.averageEmotionImpact));
  }

  static analyzeWritingDNA(entries: JournalEntry[]): WritingDNA {
    if (entries.length === 0) {
      return {
        averageWordCount: 0,
        vocabularyRichness: 0,
        emotionalRange: 0,
        consistencyScore: 0,
        growthTrend: 'stable',
        personalityTraits: []
      };
    }

    const wordCounts = entries.map(e => e.wordCount || 0);
    const emotions = entries.map(e => e.emotionScale);
    
    // Calculate vocabulary richness
    const allWords = entries.flatMap(e => e.content.toLowerCase().split(/\s+/));
    const uniqueWords = new Set(allWords);
    const vocabularyRichness = uniqueWords.size / allWords.length;

    // Emotional range
    const emotionalRange = Math.max(...emotions) - Math.min(...emotions);

    // Consistency score (how regular the entries are)
    const dates = entries.map(e => new Date(e.date).getTime());
    const intervals = dates.slice(1).map((date, i) => date - dates[i]);
    const avgInterval = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;
    const consistencyScore = Math.max(0, 1 - (intervals.reduce((sum, interval) => sum + Math.abs(interval - avgInterval), 0) / intervals.length) / avgInterval);

    // Growth trend
    const recentEntries = entries.slice(-10);
    const earlierEntries = entries.slice(0, 10);
    const recentAvgEmotion = recentEntries.reduce((sum, e) => sum + e.emotionScale, 0) / recentEntries.length;
    const earlierAvgEmotion = earlierEntries.reduce((sum, e) => sum + e.emotionScale, 0) / earlierEntries.length;
    
    let growthTrend: 'improving' | 'stable' | 'declining' = 'stable';
    if (recentAvgEmotion - earlierAvgEmotion > 0.5) growthTrend = 'improving';
    else if (earlierAvgEmotion - recentAvgEmotion > 0.5) growthTrend = 'declining';

    // Personality traits based on writing patterns
    const personalityTraits = this.inferPersonalityTraits(entries);

    return {
      averageWordCount: wordCounts.reduce((sum, count) => sum + count, 0) / wordCounts.length,
      vocabularyRichness,
      emotionalRange,
      consistencyScore,
      growthTrend,
      personalityTraits
    };
  }

  static detectEnergyPatterns(entries: JournalEntry[]): EnergyPattern[] {
    const timeSlots = ['morning', 'midday', 'cbt', 'evening', 'gratitude'];
    const patterns: EnergyPattern[] = [];

    timeSlots.forEach(timeSlot => {
      const slotEntries = entries.filter(e => e.sessionId === timeSlot);
      if (slotEntries.length > 0) {
        const avgEmotion = slotEntries.reduce((sum, e) => sum + e.emotionScale, 0) / slotEntries.length;
        const avgWordCount = slotEntries.reduce((sum, e) => sum + (e.wordCount || 0), 0) / slotEntries.length;
        
        patterns.push({
          timeOfDay: timeSlot,
          averageEmotion: avgEmotion,
          wordCount: avgWordCount,
          frequency: slotEntries.length,
          suggestedPrompt: this.generateOptimalPrompt(timeSlot, avgEmotion)
        });
      }
    });

    return patterns.sort((a, b) => b.averageEmotion - a.averageEmotion);
  }

  private static extractRelatedWords(entries: JournalEntry[], trigger: string): string[] {
    const words = entries.flatMap(e => e.content.toLowerCase().split(/\s+/));
    const wordFreq = words.reduce((acc, word) => {
      acc[word] = (acc[word] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(wordFreq)
      .filter(([word]) => word.length > 3 && word !== trigger.toLowerCase())
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([word]) => word);
  }

  private static inferPersonalityTraits(entries: JournalEntry[]): string[] {
    const allText = entries.map(e => e.content.toLowerCase()).join(' ');
    const traits: string[] = [];

    // Simple keyword-based personality inference
    if (allText.includes('grateful') || allText.includes('thankful')) traits.push('Grateful');
    if (allText.includes('goal') || allText.includes('plan')) traits.push('Goal-oriented');
    if (allText.includes('creative') || allText.includes('art')) traits.push('Creative');
    if (allText.includes('analytical') || allText.includes('think')) traits.push('Analytical');
    if (allText.includes('empathy') || allText.includes('understand')) traits.push('Empathetic');

    return traits.slice(0, 3);
  }

  private static generateOptimalPrompt(timeSlot: string, avgEmotion: number): string {
    const prompts = {
      morning: avgEmotion > 3.5 ? 
        "What energizes you most this morning?" : 
        "What small step can brighten your day?",
      midday: avgEmotion > 3.5 ?
        "How can you sustain this positive energy?" :
        "What would help you reset and refocus?",
      cbt: "What limiting belief can you challenge today?",
      evening: avgEmotion > 3.5 ?
        "What made today meaningful?" :
        "What lesson can you take from today?",
      gratitude: "What unexpected joy did you discover today?"
    };

    return prompts[timeSlot as keyof typeof prompts] || "What's on your mind?";
  }
}
