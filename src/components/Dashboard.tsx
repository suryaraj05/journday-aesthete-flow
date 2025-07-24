import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import JournalingCard from './JournalingCard';
import AyurvedicTip from './AyurvedicTip';
import JournalReflection from './JournalReflection';
import GamificationCard from './GamificationCard';
import ReadingPage from './ReadingPage';
import WeeklyLetter from './WeeklyLetter';
import ManifestationPage from './ManifestationPage';
import MyGoals from './MyGoals';
import InstallPrompt from './InstallPrompt';
import { AppSidebar } from './AppSidebar';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { GamificationService } from '@/services/gamificationService';
import { NotificationService } from '@/services/notificationService';
import { BarChart3, Menu, BookOpen } from 'lucide-react';
import { JournalEntry } from '@/types/journal';
import InteractiveGuide from './InteractiveGuide';
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';

const journalingSessions = [
  {
    id: 'morning',
    title: 'Morning Intention',
    time: '7:00 AM',
    icon: '🌅',
    prompt: "What's my top goal today? How will I overcome one obstacle?",
    description: 'Set your daily intention and prepare for challenges',
    color: 'from-yellow-200/50 to-orange-200/50'
  },
  {
    id: 'midday',
    title: 'Midday Check-In',
    time: '1:00 PM',
    icon: '☀️',
    prompt: "What's one task I've completed? What's one challenge I'm facing?",
    description: 'Reflect on progress and current obstacles',
    color: 'from-blue-200/50 to-cyan-200/50'
  },
  {
    id: 'cbt',
    title: 'CBT Reframing',
    time: '3:00 PM',
    icon: '🧠',
    prompt: "What's one negative thought? What's evidence against it? What's a positive counter-thought?",
    description: 'Transform negative patterns with cognitive restructuring',
    color: 'from-purple-200/50 to-pink-200/50'
  },
  {
    id: 'evening',
    title: 'Evening Reflection',
    time: '8:00 PM',
    icon: '🌆',
    prompt: "What went well today? What can I improve tomorrow?",
    description: 'Review your day with compassion and wisdom',
    color: 'from-indigo-200/50 to-purple-200/50'
  },
  {
    id: 'gratitude',
    title: 'Gratitude Practice',
    time: '9:00 PM',
    icon: '🙏',
    prompt: "What's one thing I'm grateful for today?",
    description: 'Cultivate appreciation and positive emotions',
    color: 'from-green-200/50 to-emerald-200/50'
  }
];

