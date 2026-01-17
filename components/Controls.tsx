import React, { useState } from 'react';
import { Upload, Play, Sliders, RotateCcw } from 'lucide-react';
import { AppState, SimulationConfig } from '../types';

interface ControlsProps {
  appState: AppState;
  onUpload: (file: File) => void;
  onStartPaint: () => void;
  onReplay: () => void;
  onReset: () => void;
  config: SimulationConfig;
  onConfigChange: (config: SimulationConfig) => void;
}

export const Controls: React.FC<ControlsProps> = ({ 
  appState, 
  onUpload, 
  onStartPaint,
  onReplay,
  onReset,
  config,
  onConfigChange
}) => {
  const [showSettings, setShowSettings] = useState(false);

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
            <span className="flex items-center gap-2"><Sliders size={16} /> 효과 설정</span>
            <span className="text-xs text-neutral-500">{showSettings ? '숨기기' : '조절하기'}</span>
        </button>
        
        {showSettings && (
            <div className="grid gap-6 mt-4 animate-in slide-in-from-top-2 duration-300">
                {renderSlider("중력 (흐름 속도)", "gravity", 0, 0.02, 0.0005)}
                {renderSlider("건조 배수 (지속 시간)", "dryingSpeed", 0.1, 3.0, 0.1)}
                {renderSlider("방울 크기", "headScale", 1.0, 4.0, 0.1)}
                {renderSlider("흐름 두께", "trailScale", 0.5, 2.0, 0.1)}
                {renderSlider("확산 (흔들림)", "diffusion", 0.0, 3.0, 0.1)}
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
            {appState === AppState.FINISHED ? "다시보기" : "다시 시작"}
          </button>
          
          <button
            onClick={onReset}
            className="px-8 py-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-full font-medium transition-colors border border-neutral-700 shadow-lg"
          >
            새 이미지
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
          녹이기 시작
        </button>

        {renderSettingsPanel()}

        <button 
          onClick={onReset}
          className="text-sm text-neutral-500 hover:text-neutral-300 underline underline-offset-4"
        >
          다른 이미지 선택
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
          <h3 className="text-xl font-semibold text-neutral-200">이미지 업로드</h3>
          <p className="text-neutral-500 mt-2">유화로 변환할 사진을 선택하세요</p>
        </div>
        <label className="cursor-pointer px-8 py-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-full font-medium transition-colors border border-neutral-700 w-full">
          파일 찾아보기
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