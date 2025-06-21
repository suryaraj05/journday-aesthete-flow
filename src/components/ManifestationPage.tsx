import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, Target, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { useToast } from '@/hooks/use-toast';

interface ManifestationPageProps {
  onBack: () => void;
}

const ManifestationPage = ({ onBack }: ManifestationPageProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [manifestation, setManifestation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadManifestation();
  }, [user]);

  const loadManifestation = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const docRef = doc(db, 'manifestations', user.uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setManifestation(docSnap.data().text || '');
      } else {
        // Set a default manifestation
        setManifestation("I am worthy of all the abundance and joy that flows into my life today.");
      }
    } catch (error) {
      console.error('Error loading manifestation:', error);
      toast({
        title: "Error",
        description: "Failed to load your manifestation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveManifestation = async () => {
    if (!user || !manifestation.trim()) return;

    setIsSaving(true);
    try {
      const docRef = doc(db, 'manifestations', user.uid);
      await setDoc(docRef, {
        text: manifestation.trim(),
        updatedAt: new Date().toISOString(),
        userId: user.uid
      });

      toast({
        title: "Success",
        description: "Your manifestation has been saved!",
      });
    } catch (error) {
      console.error('Error saving manifestation:', error);
      toast({
        title: "Error",
        description: "Failed to save your manifestation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const defaultManifestations = [
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

  return (
    <div className="min-h-screen ayurvedic-gradient lotus-pattern relative overflow-hidden">
      {/* Background Elements */}
      <div className="floating-orbs">
        <div className="floating-orb"></div>
        <div className="floating-orb"></div>
        <div className="floating-orb"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button
            onClick={onBack}
            className="button-neumorphic mr-4 hover:scale-105 transition-transform text-gray-800 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 neumorphic flex items-center justify-center">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Manifestation</h1>
              <p className="text-gray-600">Shape your reality with sacred intentions</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Edit Manifestation */}
          <Card className="card-neumorphic border-none">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-800">
                <Sparkles className="w-5 h-5 mr-2 text-purple-600" />
                Your Sacred Intention
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <div className="animate-pulse">
                  <div className="h-32 bg-gray-200 rounded-lg"></div>
                </div>
              ) : (
                <Textarea
                  value={manifestation}
                  onChange={(e) => setManifestation(e.target.value)}
                  placeholder="Write your daily manifestation here..."
                  className="min-h-32 bg-white/50 border-purple-200 focus:border-purple-400 resize-none"
                  maxLength={300}
                />
              )}
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {manifestation.length}/300 characters
                </span>
                <Button
                  onClick={saveManifestation}
                  disabled={isSaving || !manifestation.trim()}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save'}
                </Button>
              </div>

              {/* Preview */}
              {manifestation && (
                <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200">
                  <h4 className="font-semibold text-amber-900 mb-2">Preview:</h4>
                  <p className="text-amber-800 italic font-serif">"{manifestation}"</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Inspiration */}
          <Card className="card-neumorphic border-none">
            <CardHeader>
              <CardTitle className="text-gray-800">Inspiration</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Choose from these powerful manifestations or create your own:
              </p>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {defaultManifestations.map((text, index) => (
                  <div
                    key={index}
                    className="p-3 bg-white/30 rounded-lg border border-purple-100 cursor-pointer hover:bg-white/50 transition-colors"
                    onClick={() => setManifestation(text)}
                  >
                    <p className="text-sm text-gray-700 italic">"{text}"</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">💡 Tips for Effective Manifestations:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Use present tense ("I am" not "I will")</li>
                  <li>• Be specific and positive</li>
                  <li>• Include emotions and feelings</li>
                  <li>• Keep it personal and meaningful</li>
                  <li>• Believe in what you're saying</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ManifestationPage;
