
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Star, Target, Flame } from 'lucide-react';
import { Badge as BadgeType, Achievement } from '@/types/journal';

interface GamificationCardProps {
  currentStreak: number;
  badges: BadgeType[];
  achievements: Achievement[];
  totalEntries: number;
}

const GamificationCard = ({ currentStreak, badges, achievements, totalEntries }: GamificationCardProps) => {
  const earnedBadges = badges.filter(b => b.earned);
  const activeAchievements = achievements.filter(a => !a.unlocked).slice(0, 3);

  return (
    <Card className="card-neumorphic border-none">
      <CardHeader>
        <CardTitle className="flex items-center text-gray-800">
          <Trophy className="w-5 h-5 mr-2" />
          Your Journey Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Streak */}
        <div className="text-center p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Flame className="w-6 h-6 text-orange-500" />
            <span className="text-2xl font-bold text-orange-600">{currentStreak}</span>
          </div>
          <p className="text-sm text-gray-600">Day Streak</p>
          {currentStreak >= 7 && (
            <Badge variant="outline" className="mt-2 text-orange-600">
              🔥 On Fire!
            </Badge>
          )}
        </div>

        {/* Recent Badges */}
        <div>
          <h4 className="font-medium text-gray-800 mb-3 flex items-center">
            <Star className="w-4 h-4 mr-1" />
            Recent Badges ({earnedBadges.length})
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {earnedBadges.slice(0, 4).map((badge) => (
              <div key={badge.id} className="glassmorphic p-3 rounded-lg text-center">
                <div className="text-2xl mb-1">{badge.icon}</div>
                <div className="text-xs font-medium text-gray-700">{badge.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Goals */}
        <div>
          <h4 className="font-medium text-gray-800 mb-3 flex items-center">
            <Target className="w-4 h-4 mr-1" />
            Current Goals
          </h4>
          <div className="space-y-3">
            {activeAchievements.map((achievement) => (
              <div key={achievement.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">{achievement.title}</span>
                  <span className="text-xs text-gray-500">
                    {achievement.progress}/{achievement.target}
                  </span>
                </div>
                <Progress 
                  value={(achievement.progress / achievement.target) * 100} 
                  className="h-2"
                />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GamificationCard;
