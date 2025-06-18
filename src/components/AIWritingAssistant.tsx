
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AIService } from '@/services/aiService';
import { Sparkles, Lightbulb, ArrowRight } from 'lucide-react';

interface AIWritingAssistantProps {
  content: string;
  sessionType: string;
  apiKey?: string;
  onSuggestionSelect: (suggestion: string) => void;
}

const AIWritingAssistant = ({ content, sessionType, apiKey, onSuggestionSelect }: AIWritingAssistantProps) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastContent, setLastContent] = useState('');

  useEffect(() => {
    if (apiKey && content.length > 50 && content !== lastContent) {
      const debounceTimer = setTimeout(() => {
        getSuggestions();
        setLastContent(content);
      }, 2000);
      
      return () => clearTimeout(debounceTimer);
    }
  }, [content, apiKey]);

  const getSuggestions = async () => {
    if (!apiKey) return;

    setLoading(true);
    try {
      const aiService = new AIService(apiKey);
      const newSuggestions = await aiService.generateWritingSuggestions(content, sessionType);
      setSuggestions(newSuggestions);
    } catch (error) {
      console.error('Error getting writing suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!apiKey || (!suggestions.length && !loading)) return null;

  return (
    <Card className="glassmorphic border-none mt-4">
      <CardContent className="p-4">
        <div className="flex items-center mb-3">
          <Sparkles className="w-4 h-4 text-purple-600 mr-2" />
          <span className="text-sm font-medium text-gray-700">AI Writing Assistant</span>
        </div>
        
        {loading ? (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span>Analyzing your reflection...</span>
          </div>
        ) : (
          <div className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => onSuggestionSelect(suggestion)}
                className="w-full text-left p-3 glassmorphic rounded-lg hover:bg-white/20 transition-colors group"
              >
                <div className="flex items-start space-x-2">
                  <Lightbulb className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700 flex-1">{suggestion}</span>
                  <ArrowRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIWritingAssistant;
