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

const CHEMISTRY = { NiMH: 'Nickel-metal hydride (NiMH)', NiCd: 'Nickel-cadmium (NiCd)' };
const EQUIPMENT = { 'Roll Mover': 'RollMover™ roll pusher', 'Cart Mover': 'CartMover™ cart tugger' };

// Pull the facts already stated in MoverBattery's description into a structured spec sheet.
function buildSpecs(p) {
  const text = p.description ?? '';
  const match = (re) => text.match(re)?.[0];
  const chemistryKey = (p.categories ?? []).find((c) => CHEMISTRY[c]) ?? Object.keys(CHEMISTRY).find((k) => p.name.includes(k));
  const equipmentKey = (p.categories ?? []).find((c) => EQUIPMENT[c]);
  const range = text.match(/(-?\d+°C)\s*to\s*(-?\d+°C)/);
  const coldOnly = text.match(/down to (-\d+°C)/);
  const specs = [
    ['Appleton part', p.appletonPartNumber ? `#${p.appletonPartNumber}` : undefined],
    ['Fits', equipmentKey ? `Appleton ${EQUIPMENT[equipmentKey]} units that use battery #${p.appletonPartNumber}` : undefined],
    ['Voltage', p.voltage],
    ['Capacity', p.name.match(/\d+\s*mAh/i)?.[0]],
    ['Chemistry', chemistryKey ? CHEMISTRY[chemistryKey] : undefined],
    ['Cycle life', match(/\d[\d,]*\+\s*(charge\/discharge\s*)?cycles/i)?.replace(/charge\/discharge\s*/i, '')],
    ['Charge time', text.match(/\((\d+\s*-\s*\d+\s*hours)\)/)?.[1]],
    ['Operating temperature', range ? `${range[1]} to ${range[2]}` : coldOnly ? `Down to ${coldOnly[1]}` : undefined],
    ['Availability', typeof p.stock === 'number' ? (p.stock > 0 ? 'In stock' : 'Out of stock') : undefined],
  ];
  return specs.filter(([, v]) => v).map(([label, value]) => ({ label, value }));
}

// First sentence becomes the intro; the rest become a feature list.
function splitDescription(text = '') {
  const sentences = text.match(/[^.]+(\.(?!\d)|$)/g)?.map((s) => s.trim()).filter(Boolean) ?? [];
  return { intro: sentences[0] ?? '', features: sentences.slice(1) };
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
    stock: p.stock,
    specs: buildSpecs(p),
    ...splitDescription(p.description),
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
