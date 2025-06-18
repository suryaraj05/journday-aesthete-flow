
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
          title: "Welcome back!",
          description: "You've successfully signed in.",
        });
      } else {
        await signUp(email, password);
        toast({
          title: "Account created!",
          description: "Welcome to JournDay. Let's begin your mindful journey.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Authentication Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen ayurvedic-gradient lotus-pattern relative overflow-hidden">
      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl float-animation"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-purple-200/20 rounded-full blur-lg float-animation" style={{animationDelay: '1.5s'}}></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-16">
        {/* Header */}
        <header className="flex justify-between items-center mb-16">
          <button 
            onClick={onBack}
            className="button-neumorphic p-3 rounded-full"
          >
            <span className="text-xl">←</span>
          </button>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 neumorphic flex items-center justify-center">
              <span className="text-2xl">🪷</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">JournDay</h1>
          </div>
          <div className="w-12"></div>
        </header>

        {/* Auth Form */}
        <div className="max-w-md mx-auto">
          <div className="card-neumorphic p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                {isSignIn ? 'Welcome Back' : 'Begin Your Journey'}
              </h2>
              <p className="text-gray-600">
                {isSignIn 
                  ? 'Continue your mindful practice' 
                  : 'Create your sacred space for reflection'
                }
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Email
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="glassmorphic border-0 focus:ring-2 focus:ring-purple-300"
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
                  className="glassmorphic border-0 focus:ring-2 focus:ring-purple-300"
                  placeholder="••••••••"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full button-neumorphic text-gray-800 font-semibold py-6 text-lg hover:text-gray-900 transition-colors"
              >
                {loading ? 'Please wait...' : (isSignIn ? 'Sign In' : 'Create Account')}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-600">
                {isSignIn ? "Don't have an account?" : "Already have an account?"}
                <button
                  onClick={() => setIsSignIn(!isSignIn)}
                  className="ml-2 text-purple-600 font-medium hover:text-purple-700 transition-colors"
                >
                  {isSignIn ? 'Sign Up' : 'Sign In'}
                </button>
              </p>
            </div>

            {/* Ayurvedic Quote */}
            <div className="mt-8 text-center glassmorphic p-4 rounded-lg">
              <p className="text-sm text-gray-600 italic">
                "The mind is everything. What you think you become." - Buddha
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
