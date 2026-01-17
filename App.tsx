import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { DrippingCanvas } from './components/DrippingCanvas';
import { Controls } from './components/Controls';
import { AppState, SimulationConfig, Language } from './types';
import { Github, Instagram } from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>('ko');
  
  // Key to force re-mounting of the canvas for replay
  const [simulationKey, setSimulationKey] = useState(0);

  // Default Hyperparameters - Adjusted per user request
  const [config, setConfig] = useState<SimulationConfig>({
    gravity: 0.003, 
    dryingSpeed: 1.6, 
    headScale: 1.5,
    trailScale: 1.0,
    diffusion: 0.4, 
  });

  const handleUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setImageSrc(e.target.result as string);
        setAppState(AppState.READY_TO_PAINT);
        setError(null);
        setSimulationKey(0);
      }
    };
    reader.readAsDataURL(file);
  }, []);

  const handleStartPaint = useCallback(() => {
    setAppState(AppState.PAINTING);
  }, []);

  const handleReplay = useCallback(() => {
    // Increment key to force remount of DrippingCanvas, resetting the simulation completely
    setSimulationKey(prev => prev + 1);
    setAppState(AppState.PAINTING);
  }, []);

  const handleReset = useCallback(() => {
    setAppState(AppState.IDLE);
    setImageSrc(null);
    setError(null);
    setSimulationKey(0);
  }, []);

  const handleFinish = useCallback(() => {
    setAppState(AppState.FINISHED);
  }, []);

  const isKo = language === 'ko';

  return (
    <div className="min-h-screen bg-[#121212] text-neutral-100 font-sans selection:bg-paint-600 selection:text-white pb-20">
      <div className="container mx-auto px-4 max-w-5xl">
        <Header language={language} onLanguageChange={setLanguage} />

        {error && (
          <div className="max-w-md mx-auto mb-8 p-4 bg-red-900/20 border border-red-800 text-red-200 rounded-lg text-center text-sm">
            {error}
          </div>
        )}

        {imageSrc && (
          <div className={`transition-all duration-1000 ease-in-out ${appState === AppState.READY_TO_PAINT ? 'scale-100 opacity-100' : 'scale-100 opacity-100'}`}>
             <DrippingCanvas 
               key={simulationKey}
               imageSrc={imageSrc} 
               isPlaying={appState === AppState.PAINTING}
               onFinish={handleFinish}
               resolution={4}
               config={config}
               language={language}
             />
          </div>
        )}

        <Controls 
          appState={appState}
          onUpload={handleUpload}
          onStartPaint={handleStartPaint}
          onReplay={handleReplay}
          onReset={handleReset}
          config={config}
          onConfigChange={setConfig}
          language={language}
        />
        
        {appState === AppState.FINISHED && (
            <div className="text-center mt-6 mb-12 animate-in fade-in duration-1000">
                <p className="text-paint-300 font-serif italic text-lg">
                  {isKo 
                    ? "\"예술은 끝나는 것이 아니라, 버려지는 것이다.\"" 
                    : "\"Art is never finished, only abandoned.\""}
                </p>
            </div>
        )}

        {/* Footer Section */}
        <footer className="mt-24 pt-8 border-t border-neutral-800/50 flex flex-col items-center gap-6 text-neutral-500">
            <div className="flex flex-wrap justify-center gap-6 md:gap-10">
                <a 
                    href="https://github.com/jugwangjin/pollock_canvas_2" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 hover:text-white transition-colors group"
                    aria-label="GitHub Repository"
                >
                    <div className="p-2 bg-neutral-800 rounded-full group-hover:bg-neutral-700 transition-colors ring-1 ring-white/10 group-hover:ring-white/20">
                        <Github size={20} />
                    </div>
                    <span className="text-sm font-medium">GitHub Repository</span>
                </a>
                
                <a 
                    href="https://instagram.com/panggun_ju" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 hover:text-white transition-colors group"
                    aria-label="Instagram Profile"
                >
                    <div className="p-2 bg-neutral-800 rounded-full group-hover:bg-neutral-700 transition-colors ring-1 ring-white/10 group-hover:ring-white/20">
                        <Instagram size={20} />
                    </div>
                    <span className="text-sm font-medium">@panggun_ju</span>
                </a>
            </div>
            
            <div className="text-center space-y-1">
                <p className="text-xs text-neutral-600">
                    Developed by <span className="text-neutral-400">Ju Gwangjin</span>
                </p>
            </div>
        </footer>
      </div>
    </div>
  );
};

export default App;