const Dashboard = () => {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [showGuide, setShowGuide] = useState(false);
  const [analytics, setAnalytics] = useState({
    totalEntries: 0,
    currentStreak: 0,
    completedDays: 0,
    consistencyRate: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (user) {
      fetchAnalytics();
      setupNotifications();
    }
  }, [user]);

  const setupNotifications = async () => {
    // Request notification permission and set up reminders
    await NotificationService.scheduleJournalingReminders();
  };

  const getWeekKey = (date: Date): string => {
    const year = date.getFullYear();
    const week = Math.ceil(((date.getTime() - new Date(year, 0, 1).getTime()) / 86400000 + 1) / 7);
    return `${year}-W${week}`;
  };

  const fetchAnalytics = async () => {
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
          sessionTitle: data.sessionId,
          content: data.content,
          date: data.date,
          timestamp: data.timestamp,
          emotionScale: data.emotionScale || 3,
          wordCount: data.wordCount || data.content?.split(' ').length || 0,
          sleepQuality: data.sleepQuality,
          energyLevel: data.energyLevel,
          goals: data.goals || [],
          isDreamEntry: data.isDreamEntry || false
        });
      });

      setEntries(fetchedEntries);
      const totalEntries = fetchedEntries.length;
      const uniqueDays = new Set(fetchedEntries.map(entry => entry.date)).size;
      
      // Calculate streak
      const today = new Date().toISOString().split('T')[0];
      const uniqueDates = [...new Set(fetchedEntries.map(entry => entry.date))].sort().reverse();
      
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

      const consistencyRate = uniqueDays > 0 ? Math.round((streak / uniqueDays) * 100) : 0;

      setAnalytics({
        totalEntries,
        currentStreak: streak,
        completedDays: uniqueDays,
        consistencyRate
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const getCurrentHour = () => {
    return currentTime.getHours();
  };

  const getActiveSession = () => {
    const hour = getCurrentHour();
    if (hour >= 6 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 15) return 'midday';
    if (hour >= 15 && hour < 18) return 'cbt';
    if (hour >= 18 && hour < 21) return 'evening';
    return 'gratitude';
  };

  const getGreeting = () => {
    const hour = getCurrentHour();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const sortedSessions = [...journalingSessions].sort((a, b) => {
    const activeSession = getActiveSession();
    if (a.id === activeSession) return -1;
    if (b.id === activeSession) return 1;
    return 0;
  });

  // Generate gamification data
  const badges = GamificationService.generateBadges(entries);
  const achievements = GamificationService.generateAchievements(entries);

  const handleNavigation = (page: string) => {
    setCurrentPage(page);
  };

  if (currentPage === 'weeklyLetter') {
    return <WeeklyLetter onClose={() => setCurrentPage('dashboard')} />;
  }

  if (currentPage === 'goals') {
    return <MyGoals onBack={() => setCurrentPage('dashboard')} />;
  }

  if (currentPage === 'manifestation') {
    return <ManifestationPage onBack={() => setCurrentPage('dashboard')} />;
  }

  if (currentPage === 'reading') {
    return <ReadingPage onBack={() => setCurrentPage('dashboard')} />;
  }

  if (currentPage === 'reflections') {
    return <JournalReflection onBack={() => setCurrentPage('dashboard')} />;
  }

  if (selectedSession) {
    const session = journalingSessions.find(s => s.id === selectedSession);
    return (
      <JournalingCard
        session={session!}
        onBack={() => setSelectedSession(null)}
        onSave={() => {
          setSelectedSession(null);
          fetchAnalytics();
        }}
      />
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full ayurvedic-gradient lotus-pattern relative overflow-hidden">
        <AppSidebar onNavigate={handleNavigation} currentPage={currentPage} />
        
        <SidebarInset className="flex-1">
          {/* Show Interactive Guide */}
          {showGuide && <InteractiveGuide onClose={() => setShowGuide(false)} />}

          {/* Install Prompt */}
          <InstallPrompt />

          {/* Enhanced Background Elements */}
          <div className="floating-orbs">
            <div className="floating-orb"></div>
            <div className="floating-orb"></div>
            <div className="floating-orb"></div>
            <div className="floating-orb"></div>
          </div>

          <div className="sacred-geometry"></div>

          {/* Floating decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl float-animation shimmer-animation"></div>
            <div className="absolute bottom-20 right-10 w-24 h-24 bg-purple-200/20 rounded-full blur-lg float-animation drift-animation" style={{animationDelay: '1.5s'}}></div>
            <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-yellow-200/15 rounded-full blur-md shimmer-animation" style={{animationDelay: '3s'}}></div>
          </div>

          <div className="relative z-10 container mx-auto px-4 md:px-6 py-4 md:py-8">
            {/* Header */}
            <header className="flex justify-between items-center mb-6 md:mb-8">
              <div className="flex items-center space-x-3">
                <SidebarTrigger className="md:hidden">
                  <Menu className="w-5 h-5" />
                </SidebarTrigger>
                <div className="hidden md:flex items-center space-x-3">
                  <div className="w-12 h-12 neumorphic flex items-center justify-center pulse-glow-animation">
                    <img 
                      src="/lovable-uploads/fea06144-508f-49e9-8fdf-15396ad4c3f8.png" 
                      alt="JournDay Logo" 
                      className="w-8 h-8"
                    />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-800">JournDay</h1>
                    <p className="text-sm text-gray-600">{getGreeting()}, {user?.email?.split('@')[0]}</p>
                  </div>
                </div>
              </div>
              
              {/* Desktop Navigation - Hidden on mobile */}
              <div className="hidden lg:flex items-center space-x-3">
                <Button
                  onClick={() => setShowGuide(true)}
                  className="button-neumorphic text-gray-800 hover:text-gray-900 hover:scale-105 transition-transform"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Guide
                </Button>
                <Button
                  onClick={() => setCurrentPage('weeklyLetter')}
                  className="button-neumorphic text-gray-800 hover:text-gray-900 hover:scale-105 transition-transform"
                >
                  Letter
                </Button>
                <Button
                  onClick={() => setCurrentPage('goals')}
                  className="button-neumorphic text-gray-800 hover:text-gray-900 hover:scale-105 transition-transform"
                >
                  My Goals
                </Button>
                <Button
                  onClick={() => setCurrentPage('manifestation')}
                  className="button-neumorphic text-gray-800 hover:text-gray-900 hover:scale-105 transition-transform"
                >
                  Manifestation
                </Button>
                <Button
                  onClick={() => setCurrentPage('reading')}
                  className="button-neumorphic text-gray-800 hover:text-gray-900 hover:scale-105 transition-transform"
                >
                  Reading
                </Button>
                <Button
                  onClick={() => setCurrentPage('reflections')}
                  className="button-neumorphic text-gray-800 hover:text-gray-900 hover:scale-105 transition-transform"
                >
                  Reflections
                </Button>
              </div>
            </header>

            {/* Guide Introduction Banner - Show only for new users */}
            {analytics.totalEntries === 0 && (
              <div className="mb-6 md:mb-8">
                <Card className="card-neumorphic border-none bg-gradient-to-r from-purple-100/80 to-pink-100/80">
                  <CardContent className="p-6 text-center">
                    <div className="flex items-center justify-center space-x-3 mb-4">
                      <img 
                        src="/lovable-uploads/fea06144-508f-49e9-8fdf-15396ad4c3f8.png" 
                        alt="JournDay" 
                        className="w-8 h-8"
                      />
                      <h3 className="text-xl font-bold text-gray-800">Welcome to Your Sacred Journey</h3>
                    </div>
                    <p className="text-gray-600 mb-4">
                      Discover the power of mindful journaling with our interactive guide. 
                      Explore all features and learn how to transform your daily practice.
                    </p>
                    <Button
                      onClick={() => setShowGuide(true)}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:scale-105 transition-transform"
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      Start Interactive Guide
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Ayurvedic Tip */}
            <AyurvedicTip />

            {/* Time and Active Session */}
            <div className="text-center mb-6 md:mb-8">
              <div className="glassmorphic inline-block px-4 md:px-6 py-2 md:py-3 rounded-full mb-4 shimmer-animation">
                <span className="text-base md:text-lg font-medium text-gray-700">
                  {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 float-animation">Today's Sacred Practice</h2>
              <p className="text-sm md:text-base text-gray-600">Your mindful moments await, embrace each one</p>
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-4 md:gap-8 max-w-6xl mx-auto">
              {/* Journaling Sessions */}
              <div className="lg:col-span-2 space-y-3 md:space-y-4">
                {sortedSessions.map((session, index) => {
                  const isActive = session.id === getActiveSession();
                  return (
                    <div
                      key={session.id}
                      className={`card-neumorphic p-4 md:p-6 cursor-pointer transition-all duration-300 hover:scale-105 ${
                        isActive ? 'ring-2 ring-purple-300 transform scale-105 active-session' : ''
                      } ${index === 0 ? 'float-animation' : ''}`}
                      onClick={() => setSelectedSession(session.id)}
                      style={{
                        animationDelay: index === 0 ? '0s' : `${index * 0.1}s`,
                      }}
                    >
                      <div className="flex items-center space-x-3 md:space-x-4">
                        <div className={`w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br ${session.color} rounded-2xl md:rounded-3xl flex items-center justify-center ${isActive ? 'pulse-glow-animation' : ''}`}>
                          <span className="text-xl md:text-2xl">{session.icon}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="text-base md:text-lg font-semibold text-gray-800 truncate">{session.title}</h3>
                            {isActive && (
                              <div className="flex items-center space-x-1">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                <span className="text-xs text-green-600 font-medium hidden sm:inline">Active Now</span>
                              </div>
                            )}
                          </div>
                          <p className="text-xs md:text-sm text-gray-600 mb-1">{session.time}</p>
                          <p className="text-xs md:text-sm text-gray-500 line-clamp-2">{session.description}</p>
                        </div>
                        <div className="text-gray-400 transition-transform hover:scale-125">
                          <span className="text-lg md:text-xl">→</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Gamification Sidebar */}
              <div className="space-y-4 md:space-y-6">
                <GamificationCard
                  currentStreak={analytics.currentStreak}
                  badges={badges}
                  achievements={achievements}
                  totalEntries={analytics.totalEntries}
                />

                {/* Enhanced Analytics Preview */}
                <div className="card-neumorphic p-4 md:p-6 float-animation" style={{animationDelay: '0.5s'}}>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <BarChart3 className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                    Your Sacred Journey
                  </h3>
                  <div className="grid grid-cols-2 gap-3 md:gap-4 text-center">
                    <div className="p-3 md:p-4 glassmorphic rounded-lg">
                      <div className="text-xl md:text-2xl font-bold text-purple-600 mb-1">{analytics.currentStreak}</div>
                      <div className="text-xs md:text-sm text-gray-600">Day Streak</div>
                    </div>
                    <div className="p-3 md:p-4 glassmorphic rounded-lg">
                      <div className="text-xl md:text-2xl font-bold text-blue-600 mb-1">{analytics.totalEntries}</div>
                      <div className="text-xs md:text-sm text-gray-600">Total Entries</div>
                    </div>
                    <div className="p-3 md:p-4 glassmorphic rounded-lg">
                      <div className="text-xl md:text-2xl font-bold text-green-600 mb-1">{analytics.completedDays}</div>
                      <div className="text-xs md:text-sm text-gray-600">Active Days</div>
                    </div>
                    <div className="p-3 md:p-4 glassmorphic rounded-lg">
                      <div className="text-xl md:text-2xl font-bold text-orange-600 mb-1">{analytics.consistencyRate}%</div>
                      <div className="text-xs md:text-sm text-gray-600">Consistency</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
