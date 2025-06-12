// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import vue from '@astrojs/vue';
import tailwindcss from '@tailwindcss/vite';


// https://astro.build/config
export default defineConfig({
  site: 'https://example.com',

  // The vite key can be removed if tailwindcss was the only plugin
  // and you have no other custom Vite configurations.
  // If you have other Vite configurations, keep the vite key
  // and just remove tailwindcss() from its plugins array.
  integrations: [
    mdx(),
    sitemap(),
    vue(),
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});