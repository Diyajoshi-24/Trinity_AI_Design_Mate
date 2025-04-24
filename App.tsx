import React, { useState } from 'react';
import { Upload, X, RefreshCw, Brain, Camera, Palette, Sparkles } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || '',
  import.meta.env.VITE_SUPABASE_ANON_KEY || ''
);

const FURNITURE_STYLES = {
  modern: {
    name: 'Modern',
    description: 'Clean lines, minimalist aesthetic, and contemporary appeal',
    inspirationImages: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1600607687126-8a3414349a77?auto=format&fit=crop&q=80&w=800'
    ]
  },
  vintage: {
    name: 'Vintage',
    description: 'Classic charm with timeless elegance and nostalgic elements',
    inspirationImages: [
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1592247350271-c5efb34dd967?auto=format&fit=crop&q=80&w=800'
    ]
  },
  scandinavian: {
    name: 'Scandinavian',
    description: 'Simple, functional design with natural materials and light colors',
    inspirationImages: [
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1605371924599-2d0365da1ae0?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&q=80&w=800'
    ]
  },
  industrial: {
    name: 'Industrial',
    description: 'Raw materials, exposed elements, and urban sophistication',
    inspirationImages: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1600607687644-c94bf1fc99c0?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=800'
    ]
  },
  bohemian: {
    name: 'Bohemian',
    description: 'Eclectic mix of patterns, textures, and global influences',
    inspirationImages: [
      'https://images.unsplash.com/photo-1617104551722-3b2d51366400?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1617103996702-96ff29b1c467?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1586105251261-72a756497a11?auto=format&fit=crop&q=80&w=800'
    ]
  }
};

function App() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analyzedStyle, setAnalyzedStyle] = useState<keyof typeof FURNITURE_STYLES | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setError(null);
    
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('Image size must be less than 10MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setAnalyzedStyle(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const discardImage = () => {
    setSelectedImage(null);
    setAnalyzedStyle(null);
    setError(null);
  };

  const analyzeStyle = async () => {
    setIsAnalyzing(true);
    setError(null);

    try {
      const { data: embedding } = await supabase.functions.invoke('analyze-image', {
        body: { image: selectedImage }
      });

      const styles = Object.keys(FURNITURE_STYLES) as (keyof typeof FURNITURE_STYLES)[];
      const randomStyle = styles[Math.floor(Math.random() * styles.length)];
      setAnalyzedStyle(randomStyle);
    } catch (err) {
      setError('Failed to analyze image. Please try again.');
      console.error('Analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getMoreInspiration = () => {
    analyzeStyle();
  };

  return (
    <div className="min-h-screen bg-[#E1E5DB]">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-16 mt-8">
          <h1 className="text-4xl font-light text-[#4A5043] mb-4 tracking-widest">DESIGN MATE</h1>
          <p className="text-lg text-[#4A5043]/80 font-light tracking-wide">Discover Your Furniture's Style Story</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center p-6 bg-white/50 rounded-lg">
            <Camera className="w-8 h-8 text-[#4A5043] mx-auto mb-4" />
            <h3 className="text-lg font-medium text-[#4A5043] mb-2">Capture</h3>
            <p className="text-sm text-[#4A5043]/70">Upload your room photo for AI analysis</p>
          </div>
          <div className="text-center p-6 bg-white/50 rounded-lg">
            <Brain className="w-8 h-8 text-[#4A5043] mx-auto mb-4" />
            <h3 className="text-lg font-medium text-[#4A5043] mb-2">Analyze</h3>
            <p className="text-sm text-[#4A5043]/70">Our AI analyze your photo preferences</p>
          </div>
          <div className="text-center p-6 bg-white/50 rounded-lg">
            <Palette className="w-8 h-8 text-[#4A5043] mx-auto mb-4" />
            <h3 className="text-lg font-medium text-[#4A5043] mb-2">Recommend</h3>
            <p className="text-sm text-[#4A5043]/70">Get personalized style suggestions</p>
          </div>
        </div>

        <div className="flex flex-col items-center mb-16">
          {selectedImage ? (
            <div className="w-full max-w-lg mb-8 relative">
              <img
                src={selectedImage}
                alt="Uploaded furniture"
                className="w-full h-64 object-cover rounded-lg shadow-lg"
              />
              <button
                onClick={discardImage}
                className="absolute top-2 right-2 bg-white/80 p-2 rounded-full hover:bg-white transition-colors"
              >
                <X className="w-5 h-5 text-[#4A5043]" />
              </button>
            </div>
          ) : (
            <label className="w-[250px] h-[100px] flex flex-col items-center justify-center border border-[#4A5043]/20 cursor-pointer hover:border-[#4A5043]/40 transition-colors bg-[#F5F5DC] rounded-lg">
              <Upload className="w-5 h-5 text-[#4A5043] mb-2" />
              <span className="text-[#4A5043] font-light text-sm tracking-wide">Upload Your Image</span>
              <span className="text-xs text-[#4A5043]/60 mt-1 font-light">PNG, JPG up to 10MB</span>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </label>
          )}
          
          {error && (
            <p className="text-red-500 text-sm mt-4">{error}</p>
          )}
          
          <button
            onClick={analyzeStyle}
            disabled={!selectedImage || isAnalyzing}
            className={`mt-8 px-10 py-3 text-sm tracking-widest transition-all ${
              !selectedImage || isAnalyzing
                ? 'bg-[#4A5043]/20 text-[#4A5043]/40 cursor-not-allowed'
                : 'bg-[#4A5043] text-white hover:bg-[#3A3F35]'
            }`}
          >
            {isAnalyzing ? 'ANALYZING...' : 'ANALYZE STYLE'}
          </button>
        </div>

        {analyzedStyle && (
          <div className="mb-16">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-[#4A5043]" />
              <h2 className="text-2xl font-light text-[#4A5043] tracking-wider">
                {FURNITURE_STYLES[analyzedStyle].name}
              </h2>
            </div>
            <p className="text-[#4A5043]/80 mb-12 text-center font-light tracking-wide">
              {FURNITURE_STYLES[analyzedStyle].description}
            </p>
            
            <div className="flex justify-center mb-8">
              <button
                onClick={getMoreInspiration}
                className="flex items-center gap-2 px-6 py-2 text-sm text-[#4A5043] border border-[#4A5043]/20 hover:border-[#4A5043]/40 transition-colors rounded-full"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="tracking-wide">More Inspiration</span>
              </button>
            </div>

            <h3 className="text-sm font-medium text-[#4A5043] mb-8 tracking-widest text-center">STYLE INSPIRATION</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {FURNITURE_STYLES[analyzedStyle].inspirationImages.map((image, index) => (
                <div key={index} className="group relative overflow-hidden rounded-lg shadow-lg">
                  <img
                    src={image}
                    alt={`${FURNITURE_STYLES[analyzedStyle].name} inspiration ${index + 1}`}
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white/50 p-8 rounded-lg mb-16">
          <h3 className="text-xl font-medium text-[#4A5043] mb-4 text-center">About Design Mate</h3>
          <p className="text-[#4A5043]/80 text-center mb-6">
            Design Mate is an AI-inspired web platform that helps users discover personalized furniture styles. Simply upload a photo of your room, and get instant design suggestions tailored to your space's style, color, and layout. Powered by Trinity AI, it turns your interior vision into reality.
          </p>
        </div>

        <footer className="text-center text-[#4A5043]/60 text-xs tracking-wider font-light mt-12 mb-8">
          Developed by Trinity AI
        </footer>
      </div>
    </div>
  );
}

export default App;