
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage = ({ onGetStarted }: LandingPageProps) => {
  return (
    <div className="min-h-screen ayurvedic-gradient lotus-pattern relative overflow-hidden">
      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl float-animation"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-purple-200/20 rounded-full blur-lg" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-40 left-1/4 w-20 h-20 bg-pink-200/15 rounded-full blur-md float-animation" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-16">
        {/* Header */}
        <header className="flex justify-between items-center mb-16">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 neumorphic flex items-center justify-center">
              <span className="text-2xl">🪷</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">JournDay</h1>
          </div>
          <div className="glassmorphic px-4 py-2 flex items-center space-x-2">
            <span className="text-sm text-gray-600">✨ 2,390 Like</span>
          </div>
        </header>

        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto">
          <div className="mb-8">
            <span className="glassmorphic px-6 py-2 text-sm text-gray-600 rounded-full">
              Suggestions for you
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-gray-800 mb-6">
            Build With Proud
          </h1>
          
          <div className="glassmorphic inline-flex items-center px-6 py-3 mb-12 rounded-full">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
            <span className="text-gray-700">Mindful Journaling</span>
          </div>

          {/* Categories */}
          <div className="flex justify-center items-center space-x-8 mb-16 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <span>🌙</span>
              <span>Sleep-well</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>🏥</span>
              <span>Medical Centers</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>🐾</span>
              <span>Animal M</span>
            </div>
          </div>

          <p className="text-lg text-gray-700 mb-12 max-w-2xl mx-auto">
            How do I stop poor sleep habits?
          </p>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-16 max-w-4xl mx-auto">
            <div className="card-neumorphic p-8 text-left">
              <div className="w-16 h-16 bg-orange-200/50 rounded-3xl flex items-center justify-center mb-6">
                <span className="text-2xl">☕</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Reduce any <span className="text-orange-500">caffeine</span>
              </h3>
              <p className="text-gray-600 text-sm">
                Track your daily habits and build mindful routines
              </p>
            </div>

            <div className="card-neumorphic p-8 text-left">
              <div className="w-16 h-16 bg-blue-200/50 rounded-3xl flex items-center justify-center mb-6">
                <span className="text-2xl">🌙</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Regular <span className="text-blue-500">bedtime</span> rituals
              </h3>
              <p className="text-gray-600 text-sm">
                Create peaceful evening practices with guided reflections
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <Button 
            onClick={onGetStarted}
            className="button-neumorphic text-gray-800 font-semibold px-12 py-6 text-lg hover:text-gray-900 transition-colors"
          >
            Begin Your Journey
          </Button>
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 glassmorphic px-8 py-4 rounded-full">
          <div className="flex items-center space-x-8">
            <span className="w-8 h-8 text-gray-400">🌱</span>
            <span className="w-8 h-8 text-gray-400">📊</span>
            <span className="w-8 h-8 text-gray-600">📖</span>
            <span className="w-8 h-8 text-gray-400">👤</span>
            <span className="w-8 h-8 text-gray-400">⚙️</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
