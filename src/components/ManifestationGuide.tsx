
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X } from 'lucide-react';

interface ManifestationGuideProps {
  onDismiss: () => void;
}

const ManifestationGuide = ({ onDismiss }: ManifestationGuideProps) => {
  const [manifestation, setManifestation] = useState('');

  useEffect(() => {
    // Generate a daily manifestation
    const manifestations = [
      "I am worthy of all the abundance and joy that flows into my life today.",
      "Every challenge I face today makes me stronger and wiser.",
      "I attract positive energy and opportunities with ease.",
      "My thoughts create my reality, and I choose thoughts of love and success.",
      "I am grateful for this moment and trust in my journey.",
      "I radiate confidence and attract meaningful connections.",
      "Today brings new possibilities and I embrace them with an open heart.",
      "I am enough exactly as I am, and I continue to grow beautifully.",
      "My actions today align with my highest good and greatest potential.",
      "I choose peace over worry, love over fear, and hope over doubt."
    ];
    
    const today = new Date().getDate();
    setManifestation(manifestations[today % manifestations.length]);
  }, []);

  const handleAffirm = () => {
    // Store in localStorage to prevent showing again until evening
    const now = new Date();
    const nextShow = new Date();
    nextShow.setHours(19, 30, 0, 0); // 7:30 PM
    
    if (nextShow <= now) {
      nextShow.setDate(nextShow.getDate() + 1);
    }
    
    localStorage.setItem('manifestationDismissed', nextShow.toISOString());
    onDismiss();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full bg-transparent border-none">
        <CardContent className="p-0">
          {/* Ancient Scroll Design */}
          <div 
            className="relative p-8 text-center"
            style={{
              backgroundImage: `url(/lovable-uploads/2f1ccd28-95e5-4081-b942-7be698fd879f.png)`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              minHeight: '400px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            {/* Close button */}
            <Button
              onClick={onDismiss}
              className="absolute top-4 right-4 bg-transparent hover:bg-black/10 text-amber-800 p-2 rounded-full"
            >
              <X className="w-4 h-4" />
            </Button>

            {/* Content overlay */}
            <div className="bg-amber-50/90 backdrop-blur-sm rounded-lg p-6 mx-4 shadow-lg border border-amber-200">
              <h2 className="text-2xl font-bold text-amber-900 mb-4 font-serif">
                Today's Sacred Intention
              </h2>
              
              <div className="text-lg text-amber-800 mb-6 font-serif leading-relaxed italic">
                "{manifestation}"
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleAffirm}
                  className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold py-3 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  ✨ I Will Achieve This ✨
                </Button>
                
                <p className="text-sm text-amber-700 opacity-80">
                  Speak these words with conviction and feel their truth in your heart
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManifestationGuide;
