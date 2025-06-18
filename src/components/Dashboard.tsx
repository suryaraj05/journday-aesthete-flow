import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import JournalingCard from './JournalingCard';
import AyurvedicTip from './AyurvedicTip';
import JournalReflection from './JournalReflection';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { BookOpen, BarChart3 } from 'lucide-react';

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
  const { user, logout } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [showReflection, setShowReflection] = useState(false);
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
    }
  }, [user]);

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
      const entries: any[] = [];
      
      querySnapshot.forEach((doc) => {
        entries.push({ id: doc.id, ...doc.data() });
      });

      const totalEntries = entries.length;
      const uniqueDays = new Set(entries.map(entry => entry.date)).size;
      
      // Calculate streak
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

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (showReflection) {
    return <JournalReflection onBack={() => setShowReflection(false)} />;
  }

  if (selectedSession) {
    const session = journalingSessions.find(s => s.id === selectedSession);
    return (
      <JournalingCard
        session={session!}
        onBack={() => setSelectedSession(null)}
        onSave={() => {
          setSelectedSession(null);
          fetchAnalytics(); // Refresh analytics after saving
        }}
      />
    );
  }

  return (
    <div className="min-h-screen ayurvedic-gradient lotus-pattern relative overflow-hidden">
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

      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 neumorphic flex items-center justify-center pulse-glow-animation">
              <span className="text-2xl">🪷</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">JournDay</h1>
              <p className="text-sm text-gray-600">{getGreeting()}, {user?.email?.split('@')[0]}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              onClick={() => setShowReflection(true)}
              className="button-neumorphic text-gray-800 hover:text-gray-900 hover:scale-105 transition-transform"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Reflections
            </Button>
            <Button
              onClick={handleLogout}
              className="button-neumorphic text-gray-800 hover:text-gray-900 hover:scale-105 transition-transform"
            >
              Sign Out
            </Button>
          </div>
        </header>

        {/* Ayurvedic Tip */}
        <AyurvedicTip />

        {/* Time and Active Session */}
        <div className="text-center mb-8">
          <div className="glassmorphic inline-block px-6 py-3 rounded-full mb-4 shimmer-animation">
            <span className="text-lg font-medium text-gray-700">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2 float-animation">Today's Sacred Practice</h2>
          <p className="text-gray-600">Your mindful moments await, embrace each one</p>
        </div>

        {/* Journaling Sessions */}
        <div className="space-y-4 max-w-2xl mx-auto">
          {sortedSessions.map((session, index) => {
            const isActive = session.id === getActiveSession();
            return (
              <div
                key={session.id}
                className={`card-neumorphic p-6 cursor-pointer transition-all duration-300 hover:scale-105 ${
                  isActive ? 'ring-2 ring-purple-300 transform scale-105 active-session' : ''
                } ${index === 0 ? 'float-animation' : ''}`}
                onClick={() => setSelectedSession(session.id)}
                style={{
                  animationDelay: index === 0 ? '0s' : `${index * 0.1}s`,
                }}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-16 h-16 bg-gradient-to-br ${session.color} rounded-3xl flex items-center justify-center ${isActive ? 'pulse-glow-animation' : ''}`}>
                    <span className="text-2xl">{session.icon}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-lg font-semibold text-gray-800">{session.title}</h3>
                      {isActive && (
                        <div className="flex items-center space-x-1">
                          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                          <span className="text-xs text-green-600 font-medium">Active Now</span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{session.time}</p>
                    <p className="text-sm text-gray-500">{session.description}</p>
                  </div>
                  <div className="text-gray-400 transition-transform hover:scale-125">
                    <span className="text-xl">→</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Enhanced Analytics Preview */}
        <div className="mt-12 max-w-2xl mx-auto">
          <div className="card-neumorphic p-6 float-animation" style={{animationDelay: '0.5s'}}>
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Your Sacred Journey
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-4 glassmorphic rounded-lg">
                <div className="text-2xl font-bold text-purple-600 mb-1">{analytics.currentStreak}</div>
                <div className="text-sm text-gray-600">Day Streak</div>
              </div>
              <div className="p-4 glassmorphic rounded-lg">
                <div className="text-2xl font-bold text-blue-600 mb-1">{analytics.totalEntries}</div>
                <div className="text-sm text-gray-600">Total Entries</div>
              </div>
              <div className="p-4 glassmorphic rounded-lg">
                <div className="text-2xl font-bold text-green-600 mb-1">{analytics.completedDays}</div>
                <div className="text-sm text-gray-600">Active Days</div>
              </div>
              <div className="p-4 glassmorphic rounded-lg">
                <div className="text-2xl font-bold text-orange-600 mb-1">{analytics.consistencyRate}%</div>
                <div className="text-sm text-gray-600">Consistency</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
