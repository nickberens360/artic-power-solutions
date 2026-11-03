// Pings IndexNow (Bing, Yandex, Seznam, etc.) with the sitemap URLs whose built HTML changed
// since the last production deploy. Google doesn't use IndexNow; it relies on the sitemap.
// The key is public by design: it is served at /<key>.txt (public/e705c9c4ce1c2ec57adc5cbf05285259.txt).
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const KEY = 'e705c9c4ce1c2ec57adc5cbf05285259';
const HOST = 'articpowersolutions.com';
const MANIFEST = '.indexnow-manifest.json';

let changed = [];

// /blog → blog.html (build.format 'file'), / → index.html; falls back to directory format.
const htmlFor = (dist, url) => {
  const path = new URL(url).pathname.replace(/^\/|\/$/g, '') || 'index';
  return [join(dist, path + '.html'), join(dist, path, 'index.html')].find(existsSync);
};

export const onPostBuild = async ({ constants, utils }) => {
  if (process.env.CONTEXT !== 'production') return;
  const dist = constants.PUBLISH_DIR;
  const sitemap = join(dist, 'sitemap-0.xml');
  if (!existsSync(sitemap)) return console.log('IndexNow: no sitemap-0.xml, skipping');

  const urls = [...readFileSync(sitemap, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const hashes = {};
  for (const url of urls) {
    const file = htmlFor(dist, url);
    if (file) hashes[url] = createHash('sha256').update(readFileSync(file)).digest('hex');
  }

  await utils.cache.restore(MANIFEST);
  const previous = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, 'utf8')) : {};
  changed = Object.keys(hashes).filter((url) => hashes[url] !== previous[url]);
  writeFileSync(MANIFEST, JSON.stringify(hashes));
  await utils.cache.save(MANIFEST);
  console.log(`IndexNow: ${changed.length} of ${urls.length} URLs changed`);
};

// Runs only after the deploy is live, so the engines fetch the new version.
export const onSuccess = async () => {
  if (process.env.CONTEXT !== 'production' || changed.length === 0) return;
  try {
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList: changed }),
    });
    console.log(`IndexNow: submitted ${changed.length} URLs, HTTP ${res.status}`);
  } catch (err) {
    // Never fail a deploy over a ping.
    console.log(`IndexNow: submit failed: ${err.message}`);
  }
};
