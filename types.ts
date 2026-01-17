export interface Particle {
  x: number;
  y: number;
  originY: number;
  
  // RGB components for color mixing
  r: number;
  g: number;
  b: number;
  a: number;

  vx: number;
  vy: number;
  size: number;
  dryingRate: number; // How fast 'wetness' decreases (0.001 to 0.05)
  wetness: number;    // 1.0 (wet) to 0.0 (dry)
  isRevealed: boolean;
  dripDelay: number; // Random delay before dripping starts after reveal
  whiteness: number; // 0.0 (Black/Color) to 1.0 (Pure White)
}

export enum AppState {
  IDLE = 'IDLE',
  READY_TO_PAINT = 'READY_TO_PAINT',
  PAINTING = 'PAINTING',
  FINISHED = 'FINISHED'
}

export interface SimulationConfig {
  gravity: number;
  dryingSpeed: number;
  headScale: number;
  trailScale: number;
  diffusion: number;
}