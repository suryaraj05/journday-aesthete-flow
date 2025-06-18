
import { useState, useEffect } from 'react';

const ayurvedicTips = [
  {
    title: "Nadi Shodhana",
    description: "Try alternate nostril breathing before journaling to balance your mind",
    practice: "Close right nostril, inhale left. Close left, exhale right. Repeat 5 times.",
    icon: "🌬️"
  },
  {
    title: "Brahma Muhurta",
    description: "The hours before dawn are most conducive to self-reflection",
    practice: "Journal during the early morning hours for deeper insights.",
    icon: "🌅"
  },
  {
    title: "Abhyanga",
    description: "Self-massage with warm oil before writing can calm the nervous system",
    practice: "Massage your temples and hands before beginning your practice.",
    icon: "🤲"
  },
  {
    title: "Pranayama",
    description: "Deep breathing exercises enhance mental clarity",
    practice: "Take 10 deep breaths, focusing on the exhale being longer than the inhale.",
    icon: "💨"
  },
  {
    title: "Meditation",
    description: "A few minutes of stillness can deepen your writing practice",
    practice: "Sit quietly for 2-3 minutes before writing, observing your thoughts.",
    icon: "🧘"
  }
];

const AyurvedicTip = () => {
  const [currentTip, setCurrentTip] = useState(0);
  const [isTracked, setIsTracked] = useState(false);

  useEffect(() => {
    // Rotate tips daily
    const today = new Date().getDate();
    setCurrentTip(today % ayurvedicTips.length);
  }, []);

  const tip = ayurvedicTips[currentTip];

  return (
    <div className="max-w-2xl mx-auto mb-8">
      <div className="card-neumorphic p-6">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-green-200/50 to-emerald-200/50 rounded-2xl flex items-center justify-center flex-shrink-0">
            <span className="text-2xl">{tip.icon}</span>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Today's Ayurvedic Tip</h3>
            <h4 className="text-md font-medium text-purple-700 mb-2">{tip.title}</h4>
            <p className="text-sm text-gray-600 mb-3">{tip.description}</p>
            <p className="text-xs text-gray-500 italic mb-4">{tip.practice}</p>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsTracked(!isTracked)}
                className={`text-xs px-3 py-1 rounded-full transition-colors ${
                  isTracked 
                    ? 'bg-green-200/50 text-green-700' 
                    : 'bg-gray-200/50 text-gray-600 hover:bg-gray-300/50'
                }`}
              >
                {isTracked ? '✓ Practiced' : 'Mark as Practiced'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AyurvedicTip;
