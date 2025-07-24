import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const Document = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-slate-800 dark:text-slate-100 mb-4">
            JournDay Documentation
          </h1>
          <h2 className="text-3xl font-semibold text-slate-600 dark:text-slate-300 mb-6">
            Your Personal Mindful Journaling & Growth Platform
          </h2>
          <Badge className="text-lg px-6 py-2">Product Documentation</Badge>
        </div>

        {/* Introduction Section */}
        <Card className="mb-8 shadow-lg border-l-4 border-l-blue-500">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">What is JournDay?</h3>
            <div className="space-y-4 text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
              <p>JournDay is a comprehensive digital wellness platform designed to support your personal growth journey through mindful journaling, goal setting, and holistic well-being practices.</p>
              <p>Built with modern web technologies, it combines ancient wisdom with contemporary digital tools to create a seamless experience for self-reflection and personal development.</p>
              <p>Whether you're looking to track your mood, manifest your dreams, or build meaningful habits, JournDay provides the tools and insights to help you grow mindfully.</p>
            </div>
          </CardContent>
        </Card>

        {/* Core Features Section */}
        <Card className="mb-8 shadow-lg border-l-4 border-l-green-500">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">Core Features</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">📝 Journaling</Badge>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300">Advanced journaling system with mood tracking, reflection prompts, and AI-powered insights for deeper self-awareness.</p>
                </div>
                
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">✨ Manifestation</Badge>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300">Vision boarding and manifestation tracking to help you visualize and achieve your dreams with intention.</p>
                </div>
                
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">🎯 Goal Setting</Badge>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300">SMART goal framework with progress tracking, milestone celebrations, and achievement analytics.</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">🧘 Mindfulness</Badge>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300">Guided meditation, breathing exercises, and mindfulness practices integrated into your daily routine.</p>
                </div>
                
                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">📚 Reading</Badge>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300">Curated personal growth content, reading recommendations, and wisdom from various philosophical traditions.</p>
                </div>
                
                <div className="bg-teal-50 dark:bg-teal-900/20 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">📊 Analytics</Badge>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300">Personal growth analytics, mood patterns, and progress visualization to track your journey.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Journey Section */}
        <Card className="mb-8 shadow-lg border-l-4 border-l-purple-500">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">User Journey & Experience</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">🌅 Morning Routine</h4>
                  <p className="text-sm text-slate-700 dark:text-slate-300">Start your day with intention setting, gratitude practice, and mood check-in to establish a positive mindset.</p>
                </div>
                
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">📝 Journaling Sessions</h4>
                  <p className="text-sm text-slate-700 dark:text-slate-300">Guided and free-form journaling with AI-powered prompts for deeper self-reflection and awareness.</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold text-purple-800 dark:text-purple-200 mb-2">🌙 Evening Reflection</h4>
                  <p className="text-sm text-slate-700 dark:text-slate-300">End your day with gratitude journaling, progress review, and preparation for restful sleep.</p>
                </div>
                
                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold text-orange-800 dark:text-orange-200 mb-2">📊 Weekly Insights</h4>
                  <p className="text-sm text-slate-700 dark:text-slate-300">Receive personalized analytics and growth insights based on your journaling patterns and mood trends.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Benefits Section */}
        <Card className="mb-8 shadow-lg border-l-4 border-l-indigo-500">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">Key Benefits</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold text-slate-800 dark:text-slate-100">Enhanced Self-Awareness</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Develop deeper understanding of your thoughts, emotions, and behavioral patterns through consistent reflection.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold text-slate-800 dark:text-slate-100">Stress Reduction</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Regular journaling and mindfulness practices help reduce anxiety and improve emotional regulation.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold text-slate-800 dark:text-slate-100">Goal Achievement</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Structured goal-setting and tracking system to turn aspirations into achievable milestones.</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold text-slate-800 dark:text-slate-100">Improved Mental Health</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Evidence-based practices to support mental wellness and emotional balance through daily routines.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-teal-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold text-slate-800 dark:text-slate-100">Personal Growth Tracking</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Visualize your progress over time with analytics and insights that celebrate your growth journey.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-rose-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold text-slate-800 dark:text-slate-100">Mindful Living</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Cultivate presence and intentionality in daily life through integrated mindfulness practices.</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technology Stack */}
        <Card className="mb-8 shadow-lg border-l-4 border-l-cyan-500">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">Technology & Architecture</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-3">Frontend</h4>
                <ul className="space-y-1 text-sm text-slate-700 dark:text-slate-300">
                  <li>• React 18 with TypeScript</li>
                  <li>• Tailwind CSS for styling</li>
                  <li>• Responsive PWA design</li>
                  <li>• Modern component architecture</li>
                </ul>
              </div>
              
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-3">Backend</h4>
                <ul className="space-y-1 text-sm text-slate-700 dark:text-slate-300">
                  <li>• Firebase Authentication</li>
                  <li>• Cloud Firestore database</li>
                  <li>• Real-time data sync</li>
                  <li>• Secure data encryption</li>
                </ul>
              </div>
              
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-purple-800 dark:text-purple-200 mb-3">Features</h4>
                <ul className="space-y-1 text-sm text-slate-700 dark:text-slate-300">
                  <li>• Offline-first capabilities</li>
                  <li>• Cross-device synchronization</li>
                  <li>• AI-powered insights</li>
                  <li>• Advanced analytics</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security & Privacy */}
        <Card className="mb-8 shadow-lg border-l-4 border-l-rose-500">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">Security & Privacy</h3>
            <div className="space-y-4">
              <div className="bg-rose-50 dark:bg-rose-900/20 p-6 rounded-lg">
                <h4 className="text-lg font-semibold text-rose-800 dark:text-rose-200 mb-3">🔒 Data Protection</h4>
                <p className="text-slate-700 dark:text-slate-300 text-sm mb-3">Your personal thoughts and reflections are protected with enterprise-grade security measures.</p>
                <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-400 ml-4">
                  <li>• End-to-end encryption for all personal data</li>
                  <li>• GDPR compliant data handling</li>
                  <li>• User-controlled privacy settings</li>
                  <li>• No data sharing with third parties</li>
                </ul>
              </div>
              
              <div className="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-lg">
                <h4 className="text-lg font-semibold text-amber-800 dark:text-amber-200 mb-3">🛡️ User Control</h4>
                <p className="text-slate-700 dark:text-slate-300 text-sm">You maintain complete ownership and control over your personal data with options to export, delete, or modify at any time.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center py-8">
          <p className="text-slate-500 dark:text-slate-400">
            © 2024 JournDay - Your Journey to Mindful Growth
          </p>
        </div>
      </div>
    </div>
  );
};

export default Document;
