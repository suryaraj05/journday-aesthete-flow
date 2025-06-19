
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Badge as BadgeType, Achievement, WeeklyChallenge } from '@/types/journal';
import { Award, Target, Calendar, Star, Flame, Trophy } from 'lucide-react';

interface MindfulnessGamificationProps {
  badges: BadgeType[];
  achievements: Achievement[];
  weeklyChallenge: WeeklyChallenge | null;
  currentStreak: number;
}

const MindfulnessGamification = ({ badges, achievements, weeklyChallenge, currentStreak }: MindfulnessGamificationProps) => {
  const earnedBadges = badges.filter(badge => badge.earned);
  const unlockedAchievements = achievements.filter(achievement => achievement.unlocked);
  const progressAchievements = achievements.filter(achievement => !achievement.unlocked);

  return (
    <div className="space-y-6">
      {/* Current Streak */}
      <Card className="card-neumorphic border-none bg-gradient-to-r from-orange-50 to-red-50">
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Flame className="w-8 h-8 text-orange-500" />
            <span className="text-3xl font-bold text-orange-600">{currentStreak}</span>
          </div>
          <p className="text-orange-700 font-medium">Day Streak</p>
          <p className="text-sm text-orange-600 mt-1">Keep the fire burning! 🔥</p>
        </CardContent>
      </Card>

      {/* Weekly Challenge */}
      {weeklyChallenge && (
        <Card className="card-neumorphic border-none">
          <CardHeader>
            <CardTitle className="flex items-center text-gray-800">
              <Calendar className="w-5 h-5 mr-2" />
              Weekly Challenge
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-gray-800">{weeklyChallenge.title}</h4>
                <p className="text-sm text-gray-600">{weeklyChallenge.description}</p>
              </div>
              <Progress value={weeklyChallenge.progress} className="h-2" />
              <div className="flex justify-between text-xs text-gray-500">
                <span>{weeklyChallenge.progress}% Complete</span>
                <span>Week of {weeklyChallenge.week}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Badges */}
      <Card className="card-neumorphic border-none">
        <CardHeader>
          <CardTitle className="flex items-center text-gray-800">
            <Award className="w-5 h-5 mr-2" />
            Mindfulness Badges ({earnedBadges.length}/{badges.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={`text-center p-3 rounded-lg ${
                  badge.earned
                    ? 'bg-gradient-to-br from-yellow-100 to-yellow-200 border border-yellow-300'
                    : 'bg-gray-100 opacity-50'
                }`}
              >
                <div className="text-2xl mb-1">{badge.icon}</div>
                <h5 className="text-xs font-semibold text-gray-800">{badge.name}</h5>
                {badge.earned && badge.earnedDate && (
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(badge.earnedDate).toLocaleDateString()}
                  </p>
                )}
                {!badge.earned && badge.progress !== undefined && (
                  <div className="mt-2">
                    <Progress value={(badge.progress / (badge.maxProgress || 100)) * 100} className="h-1" />
                    <p className="text-xs text-gray-500 mt-1">
                      {badge.progress}/{badge.maxProgress}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card className="card-neumorphic border-none">
        <CardHeader>
          <CardTitle className="flex items-center text-gray-800">
            <Trophy className="w-5 h-5 mr-2" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Unlocked Achievements */}
            {unlockedAchievements.length > 0 && (
              <div>
                <h4 className="font-medium text-green-700 mb-2 flex items-center">
                  <Star className="w-4 h-4 mr-1" />
                  Unlocked
                </h4>
                <div className="space-y-2">
                  {unlockedAchievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200"
                    >
                      <div>
                        <h5 className="font-semibold text-green-800">{achievement.title}</h5>
                        <p className="text-sm text-green-600">{achievement.description}</p>
                        <Badge variant="outline" className="text-xs mt-1 text-green-700">
                          {achievement.reward}
                        </Badge>
                      </div>
                      <Trophy className="w-6 h-6 text-green-600" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Progress Achievements */}
            {progressAchievements.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                  <Target className="w-4 h-4 mr-1" />
                  In Progress
                </h4>
                <div className="space-y-3">
                  {progressAchievements.slice(0, 3).map((achievement) => (
                    <div key={achievement.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h5 className="font-semibold text-gray-800">{achievement.title}</h5>
                          <p className="text-sm text-gray-600">{achievement.description}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {achievement.type}
                        </Badge>
                      </div>
                      <Progress value={(achievement.progress / achievement.target) * 100} className="h-2 mb-1" />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{achievement.progress}/{achievement.target}</span>
                        <span>{Math.round((achievement.progress / achievement.target) * 100)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MindfulnessGamification;
