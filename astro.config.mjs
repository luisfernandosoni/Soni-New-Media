// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import cloudflare from '@astrojs/cloudflare';
import keystatic from '@keystatic/astro';

// #MCRD: Astro Edge Architecture
export default defineConfig({
  output: 'server',
  adapter: cloudflare({
    imageService: 'cloudflare',
    platformProxy: {
      enabled: true,
    },
  }),
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false, // Preserving original index.css structure
    }),
    keystatic(),
  ],
  vite: {
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
          // Maintaining global CSS injection order for React components
          if (id.endsWith('index.tsx')) {
            return "import './index.css';\n" + code;
          }
        },
      },
    ],
  },
});