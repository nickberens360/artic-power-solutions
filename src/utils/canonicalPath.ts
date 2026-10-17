/**
 * Normalizes a page path to the site's canonical form: no ".html" suffix
 * (added by `build.format: 'file'`), no "/index", and no trailing slash.
 * "/blog.html" -> "/blog", "/index.html" -> "/", "/parts/" -> "/parts"
 */
export function canonicalPath(pathname: string): string {
  const path = pathname
    .replace(/\.html$/, '')
    .replace(/\/index$/, '')
    .replace(/\/+$/, '');
  return path === '' ? '/' : path;
}
