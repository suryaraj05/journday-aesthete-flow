
import { useState } from 'react';
import { useAuth, AuthProvider } from '@/hooks/useAuth';
import LandingPage from '@/components/LandingPage';
import AuthPage from '@/components/AuthPage';
import Dashboard from '@/components/Dashboard';

const AppContent = () => {
  const [showAuth, setShowAuth] = useState(false);
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen ayurvedic-gradient flex items-center justify-center">
        <div className="neumorphic p-8 rounded-full">
          <span className="text-4xl">🪷</span>
        </div>
      </div>
    );
  }

  if (user) {
    return <Dashboard />;
  }

  if (showAuth) {
    return <AuthPage onBack={() => setShowAuth(false)} />;
  }

  return <LandingPage onGetStarted={() => setShowAuth(true)} />;
};

const Index = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default Index;
