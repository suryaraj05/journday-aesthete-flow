
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PersonalGrowthMilestone } from '@/services/advancedAnalytics';
import { TrendingUp, BookOpen, Heart, Target, Star } from 'lucide-react';

interface PersonalGrowthTimelineProps {
  milestones: PersonalGrowthMilestone[];
}

const PersonalGrowthTimeline = ({ milestones }: PersonalGrowthTimelineProps) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'emotional': return <Heart className="w-4 h-4" />;
      case 'writing': return <BookOpen className="w-4 h-4" />;
      case 'consistency': return <TrendingUp className="w-4 h-4" />;
      case 'goal': return <Target className="w-4 h-4" />;
      default: return <Star className="w-4 h-4" />;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'emotional': return 'bg-pink-500';
      case 'writing': return 'bg-blue-500';
      case 'consistency': return 'bg-green-500';
      case 'goal': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card className="card-neumorphic border-none">
      <CardHeader>
        <CardTitle className="flex items-center text-gray-800">
          <TrendingUp className="w-5 h-5 mr-2" />
          Personal Growth Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {milestones.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              Keep journaling to see your growth milestones appear here! 🌱
            </p>
          ) : (
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-300 to-pink-300"></div>
              {milestones.map((milestone, index) => (
                <div key={index} className="relative flex items-start space-x-4 pb-6">
                  <div className={`w-8 h-8 rounded-full ${getColor(milestone.type)} flex items-center justify-center text-white shadow-lg`}>
                    {getIcon(milestone.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-semibold text-gray-800">{milestone.title}</h4>
                      <Badge variant="outline" className="text-xs">
                        {new Date(milestone.date).toLocaleDateString()}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{milestone.description}</p>
                    {milestone.type === 'emotional' && (
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span>Impact: {milestone.emotionAfter.toFixed(1)} - {milestone.emotionBefore.toFixed(1)} = +{milestone.significance.toFixed(1)}</span>
                      </div>
                    )}
                    {milestone.type === 'writing' && (
                      <div className="text-xs text-gray-500">
                        Significance: {milestone.significance.toFixed(1)}x average length
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalGrowthTimeline;
