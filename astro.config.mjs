// astro.config.mjs
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import cloudflare from '@astrojs/cloudflare';
import keystatic from '@keystatic/astro';
import markdoc from '@astrojs/markdoc';
import path from 'path'; // Para los alias

const isDev = process.env.NODE_ENV === 'development';

export default defineConfig({
  output: isDev ? 'static' : 'server',
  adapter: isDev ? undefined : cloudflare({
    imageService: 'cloudflare',
    platformProxy: { enabled: true },
    runtime: { mode: 'off' }
  }),
  integrations: [
    react(),
    tailwind({ applyBaseStyles: false }),
    keystatic(),
    markdoc(),
  ],
  vite: {
    resolve: {
      // 1. RECUPERADO: Tus alias de Vite para rutas limpias
      alias: {
        '@': path.resolve(process.cwd(), './src'),
      },
    },
    ssr: {
      noExternal: ['motion'],
    },
    build: {
      cssMinify: 'lightningcss',
    },
    plugins: [
      {
        name: 'mcrd-inject-css',
        enforce: 'pre',
        transform(code, id) {
          // 2. ACTUALIZADO: Ahora apunta a App.tsx, el nuevo nucleo
          if (id.endsWith('App.tsx')) {
            return "import './index.css';\n" + code;
          }
        },
      },
    ],
  },
});