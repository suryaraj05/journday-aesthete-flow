import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/hooks/useAuth';
import { collection, addDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { ChevronLeft, Timer, Pause, Play, Save, Focus, Heart, CheckSquare, Plus, Trash2 } from 'lucide-react';

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
}

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

const emotions = [
  { id: 1, label: 'Very Sad', emoji: '😢', color: 'text-blue-600' },
  { id: 2, label: 'Sad', emoji: '😞', color: 'text-blue-500' },
  { id: 3, label: 'Neutral', emoji: '😐', color: 'text-gray-500' },
  { id: 4, label: 'Happy', emoji: '😊', color: 'text-green-500' },
  { id: 5, label: 'Very Happy', emoji: '😄', color: 'text-green-600' }
];

const JournalingCard = ({ session, onBack, onSave }: JournalingCardProps) => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [emotionScale, setEmotionScale] = useState<number>(3);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(5 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [hasExistingEntry, setHasExistingEntry] = useState(false);
  const [existingEntryId, setExistingEntryId] = useState<string | null>(null);
  
  // Todo functionality
  const [todosEnabled, setTodosEnabled] = useState(false);
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [newTodoText, setNewTodoText] = useState('');
  const [todosFromMorning, setTodosFromMorning] = useState<TodoItem[]>([]);

  useEffect(() => {
    loadExistingEntry();
    if (session.id === 'evening') {
      loadMorningTodos();
    }
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

  const loadMorningTodos = async () => {
    if (!user) return;
    
    try {
      const today = new Date().toISOString().split('T')[0];
      const morningEntryId = `${user.uid}_morning_${today}`;
      const entryRef = doc(db, 'journalEntries', morningEntryId);
      const entrySnap = await getDoc(entryRef);

      if (entrySnap.exists()) {
        const data = entrySnap.data();
        if (data.todos && data.todosEnabled) {
          setTodosFromMorning(data.todos);
        }
      }
    } catch (error) {
      console.error('Error loading morning todos:', error);
    }
  };

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
        setEmotionScale(data.emotionScale || 3);
        setTodosEnabled(data.todosEnabled || false);
        setTodos(data.todos || []);
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
        emotionScale: emotionScale,
        date: today,
        timestamp: new Date(),
        wordCount: wordCount,
        characterCount: characterCount,
        todosEnabled: todosEnabled,
        todos: todos
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
      onSave?.();
      onBack();
    } catch (error) {
      console.error('Error saving entry:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getUpdatedPrompt = () => {
    if (session.id === 'morning' && todosEnabled) {
      return "What's my top goal today? How will I overcome one obstacle? What are my key tasks for today?";
    }
    if (session.id === 'evening' && todosFromMorning.length > 0) {
      const completedCount = todosFromMorning.filter(todo => todo.completed).length;
      return `What went well today? What can I improve tomorrow? How many of today's tasks did I complete? (${completedCount}/${todosFromMorning.length} completed)`;
    }
    return session.prompt;
  };

  const addTodo = () => {
    if (newTodoText.trim()) {
      const newTodo: TodoItem = {
        id: Date.now().toString(),
        text: newTodoText.trim(),
        completed: false
      };
      setTodos([...todos, newTodo]);
      setNewTodoText('');
    }
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
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
                <h3 className="text-xl font-semibold text-gray-800 mb-4">{session.title}</h3>
                <p className="text-gray-600 italic">"{session.prompt}"</p>
              </div>

              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Let your thoughts flow freely..."
                className="min-h-[400px] text-lg leading-relaxed border-none bg-transparent resize-none focus:ring-0 focus:outline-none"
                autoFocus
              />

              <div className="mb-6">
                <Label className="text-base font-medium text-gray-700 mb-3 block flex items-center">
                  <Heart className="w-4 h-4 mr-2" />
                  How are you feeling right now?
                </Label>
                <RadioGroup value={emotionScale.toString()} onValueChange={(value) => setEmotionScale(parseInt(value))}>
                  <div className="flex justify-between">
                    {emotions.map((emotion) => (
                      <div key={emotion.id} className="flex flex-col items-center">
                        <RadioGroupItem value={emotion.id.toString()} id={`emotion-${emotion.id}`} className="mb-2" />
                        <Label htmlFor={`emotion-${emotion.id}`} className={`text-2xl mb-1 ${emotion.color}`}>
                          {emotion.emoji}
                        </Label>
                        <Label htmlFor={`emotion-${emotion.id}`} className="text-xs text-center">
                          {emotion.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>

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
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Reflection Prompt</h2>
              <div className="glassmorphic p-4 rounded-lg">
                <p className="text-gray-700 italic">"{getUpdatedPrompt()}"</p>
              </div>
            </div>

            {/* Todo Section for Morning Intention */}
            {session.id === 'morning' && (
              <div className="mb-6">
                <div className="flex items-center space-x-3 mb-4">
                  <CheckSquare className="w-5 h-5 text-purple-600" />
                  <Label className="text-base font-medium text-gray-700">Daily Tasks</Label>
                  <Switch
                    checked={todosEnabled}
                    onCheckedChange={setTodosEnabled}
                  />
                  <span className="text-sm text-gray-600">
                    {todosEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>

                {todosEnabled && (
                  <div className="glassmorphic p-4 rounded-lg space-y-3">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newTodoText}
                        onChange={(e) => setNewTodoText(e.target.value)}
                        placeholder="Add a task for today..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        onKeyPress={(e) => e.key === 'Enter' && addTodo()}
                      />
                      <Button onClick={addTodo} className="px-3 py-2">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="space-y-2">
                      {todos.map((todo) => (
                        <div key={todo.id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={todo.completed}
                            onChange={() => toggleTodo(todo.id)}
                            className="rounded focus:ring-purple-500"
                          />
                          <span className={`flex-1 ${todo.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                            {todo.text}
                          </span>
                          <Button
                            onClick={() => deleteTodo(todo.id)}
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Todo Review for Evening Reflection */}
            {session.id === 'evening' && todosFromMorning.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <CheckSquare className="w-5 h-5 mr-2 text-purple-600" />
                  Today's Task Review
                </h3>
                <div className="glassmorphic p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-3">
                    Completed {todosFromMorning.filter(todo => todo.completed).length} of {todosFromMorning.length} tasks
                  </p>
                  <div className="space-y-2">
                    {todosFromMorning.map((todo) => (
                      <div key={todo.id} className="flex items-center space-x-2">
                        <span className={`w-4 h-4 ${todo.completed ? 'text-green-500' : 'text-gray-400'}`}>
                          {todo.completed ? '✓' : '○'}
                        </span>
                        <span className={`${todo.completed ? 'text-green-700' : 'text-gray-500'}`}>
                          {todo.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

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

            <div className="mb-6">
              <Label className="text-base font-medium text-gray-700 mb-3 block flex items-center">
                <Heart className="w-4 h-4 mr-2" />
                How are you feeling right now?
              </Label>
              <RadioGroup value={emotionScale.toString()} onValueChange={(value) => setEmotionScale(parseInt(value))}>
                <div className="flex justify-between">
                  {emotions.map((emotion) => (
                    <div key={emotion.id} className="flex flex-col items-center">
                      <RadioGroupItem value={emotion.id.toString()} id={`emotion-${emotion.id}`} className="mb-2" />
                      <Label htmlFor={`emotion-${emotion.id}`} className={`text-2xl mb-1 ${emotion.color}`}>
                        {emotion.emoji}
                      </Label>
                      <Label htmlFor={`emotion-${emotion.id}`} className="text-xs text-center">
                        {emotion.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>

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
