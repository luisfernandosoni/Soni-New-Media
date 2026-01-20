import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// #MCRD: Plugin de Saneamiento de Entorno
const stripFallbacks = () => {
  return {
    name: 'mcrd-strip-fallbacks',
    transformIndexHtml(html: string) {
      // OJO AQUÍ: Copia TODA la línea, incluyendo los comentarios dentro del regex
      return html.replace(/[\s\S]*?/gi, '');
    },
  };
};

export default defineConfig({
  plugins: [
    react(),
    stripFallbacks()
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