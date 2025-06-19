
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { JournalEntry } from '@/types/journal';
import { Cloud, Sun, CloudRain, Zap, Snowflake, CloudDrizzle } from 'lucide-react';

interface MoodWeatherMapProps {
  entries: JournalEntry[];
}

interface WeatherData {
  date: string;
  weather: string;
  emotion: number;
  icon: JSX.Element;
  description: string;
  color: string;
}

const MoodWeatherMap = ({ entries }: MoodWeatherMapProps) => {
  const getWeatherFromEmotion = (emotion: number): { weather: string; icon: JSX.Element; description: string; color: string } => {
    if (emotion >= 4.5) {
      return {
        weather: 'sunny',
        icon: <Sun className="w-6 h-6 text-yellow-500" />,
        description: 'Bright and radiant',
        color: 'from-yellow-300 to-orange-300'
      };
    } else if (emotion >= 3.5) {
      return {
        weather: 'partly-cloudy',
        icon: <Cloud className="w-6 h-6 text-blue-400" />,
        description: 'Pleasant with some clouds',
        color: 'from-blue-200 to-blue-300'
      };
    } else if (emotion >= 2.5) {
      return {
        weather: 'cloudy',
        icon: <CloudDrizzle className="w-6 h-6 text-gray-500" />,
        description: 'Overcast and contemplative',
        color: 'from-gray-300 to-gray-400'
      };
    } else if (emotion >= 1.5) {
      return {
        weather: 'rainy',
        icon: <CloudRain className="w-6 h-6 text-blue-600" />,
        description: 'Stormy with emotional rain',
        color: 'from-blue-400 to-blue-600'
      };
    } else {
      return {
        weather: 'stormy',
        icon: <Zap className="w-6 h-6 text-purple-600" />,
        description: 'Intense emotional weather',
        color: 'from-purple-400 to-purple-600'
      };
    }
  };

  const generateWeatherData = (): WeatherData[] => {
    const last14Days = [...entries]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 14);

    return last14Days.map(entry => {
      const weather = getWeatherFromEmotion(entry.emotionScale);
      return {
        date: entry.date,
        emotion: entry.emotionScale,
        ...weather
      };
    });
  };

  const getWeatherTrend = (weatherData: WeatherData[]): string => {
    if (weatherData.length < 3) return "Not enough data";
    
    const recent = weatherData.slice(0, 3).reduce((sum, d) => sum + d.emotion, 0) / 3;
    const earlier = weatherData.slice(-3).reduce((sum, d) => sum + d.emotion, 0) / 3;
    
    if (recent - earlier > 0.5) return "Weather improving ☀️";
    if (earlier - recent > 0.5) return "Stormy weather ahead ⛈️";
    return "Stable weather patterns 🌤️";
  };

  const weatherData = generateWeatherData();
  const trend = getWeatherTrend(weatherData);

  return (
    <Card className="card-neumorphic border-none">
      <CardHeader>
        <CardTitle className="flex items-center text-gray-800">
          <Cloud className="w-5 h-5 mr-2" />
          Mood Weather Map
        </CardTitle>
      </CardHeader>
      <CardContent>
        {weatherData.length === 0 ? (
          <div className="text-center py-8">
            <Cloud className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">Start journaling to see your emotional weather patterns!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Weather Trend */}
            <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">Weather Forecast</h3>
              <p className="text-lg font-medium text-gray-700">{trend}</p>
            </div>

            {/* Weather Map Grid */}
            <div className="grid grid-cols-7 gap-2 md:gap-3">
              {weatherData.map((day, index) => (
                <div
                  key={day.date}
                  className={`relative p-3 rounded-lg bg-gradient-to-br ${day.color} text-center transition-all hover:scale-105 cursor-pointer group`}
                >
                  <div className="text-white mb-2">
                    {day.icon}
                  </div>
                  <div className="text-xs text-white font-medium">
                    {new Date(day.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </div>
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-black text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                      {day.description}
                      <br />
                      Emotion: {day.emotion}/5
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Weather Legend */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
              <div className="flex items-center space-x-1">
                <Sun className="w-4 h-4 text-yellow-500" />
                <span className="text-gray-600">Sunny (4.5+)</span>
              </div>
              <div className="flex items-center space-x-1">
                <Cloud className="w-4 h-4 text-blue-400" />
                <span className="text-gray-600">Partly Cloudy (3.5+)</span>
              </div>
              <div className="flex items-center space-x-1">
                <CloudDrizzle className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">Cloudy (2.5+)</span>
              </div>
              <div className="flex items-center space-x-1">
                <CloudRain className="w-4 h-4 text-blue-600" />
                <span className="text-gray-600">Rainy (1.5+)</span>
              </div>
              <div className="flex items-center space-x-1">
                <Zap className="w-4 h-4 text-purple-600" />
                <span className="text-gray-600">Stormy (<1.5)</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MoodWeatherMap;
