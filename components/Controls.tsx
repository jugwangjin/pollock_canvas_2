import React, { useState } from 'react';
import { Upload, Play, Sliders, RotateCcw } from 'lucide-react';
import { AppState, SimulationConfig, Language } from '../types';

interface ControlsProps {
  appState: AppState;
  onUpload: (file: File) => void;
  onStartPaint: () => void;
  onReplay: () => void;
  onReset: () => void;
  config: SimulationConfig;
  onConfigChange: (config: SimulationConfig) => void;
  language: Language;
}

export const Controls: React.FC<ControlsProps> = ({ 
  appState, 
  onUpload, 
  onStartPaint,
  onReplay,
  onReset,
  config,
  onConfigChange,
  language
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const isKo = language === 'ko';

  const t = {
    settingsTitle: isKo ? "효과 설정" : "Effect Settings",
    show: isKo ? "조절하기" : "Adjust",
    hide: isKo ? "숨기기" : "Hide",
    gravity: isKo ? "중력 (흐름 속도)" : "Gravity (Flow Speed)",
    drying: isKo ? "건조 배수 (지속 시간)" : "Drying Rate (Duration)",
    head: isKo ? "방울 크기" : "Droplet Size",
    trail: isKo ? "흐름 두께" : "Trail Thickness",
    diffusion: isKo ? "확산 (흔들림)" : "Diffusion (Jitter)",
    replay: isKo ? "다시 시작" : "Restart",
    replayView: isKo ? "다시보기" : "Replay",
    newImage: isKo ? "새 이미지" : "New Image",
    start: isKo ? "녹이기 시작" : "Start Melting",
    otherImage: isKo ? "다른 이미지 선택" : "Select another image",
    uploadTitle: isKo ? "이미지 업로드" : "Upload Image",
    uploadDesc: isKo ? "유화로 변환할 사진을 선택하세요" : "Select a photo to stylize",
    browse: isKo ? "파일 찾아보기" : "Browse Files"
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0]);
    }
  };

  const updateConfig = (key: keyof SimulationConfig, value: number) => {
    onConfigChange({ ...config, [key]: value });
  };

  const renderSlider = (label: string, key: keyof SimulationConfig, min: number, max: number, step: number) => (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-neutral-400">
        <span>{label}</span>
        <span>{config[key].toFixed(4)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={config[key]}
        onChange={(e) => updateConfig(key, parseFloat(e.target.value))}
        className="w-full h-1.5 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-paint-500 hover:accent-paint-400"
      />
    </div>
  );

  const renderSettingsPanel = () => (
    <div className="w-full max-w-lg bg-neutral-900/50 p-6 rounded-2xl border border-neutral-800 transition-all duration-300">
        <button 
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center justify-between w-full text-sm text-neutral-300 font-medium mb-1 hover:text-white transition-colors"
        >
            <span className="flex items-center gap-2"><Sliders size={16} /> {t.settingsTitle}</span>
            <span className="text-xs text-neutral-500">{showSettings ? t.hide : t.show}</span>
        </button>
        
        {showSettings && (
            <div className="grid gap-6 mt-4 animate-in slide-in-from-top-2 duration-300">
                {renderSlider(t.gravity, "gravity", 0, 0.02, 0.0005)}
                {renderSlider(t.drying, "dryingSpeed", 0.1, 3.0, 0.1)}
                {renderSlider(t.head, "headScale", 1.0, 4.0, 0.1)}
                {renderSlider(t.trail, "trailScale", 0.5, 2.0, 0.1)}
                {renderSlider(t.diffusion, "diffusion", 0.0, 3.0, 0.1)}
            </div>
        )}
    </div>
  );

  if (appState === AppState.PAINTING || appState === AppState.FINISHED) {
    return (
      <div className="flex flex-col items-center gap-6 mt-8">
        {/* Full settings panel available during painting/finished state */}
        {renderSettingsPanel()}

        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={onReplay}
            className="px-8 py-3 bg-paint-600 hover:bg-paint-500 text-white rounded-full font-medium transition-colors shadow-lg flex items-center gap-2"
          >
            <RotateCcw size={18} />
            {appState === AppState.FINISHED ? t.replayView : t.replay}
          </button>
          
          <button
            onClick={onReset}
            className="px-8 py-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-full font-medium transition-colors border border-neutral-700 shadow-lg"
          >
            {t.newImage}
          </button>
        </div>
      </div>
    );
  }

  if (appState === AppState.READY_TO_PAINT) {
    return (
      <div className="flex flex-col items-center gap-6 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <button
          onClick={onStartPaint}
          className="group relative px-8 py-4 bg-paint-600 hover:bg-paint-500 text-white rounded-full font-bold text-lg transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center gap-2"
        >
          <Play className="w-5 h-5 fill-current" />
          {t.start}
        </button>

        {renderSettingsPanel()}

        <button 
          onClick={onReset}
          className="text-sm text-neutral-500 hover:text-neutral-300 underline underline-offset-4"
        >
          {t.otherImage}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 flex justify-center">
      {/* Upload Section */}
      <div className="w-full max-w-md bg-neutral-900/50 p-10 rounded-2xl border border-neutral-800 flex flex-col items-center justify-center text-center space-y-6 hover:border-paint-800 transition-colors group">
        <div className="p-5 bg-neutral-800 rounded-full group-hover:bg-neutral-700 transition-colors">
          <Upload className="w-10 h-10 text-paint-400" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-neutral-200">{t.uploadTitle}</h3>
          <p className="text-neutral-500 mt-2">{t.uploadDesc}</p>
        </div>
        <label className="cursor-pointer px-8 py-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-full font-medium transition-colors border border-neutral-700 w-full">
          {t.browse}
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            onChange={handleFileChange}
          />
        </label>
      </div>
    </div>
  );
};