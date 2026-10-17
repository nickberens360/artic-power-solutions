// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import vue from '@astrojs/vue';
import tailwindcss from '@tailwindcss/vite';


// https://astro.build/config
export default defineConfig({
  site: 'https://articpowersolutions.com',

  // Canonical URLs have no trailing slash (/blog, not /blog/).
  trailingSlash: 'never',
  // Emit blog.html instead of blog/index.html so Netlify serves /blog
  // directly (no 301 to /blog/), matching links, canonicals and the sitemap.
  build: {
    format: 'file',
  },

  // The vite key can be removed if tailwindcss was the only plugin
  // and you have no other custom Vite configurations.
  // If you have other Vite configurations, keep the vite key
  // and just remove tailwindcss() from its plugins array.
  integrations: [
    mdx(),
    sitemap({
      // Keep utility and duplicate pages out of the sitemap
      filter: (page) => !/\/(cart|success|shop-parts)\/?$/.test(page),
    }),
    vue(),
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});
