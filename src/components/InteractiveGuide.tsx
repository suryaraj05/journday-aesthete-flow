
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  ArrowRight, 
  X, 
  BookOpen, 
  Target, 
  Sparkles, 
  Mail, 
  Goal, 
  Trophy, 
  Brain, 
  Sun, 
  Moon, 
  Heart,
  Timer,
  Calendar,
  TrendingUp,
  Zap,
  Coffee,
  Star,
  Award,
  Flame,
  Cloud,
  CheckCircle
} from 'lucide-react';

interface GuideStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  benefits: string[];
  tips: string[];
  gradient: string;
  animation?: string;
}

interface InteractiveGuideProps {
  onClose: () => void;
}

const InteractiveGuide = ({ onClose }: InteractiveGuideProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showAnimation, setShowAnimation] = useState(false);

  const guideSteps: GuideStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to JournDay',
      description: 'Your sacred space for mindful reflection, combining ancient Ayurvedic wisdom with modern psychology',
      icon: <img src="/lovable-uploads/fea06144-508f-49e9-8fdf-15396ad4c3f8.png" alt="JournDay" className="w-12 h-12" />,
      features: [
        '5 Daily Sacred Sessions',
        'CBT-Integrated Reframing',
        'Manifestation & Goal Setting',
        'Ayurvedic Wisdom Integration',
        'Mindful Gamification'
      ],
      benefits: [
        'Reduce stress and anxiety',
        'Improve emotional awareness',
        'Build consistent habits',
        'Achieve personal goals',
        'Cultivate inner peace'
      ],
      tips: [
        'Start with just 5 minutes daily',
        'Be honest and authentic',
        'Consistency over perfection'
      ],
      gradient: 'from-purple-400 to-pink-400'
    },
    {
      id: 'morning-intention',
      title: 'Morning Intention (7:00 AM)',
      description: 'Begin each day with purpose and clarity, setting intentions that align with your highest self',
      icon: <Sun className="w-12 h-12 text-yellow-500" />,
      features: [
        'Set daily top goal',
        'Identify potential obstacles',
        'Create actionable tasks',
        'Morning mindfulness practice',
        'Energy alignment check'
      ],
      benefits: [
        'Clear mental focus for the day',
        'Proactive problem-solving mindset',
        'Increased productivity',
        'Better decision making',
        'Reduced morning anxiety'
      ],
      tips: [
        'Write before checking your phone',
        'Be specific with your intentions',
        'Include one challenging goal',
        'Practice gratitude for the new day'
      ],
      gradient: 'from-yellow-300 to-orange-400'
    },
    {
      id: 'midday-checkin',
      title: 'Midday Check-In (1:00 PM)',
      description: 'Pause, breathe, and recalibrate. This sacred moment helps you stay aligned with your intentions',
      icon: <Timer className="w-12 h-12 text-blue-500" />,
      features: [
        'Progress tracking',
        'Challenge identification',
        'Energy level assessment',
        'Course correction opportunities',
        'Mindful breathing reminder'
      ],
      benefits: [
        'Maintains momentum',
        'Prevents afternoon slumps',
        'Builds self-awareness',
        'Reduces overwhelm',
        'Improves time management'
      ],
      tips: [
        'Set a gentle reminder',
        'Find a quiet space',
        'Celebrate small wins',
        'Adjust goals if needed'
      ],
      gradient: 'from-blue-300 to-cyan-400'
    },
    {
      id: 'cbt-reframing',
      title: 'CBT Reframing (3:00 PM)',
      description: 'Transform negative thought patterns using evidence-based cognitive behavioral therapy techniques',
      icon: <Brain className="w-12 h-12 text-purple-500" />,
      features: [
        'Negative thought identification',
        'Evidence examination',
        'Balanced perspective creation',
        'Emotional regulation',
        'Cognitive restructuring'
      ],
      benefits: [
        'Reduces anxiety and depression',
        'Improves emotional resilience',
        'Breaks negative thought cycles',
        'Builds mental clarity',
        'Enhances problem-solving'
      ],
      tips: [
        'Be gentle with yourself',
        'Look for concrete evidence',
        'Practice the "Is this true?" question',
        'Replace, don\'t just remove thoughts'
      ],
      gradient: 'from-purple-400 to-pink-500'
    },
    {
      id: 'evening-reflection',
      title: 'Evening Reflection (8:00 PM)',
      description: 'Honor your day with compassionate reflection, celebrating progress and learning from challenges',
      icon: <Moon className="w-12 h-12 text-indigo-500" />,
      features: [
        'Daily accomplishment review',
        'Learning opportunity identification',
        'Emotional processing',
        'Tomorrow\'s preparation',
        'Sleep quality optimization'
      ],
      benefits: [
        'Better sleep quality',
        'Reduced bedtime anxiety',
        'Continuous improvement mindset',
        'Emotional closure',
        'Personal growth tracking'
      ],
      tips: [
        'Focus on progress, not perfection',
        'Include three good things',
        'Plan tomorrow gently',
        'Practice self-compassion'
      ],
      gradient: 'from-indigo-400 to-purple-500'
    },
    {
      id: 'gratitude-practice',
      title: 'Gratitude Practice (9:00 PM)',
      description: 'End your day in appreciation, cultivating joy and abundance consciousness',
      icon: <Heart className="w-12 h-12 text-pink-500" />,
      features: [
        'Daily gratitude expression',
        'Appreciation meditation',
        'Joy cultivation',
        'Abundance mindset',
        'Peaceful closure'
      ],
      benefits: [
        'Increased happiness',
        'Better relationships',
        'Improved mental health',
        'Enhanced life satisfaction',
        'Peaceful sleep preparation'
      ],
      tips: [
        'Be specific in your gratitude',
        'Include people and experiences',
        'Feel the emotion deeply',
        'Write from the heart'
      ],
      gradient: 'from-pink-400 to-rose-500'
    },
    {
      id: 'manifestation',
      title: 'Sacred Manifestation',
      description: 'Shape your reality with powerful intentions and align your energy with your deepest desires',
      icon: <Sparkles className="w-12 h-12 text-amber-500" />,
      features: [
        'Daily manifestation writing',
        'Intention setting',
        'Energy alignment',
        'Visualization support',
        'Abundance affirmations'
      ],
      benefits: [
        'Clearer life direction',
        'Increased motivation',
        'Better goal achievement',
        'Enhanced self-belief',
        'Positive mindset cultivation'
      ],
      tips: [
        'Use present tense statements',
        'Include emotions and feelings',
        'Be specific and detailed',
        'Believe in your words',
        'Read aloud for power'
      ],
      gradient: 'from-amber-400 to-orange-500'
    },
    {
      id: 'goals-tracking',
      title: 'Mindful Goal Setting',
      description: 'Transform dreams into reality with intentional goal setting and compassionate progress tracking',
      icon: <Target className="w-12 h-12 text-green-500" />,
      features: [
        'Personal goal creation',
        'Progress tracking',
        'Achievement celebration',
        'Goal prioritization',
        'Milestone recognition'
      ],
      benefits: [
        'Clearer life direction',
        'Increased accountability',
        'Better time management',
        'Achievement satisfaction',
        'Personal growth acceleration'
      ],
      tips: [
        'Start with small, achievable goals',
        'Make them specific and measurable',
        'Celebrate every milestone',
        'Adjust goals as you grow'
      ],
      gradient: 'from-green-400 to-emerald-500'
    },
    {
      id: 'reading-wisdom',
      title: 'Wisdom Library',
      description: 'Nourish your mind with curated readings that inspire growth and deepen understanding',
      icon: <BookOpen className="w-12 h-12 text-blue-500" />,
      features: [
        'Curated wisdom content',
        'Mindfulness articles',
        'Personal development insights',
        'Ayurvedic knowledge',
        'Practical life tips'
      ],
      benefits: [
        'Continuous learning',
        'Expanded perspective',
        'Practical wisdom',
        'Mental stimulation',
        'Spiritual growth'
      ],
      tips: [
        'Read at your own pace',
        'Take notes on insights',
        'Apply what you learn',
        'Share wisdom with others'
      ],
      gradient: 'from-blue-400 to-indigo-500'
    },
    {
      id: 'weekly-letter',
      title: 'Weekly Soul Letter',
      description: 'Receive personalized insights and encouragement based on your journaling patterns and growth',
      icon: <Mail className="w-12 h-12 text-violet-500" />,
      features: [
        'Personalized insights',
        'Weekly pattern analysis',
        'Growth recommendations',
        'Motivational messages',
        'Progress celebration'
      ],
      benefits: [
        'Deeper self-understanding',
        'Personalized guidance',
        'Motivation boost',
        'Pattern recognition',
        'Continuous improvement'
      ],
      tips: [
        'Read your letter mindfully',
        'Reflect on the insights',
        'Implement suggestions gradually',
        'Save meaningful quotes'
      ],
      gradient: 'from-violet-400 to-purple-500'
    },
    {
      id: 'gamification',
      title: 'Mindful Achievement System',
      description: 'Celebrate your journey with meaningful badges and achievements that honor your growth',
      icon: <Trophy className="w-12 h-12 text-yellow-500" />,
      features: [
        'Streak tracking',
        'Achievement badges',
        'Progress milestones',
        'Weekly challenges',
        'Growth celebration'
      ],
      benefits: [
        'Increased motivation',
        'Habit reinforcement',
        'Progress visualization',
        'Achievement satisfaction',
        'Consistent practice'
      ],
      tips: [
        'Focus on consistency over perfection',
        'Celebrate small wins',
        'Use streaks as gentle motivation',
        'Don\'t let missed days discourage you'
      ],
      gradient: 'from-yellow-400 to-amber-500'
    },
    {
      id: 'analytics',
      title: 'Sacred Analytics',
      description: 'Discover patterns in your emotional journey with beautiful insights and mood tracking',
      icon: <TrendingUp className="w-12 h-12 text-cyan-500" />,
      features: [
        'Mood weather mapping',
        'Emotion tracking',
        'Pattern recognition',
        'Growth visualization',
        'Trend analysis'
      ],
      benefits: [
        'Self-awareness development',
        'Pattern recognition',
        'Emotional intelligence',
        'Progress tracking',
        'Mindful insights'
      ],
      tips: [
        'Review patterns weekly',
        'Notice emotional triggers',
        'Celebrate positive trends',
        'Use insights for growth'
      ],
      gradient: 'from-cyan-400 to-blue-500'
    }
  ];

  useEffect(() => {
    setProgress((currentStep / (guideSteps.length - 1)) * 100);
    setShowAnimation(true);
    const timer = setTimeout(() => setShowAnimation(false), 1000);
    return () => clearTimeout(timer);
  }, [currentStep, guideSteps.length]);

  const nextStep = () => {
    if (currentStep < guideSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  const currentGuideStep = guideSteps[currentStep];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-4xl mx-4 max-h-[90vh] overflow-auto">
        <Card className="card-neumorphic border-none bg-white/95 backdrop-blur-md">
          <CardHeader className="relative">
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </Button>
            
            <div className="text-center mb-4">
              <Progress value={progress} className="h-2 mb-4" />
              <div className="flex items-center justify-center space-x-2 mb-2">
                <span className="text-sm text-gray-500">
                  Step {currentStep + 1} of {guideSteps.length}
                </span>
              </div>
            </div>

            <div className={`text-center transform transition-all duration-500 ${showAnimation ? 'scale-105' : 'scale-100'}`}>
              <div className={`w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r ${currentGuideStep.gradient} flex items-center justify-center ${showAnimation ? 'animate-pulse' : ''}`}>
                {currentGuideStep.icon}
              </div>
              <CardTitle className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                {currentGuideStep.title}
              </CardTitle>
              <p className="text-gray-600 text-lg">
                {currentGuideStep.description}
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Features Section */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-800 flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-blue-500" />
                  Key Features
                </h3>
                <div className="space-y-2">
                  {currentGuideStep.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-gray-800 flex items-center">
                  <Star className="w-5 h-5 mr-2 text-yellow-500" />
                  Benefits
                </h3>
                <div className="space-y-2">
                  {currentGuideStep.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm">
                      <Heart className="w-4 h-4 text-pink-500 flex-shrink-0" />
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-gray-800 flex items-center">
                  <Coffee className="w-5 h-5 mr-2 text-amber-500" />
                  Pro Tips
                </h3>
                <div className="space-y-2">
                  {currentGuideStep.tips.map((tip, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm">
                      <Award className="w-4 h-4 text-purple-500 flex-shrink-0" />
                      <span className="text-gray-700">{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Navigation */}
            <div className="border-t pt-4">
              <h4 className="font-medium text-gray-800 mb-3">Quick Navigation</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {guideSteps.map((step, index) => (
                  <Button
                    key={step.id}
                    onClick={() => goToStep(index)}
                    variant={index === currentStep ? "default" : "outline"}
                    size="sm"
                    className={`text-xs p-2 h-auto ${
                      index === currentStep 
                        ? `bg-gradient-to-r ${step.gradient} text-white border-none` 
                        : 'text-gray-600'
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-1">
                      <div className="w-6 h-6 flex items-center justify-center">
                        {React.cloneElement(step.icon as React.ReactElement, { 
                          className: "w-4 h-4" 
                        })}
                      </div>
                      <span className="leading-tight">{step.title.split(' ')[0]}</span>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center pt-4 border-t">
              <Button
                onClick={prevStep}
                disabled={currentStep === 0}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </Button>

              <div className="flex space-x-2">
                {guideSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentStep ? 'bg-purple-500' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>

              {currentStep === guideSteps.length - 1 ? (
                <Button
                  onClick={onClose}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Start Your Journey
                </Button>
              ) : (
                <Button
                  onClick={nextStep}
                  className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                >
                  <span>Next</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InteractiveGuide;
