// Product catalog sourced from MoverBattery (moverbattery.com), our battery storefront.
// Products are fetched at build time and mapped into the same shape the existing
// Shopify-based components expect (ProductCard, PartPost, parts pages), so no UI changes are needed.
// If the API is unreachable, we fall back to the committed snapshot so the build never fails.
import snapshot from '../data/moverbattery-products.json';

export const STORE_ORIGIN = 'https://moverbattery.com';
const API_URL = `${STORE_ORIGIN}/api/products`;

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function escapeHtml(text = '') {
  return text.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
}

function toProduct(p) {
  const imageUrl = p.image ? `${STORE_ORIGIN}${encodeURI(p.image)}` : null;
  const price = { amount: p.price, currencyCode: 'USD' };
  return {
    id: p.id,
    title: p.name,
    handle: slugify(p.name),
    description: p.description,
    descriptionHtml: `<p>${escapeHtml(p.description)}</p>`,
    priceRange: { minVariantPrice: price },
    variants: { edges: [] },
    images: { edges: imageUrl ? [{ node: { url: imageUrl, altText: p.name } }] : [] },
    // MoverBattery-specific fields
    partNumber: p.appletonPartNumber,
    note: p.note,
    voltage: p.voltage,
    categories: p.categories ?? [],
    buyUrl: `${STORE_ORIGIN}/product/${p.id}`,
  };
}

export async function getAllProducts() {
  let raw = snapshot;
  try {
    const res = await fetch(API_URL, { signal: AbortSignal.timeout(10000) });
    if (!res.ok) throw new Error(`status ${res.status}`);
    const data = await res.json();
    if (Array.isArray(data) && data.length) raw = data;
  } catch (error) {
    console.warn(`MoverBattery API unavailable (${error.message}); using bundled product snapshot.`);
  }
  return raw.map(toProduct);
}
