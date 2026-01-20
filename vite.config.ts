import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// #MCRD: Plugin de Saneamiento de Entorno
// Elimina los fallbacks de CDNs cuando se compila para producción.
const stripFallbacks = () => {
  return {
    name: 'mcrd-strip-fallbacks',
    transformIndexHtml(html: string) {
      // Regex agresivo para eliminar el bloque de fallback
      return html.replace(/[\s\S]*?/gi, '');
    },
  };
};

export default defineConfig({
  plugins: [
    react(),
    stripFallbacks() // <--- El agente de limpieza
  ],
  base: './',
  root: '.',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: 'index.html',
    },
  },
  server: {
    port: 3000,
    host: true
  }
});