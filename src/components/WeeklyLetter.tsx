
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { JournalEntry } from '@/types/journal';
import { Mail, Download, Share2 } from 'lucide-react';

interface WeeklyLetterProps {
  onClose: () => void;
}

const WeeklyLetter = ({ onClose }: WeeklyLetterProps) => {
  const { user } = useAuth();
  const [weeklyLetter, setWeeklyLetter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      generateWeeklyLetter();
    }
  }, [user]);

  const generateWeeklyLetter = async () => {
    if (!user) return;

    try {
      // Get entries from the past week
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      
      const entriesRef = collection(db, 'journalEntries');
      const q = query(
        entriesRef,
        where('userId', '==', user.uid),
        where('date', '>=', weekAgo.toISOString().split('T')[0]),
        orderBy('timestamp', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const entries: JournalEntry[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        entries.push({
          id: doc.id,
          sessionId: data.sessionId,
          sessionTitle: data.sessionId,
          content: data.content,
          date: data.date,
          timestamp: data.timestamp,
          emotionScale: data.emotionScale || 3,
          wordCount: data.wordCount || 0,
          sleepQuality: data.sleepQuality,
          energyLevel: data.energyLevel,
          goals: data.goals || [],
          isDreamEntry: data.isDreamEntry || false
        });
      });

      const letter = createWeeklyLetter(entries);
      setWeeklyLetter(letter);
    } catch (error) {
      console.error('Error generating weekly letter:', error);
    } finally {
      setLoading(false);
    }
  };

  const createWeeklyLetter = (entries: JournalEntry[]): string => {
    if (entries.length === 0) {
      return `Dear Future Self,

This week was quiet in terms of journaling, but that's okay. Sometimes we need space to simply be, without the need to capture every moment in words.

Perhaps this week was about living in the present, experiencing life without the filter of reflection. Or maybe you were processing experiences in your own way, beyond the written word.

Remember, your journey isn't measured by the number of words you write, but by the wisdom you gain and the peace you find.

With love and understanding,
Your Present Self

P.S. Tomorrow is a new day, and your journal will be here whenever you're ready.`;
    }

    const totalEntries = entries.length;
    const avgEmotion = entries.reduce((sum, entry) => sum + entry.emotionScale, 0) / totalEntries;
    const totalWords = entries.reduce((sum, entry) => sum + (entry.wordCount || 0), 0);
    
    // Extract key themes
    const allContent = entries.map(e => e.content.toLowerCase()).join(' ');
    const commonWords = extractCommonThemes(allContent);
    
    // Find the most meaningful entry
    const longestEntry = entries.reduce((prev, current) => 
      (current.wordCount || 0) > (prev.wordCount || 0) ? current : prev
    );

    const emotionDescription = avgEmotion >= 4 ? 'joyful and positive' :
                              avgEmotion >= 3 ? 'balanced and steady' :
                              avgEmotion >= 2 ? 'contemplative and introspective' : 'challenging but growing';

    return `Dear Future Self,

What a week it has been! As I sit here reflecting on the past seven days, I'm struck by the journey you've taken through ${totalEntries} journal entries, totaling ${totalWords} words of your inner world.

This week, your emotional landscape has been ${emotionDescription}, with an average feeling score of ${avgEmotion.toFixed(1)} out of 5. Each entry has been a stepping stone in your ongoing journey of self-discovery.

The themes that kept appearing in your reflections were: ${commonWords.slice(0, 3).join(', ')}. These words seem to be calling your attention, perhaps pointing toward areas of growth or sources of meaning in your life.

One entry that particularly stands out was from ${new Date(longestEntry.date).toLocaleDateString()}, where you wrote with such depth and honesty. In those ${longestEntry.wordCount} words, you captured something essential about your experience.

Here's what I want you to remember from this week:
• Your willingness to show up for yourself, day after day, is remarkable
• Every emotion you felt was valid and served a purpose
• The patterns you're noticing are the beginning of wisdom
• Your growth might be invisible day to day, but it's profound week by week

Looking at your words, I see someone who is:
- Brave enough to face their inner world honestly
- Committed to growth and understanding
- Worthy of love and compassion
- Creating meaning through reflection

As you read this in the future, remember that the person who wrote these journal entries was doing their best with the awareness they had. Be gentle with that version of yourself. Be proud of the journey.

The themes of ${commonWords[0]} and ${commonWords[1]} that appeared so often this week might still be relevant when you read this, or they might feel like ancient history. Either way, they were important stepping stones.

Keep writing, keep reflecting, keep growing. Your future self will thank you for the gift of these honest words.

With deep appreciation and love,
Your Past Self

P.S. Remember that time on ${new Date(entries[0].date).toLocaleDateString()} when you felt so grateful? Hold onto that feeling. It's always available to you.

---

"The real voyage of discovery consists not in seeking new landscapes, but in having new eyes." - Marcel Proust

This week, you've been cultivating those new eyes, one journal entry at a time.`;
  };

  const extractCommonThemes = (content: string): string[] => {
    const meaningfulWords = ['work', 'family', 'love', 'growth', 'peace', 'challenge', 'gratitude', 'hope', 'change', 'relationship', 'dream', 'goal', 'fear', 'joy', 'friend', 'health', 'creative', 'stress', 'success', 'learning'];
    const wordCounts: { [key: string]: number } = {};
    
    meaningfulWords.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      const matches = content.match(regex);
      if (matches) {
        wordCounts[word] = matches.length;
      }
    });
    
    return Object.entries(wordCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([word]) => word);
  };

  if (loading) {
    return (
      <div className="min-h-screen ayurvedic-gradient lotus-pattern flex items-center justify-center">
        <div className="card-neumorphic p-8 rounded-full">
          <span className="text-4xl">💌</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ayurvedic-gradient lotus-pattern relative overflow-hidden">
      <div className="relative z-10 container mx-auto px-6 py-8 max-w-4xl">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 neumorphic flex items-center justify-center pulse-glow-animation">
              <Mail className="w-6 h-6 text-gray-700" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Your Weekly Letter</h1>
              <p className="text-sm text-gray-600">A letter from your past to your future self</p>
            </div>
          </div>
          <Button
            onClick={onClose}
            className="button-neumorphic text-gray-800 hover:text-gray-900"
          >
            Close
          </Button>
        </header>

        <Card className="card-neumorphic border-none">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-gray-800">
              <span>Letter from Your Journey</span>
              <div className="flex space-x-2">
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(weeklyLetter);
                  }}
                  className="button-neumorphic text-gray-700 hover:text-gray-900 p-2"
                >
                  <Share2 className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => {
                    const element = document.createElement('a');
                    const file = new Blob([weeklyLetter], { type: 'text/plain' });
                    element.href = URL.createObjectURL(file);
                    element.download = `weekly-letter-${new Date().toISOString().split('T')[0]}.txt`;
                    document.body.appendChild(element);
                    element.click();
                    document.body.removeChild(element);
                  }}
                  className="button-neumorphic text-gray-700 hover:text-gray-900 p-2"
                >
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-8 border border-amber-200">
              <div 
                className="prose prose-lg max-w-none text-gray-700 leading-relaxed font-serif"
                style={{ whiteSpace: 'pre-wrap' }}
              >
                {weeklyLetter}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WeeklyLetter;
