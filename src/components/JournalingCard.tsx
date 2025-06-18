import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { collection, addDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { ChevronLeft, Timer, Pause, Play, Save, Focus, Sparkles } from 'lucide-react';
import AIWritingAssistant from './AIWritingAssistant';
import { AIService } from '@/services/aiService';

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
  onSave?: () => void;
  apiKey?: string;
}

const JournalingCard = ({ session, onBack, onSave, apiKey }: JournalingCardProps) => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(5 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [hasExistingEntry, setHasExistingEntry] = useState(false);
  const [existingEntryId, setExistingEntryId] = useState<string | null>(null);
  const [aiPrompt, setAiPrompt] = useState('');
  const [sentimentAnalysis, setSentimentAnalysis] = useState<any>(null);

  useEffect(() => {
    loadExistingEntry();
  }, [session.id, user]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const loadExistingEntry = async () => {
    if (!user) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      const entryId = `${user.uid}_${session.id}_${today}`;
      const entryRef = doc(db, 'journalEntries', entryId);
      const entrySnap = await getDoc(entryRef);

      if (entrySnap.exists()) {
        const data = entrySnap.data();
        setContent(data.content || '');
        setHasExistingEntry(true);
        setExistingEntryId(entryId);
      }
    } catch (error) {
      console.error('Error loading existing entry:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    if (!isTimerRunning && timerSeconds === 0) {
      setTimerSeconds(5 * 60);
    }
    setIsTimerRunning(!isTimerRunning);
  };

  const toggleFocusMode = () => {
    setIsFocusMode(!isFocusMode);
    if (!isFocusMode) {
      setTimerSeconds(5 * 60);
      setIsTimerRunning(true);
    } else {
      setIsTimerRunning(false);
    }
  };

  useEffect(() => {
    if (apiKey && content.length > 100) {
      analyzeSentiment();
    }
  }, [content, apiKey]);

  const analyzeSentiment = async () => {
    if (!apiKey) return;

    try {
      const aiService = new AIService(apiKey);
      const analysis = await aiService.analyzeSentiment(content);
      setSentimentAnalysis(analysis);
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
    }
  };

  const generateAIPrompt = async () => {
    if (!apiKey) return;

    try {
      const aiService = new AIService(apiKey);
      const suggestion = await aiService.generatePersonalizedPrompt(
        session.id,
        [content],
        new Date().toLocaleTimeString()
      );
      setAiPrompt(suggestion.prompt);
    } catch (error) {
      console.error('Error generating AI prompt:', error);
    }
  };

  const handleSuggestionSelect = (suggestion: string) => {
    setContent(prev => prev + '\n\n' + suggestion);
  };

  const wordCount = content.trim().split(/\s+/).filter(word => word.length > 0).length;
  const characterCount = content.length;

  const handleSave = async () => {
    if (!user || !content.trim()) return;

    setIsLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const entryData = {
        userId: user.uid,
        sessionId: session.id,
        content: content.trim(),
        date: today,
        timestamp: new Date(),
        wordCount: wordCount,
        characterCount: characterCount
      };

      if (hasExistingEntry && existingEntryId) {
        await updateDoc(doc(db, 'journalEntries', existingEntryId), entryData);
      } else {
        const entryId = `${user.uid}_${session.id}_${today}`;
        await addDoc(collection(db, 'journalEntries'), {
          ...entryData,
          id: entryId
        });
      }

      console.log('Entry saved successfully');
      onSave?.(); // Call the onSave callback to refresh analytics
      onBack();
    } catch (error) {
      console.error('Error saving entry:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFocusMode) {
    return (
      <div className="min-h-screen focus-mode-bg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/50"></div>
        
        <div className="relative z-10 container mx-auto px-6 py-8">
          <div className="max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center space-x-4">
                <Button
                  onClick={toggleFocusMode}
                  className="button-neumorphic text-gray-800 hover:text-gray-900 p-2"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <h2 className="text-2xl font-bold text-gray-800">Focus Mode</h2>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="glassmorphic px-4 py-2 rounded-lg">
                  <span className="text-lg font-mono text-gray-700">{formatTime(timerSeconds)}</span>
                </div>
                <Button
                  onClick={toggleTimer}
                  className="button-neumorphic text-gray-800 hover:text-gray-900 p-2"
                >
                  {isTimerRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </Button>
              </div>
            </div>

            <div className="card-neumorphic p-8">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">{session.title}</h3>
                  {apiKey && (
                    <Button
                      onClick={generateAIPrompt}
                      className="button-neumorphic text-gray-800 hover:text-gray-900"
                      size="sm"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      AI Prompt
                    </Button>
                  )}
                </div>
                <p className="text-gray-600 italic">"{aiPrompt || session.prompt}"</p>
                
                {sentimentAnalysis && (
                  <div className="mt-4 glassmorphic p-3 rounded-lg">
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="text-gray-600">Mood:</span>
                      <span className={`font-medium ${
                        sentimentAnalysis.sentiment === 'positive' ? 'text-green-600' :
                        sentimentAnalysis.sentiment === 'negative' ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {sentimentAnalysis.sentiment}
                      </span>
                      <span className="text-gray-600">|</span>
                      <span className="text-gray-600">
                        {sentimentAnalysis.emotions.slice(0, 2).join(', ')}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Let your thoughts flow freely..."
                className="min-h-[400px] text-lg leading-relaxed border-none bg-transparent resize-none focus:ring-0 focus:outline-none"
                autoFocus
              />

              <AIWritingAssistant
                content={content}
                sessionType={session.id}
                apiKey={apiKey}
                onSuggestionSelect={handleSuggestionSelect}
              />

              <div className="flex justify-between items-center mt-6">
                <div className="text-sm text-gray-500">
                  {wordCount} words • {characterCount} characters
                </div>
                <Button
                  onClick={handleSave}
                  disabled={isLoading || !content.trim()}
                  className="button-neumorphic text-gray-800 hover:text-gray-900 disabled:opacity-50"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isLoading ? 'Saving...' : hasExistingEntry ? 'Update Entry' : 'Save Entry'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ayurvedic-gradient lotus-pattern relative overflow-hidden">
      <div className="floating-orbs">
        <div className="floating-orb"></div>
        <div className="floating-orb"></div>
        <div className="floating-orb"></div>
        <div className="floating-orb"></div>
      </div>

      <div className="sacred-geometry"></div>

      <div className="relative z-10 container mx-auto px-6 py-8">
        <div className="max-w-3xl mx-auto">
          <header className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-4">
              <Button
                onClick={onBack}
                className="button-neumorphic text-gray-800 hover:text-gray-900 p-2"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 bg-gradient-to-br ${session.color} rounded-3xl flex items-center justify-center pulse-glow-animation`}>
                  <span className="text-2xl">{session.icon}</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">{session.title}</h1>
                  <p className="text-sm text-gray-600">{session.time}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                onClick={toggleFocusMode}
                className="button-neumorphic text-gray-800 hover:text-gray-900"
              >
                <Focus className="w-4 h-4 mr-2" />
                Focus Mode
              </Button>
              <div className="glassmorphic px-4 py-2 rounded-lg">
                <Timer className="w-4 h-4 inline mr-2" />
                <span className="text-sm font-mono">{formatTime(timerSeconds)}</span>
              </div>
            </div>
          </header>

          <div className="card-neumorphic p-8 mb-6">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-semibold text-gray-800">Reflection Prompt</h2>
                {apiKey && (
                  <Button
                    onClick={generateAIPrompt}
                    className="button-neumorphic text-gray-800 hover:text-gray-900"
                    size="sm"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    AI Prompt
                  </Button>
                )}
              </div>
              <div className="glassmorphic p-4 rounded-lg">
                <p className="text-gray-700 italic">"{aiPrompt || session.prompt}"</p>
              </div>
              
              {sentimentAnalysis && (
                <div className="mt-4 glassmorphic p-3 rounded-lg">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-600">Current mood:</span>
                      <span className={`font-medium ${
                        sentimentAnalysis.sentiment === 'positive' ? 'text-green-600' :
                        sentimentAnalysis.sentiment === 'negative' ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {sentimentAnalysis.sentiment}
                      </span>
                    </div>
                    <span className="text-gray-600">
                      {sentimentAnalysis.emotions.slice(0, 2).join(', ')}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{sentimentAnalysis.summary}</p>
                </div>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Your Reflection
              </label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Take a moment to reflect and write your thoughts..."
                className="min-h-[300px] text-base leading-relaxed"
              />
            </div>

            <AIWritingAssistant
              content={content}
              sessionType={session.id}
              apiKey={apiKey}
              onSuggestionSelect={handleSuggestionSelect}
            />

            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                {wordCount} words • {characterCount} characters
              </div>
              <Button
                onClick={handleSave}
                disabled={isLoading || !content.trim()}
                className="button-neumorphic text-gray-800 hover:text-gray-900 disabled:opacity-50"
              >
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? 'Saving...' : hasExistingEntry ? 'Update Entry' : 'Save Entry'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JournalingCard;
