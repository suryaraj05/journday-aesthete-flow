
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { useAuth } from '@/hooks/useAuth';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { LocalAIService } from '@/services/localAIService';
import { AdvancedAnalytics } from '@/services/advancedAnalytics';
import { GamificationService } from '@/services/gamificationService';
import PersonalGrowthTimeline from './PersonalGrowthTimeline';
import MindfulnessGamification from './MindfulnessGamification';
import CircadianWellness from './CircadianWellness';
import MoodWeatherMap from './MoodWeatherMap';
import { ChevronLeft, CalendarDays, TrendingUp, BookOpen, Target, Brain, Heart, BarChart3, Trophy, Sun, Cloud } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { JournalEntry as JournalEntryType } from '@/types/journal';

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
  const [entries, setEntries] = useState<JournalEntryType[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    totalEntries: 0,
    currentStreak: 0,
    completedDays: 0,
    averageWordsPerEntry: 0,
    mostActiveSession: '',
    totalWords: 0,
    averageEmotion: 0,
    emotionTrend: 'stable' as 'improving' | 'declining' | 'stable'
  });
  const [aiInsights, setAiInsights] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (user) {
      fetchEntries();
    }
  }, [user]);

  const fetchEntries = async () => {
    if (!user) return;

    try {
      console.log('Fetching entries for user:', user.uid);
      const entriesRef = collection(db, 'journalEntries');
      const q = query(
        entriesRef,
        where('userId', '==', user.uid),
        orderBy('timestamp', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const fetchedEntries: JournalEntryType[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log('Entry data:', data);
        fetchedEntries.push({
          id: doc.id,
          sessionId: data.sessionId,
          sessionTitle: sessionConfig[data.sessionId as keyof typeof sessionConfig]?.title || data.sessionId,
          content: data.content,
          date: data.date,
          timestamp: data.timestamp,
          emotionScale: data.emotionScale || 3,
          wordCount: data.wordCount || data.content?.split(' ').length || 0,
          sleepQuality: data.sleepQuality,
          energyLevel: data.energyLevel,
          goals: data.goals,
          isDreamEntry: data.isDreamEntry
        });
      });

      console.log('Fetched entries:', fetchedEntries);
      setEntries(fetchedEntries);
      calculateAnalytics(fetchedEntries);
      generateAIInsights(fetchedEntries);
    } catch (error) {
      console.error('Error fetching entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAnalytics = (entriesData: JournalEntryType[]) => {
    const totalEntries = entriesData.length;
    const totalWords = entriesData.reduce((sum, entry) => sum + (entry.wordCount || 0), 0);
    const averageWordsPerEntry = totalEntries > 0 ? Math.round(totalWords / totalEntries) : 0;
    
    // Calculate emotion analytics
    const emotionPattern = LocalAIService.analyzeEmotionPatterns(entriesData);
    
    // Calculate unique days
    const uniqueDays = new Set(entriesData.map(entry => entry.date)).size;
    
    // Calculate session counts
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
      totalWords,
      averageEmotion: emotionPattern.averageEmotion,
      emotionTrend: emotionPattern.trend
    });
  };

  const generateAIInsights = (entriesData: JournalEntryType[]) => {
    const insights = LocalAIService.generateWritingInsights(entriesData);
    setAiInsights(insights);
  };

  const calculateStreak = (entriesData: JournalEntryType[]) => {
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

  const getEmotionChartData = () => {
    const last30Days = entries
      .filter(entry => {
        const entryDate = new Date(entry.date);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return entryDate >= thirtyDaysAgo;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-30);

    return last30Days.map(entry => ({
      date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      emotion: entry.emotionScale,
      session: entry.sessionId
    }));
  };

  const getEmotionDistribution = () => {
    const distribution = [1, 2, 3, 4, 5].map(emotion => ({
      emotion: emotion.toString(),
      count: entries.filter(entry => Math.round(entry.emotionScale) === emotion).length,
      label: ['Very Sad', 'Sad', 'Neutral', 'Happy', 'Very Happy'][emotion - 1]
    }));
    return distribution;
  };

  // Generate advanced analytics data
  const personalGrowthMilestones = AdvancedAnalytics.generatePersonalGrowthTimeline(entries);
  const triggerPatterns = AdvancedAnalytics.detectTriggerPatterns(entries);
  const writingDNA = AdvancedAnalytics.analyzeWritingDNA(entries);
  const energyPatterns = AdvancedAnalytics.detectEnergyPatterns(entries);
  
  // Generate gamification data
  const badges = GamificationService.generateBadges(entries);
  const achievements = GamificationService.generateAchievements(entries);
  const weeklyChallenge = GamificationService.generateWeeklyChallenge();

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

  const emotionChartData = getEmotionChartData();
  const emotionDistribution = getEmotionDistribution();

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

        {/* Enhanced Analytics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
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

          <Card className="card-neumorphic border-none">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-pink-600 mb-1">{analytics.averageEmotion.toFixed(1)}</div>
              <div className="text-sm text-gray-600">Avg Emotion</div>
            </CardContent>
          </Card>

          <Card className="card-neumorphic border-none">
            <CardContent className="p-4 text-center">
              <div className={`text-2xl font-bold mb-1 ${
                analytics.emotionTrend === 'improving' ? 'text-green-600' :
                analytics.emotionTrend === 'declining' ? 'text-red-600' : 'text-gray-600'
              }`}>
                {analytics.emotionTrend === 'improving' ? '📈' : analytics.emotionTrend === 'declining' ? '📉' : '➡️'}
              </div>
              <div className="text-sm text-gray-600">Trend</div>
            </CardContent>
          </Card>
        </div>

        {/* Advanced Features Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 card-neumorphic border-none">
            <TabsTrigger value="overview" className="flex items-center space-x-1">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden md:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="growth" className="flex items-center space-x-1">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden md:inline">Growth</span>
            </TabsTrigger>
            <TabsTrigger value="gamification" className="flex items-center space-x-1">
              <Trophy className="w-4 h-4" />
              <span className="hidden md:inline">Rewards</span>
            </TabsTrigger>
            <TabsTrigger value="wellness" className="flex items-center space-x-1">
              <Sun className="w-4 h-4" />
              <span className="hidden md:inline">Wellness</span>
            </TabsTrigger>
            <TabsTrigger value="patterns" className="flex items-center space-x-1">
              <Cloud className="w-4 h-4" />
              <span className="hidden md:inline">Patterns</span>
            </TabsTrigger>
            <TabsTrigger value="entries" className="flex items-center space-x-1">
              <CalendarDays className="w-4 h-4" />
              <span className="hidden md:inline">Entries</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Emotion Analytics Charts */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="card-neumorphic border-none">
                <CardHeader>
                  <CardTitle className="flex items-center text-gray-800">
                    <Heart className="w-5 h-5 mr-2" />
                    Emotion Trend (Last 30 Days)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={{
                    emotion: { label: "Emotion", color: "hsl(var(--chart-1))" }
                  }} className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={emotionChartData}>
                        <XAxis dataKey="date" />
                        <YAxis domain={[1, 5]} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line 
                          type="monotone" 
                          dataKey="emotion" 
                          stroke="hsl(var(--chart-1))" 
                          strokeWidth={2}
                          dot={{ fill: "hsl(var(--chart-1))" }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card className="card-neumorphic border-none">
                <CardHeader>
                  <CardTitle className="flex items-center text-gray-800">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Emotion Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={{
                    count: { label: "Count", color: "hsl(var(--chart-2))" }
                  }} className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={emotionDistribution}>
                        <XAxis dataKey="label" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="count" fill="hsl(var(--chart-2))" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            {/* AI Insights */}
            {aiInsights.length > 0 && (
              <Card className="card-neumorphic border-none">
                <CardHeader>
                  <CardTitle className="flex items-center text-gray-800">
                    <Brain className="w-5 h-5 mr-2" />
                    AI-Powered Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    {aiInsights.map((insight, index) => (
                      <div key={index} className="glassmorphic p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-800 mb-2">{insight.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
                        <div className="text-xs text-gray-500">
                          Confidence: {Math.round(insight.confidence * 100)}%
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="growth" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <PersonalGrowthTimeline milestones={personalGrowthMilestones} />
              
              <Card className="card-neumorphic border-none">
                <CardHeader>
                  <CardTitle className="flex items-center text-gray-800">
                    <Target className="w-5 h-5 mr-2" />
                    Trigger Patterns
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {triggerPatterns.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                      Keep writing to discover patterns that influence your mood! 🔍
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {triggerPatterns.slice(0, 5).map((pattern, index) => (
                        <div key={pattern.trigger} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-gray-800 capitalize">{pattern.trigger}</h4>
                            <span className={`text-sm font-medium ${
                              pattern.averageEmotionImpact > 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {pattern.averageEmotionImpact > 0 ? '+' : ''}{pattern.averageEmotionImpact.toFixed(1)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            Mentioned {pattern.frequency} times
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {pattern.relatedWords.slice(0, 3).map(word => (
                              <span key={word} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                                {word}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Writing DNA */}
            <Card className="card-neumorphic border-none">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-800">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Writing DNA Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {writingDNA.averageWordCount.toFixed(0)}
                    </div>
                    <div className="text-sm text-gray-600">Avg Words/Entry</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {(writingDNA.vocabularyRichness * 100).toFixed(0)}%
                    </div>
                    <div className="text-sm text-gray-600">Vocabulary Richness</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">
                      {Math.max(1, Math.min(5, writingDNA.emotionalRange)).toFixed(1)}
                    </div>
                    <div className="text-sm text-gray-600">Emotional Range (1-5)</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-3xl font-bold mb-2 ${
                      writingDNA.growthTrend === 'improving' ? 'text-green-600' :
                      writingDNA.growthTrend === 'declining' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {writingDNA.growthTrend === 'improving' ? '📈' : 
                       writingDNA.growthTrend === 'declining' ? '📉' : '➡️'}
                    </div>
                    <div className="text-sm text-gray-600">Growth Trend</div>
                  </div>
                </div>
                
                {writingDNA.personalityTraits.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-medium text-gray-800 mb-3">Personality Insights</h4>
                    <div className="flex flex-wrap gap-2">
                      {writingDNA.personalityTraits.map(trait => (
                        <span key={trait} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                          {trait}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gamification">
            <MindfulnessGamification 
              badges={badges}
              achievements={achievements}
              weeklyChallenge={weeklyChallenge}
              currentStreak={analytics.currentStreak}
            />
          </TabsContent>

          <TabsContent value="wellness">
            <CircadianWellness entries={entries} />
          </TabsContent>

          <TabsContent value="patterns">
            <div className="space-y-6">
              <MoodWeatherMap entries={entries} />
              
              {/* Energy Patterns */}
              <Card className="card-neumorphic border-none">
                <CardHeader>
                  <CardTitle className="flex items-center text-gray-800">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Optimal Writing Times
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {energyPatterns.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                      Continue journaling to discover your optimal writing times! ⏰
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {energyPatterns.map((pattern, index) => (
                        <div key={pattern.timeOfDay} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h4 className="font-semibold text-gray-800 capitalize">{pattern.timeOfDay}</h4>
                            <p className="text-sm text-gray-600">{pattern.suggestedPrompt}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-blue-600">
                              {pattern.averageEmotion.toFixed(1)}/5
                            </div>
                            <div className="text-xs text-gray-500">
                              {pattern.wordCount.toFixed(0)} words avg
                            </div>
                            {index === 0 && (
                              <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded mt-1 inline-block">
                                Peak Time ⭐
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="entries" className="space-y-6">
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
                    const emotion = ['😢', '😞', '😐', '😊', '😄'][entry.emotionScale - 1];
                    return (
                      <Card key={entry.id} className="card-neumorphic border-none">
                        <CardHeader>
                          <CardTitle className="flex items-center justify-between text-gray-800">
                            <div className="flex items-center">
                              <div className={`w-10 h-10 bg-gradient-to-br ${session?.color} rounded-2xl flex items-center justify-center mr-3`}>
                                <span className="text-lg">{session?.icon}</span>
                              </div>
                              {entry.sessionTitle}
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-2xl">{emotion}</span>
                              <span className="text-sm text-gray-500">{entry.emotionScale}/5</span>
                            </div>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
                            <p className="text-gray-700 whitespace-pre-wrap">{entry.content}</p>
                          </div>
                          <div className="mt-3 text-xs text-gray-500">
                            {entry.wordCount} words
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default JournalReflection;
