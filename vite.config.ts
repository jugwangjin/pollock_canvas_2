import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // GitHub Pages 배포 시 하위 경로(/repo-name/) 문제를 해결하기 위해 상대 경로로 설정
  base: './', 
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  define: {
    'process.env': {} 
  }
});