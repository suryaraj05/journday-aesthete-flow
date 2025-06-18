
import { Button } from '@/components/ui/button';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage = ({ onGetStarted }: LandingPageProps) => {
  return (
    <div className="min-h-screen ayurvedic-gradient lotus-pattern relative overflow-hidden">
      {/* Floating Orbs Background */}
      <div className="floating-orbs">
        <div className="floating-orb"></div>
        <div className="floating-orb"></div>
        <div className="floating-orb"></div>
        <div className="floating-orb"></div>
      </div>

      {/* Sacred Geometry Pattern */}
      <div className="sacred-geometry"></div>

      {/* Meditation Ripples */}
      <div className="meditation-ripples"></div>

      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl float-animation shimmer-animation"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-purple-200/20 rounded-full blur-lg drift-animation" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-40 left-1/4 w-20 h-20 bg-pink-200/15 rounded-full blur-md float-animation" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/3 right-1/3 w-16 h-16 bg-yellow-200/10 rounded-full blur-lg drift-animation" style={{animationDelay: '3s'}}></div>
        <div className="absolute bottom-1/3 right-1/4 w-28 h-28 bg-blue-200/15 rounded-full blur-xl shimmer-animation" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-16">
        {/* Header */}
        <header className="flex justify-between items-center mb-16">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 neumorphic flex items-center justify-center pulse-glow-animation">
              <span className="text-2xl">🪷</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">JournDay</h1>
          </div>
          <div className="glassmorphic px-4 py-2 flex items-center space-x-2 shimmer-animation">
            <span className="text-sm text-gray-600">✨ Mindful Journaling</span>
          </div>
        </header>

        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto">
          <div className="mb-8">
            <span className="glassmorphic px-6 py-2 text-sm text-gray-600 rounded-full">
              Transform Your Inner World
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-gray-800 mb-6 float-animation">
            Journey Within
          </h1>
          
          <div className="glassmorphic inline-flex items-center px-6 py-3 mb-12 rounded-full pulse-glow-animation">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-3 shimmer-animation"></span>
            <span className="text-gray-700">Ancient Wisdom, Modern Practice</span>
          </div>

          {/* Ayurvedic Elements */}
          <div className="flex justify-center items-center space-x-8 mb-16 text-sm text-gray-600">
            <div className="flex items-center space-x-2 float-animation" style={{animationDelay: '0.5s'}}>
              <span>🧘‍♀️</span>
              <span>Meditation</span>
            </div>
            <div className="flex items-center space-x-2 float-animation" style={{animationDelay: '1s'}}>
              <span>🌿</span>
              <span>Ayurveda</span>
            </div>
            <div className="flex items-center space-x-2 float-animation" style={{animationDelay: '1.5s'}}>
              <span>📖</span>
              <span>Journaling</span>
            </div>
          </div>

          <p className="text-lg text-gray-700 mb-12 max-w-2xl mx-auto">
            Discover inner peace through structured journaling with ancient Ayurvedic wisdom
          </p>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-16 max-w-4xl mx-auto">
            <div className="card-neumorphic p-8 text-left float-animation" style={{animationDelay: '2s'}}>
              <div className="w-16 h-16 bg-gradient-to-br from-orange-200/50 to-yellow-200/50 rounded-3xl flex items-center justify-center mb-6 pulse-glow-animation">
                <span className="text-2xl">☀️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Daily <span className="text-orange-500">Rituals</span>
              </h3>
              <p className="text-gray-600 text-sm">
                Five structured sessions: Morning Intention, Midday Check-in, CBT Reframing, Evening Reflection & Gratitude
              </p>
            </div>

            <div className="card-neumorphic p-8 text-left float-animation" style={{animationDelay: '2.5s'}}>
              <div className="w-16 h-16 bg-gradient-to-br from-purple-200/50 to-pink-200/50 rounded-3xl flex items-center justify-center mb-6 pulse-glow-animation">
                <span className="text-2xl">🧠</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                <span className="text-purple-500">Mindful</span> Reflection
              </h3>
              <p className="text-gray-600 text-sm">
                Cognitive behavioral techniques combined with Ayurvedic wisdom for deeper self-awareness
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <Button 
            onClick={onGetStarted}
            className="button-neumorphic text-gray-800 font-semibold px-12 py-6 text-lg hover:text-gray-900 transition-colors pulse-glow-animation"
          >
            Begin Your Sacred Journey
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
