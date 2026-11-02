// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = 'Artic Power Solutions';
export const SITE_DESCRIPTION = 'Compatible replacement batteries for Appleton RollMover™ and CartMover™ equipment, matched by part number and shipped nationwide, even after a denied warranty claim.';
export const SITE_URL = 'https://articpowersolutions.com';
export const CONTACT_EMAIL = 'sales@articpowersolutions.com';
// Shipping terms used in Product structured data (matches MoverBattery checkout: UPS Ground, $30 per pack).
// Return policy is intentionally not published in structured data until one is defined.
export const SHIPPING = {
    carrier: 'UPS Ground',
    ratePerItem: '30.00',
    currency: 'USD',
    country: 'US',
};
// Analytics + search engine verification (rendered by src/components/Analytics.astro).
// Leave a value empty to turn that piece off.
export const ANALYTICS = {
    // Google Analytics 4 > Admin > Data streams > Web > Measurement ID, e.g. 'G-XXXXXXXXXX'
    GA4_MEASUREMENT_ID: '',
    // Google Search Console > Add property (URL prefix) > HTML tag: just the content="..." value
    GOOGLE_SITE_VERIFICATION: '',
    // Bing Webmaster Tools > Add site > HTML Meta Tag: just the content="..." value
    BING_SITE_VERIFICATION: '',
};
// Feature Flags
export const FEATURE_FLAGS = {
    SHOW_BLOG: true,           // Controls visibility of blog section
    ENABLE_SHOP: false,         // Controls e-commerce functionality
    SHOW_ABOUT_SECTION: true,  // Controls visibility of about section
    ENABLE_CONTACT_FORM: true, // Controls contact form functionality
    SHOW_SERVICES: true,       // Controls visibility of services section
};
