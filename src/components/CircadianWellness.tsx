
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { JournalEntry } from '@/types/journal';
import { Moon, Sun, Zap, TrendingUp, Clock, Brain } from 'lucide-react';

interface CircadianWellnessProps {
  entries: JournalEntry[];
}

interface SleepJournalCorrelation {
  averageSleepQuality: number;
  averageMoodAfterGoodSleep: number;
  averageMoodAfterPoorSleep: number;
  correlation: number;
}

interface EnergyPattern {
  timeSlot: string;
  averageEnergy: number;
  averageMood: number;
  entryCount: number;
  suggestion: string;
}

const CircadianWellness = ({ entries }: CircadianWellnessProps) => {
  const analyzeSleepCorrelation = (): SleepJournalCorrelation => {
    const entriesWithSleep = entries.filter(e => e.sleepQuality !== undefined);
    
    if (entriesWithSleep.length === 0) {
      return {
        averageSleepQuality: 0,
        averageMoodAfterGoodSleep: 0,
        averageMoodAfterPoorSleep: 0,
        correlation: 0
      };
    }

    const avgSleep = entriesWithSleep.reduce((sum, e) => sum + (e.sleepQuality || 0), 0) / entriesWithSleep.length;
    const goodSleepEntries = entriesWithSleep.filter(e => (e.sleepQuality || 0) >= 4);
    const poorSleepEntries = entriesWithSleep.filter(e => (e.sleepQuality || 0) <= 2);

    const avgMoodGoodSleep = goodSleepEntries.length > 0 
      ? goodSleepEntries.reduce((sum, e) => sum + e.emotionScale, 0) / goodSleepEntries.length 
      : 0;
    
    const avgMoodPoorSleep = poorSleepEntries.length > 0
      ? poorSleepEntries.reduce((sum, e) => sum + e.emotionScale, 0) / poorSleepEntries.length
      : 0;

    const correlation = avgMoodGoodSleep - avgMoodPoorSleep;

    return {
      averageSleepQuality: avgSleep,
      averageMoodAfterGoodSleep: avgMoodGoodSleep,
      averageMoodAfterPoorSleep: avgMoodPoorSleep,
      correlation
    };
  };

  const analyzeEnergyPatterns = (): EnergyPattern[] => {
    const timeSlots = ['morning', 'midday', 'cbt', 'evening', 'gratitude'];
    const patterns: EnergyPattern[] = [];

    timeSlots.forEach(slot => {
      const slotEntries = entries.filter(e => e.sessionId === slot);
      if (slotEntries.length > 0) {
        const avgEnergy = slotEntries.reduce((sum, e) => sum + (e.energyLevel || 3), 0) / slotEntries.length;
        const avgMood = slotEntries.reduce((sum, e) => sum + e.emotionScale, 0) / slotEntries.length;
        
        patterns.push({
          timeSlot: slot,
          averageEnergy: avgEnergy,
          averageMood: avgMood,
          entryCount: slotEntries.length,
          suggestion: generateBiorhythmSuggestion(slot, avgEnergy, avgMood)
        });
      }
    });

    return patterns.sort((a, b) => b.averageEnergy - a.averageEnergy);
  };

  const generateBiorhythmSuggestion = (timeSlot: string, energy: number, mood: number): string => {
    const suggestions = {
      morning: energy > 3.5 
        ? "Your mornings are energized! Perfect time for goal-setting and intention work."
        : "Consider a gentle morning routine to boost your energy. Try gratitude or light stretching.",
      midday: energy > 3.5
        ? "Great midday energy! Use this time for productive reflection and problem-solving."
        : "Midday energy dip detected. Consider a brief walk or mindful breathing exercise.",
      cbt: mood < 3
        ? "This is an optimal time for cognitive reframing when emotions are present."
        : "Your afternoon mindset work is balanced. Continue with thought pattern analysis.",
      evening: energy > 3
        ? "High evening energy! Good time for deeper reflection and processing the day."
        : "Low evening energy is natural. Focus on gentle reflection and winding down.",
      gratitude: mood > 3.5
        ? "Your gratitude practice is enhancing your evening mood beautifully."
        : "Gratitude practice could help shift your evening mindset. Focus on small wins."
    };

    return suggestions[timeSlot as keyof typeof suggestions] || "Continue your mindful practice.";
  };

  const getDreamPrompts = (): string[] => {
    const currentHour = new Date().getHours();
    if (currentHour >= 21 || currentHour <= 6) {
      return [
        "What symbols or themes appeared in your dreams?",
        "How did your dreams make you feel upon waking?",
        "What connections can you draw between your dreams and recent experiences?",
        "Record any vivid dream details before they fade."
      ];
    }
    return [];
  };

  const sleepCorrelation = analyzeSleepCorrelation();
  const energyPatterns = analyzeEnergyPatterns();
  const dreamPrompts = getDreamPrompts();

  return (
    <div className="space-y-6">
      {/* Sleep-Journal Correlation */}
      <Card className="card-neumorphic border-none">
        <CardHeader>
          <CardTitle className="flex items-center text-gray-800">
            <Moon className="w-5 h-5 mr-2" />
            Sleep & Mood Connection
          </CardTitle>
        </CardHeader>
        <CardContent>
          {sleepCorrelation.averageSleepQuality === 0 ? (
            <div className="text-center py-6">
              <Moon className="w-12 h-12 mx-auto text-gray-400 mb-2" />
              <p className="text-gray-600">Start tracking sleep quality to see correlations with your mood!</p>
              <p className="text-sm text-gray-500 mt-1">Add sleep quality ratings to your journal entries</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {sleepCorrelation.averageSleepQuality.toFixed(1)}
                  </div>
                  <div className="text-sm text-blue-700">Avg Sleep Quality</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {sleepCorrelation.averageMoodAfterGoodSleep.toFixed(1)}
                  </div>
                  <div className="text-sm text-green-700">Mood After Good Sleep</div>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {sleepCorrelation.averageMoodAfterPoorSleep.toFixed(1)}
                  </div>
                  <div className="text-sm text-orange-700">Mood After Poor Sleep</div>
                </div>
              </div>
              
              {sleepCorrelation.correlation > 0.5 && (
                <div className="bg-green-100 border border-green-300 rounded-lg p-3">
                  <p className="text-green-800 text-sm">
                    <strong>Strong correlation detected!</strong> Your mood improves by {sleepCorrelation.correlation.toFixed(1)} points with better sleep.
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Energy Patterns & Biorhythm Insights */}
      <Card className="card-neumorphic border-none">
        <CardHeader>
          <CardTitle className="flex items-center text-gray-800">
            <Zap className="w-5 h-5 mr-2" />
            Energy Cycles & Optimal Times
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {energyPatterns.length === 0 ? (
              <p className="text-gray-600 text-center py-6">
                Start tracking energy levels to discover your optimal journaling times! ⚡
              </p>
            ) : (
              energyPatterns.map((pattern, index) => (
                <div key={pattern.timeSlot} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-gray-800 capitalize">{pattern.timeSlot}</h4>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        {pattern.entryCount} entries
                      </Badge>
                      <span className="text-sm text-gray-600">
                        Energy: {pattern.averageEnergy.toFixed(1)}/5
                      </span>
                    </div>
                  </div>
                  <Progress value={(pattern.averageEnergy / 5) * 100} className="h-2" />
                  <p className="text-sm text-gray-600">{pattern.suggestion}</p>
                  {index === 0 && (
                    <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                      ⭐ Your Peak Energy Time
                    </Badge>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dream Integration */}
      {dreamPrompts.length > 0 && (
        <Card className="card-neumorphic border-none bg-gradient-to-br from-indigo-50 to-purple-50">
          <CardHeader>
            <CardTitle className="flex items-center text-gray-800">
              <Brain className="w-5 h-5 mr-2" />
              Dream Journal Portal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 mb-3">
                <Moon className="w-5 h-5 text-indigo-600" />
                <span className="text-sm text-indigo-700 font-medium">
                  Perfect time for dream reflection
                </span>
              </div>
              {dreamPrompts.map((prompt, index) => (
                <div key={index} className="bg-white/50 rounded-lg p-3 border border-indigo-200">
                  <p className="text-sm text-gray-700 italic">"{prompt}"</p>
                </div>
              ))}
              <div className="mt-4 text-center">
                <Badge className="bg-indigo-100 text-indigo-800">
                  Dreams reveal your subconscious wisdom 🌙
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Circadian Optimization Tips */}
      <Card className="card-neumorphic border-none">
        <CardHeader>
          <CardTitle className="flex items-center text-gray-800">
            <Clock className="w-5 h-5 mr-2" />
            Circadian Optimization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium text-gray-800 flex items-center">
                <Sun className="w-4 h-4 mr-1 text-yellow-500" />
                Morning (6-12 PM)
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Set intentions and goals</li>
                <li>• Process overnight insights</li>
                <li>• Plan your day mindfully</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-gray-800 flex items-center">
                <Moon className="w-4 h-4 mr-1 text-indigo-500" />
                Evening (6-10 PM)
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Reflect on the day</li>
                <li>• Practice gratitude</li>
                <li>• Process emotions gently</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CircadianWellness;
