
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface AuthPageProps {
  onBack: () => void;
}

const AuthPage = ({ onBack }: AuthPageProps) => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignIn) {
        await signIn(email, password);
        toast({
          title: "Welcome back, seeker! 🙏",
          description: "Your sacred space awaits. Let's continue your mindful journey.",
        });
      } else {
        await signUp(email, password);
        toast({
          title: "Sacred space created! 🪷",
          description: "Welcome to JournDay. Your journey of self-discovery begins now.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Authentication Challenge",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen ayurvedic-gradient lotus-pattern relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="floating-orbs">
        <div className="floating-orb"></div>
        <div className="floating-orb"></div>
        <div className="floating-orb"></div>
      </div>

      <div className="sacred-geometry"></div>
      <div className="meditation-ripples"></div>

      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl float-animation shimmer-animation"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-purple-200/20 rounded-full blur-lg float-animation drift-animation" style={{animationDelay: '1.5s'}}></div>
        <div className="absolute top-1/2 left-20 w-16 h-16 bg-blue-200/15 rounded-full blur-md shimmer-animation" style={{animationDelay: '3s'}}></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-16">
        {/* Header */}
        <header className="flex justify-between items-center mb-16">
          <button 
            onClick={onBack}
            className="button-neumorphic p-3 rounded-full hover:scale-105 transition-transform"
          >
            <span className="text-xl">←</span>
          </button>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 neumorphic flex items-center justify-center pulse-glow-animation">
              <span className="text-2xl">🪷</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">JournDay</h1>
          </div>
          <div className="w-12"></div>
        </header>

        {/* Auth Form */}
        <div className="max-w-md mx-auto">
          <div className="card-neumorphic p-8 float-animation">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-200/50 to-pink-200/50 rounded-3xl flex items-center justify-center mx-auto mb-6 pulse-glow-animation">
                <span className="text-3xl">{isSignIn ? '🙏' : '🌅'}</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                {isSignIn ? 'Welcome Back, Seeker' : 'Begin Your Sacred Journey'}
              </h2>
              <p className="text-gray-600">
                {isSignIn 
                  ? 'Continue your path of mindful self-discovery' 
                  : 'Create your sanctuary for inner exploration'
                }
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Email Address
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="glassmorphic border-0 focus:ring-2 focus:ring-purple-300 transition-all"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Password
                </label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="glassmorphic border-0 focus:ring-2 focus:ring-purple-300 transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full button-neumorphic text-gray-800 font-semibold py-6 text-lg hover:text-gray-900 transition-all hover:scale-105"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                    {isSignIn ? 'Entering Sacred Space...' : 'Creating Sanctuary...'}
                  </div>
                ) : (
                  isSignIn ? 'Enter Sacred Space' : 'Create Sanctuary'
                )}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-600">
                {isSignIn ? "New to this sacred practice?" : "Already have a sanctuary?"}
                <button
                  onClick={() => setIsSignIn(!isSignIn)}
                  className="ml-2 text-purple-600 font-medium hover:text-purple-700 transition-colors underline decoration-wavy"
                >
                  {isSignIn ? 'Create Your Space' : 'Enter Existing Space'}
                </button>
              </p>
            </div>

            {/* Rotating Ayurvedic Quotes */}
            <div className="mt-8 text-center glassmorphic p-4 rounded-lg shimmer-animation">
              <p className="text-sm text-gray-600 italic">
                {isSignIn 
                  ? '"The mind is everything. What you think you become." - Buddha'
                  : '"Yoga is a light, which once lit will never dim. The better your practice, the brighter your flame." - B.K.S. Iyengar'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
