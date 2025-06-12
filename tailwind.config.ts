import type { Config } from 'tailwindcss';
console.log('tailwind.config.ts');

export default {
    content: [
        './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    ],
    theme: {
        extend: {},
    },
    plugins: [],
} satisfies Config;