import React from 'react';
import { Palette, Droplets } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="py-8 text-center space-y-2">
      <div className="flex items-center justify-center space-x-3 text-paint-400 mb-2">
        <Droplets size={28} className="animate-bounce" style={{ animationDuration: '3s' }} />
        <Palette size={28} />
      </div>
      <h1 className="text-4xl md:text-5xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-paint-200 via-paint-400 to-paint-600 font-bold tracking-tight">
        Pollock Canvas
      </h1>
      <p className="text-neutral-500 text-sm md:text-base font-light tracking-wide max-w-md mx-auto leading-relaxed">
        당신의 사진을 흐르는 유화 명작으로 변환해보세요.<br/>
        픽셀들이 캔버스를 채우고 천천히 녹아내리는 과정을 지켜보세요.
      </p>
    </header>
  );
};