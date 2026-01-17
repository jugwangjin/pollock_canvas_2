import React from 'react';
import { Palette, Droplets, Check } from 'lucide-react';
import { Language } from '../types';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export const Header: React.FC<HeaderProps> = ({ language, onLanguageChange }) => {
  const isKo = language === 'ko';

  return (
    <header className="py-8 text-center space-y-6 relative">
      {/* Language Toggle - Radio Button Style */}
      <div className="absolute top-4 right-0 md:static md:flex md:justify-end md:mb-[-2rem] z-10">
        <div className="inline-flex bg-neutral-800 p-1 rounded-full border border-neutral-700 shadow-lg">
          <label className={`relative cursor-pointer px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
            isKo 
              ? 'bg-paint-600 text-white shadow-md' 
              : 'text-neutral-400 hover:text-neutral-200'
          }`}>
            <input 
              type="radio" 
              name="language" 
              value="ko" 
              checked={isKo} 
              onChange={() => onLanguageChange('ko')}
              className="sr-only"
            />
            {isKo && <Check size={14} />}
            한국어
          </label>
          <label className={`relative cursor-pointer px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
            !isKo 
              ? 'bg-paint-600 text-white shadow-md' 
              : 'text-neutral-400 hover:text-neutral-200'
          }`}>
            <input 
              type="radio" 
              name="language" 
              value="en" 
              checked={!isKo} 
              onChange={() => onLanguageChange('en')}
              className="sr-only"
            />
            {!isKo && <Check size={14} />}
            English
          </label>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-center space-x-3 text-paint-400 mb-2">
          <Droplets size={28} className="animate-bounce" style={{ animationDuration: '3s' }} />
          <Palette size={28} />
        </div>
        <h1 className="text-4xl md:text-5xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-paint-200 via-paint-400 to-paint-600 font-bold tracking-tight">
          MorganSims Canvas
        </h1>
        <p className="text-neutral-500 text-sm md:text-base font-light tracking-wide max-w-md mx-auto leading-relaxed">
          {isKo ? (
            <>
              당신의 사진을 흐르는 유화 명작으로 변환해보세요.<br/>
              픽셀들이 캔버스를 채우고 천천히 녹아내리는 과정을 지켜보세요.
            </>
          ) : (
            <>
              Transform your photos into flowing oil painting masterpieces.<br/>
              Watch pixels fill the canvas and slowly melt into art.
            </>
          )}
        </p>
      </div>
    </header>
  );
};