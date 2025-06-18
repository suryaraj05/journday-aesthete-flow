
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import JournalingCard from './JournalingCard';
import AyurvedicTip from './AyurvedicTip';

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
    time: '8:00 PM',
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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

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

  if (selectedSession) {
    const session = journalingSessions.find(s => s.id === selectedSession);
    return (
      <JournalingCard
        session={session!}
        onBack={() => setSelectedSession(null)}
      />
    );
  }

  return (
    <div className="min-h-screen ayurvedic-gradient lotus-pattern relative overflow-hidden">
      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl float-animation"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-purple-200/20 rounded-full blur-lg float-animation" style={{animationDelay: '1.5s'}}></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 neumorphic flex items-center justify-center">
              <span className="text-2xl">🪷</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">JournDay</h1>
              <p className="text-sm text-gray-600">Welcome back, {user?.email?.split('@')[0]}</p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            className="button-neumorphic text-gray-800 hover:text-gray-900"
          >
            Sign Out
          </Button>
        </header>

        {/* Ayurvedic Tip */}
        <AyurvedicTip />

        {/* Time and Active Session */}
        <div className="text-center mb-8">
          <div className="glassmorphic inline-block px-6 py-3 rounded-full mb-4">
            <span className="text-lg font-medium text-gray-700">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Today's Practice</h2>
          <p className="text-gray-600">Your mindful moments await</p>
        </div>

        {/* Journaling Sessions */}
        <div className="space-y-4 max-w-2xl mx-auto">
          {sortedSessions.map((session, index) => {
            const isActive = session.id === getActiveSession();
            return (
              <div
                key={session.id}
                className={`card-neumorphic p-6 cursor-pointer transition-all duration-300 ${
                  isActive ? 'ring-2 ring-purple-300 transform scale-105' : ''
                } ${index === 0 ? 'float-animation' : ''}`}
                onClick={() => setSelectedSession(session.id)}
                style={{
                  animationDelay: index === 0 ? '0s' : 'none',
                }}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-16 h-16 bg-gradient-to-br ${session.color} rounded-3xl flex items-center justify-center`}>
                    <span className="text-2xl">{session.icon}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-lg font-semibold text-gray-800">{session.title}</h3>
                      {isActive && <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>}
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{session.time}</p>
                    <p className="text-sm text-gray-500">{session.description}</p>
                  </div>
                  <div className="text-gray-400">
                    <span className="text-xl">→</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Analytics Preview */}
        <div className="mt-12 max-w-2xl mx-auto">
          <div className="card-neumorphic p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">📊</span>
              Your Journey
            </h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-purple-600">7</div>
                <div className="text-sm text-gray-600">Days Active</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">23</div>
                <div className="text-sm text-gray-600">Sessions</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">85%</div>
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
