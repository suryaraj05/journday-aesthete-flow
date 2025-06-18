
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { useAuth } from '@/hooks/useAuth';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { ChevronLeft, CalendarDays, TrendingUp, BookOpen, Target } from 'lucide-react';

interface JournalEntry {
  id: string;
  sessionId: string;
  sessionTitle: string;
  content: string;
  date: string;
  timestamp: any;
}

interface JournalReflectionProps {
  onBack: () => void;
}

const sessionConfig = {
  morning: { title: 'Morning Intention', icon: '🌅', color: 'from-yellow-200/50 to-orange-200/50' },
  midday: { title: 'Midday Check-In', icon: '☀️', color: 'from-blue-200/50 to-cyan-200/50' },
  cbt: { title: 'CBT Reframing', icon: '🧠', color: 'from-purple-200/50 to-pink-200/50' },
  evening: { title: 'Evening Reflection', icon: '🌆', color: 'from-indigo-200/50 to-purple-200/50' },
  gratitude: { title: 'Gratitude Practice', icon: '🙏', color: 'from-green-200/50 to-emerald-200/50' }
};

const JournalReflection = ({ onBack }: JournalReflectionProps) => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    totalEntries: 0,
    currentStreak: 0,
    completedDays: 0,
    averageWordsPerEntry: 0,
    mostActiveSession: '',
    totalWords: 0
  });

  useEffect(() => {
    if (user) {
      fetchEntries();
    }
  }, [user]);

  const fetchEntries = async () => {
    if (!user) return;

    try {
      const entriesRef = collection(db, 'journalEntries');
      const q = query(
        entriesRef,
        where('userId', '==', user.uid),
        orderBy('timestamp', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const fetchedEntries: JournalEntry[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        fetchedEntries.push({
          id: doc.id,
          sessionId: data.sessionId,
          sessionTitle: sessionConfig[data.sessionId as keyof typeof sessionConfig]?.title || data.sessionId,
          content: data.content,
          date: data.date,
          timestamp: data.timestamp
        });
      });

      setEntries(fetchedEntries);
      calculateAnalytics(fetchedEntries);
    } catch (error) {
      console.error('Error fetching entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAnalytics = (entriesData: JournalEntry[]) => {
    const totalEntries = entriesData.length;
    const totalWords = entriesData.reduce((sum, entry) => sum + entry.content.split(' ').length, 0);
    const averageWordsPerEntry = totalEntries > 0 ? Math.round(totalWords / totalEntries) : 0;
    
    // Calculate unique days
    const uniqueDays = new Set(entriesData.map(entry => entry.date)).size;
    
    // Calculate most active session
    const sessionCounts = entriesData.reduce((acc, entry) => {
      acc[entry.sessionId] = (acc[entry.sessionId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const mostActiveSession = Object.keys(sessionCounts).reduce((a, b) => 
      sessionCounts[a] > sessionCounts[b] ? a : b, ''
    );

    // Calculate streak (simplified)
    const currentStreak = calculateStreak(entriesData);

    setAnalytics({
      totalEntries,
      currentStreak,
      completedDays: uniqueDays,
      averageWordsPerEntry,
      mostActiveSession: sessionConfig[mostActiveSession as keyof typeof sessionConfig]?.title || '',
      totalWords
    });
  };

  const calculateStreak = (entriesData: JournalEntry[]) => {
    if (entriesData.length === 0) return 0;
    
    const today = new Date().toISOString().split('T')[0];
    const uniqueDates = [...new Set(entriesData.map(entry => entry.date))].sort().reverse();
    
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
  };

  const getEntriesForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return entries.filter(entry => entry.date === dateString);
  };

  const selectedDateEntries = getEntriesForDate(selectedDate);

  if (loading) {
    return (
      <div className="min-h-screen ayurvedic-gradient lotus-pattern flex items-center justify-center">
        <div className="card-neumorphic p-8 rounded-full">
          <span className="text-4xl">🪷</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ayurvedic-gradient lotus-pattern relative overflow-hidden">
      {/* Background elements */}
      <div className="floating-orbs">
        <div className="floating-orb"></div>
        <div className="floating-orb"></div>
        <div className="floating-orb"></div>
        <div className="floating-orb"></div>
      </div>

      <div className="sacred-geometry"></div>

      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Header */}
        <header className="flex items-center mb-8">
          <Button
            onClick={onBack}
            className="button-neumorphic text-gray-800 hover:text-gray-900 mr-4 p-2"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 neumorphic flex items-center justify-center pulse-glow-animation">
              <BookOpen className="w-6 h-6 text-gray-700" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Journal Reflection</h1>
              <p className="text-sm text-gray-600">Your mindful journey insights</p>
            </div>
          </div>
        </header>

        {/* Analytics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="card-neumorphic border-none">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">{analytics.totalEntries}</div>
              <div className="text-sm text-gray-600">Total Entries</div>
            </CardContent>
          </Card>
          
          <Card className="card-neumorphic border-none">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600 mb-1">{analytics.currentStreak}</div>
              <div className="text-sm text-gray-600">Day Streak</div>
            </CardContent>
          </Card>
          
          <Card className="card-neumorphic border-none">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">{analytics.completedDays}</div>
              <div className="text-sm text-gray-600">Active Days</div>
            </CardContent>
          </Card>
          
          <Card className="card-neumorphic border-none">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">{analytics.averageWordsPerEntry}</div>
              <div className="text-sm text-gray-600">Avg Words</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <Card className="card-neumorphic border-none">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-800">
                <CalendarDays className="w-5 h-5 mr-2" />
                Select Date
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="rounded-md border-none"
                modifiers={{
                  hasEntry: (date) => getEntriesForDate(date).length > 0
                }}
                modifiersStyles={{
                  hasEntry: { 
                    backgroundColor: 'rgba(196, 181, 253, 0.3)',
                    color: 'rgb(67, 56, 202)',
                    fontWeight: 'bold'
                  }
                }}
              />
            </CardContent>
          </Card>

          {/* Entries for Selected Date */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Entries for {selectedDate.toLocaleDateString()}
            </h3>
            
            {selectedDateEntries.length === 0 ? (
              <Card className="card-neumorphic border-none">
                <CardContent className="p-8 text-center">
                  <div className="text-gray-500 mb-4">
                    <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    No entries found for this date
                  </div>
                  <p className="text-sm text-gray-400">Start journaling to see your reflections here</p>
                </CardContent>
              </Card>
            ) : (
              selectedDateEntries.map((entry) => {
                const session = sessionConfig[entry.sessionId as keyof typeof sessionConfig];
                return (
                  <Card key={entry.id} className="card-neumorphic border-none">
                    <CardHeader>
                      <CardTitle className="flex items-center text-gray-800">
                        <div className={`w-10 h-10 bg-gradient-to-br ${session?.color} rounded-2xl flex items-center justify-center mr-3`}>
                          <span className="text-lg">{session?.icon}</span>
                        </div>
                        {entry.sessionTitle}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
                        <p className="text-gray-700 whitespace-pre-wrap">{entry.content}</p>
                      </div>
                      <div className="mt-3 text-xs text-gray-500">
                        {entry.content.split(' ').length} words
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </div>

        {/* Additional Analytics */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <Card className="card-neumorphic border-none">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-800">
                <TrendingUp className="w-5 h-5 mr-2" />
                Progress Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Most Active Session:</span>
                <span className="font-medium text-gray-800">{analytics.mostActiveSession || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Words Written:</span>
                <span className="font-medium text-gray-800">{analytics.totalWords.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Consistency Rate:</span>
                <span className="font-medium text-gray-800">
                  {analytics.completedDays > 0 ? Math.round((analytics.currentStreak / analytics.completedDays) * 100) : 0}%
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="card-neumorphic border-none">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-800">
                <Target className="w-5 h-5 mr-2" />
                Journey Milestones
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className={`w-3 h-3 rounded-full ${analytics.totalEntries >= 1 ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                  <span className="text-sm text-gray-600">First Entry</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`w-3 h-3 rounded-full ${analytics.totalEntries >= 7 ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                  <span className="text-sm text-gray-600">Week Warrior (7 entries)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`w-3 h-3 rounded-full ${analytics.currentStreak >= 3 ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                  <span className="text-sm text-gray-600">3-Day Streak</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`w-3 h-3 rounded-full ${analytics.totalWords >= 1000 ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                  <span className="text-sm text-gray-600">Wordsmith (1000+ words)</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default JournalReflection;
