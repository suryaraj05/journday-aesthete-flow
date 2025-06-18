
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface Session {
  id: string;
  title: string;
  time: string;
  icon: string;
  prompt: string;
  description: string;
  color: string;
}

interface JournalingCardProps {
  session: Session;
  onBack: () => void;
}

const JournalingCard = ({ session, onBack }: JournalingCardProps) => {
  const [entry, setEntry] = useState('');
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Load existing entry if any
    loadEntry();
  }, [session.id]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsTimerActive(false);
      toast({
        title: "Time's up!",
        description: "Your 5-minute focus session is complete.",
      });
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerActive, timeLeft, toast]);

  const loadEntry = async () => {
    if (!user) return;
    
    try {
      const today = new Date().toISOString().split('T')[0];
      const entryRef = doc(db, 'entries', `${user.uid}_${session.id}_${today}`);
      const entrySnap = await getDoc(entryRef);
      
      if (entrySnap.exists()) {
        setEntry(entrySnap.data().content || '');
      }
    } catch (error) {
      console.error('Error loading entry:', error);
    }
  };

  const saveEntry = async () => {
    if (!user || !entry.trim()) return;
    
    setLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const entryRef = doc(db, 'entries', `${user.uid}_${session.id}_${today}`);
      
      await setDoc(entryRef, {
        userId: user.uid,
        sessionId: session.id,
        sessionTitle: session.title,
        content: entry,
        date: today,
        timestamp: new Date(),
        prompt: session.prompt
      });

      toast({
        title: "Entry saved!",
        description: "Your reflection has been captured.",
      });
      
      onBack();
    } catch (error) {
      console.error('Error saving entry:', error);
      toast({
        title: "Error",
        description: "Failed to save your entry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const startFocusMode = () => {
    setIsFocusMode(true);
    setIsTimerActive(true);
    setTimeLeft(300);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (isFocusMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 container mx-auto px-6 py-16">
          {/* Timer */}
          <div className="text-center mb-8">
            <div className="glassmorphic inline-block px-8 py-4 rounded-full mb-4">
              <span className="text-3xl font-mono text-gray-700">
                {formatTime(timeLeft)}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{session.title}</h2>
            <p className="text-gray-600">Focus Mode</p>
          </div>

          {/* Prompt */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="card-neumorphic p-6 text-center">
              <span className="text-4xl mb-4 block">{session.icon}</span>
              <p className="text-lg text-gray-700 font-medium">{session.prompt}</p>
            </div>
          </div>

          {/* Writing Area */}
          <div className="max-w-2xl mx-auto">
            <Textarea
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              placeholder="Let your thoughts flow..."
              className="min-h-[300px] glassmorphic border-0 text-lg leading-relaxed resize-none focus:ring-2 focus:ring-purple-300"
            />
            
            <div className="flex justify-center space-x-4 mt-6">
              <Button
                onClick={() => setIsTimerActive(!isTimerActive)}
                className="button-neumorphic text-gray-800 hover:text-gray-900"
              >
                {isTimerActive ? 'Pause' : 'Resume'}
              </Button>
              <Button
                onClick={() => setIsFocusMode(false)}
                className="button-neumorphic text-gray-800 hover:text-gray-900"
              >
                Exit Focus
              </Button>
            </div>
          </div>
        </div>
      </div>
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
          <button 
            onClick={onBack}
            className="button-neumorphic p-3 rounded-full"
          >
            <span className="text-xl">←</span>
          </button>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">{session.title}</h1>
            <p className="text-sm text-gray-600">{session.time}</p>
          </div>
          <Button
            onClick={startFocusMode}
            className="button-neumorphic text-gray-800 hover:text-gray-900 text-sm px-4 py-2"
          >
            Focus Mode
          </Button>
        </header>

        {/* Session Info */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="card-neumorphic p-6 text-center">
            <div className={`w-20 h-20 bg-gradient-to-br ${session.color} rounded-3xl flex items-center justify-center mx-auto mb-4`}>
              <span className="text-3xl">{session.icon}</span>
            </div>
            <p className="text-lg text-gray-700 font-medium mb-2">{session.prompt}</p>
            <p className="text-sm text-gray-500">{session.description}</p>
          </div>
        </div>

        {/* Writing Area */}
        <div className="max-w-2xl mx-auto">
          <div className="card-neumorphic p-6">
            <Textarea
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              placeholder="Begin writing your thoughts..."
              className="min-h-[300px] glassmorphic border-0 text-lg leading-relaxed resize-none focus:ring-2 focus:ring-purple-300"
            />
            
            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-gray-500">
                {entry.length} characters
              </div>
              <Button
                onClick={saveEntry}
                disabled={loading || !entry.trim()}
                className="button-neumorphic text-gray-800 hover:text-gray-900 px-8"
              >
                {loading ? 'Saving...' : 'Save Entry'}
              </Button>
            </div>
          </div>
        </div>

        {/* Ayurvedic Encouragement */}
        <div className="max-w-2xl mx-auto mt-8">
          <div className="glassmorphic p-4 rounded-lg text-center">
            <p className="text-sm text-gray-600 italic">
              "In the depth of winter, I finally learned that there was in me an invincible summer." - Albert Camus
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JournalingCard;
