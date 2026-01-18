import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Particle, SimulationConfig, Language } from '../types';

interface DrippingCanvasProps {
  imageSrc: string;
  isPlaying: boolean;
  onFinish?: () => void;
  resolution?: number; 
  config: SimulationConfig;
  language: Language;
}

export const DrippingCanvas: React.FC<DrippingCanvasProps> = ({ 
  imageSrc, 
  isPlaying,
  onFinish,
  resolution = 5,
  config,
  language
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sCanvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Data refs
  const requestRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const sourceDataRef = useRef<Uint8ClampedArray | null>(null);
  const sourceWidthRef = useRef<number>(0);
  
  // State
  const [isLoaded, setIsLoaded] = useState(false);
  const [displaySize, setDisplaySize] = useState({ width: 0, height: 0 });
  
  // This ref tracks the "Activation Line" that moves bottom-up
  const lastRevealYRef = useRef<number>(0);

  // --- PHYSICS CONSTANTS ---
  const INTERNAL_WIDTH = 600; 
  const REVEAL_SPEED = 0.5; 
  const TERMINAL_VELOCITY = 1.0; 
  
  const COLOR_MIX_RATE = 0.02;  
  
  // Initialization
  useEffect(() => {
    setIsLoaded(false);
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageSrc;
    
    img.onload = () => {
      // 1. Calculate Standardized Dimensions
      const aspectRatio = img.height / img.width;
      const w = INTERNAL_WIDTH;
      const h = Math.round(INTERNAL_WIDTH * aspectRatio);
      
      sourceWidthRef.current = w;
      lastRevealYRef.current = h; 

      // 2. Create Offscreen Canvas for pixel reading and caching the initial image
      const sCanvas = document.createElement('canvas');
      sCanvas.width = w;
      sCanvas.height = h;
      const sCtx = sCanvas.getContext('2d', { willReadFrequently: true });
      if (!sCtx) return;
      
      sCtx.drawImage(img, 0, 0, w, h);
      sCanvasRef.current = sCanvas;

      const imageData = sCtx.getImageData(0, 0, w, h);
      const data = imageData.data;
      sourceDataRef.current = data;
      
      // 3. Generate Particles
      const newParticles: Particle[] = [];
      
      for (let y = 0; y < h; y += resolution) {
        for (let x = 0; x < w; x += resolution) {
          const i = (y * w + x) * 4;
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const a = data[i + 3];
          
          if (a > 20) {
            // HSV Calculation for Physics
            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            const v = max / 255; // Value (Brightness) 0~1
            const s = max === 0 ? 0 : (max - min) / max; // Saturation 0~1
            
            // Whiteness Score: 0.0 (Pure Color/Black) to 1.0 (Pure White)
            const whiteness = v * (1 - s);

            // Physics variation based on Whiteness
            const baseDecay = 0.002; 
            const whitenessPenalty = Math.pow(whiteness, 3) * 0.15; 
            // Increased randomness from 0.01 to 0.02 as requested
            const randomFactor = Math.random() * 0.02;
            const dryingRate = baseDecay + whitenessPenalty + randomFactor;

            newParticles.push({
              x,
              y: y, 
              originY: y,
              r, g, b, a,
              vx: (Math.random() - 0.5) * 0.2, 
              vy: 0,
              size: resolution,
              dryingRate: dryingRate, 
              wetness: 1.0,
              isRevealed: false, 
              dripDelay: 0,
              whiteness: whiteness
            });
          }
        }
      }
      
      particlesRef.current = newParticles;
      
      // Update state to trigger render and sizing
      setDisplaySize({ width: w, height: h });
      setIsLoaded(true);
    };
  }, [imageSrc, resolution]);

  // Initial Draw - Ensures image is visible immediately after React resizes the canvas
  useEffect(() => {
    if (isLoaded && displaySize.width > 0 && canvasRef.current && sCanvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
            ctx.drawImage(sCanvasRef.current, 0, 0);
        }
    }
  }, [isLoaded, displaySize]);

  const animate = useCallback((revealY: number) => {
    const canvas = canvasRef.current;
    const sourceData = sourceDataRef.current;
    const w = sourceWidthRef.current;
    
    if (!canvas || !sourceData || w === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const h = canvas.height;

    let activeParticles = 0;
    
    const particles = particlesRef.current;
    const len = particles.length;

    for (let i = 0; i < len; i++) {
      const p = particles[i];

      // 1. Activation Logic
      if (!p.isRevealed) {
        if (p.originY >= revealY) {
          p.isRevealed = true;
        }
      }

      // 2. Movement Logic
      if (p.isRevealed && p.wetness > 0) {
        activeParticles++;

        // Reduce wetness based on dryingSpeed config
        p.wetness -= (p.dryingRate * config.dryingSpeed);
        
        if (p.wetness <= 0) {
            p.wetness = 0;
            // Final dry stamp shrunk size
            const finalSize = p.size * 0.33;
            const radius = (finalSize * config.headScale) / 2;
            const centerX = p.x + p.size / 2;
            const centerY = p.y + p.size / 2;
            
            // Apply Exponential Alpha Logic for dry stamp
            const finalAlpha = Math.max(0.05, Math.pow(1.0 - p.whiteness, 0.33));

            ctx.fillStyle = `rgba(${p.r},${p.g},${p.b}, ${finalAlpha})`;
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.fill();
            continue;
        }

        // Apply Forces
        const currentGravity = config.gravity * p.wetness;
        p.vy += currentGravity;
        
        // Horizontal Diffusion
        const diffusion = (Math.random() - 0.5) * 0.2 * p.wetness * config.diffusion;
        p.vx += diffusion;
        p.vx *= 0.95; 

        // Cap velocity
        const maxV = TERMINAL_VELOCITY * p.wetness;
        if (p.vy > maxV) p.vy = maxV;

        // Move
        const prevX = p.x;
        const prevY = p.y;
        
        p.x += p.vx;
        p.y += p.vy;

        // --- COLOR MIXING ---
        const checkY = Math.min(Math.floor(p.y), h - 1);
        const checkX = Math.min(Math.max(Math.floor(p.x), 0), w - 1);
        const idx = (checkY * w + checkX) * 4;

        if (idx < sourceData.length - 4) {
          const bgR = sourceData[idx];
          const bgG = sourceData[idx + 1];
          const bgB = sourceData[idx + 2];

          p.r = p.r * (1 - COLOR_MIX_RATE) + bgR * COLOR_MIX_RATE;
          p.g = p.g * (1 - COLOR_MIX_RATE) + bgG * COLOR_MIX_RATE;
          p.b = p.b * (1 - COLOR_MIX_RATE) + bgB * COLOR_MIX_RATE;
        }

        // --- DRAWING ---
        const finalAlpha = Math.max(0.05, Math.pow(1.0 - p.whiteness, 0.15));

        // Size shrinking logic:
        const sizeMultiplier = 0.33 + (0.17 * p.wetness);
        const currentSize = p.size * sizeMultiplier;

        ctx.fillStyle = `rgba(${Math.floor(p.r)},${Math.floor(p.g)},${Math.floor(p.b)}, ${finalAlpha})`;
        
        const distY = p.y - prevY;
        const distX = p.x - prevX;
        
        // 1. Draw Trail
        const trailWidth = currentSize * config.trailScale;
        const trailOffset = (trailWidth - p.size) / 2;
        
        ctx.fillRect(
            p.x - trailOffset, 
            prevY, 
            trailWidth + Math.abs(distX), 
            distY + (currentSize / 2) 
        );

        // 2. Draw Head
        const radius = (currentSize * config.headScale) / 2;
        const centerX = p.x + p.size / 2; 
        const centerY = p.y + p.size / 2;

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const isRevealFinished = revealY <= -20;
    
    if (isPlaying && (!isRevealFinished || activeParticles > 0)) {
        const nextRevealY = revealY - REVEAL_SPEED;
        requestRef.current = requestAnimationFrame(() => animate(nextRevealY));
    } else if (isPlaying && isRevealFinished && activeParticles === 0) {
        if (onFinish) onFinish();
    } else if (!isPlaying && requestRef.current) {
        cancelAnimationFrame(requestRef.current);
    }

  }, [isPlaying, onFinish, config]);

  // Handle Play/Stop trigger
  useEffect(() => {
    if (isPlaying && isLoaded && displaySize.height > 0) {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      requestRef.current = requestAnimationFrame(() => animate(lastRevealYRef.current));
    } else if (!isPlaying && isLoaded) {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    }
    
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying, isLoaded, displaySize, animate]);

  return (
    <div className="relative shadow-2xl rounded-lg overflow-hidden bg-[#1a1a1a] border border-neutral-800">
      <canvas
        ref={canvasRef}
        width={displaySize.width}
        height={displaySize.height}
        className="max-w-full max-h-[70vh] object-contain block mx-auto"
      />
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center text-neutral-500">
          {language === 'ko' ? "캔버스 로딩 중..." : "Loading Canvas..."}
        </div>
      )}
    </div>
  );
};