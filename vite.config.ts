import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Vite environment variables are prefixed with VITE_
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext', // browsers can handle the latest ES features
  },
});
