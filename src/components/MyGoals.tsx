import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Plus, Trash2, Target, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { useToast } from '@/hooks/use-toast';

interface Goal {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

interface MyGoalsProps {
  onBack: () => void;
}

const MyGoals = ({ onBack }: MyGoalsProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [newGoal, setNewGoal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadGoals();
  }, [user]);

  const loadGoals = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const docRef = doc(db, 'goals', user.uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setGoals(docSnap.data().goals || []);
      }
    } catch (error) {
      console.error('Error loading goals:', error);
      toast({
        title: "Error",
        description: "Failed to load your goals. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveGoals = async (updatedGoals: Goal[]) => {
    if (!user) return;

    setIsSaving(true);
    try {
      const docRef = doc(db, 'goals', user.uid);
      await setDoc(docRef, {
        goals: updatedGoals,
        updatedAt: new Date().toISOString(),
        userId: user.uid
      });

      toast({
        title: "Success",
        description: "Your goals have been saved!",
      });
    } catch (error) {
      console.error('Error saving goals:', error);
      toast({
        title: "Error",
        description: "Failed to save your goals. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const addGoal = () => {
    if (!newGoal.trim()) return;

    const goal: Goal = {
      id: Date.now().toString(),
      text: newGoal.trim(),
      completed: false,
      createdAt: new Date().toISOString()
    };

    const updatedGoals = [...goals, goal];
    setGoals(updatedGoals);
    setNewGoal('');
    saveGoals(updatedGoals);
  };

  const toggleGoal = (goalId: string) => {
    const updatedGoals = goals.map(goal =>
      goal.id === goalId ? { ...goal, completed: !goal.completed } : goal
    );
    setGoals(updatedGoals);
    saveGoals(updatedGoals);
  };

  const deleteGoal = (goalId: string) => {
    const updatedGoals = goals.filter(goal => goal.id !== goalId);
    setGoals(updatedGoals);
    saveGoals(updatedGoals);
  };

  const completedGoals = goals.filter(goal => goal.completed).length;
  const totalGoals = goals.length;

  return (
    <div className="min-h-screen ayurvedic-gradient lotus-pattern relative overflow-hidden">
      {/* Background Elements */}
      <div className="floating-orbs">
        <div className="floating-orb"></div>
        <div className="floating-orb"></div>
        <div className="floating-orb"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button
            onClick={onBack}
            className="button-neumorphic mr-4 hover:scale-105 transition-transform text-gray-800 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 neumorphic flex items-center justify-center">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">My Goals</h1>
              <p className="text-gray-600">Track your aspirations and achievements</p>
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <Card className="card-neumorphic border-none mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-purple-600">{totalGoals}</div>
                <div className="text-sm text-gray-600">Total Goals</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{completedGoals}</div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0}%
                </div>
                <div className="text-sm text-gray-600">Progress</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add New Goal */}
        <Card className="card-neumorphic border-none mb-8">
          <CardHeader>
            <CardTitle className="text-gray-800">Add New Goal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-3">
              <Input
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                placeholder="Enter your goal..."
                className="flex-1 bg-white/50 border-purple-200 focus:border-purple-400"
                onKeyPress={(e) => e.key === 'Enter' && addGoal()}
                maxLength={100}
              />
              <Button
                onClick={addGoal}
                disabled={!newGoal.trim() || isSaving}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Goals List */}
        <Card className="card-neumorphic border-none">
          <CardHeader>
            <CardTitle className="text-gray-800">Your Goals</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse flex items-center space-x-3">
                    <div className="w-6 h-6 bg-gray-200 rounded"></div>
                    <div className="flex-1 h-4 bg-gray-200 rounded"></div>
                    <div className="w-8 h-8 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : goals.length === 0 ? (
              <div className="text-center py-8">
                <Target className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No goals yet. Add your first goal above!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {goals.map((goal) => (
                  <div
                    key={goal.id}
                    className={`flex items-center space-x-3 p-3 rounded-lg border transition-all ${
                      goal.completed
                        ? 'bg-green-50 border-green-200'
                        : 'bg-white/30 border-purple-100'
                    }`}
                  >
                    <Button
                      onClick={() => toggleGoal(goal.id)}
                      variant="ghost"
                      size="sm"
                      className={`p-1 ${
                        goal.completed ? 'text-green-600' : 'text-gray-400'
                      }`}
                    >
                      <CheckCircle2 className="w-5 h-5" />
                    </Button>
                    <span
                      className={`flex-1 ${
                        goal.completed
                          ? 'line-through text-gray-500'
                          : 'text-gray-800'
                      }`}
                    >
                      {goal.text}
                    </span>
                    <Button
                      onClick={() => deleteGoal(goal.id)}
                      variant="ghost"
                      size="sm"
                      className="p-1 text-red-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MyGoals;
