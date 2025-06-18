
const OPENAI_API_URL = 'https://api.openai.ai/v1/chat/completions';

export interface AISentimentAnalysis {
  sentiment: 'positive' | 'neutral' | 'negative';
  emotions: string[];
  confidence: number;
  summary: string;
}

export interface AIInsight {
  type: 'pattern' | 'suggestion' | 'reflection';
  title: string;
  content: string;
  relevance: number;
}

export interface AIPromptSuggestion {
  prompt: string;
  reasoning: string;
  category: string;
}

export class AIService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generatePersonalizedPrompt(
    sessionType: string,
    recentEntries: string[],
    timeOfDay: string
  ): Promise<AIPromptSuggestion> {
    const response = await this.callOpenAI([
      {
        role: 'system',
        content: `You are a mindful journaling assistant with expertise in Ayurveda and cognitive behavioral therapy. Generate personalized journal prompts based on the user's recent entries and current session type.`
      },
      {
        role: 'user',
        content: `Session type: ${sessionType}, Time: ${timeOfDay}, Recent entries: ${recentEntries.join(' | ')}`
      }
    ]);

    try {
      const result = JSON.parse(response);
      return result;
    } catch {
      return {
        prompt: "What are you feeling right now, and what might be behind those feelings?",
        reasoning: "A gentle exploration of current emotional state",
        category: "mindfulness"
      };
    }
  }

  async analyzeSentiment(text: string): Promise<AISentimentAnalysis> {
    const response = await this.callOpenAI([
      {
        role: 'system',
        content: `Analyze the sentiment and emotions in this journal entry. Return a JSON object with: sentiment (positive/neutral/negative), emotions (array of emotions detected), confidence (0-1), and summary (brief insight).`
      },
      {
        role: 'user',
        content: text
      }
    ]);

    try {
      return JSON.parse(response);
    } catch {
      return {
        sentiment: 'neutral',
        emotions: ['calm'],
        confidence: 0.5,
        summary: 'A reflective entry with mixed emotions'
      };
    }
  }

  async generateInsights(entries: Array<{content: string, date: string, sessionId: string}>): Promise<AIInsight[]> {
    const response = await this.callOpenAI([
      {
        role: 'system',
        content: `You are a therapeutic AI assistant. Analyze these journal entries and provide 3-5 meaningful insights about patterns, growth opportunities, and positive observations. Return as JSON array of insights with type, title, content, and relevance (0-1).`
      },
      {
        role: 'user',
        content: JSON.stringify(entries)
      }
    ]);

    try {
      return JSON.parse(response);
    } catch {
      return [
        {
          type: 'pattern',
          title: 'Consistent Reflection',
          content: 'You show dedication to self-reflection through regular journaling.',
          relevance: 0.8
        }
      ];
    }
  }

  async generateWritingSuggestions(currentText: string, sessionType: string): Promise<string[]> {
    const response = await this.callOpenAI([
      {
        role: 'system',
        content: `You are a writing assistant for ${sessionType} journaling. Provide 3 brief, helpful suggestions to deepen reflection based on the current text. Return as JSON array of strings.`
      },
      {
        role: 'user',
        content: currentText
      }
    ]);

    try {
      return JSON.parse(response);
    } catch {
      return [
        "Try exploring the 'why' behind your thoughts",
        "Consider what you learned from this experience",
        "Reflect on how this connects to your values"
      ];
    }
  }

  private async callOpenAI(messages: Array<{role: string, content: string}>): Promise<string> {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages,
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to call OpenAI API');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }
}
