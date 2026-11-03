// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import vue from '@astrojs/vue';
import tailwindcss from '@tailwindcss/vite';
import { readdirSync, readFileSync } from 'node:fs';

const SITE = 'https://articpowersolutions.com';

// Sitemap <lastmod> for blog posts, from frontmatter (updatedDate, else pubDate).
// Only pages with a real content date get one: Google ignores lastmod once it proves unreliable,
// so pages without a trustworthy date are left without it rather than stamped with the build date.
const BLOG_DIR = new URL('./src/content/blog/', import.meta.url);
const blogLastmod = new Map();
for (const file of readdirSync(BLOG_DIR).filter((f) => /\.mdx?$/.test(f))) {
  const frontmatter = readFileSync(new URL(file, BLOG_DIR), 'utf8').split(/^---\s*$/m)[1] ?? '';
  const field = (name) => frontmatter.match(new RegExp(`^${name}:\\s*['"]?([^'"\\n]+)`, 'm'))?.[1];
  const date = new Date(field('updatedDate') ?? field('pubDate') ?? '');
  if (!Number.isNaN(date.getTime())) blogLastmod.set(`${SITE}/blog/${file.replace(/\.mdx?$/, '')}`, date);
}
const newestPost = [...blogLastmod.values()].sort((a, b) => b - a)[0];
if (newestPost) blogLastmod.set(`${SITE}/blog`, newestPost);


// https://astro.build/config
export default defineConfig({
  site: SITE,

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
      serialize(item) {
        const lastmod = blogLastmod.get(item.url.replace(/\/$/, ''));
        return lastmod ? { ...item, lastmod: lastmod.toISOString() } : item;
      },
    }),
    vue(),
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});
