
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronLeft, BookOpen, Brain, Lotus, Mountain, Heart, Star } from 'lucide-react';

interface ReadingPageProps {
  onBack: () => void;
}

const ReadingPage = ({ onBack }: ReadingPageProps) => {
  const [activeStory, setActiveStory] = useState<string | null>(null);

  const stories = [
    {
      id: 'buddha-enlightenment',
      title: 'The Buddha\'s Enlightenment',
      category: 'Ancient Wisdom',
      image: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=800&h=600&fit=crop',
      excerpt: 'The profound journey of Siddhartha Gautama to becoming the Buddha',
      content: `
        <h3>The Great Awakening</h3>
        <p>Under the sacred Bodhi tree, Prince Siddhartha sat in deep meditation, determined to find the truth about suffering and liberation. For 49 days, he faced the temptations of Mara, the demon of desire and fear.</p>
        
        <p>As dawn broke on the final day, Siddhartha achieved perfect enlightenment. He understood the Four Noble Truths: the existence of suffering, its cause in attachment and craving, the possibility of its cessation, and the Eightfold Path to liberation.</p>
        
        <p>In that moment of awakening, he became the Buddha - "the awakened one." His first words were said to be: "Wonder of wonders! All beings are perfect as they are, and yet are destined for enlightenment."</p>
        
        <p>The Buddha spent the remaining 45 years of his life teaching others the path to freedom from suffering, establishing a legacy of compassion and wisdom that continues to transform lives today.</p>
        
        <h4>Lessons for Your Journey:</h4>
        <ul>
          <li>Persistent practice leads to profound insights</li>
          <li>Facing our inner demons with courage transforms them</li>
          <li>True peace comes from understanding the nature of mind</li>
          <li>Compassion for all beings is the fruit of wisdom</li>
        </ul>
      `
    },
    {
      id: 'deer-park',
      title: 'The First Teaching at Deer Park',
      category: 'Ancient Wisdom',
      image: 'https://images.unsplash.com/photo-1466721591366-2d5fba72006d?w=800&h=600&fit=crop',
      excerpt: 'Buddha\'s first sermon and the birth of the Sangha',
      content: `
        <h3>The Turning of the Wheel of Dharma</h3>
        <p>Seven weeks after his enlightenment, the Buddha traveled to Deer Park in Sarnath, where he encountered five ascetics who had previously practiced with him. Initially skeptical, they were soon captivated by his radiant presence and profound wisdom.</p>
        
        <p>Here, the Buddha delivered his first sermon, "Setting in Motion the Wheel of Dharma," introducing the Middle Way - avoiding both extreme indulgence and severe asceticism. He taught the Four Noble Truths and the Noble Eightfold Path.</p>
        
        <p>The five ascetics became his first disciples, forming the original Sangha (spiritual community). This marked the beginning of the Three Jewels: Buddha (the teacher), Dharma (the teaching), and Sangha (the community).</p>
        
        <h4>The Middle Way in Daily Life:</h4>
        <ul>
          <li>Balance effort with ease in your practice</li>
          <li>Neither suppress nor indulge difficult emotions</li>
          <li>Find the middle ground between attachment and aversion</li>
          <li>Seek harmony between solitude and community</li>
        </ul>
      `
    }
  ];

  const calmingContent = [
    {
      title: 'The Science of Breathwork',
      content: 'Deep, conscious breathing activates the parasympathetic nervous system, naturally reducing stress hormones and promoting a state of calm awareness.',
      icon: <Heart className="w-6 h-6 text-pink-500" />
    },
    {
      title: 'Neuroplasticity and Meditation',
      content: 'Regular meditation physically changes your brain, increasing gray matter in areas associated with learning, memory, and emotional regulation.',
      icon: <Brain className="w-6 h-6 text-purple-500" />
    },
    {
      title: 'Ayurvedic Daily Rhythms',
      content: 'Aligning with natural cycles - rising with the sun, eating at regular times, and winding down with sunset - supports your body\'s innate wisdom.',
      icon: <Lotus className="w-6 h-6 text-green-500" />
    },
    {
      title: 'Yoga Philosophy',
      content: 'The eight limbs of yoga provide a complete framework for living: ethical guidelines, physical practices, breath control, and meditation.',
      icon: <Mountain className="w-6 h-6 text-blue-500" />
    }
  ];

  const yogaWisdom = [
    {
      title: 'Patanjali\'s Yoga Sutras',
      quote: '"Yoga is the cessation of fluctuations in the mind."',
      explanation: 'True peace comes not from eliminating thoughts, but from no longer being disturbed by them.'
    },
    {
      title: 'The Bhagavad Gita',
      quote: '"You have the right to perform your actions, but you are not entitled to the fruits of action."',
      explanation: 'Focus on the process and effort, releasing attachment to specific outcomes.'
    },
    {
      title: 'Upanishads',
      quote: '"Tat tvam asi" - Thou art That',
      explanation: 'Recognize the divine consciousness that exists within you and all beings.'
    }
  ];

  if (activeStory) {
    const story = stories.find(s => s.id === activeStory);
    return (
      <div className="min-h-screen ayurvedic-gradient lotus-pattern relative overflow-hidden">
        <div className="relative z-10 container mx-auto px-6 py-8">
          <header className="flex items-center mb-8">
            <Button
              onClick={() => setActiveStory(null)}
              className="button-neumorphic text-gray-800 hover:text-gray-900 mr-4 p-2"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 neumorphic flex items-center justify-center pulse-glow-animation">
                <BookOpen className="w-6 h-6 text-gray-700" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{story?.title}</h1>
                <p className="text-sm text-gray-600">{story?.category}</p>
              </div>
            </div>
          </header>

          <Card className="card-neumorphic border-none max-w-4xl mx-auto">
            <CardContent className="p-8">
              <img 
                src={story?.image} 
                alt={story?.title}
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
              <div 
                className="prose prose-lg max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: story?.content || '' }}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ayurvedic-gradient lotus-pattern relative overflow-hidden">
      <div className="floating-orbs">
        <div className="floating-orb"></div>
        <div className="floating-orb"></div>
        <div className="floating-orb"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-8">
        <header className="flex items-center mb-8">
          <Button
            onClick={onBack}
            className="button-neumorphic text-gray-800 hover:text-gray-900 mr-4 p-2"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 neumorphic flex items-center justify-center pulse-glow-animation">
              <BookOpen className="w-6 h-6 text-gray-700" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Sacred Readings</h1>
              <p className="text-sm text-gray-600">Wisdom for your mindful journey</p>
            </div>
          </div>
        </header>

        <Tabs defaultValue="stories" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 card-neumorphic border-none">
            <TabsTrigger value="stories">Ancient Stories</TabsTrigger>
            <TabsTrigger value="science">Science & Mind</TabsTrigger>
            <TabsTrigger value="ayurveda">Ayurveda</TabsTrigger>
            <TabsTrigger value="yoga">Yoga Wisdom</TabsTrigger>
          </TabsList>

          <TabsContent value="stories" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {stories.map((story) => (
                <Card 
                  key={story.id} 
                  className="card-neumorphic border-none cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => setActiveStory(story.id)}
                >
                  <div className="relative">
                    <img 
                      src={story.image} 
                      alt={story.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 text-gray-800 px-3 py-1 rounded-full text-xs font-medium">
                        {story.category}
                      </span>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{story.title}</h3>
                    <p className="text-gray-600 text-sm">{story.excerpt}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="science" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {calmingContent.map((item, index) => (
                <Card key={index} className="card-neumorphic border-none">
                  <CardHeader>
                    <CardTitle className="flex items-center text-gray-800">
                      {item.icon}
                      <span className="ml-2">{item.title}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{item.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="ayurveda" className="space-y-6">
            <Card className="card-neumorphic border-none">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-800">
                  <Lotus className="w-6 h-6 mr-2" />
                  Ayurvedic Principles for Daily Life
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-4 glassmorphic rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-2">Vata (Air)</h4>
                    <p className="text-sm text-gray-600">Movement, creativity, nervous system. Balance with routine and warmth.</p>
                  </div>
                  <div className="text-center p-4 glassmorphic rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-2">Pitta (Fire)</h4>
                    <p className="text-sm text-gray-600">Metabolism, intelligence, transformation. Balance with cooling and moderation.</p>
                  </div>
                  <div className="text-center p-4 glassmorphic rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-2">Kapha (Earth)</h4>
                    <p className="text-sm text-gray-600">Structure, immunity, stability. Balance with activity and stimulation.</p>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-3">Daily Ayurvedic Practices</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Wake before sunrise for mental clarity</li>
                    <li>• Practice oil pulling for oral health</li>
                    <li>• Eat your largest meal at midday when digestion is strongest</li>
                    <li>• Use spices like turmeric, ginger, and cumin for healing</li>
                    <li>• End the day with calming herbal tea</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="yoga" className="space-y-6">
            <div className="space-y-6">
              {yogaWisdom.map((wisdom, index) => (
                <Card key={index} className="card-neumorphic border-none">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Star className="w-6 h-6 text-yellow-500 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">{wisdom.title}</h4>
                        <blockquote className="text-lg italic text-gray-700 mb-3 border-l-4 border-yellow-300 pl-4">
                          {wisdom.quote}
                        </blockquote>
                        <p className="text-gray-600">{wisdom.explanation}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ReadingPage;
