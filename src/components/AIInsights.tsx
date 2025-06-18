
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AIService, AIInsight } from '@/services/aiService';
import { Brain, TrendingUp, Lightbulb, Target, RefreshCw } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '@/config/firebase';

interface AIInsightsProps {
  apiKey?: string;
}

const AIInsights = ({ apiKey }: AIInsightsProps) => {
  const { user } = useAuth();
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastGenerated, setLastGenerated] = useState<Date | null>(null);

  useEffect(() => {
    if (apiKey && user) {
      const lastGen = localStorage.getItem('journday_last_insights');
      if (lastGen) {
        const lastDate = new Date(lastGen);
        const hoursSince = (Date.now() - lastDate.getTime()) / (1000 * 60 * 60);
        if (hoursSince < 6) { // Don't regenerate if less than 6 hours
          const savedInsights = localStorage.getItem('journday_insights');
          if (savedInsights) {
            setInsights(JSON.parse(savedInsights));
            setLastGenerated(lastDate);
            return;
          }
        }
      }
      generateInsights();
    }
  }, [apiKey, user]);

  const generateInsights = async () => {
    if (!apiKey || !user) return;

    setLoading(true);
    try {
      const aiService = new AIService(apiKey);
      
      // Fetch recent entries
      const entriesRef = collection(db, 'journalEntries');
      const q = query(
        entriesRef,
        where('userId', '==', user.uid),
        orderBy('timestamp', 'desc'),
        limit(10)
      );
      
      const querySnapshot = await getDocs(q);
      const entries: any[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        entries.push({
          content: data.content,
          date: data.date,
          sessionId: data.sessionId
        });
      });

      const generatedInsights = await aiService.generateInsights(entries);
      setInsights(generatedInsights);
      setLastGenerated(new Date());
      
      // Cache insights
      localStorage.setItem('journday_insights', JSON.stringify(generatedInsights));
      localStorage.setItem('journday_last_insights', new Date().toISOString());
    } catch (error) {
      console.error('Error generating insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'pattern': return <TrendingUp className="w-5 h-5" />;
      case 'suggestion': return <Lightbulb className="w-5 h-5" />;
      case 'reflection': return <Target className="w-5 h-5" />;
      default: return <Brain className="w-5 h-5" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'pattern': return 'text-blue-600';
      case 'suggestion': return 'text-yellow-600';
      case 'reflection': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  if (!apiKey) return null;

  return (
    <Card className="card-neumorphic border-none mb-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-gray-800">
          <div className="flex items-center">
            <Brain className="w-5 h-5 mr-2" />
            AI Insights
          </div>
          <Button
            onClick={generateInsights}
            disabled={loading}
            className="button-neumorphic text-gray-800 hover:text-gray-900"
            size="sm"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">
            <Brain className="w-8 h-8 mx-auto mb-4 animate-pulse text-purple-600" />
            <p className="text-gray-600">AI is analyzing your journey...</p>
          </div>
        ) : insights.length > 0 ? (
          <div className="space-y-4">
            {insights.map((insight, index) => (
              <div key={index} className="glassmorphic p-4 rounded-lg">
                <div className="flex items-start space-x-3">
                  <div className={`${getInsightColor(insight.type)} mt-1`}>
                    {getInsightIcon(insight.type)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800 mb-1">{insight.title}</h4>
                    <p className="text-sm text-gray-600">{insight.content}</p>
                    <div className="mt-2 flex items-center space-x-2">
                      <span className="text-xs text-gray-500 capitalize">{insight.type}</span>
                      <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                        <span className="text-xs text-gray-500">
                          {Math.round(insight.relevance * 100)}% relevant
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {lastGenerated && (
              <p className="text-xs text-gray-500 text-center mt-4">
                Last updated: {lastGenerated.toLocaleTimeString()}
              </p>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <Brain className="w-8 h-8 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600">Start journaling to receive AI insights</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIInsights;
