
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Key, Sparkles } from 'lucide-react';

interface AISettingsProps {
  onApiKeySet: (apiKey: string) => void;
  currentApiKey?: string;
}

const AISettings = ({ onApiKeySet, currentApiKey }: AISettingsProps) => {
  const [apiKey, setApiKey] = useState(currentApiKey || '');
  const [isVisible, setIsVisible] = useState(!currentApiKey);

  const handleSave = () => {
    if (apiKey.trim()) {
      localStorage.setItem('journday_openai_key', apiKey);
      onApiKeySet(apiKey);
      setIsVisible(false);
    }
  };

  if (!isVisible && currentApiKey) {
    return (
      <Button
        onClick={() => setIsVisible(true)}
        className="button-neumorphic text-gray-800 hover:text-gray-900"
        size="sm"
      >
        <Brain className="w-4 h-4 mr-2" />
        AI Settings
      </Button>
    );
  }

  return (
    <Card className="card-neumorphic border-none mb-6">
      <CardHeader>
        <CardTitle className="flex items-center text-gray-800">
          <Sparkles className="w-5 h-5 mr-2" />
          AI-Powered Features
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">
          Enable AI features like personalized prompts, sentiment analysis, and intelligent insights by adding your OpenAI API key.
        </p>
        <div className="flex space-x-2">
          <div className="flex-1">
            <Input
              type="password"
              placeholder="Enter your OpenAI API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="glassmorphic"
            />
          </div>
          <Button
            onClick={handleSave}
            disabled={!apiKey.trim()}
            className="button-neumorphic text-gray-800 hover:text-gray-900"
          >
            <Key className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>
        <p className="text-xs text-gray-500">
          Your API key is stored locally and never shared. Get your key from{' '}
          <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">
            OpenAI Platform
          </a>
        </p>
      </CardContent>
    </Card>
  );
};

export default AISettings;
