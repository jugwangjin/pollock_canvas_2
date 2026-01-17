import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { DrippingCanvas } from './components/DrippingCanvas';
import { Controls } from './components/Controls';
import { AppState, SimulationConfig } from './types';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
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

  return (
    <div className="min-h-screen bg-[#121212] text-neutral-100 font-sans selection:bg-paint-600 selection:text-white pb-20">
      <div className="container mx-auto px-4 max-w-5xl">
        <Header />

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
        />
        
        {appState === AppState.FINISHED && (
            <div className="text-center mt-6 animate-in fade-in duration-1000">
                <p className="text-paint-300 font-serif italic text-lg">"예술은 끝나는 것이 아니라, 버려지는 것이다."</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default App;