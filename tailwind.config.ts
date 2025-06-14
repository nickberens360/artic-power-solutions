import type { Config } from 'tailwindcss';
console.log('tailwind.config.ts');

export default {
    content: [
        './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    ],
    theme: {
        extend: {
            colors: {
                accent: '#fc5252',
                'accent-dark': '#e52a2a',
                'custom-black': 'rgb(15, 18, 25)',
                'custom-gray': 'rgb(96, 115, 159)',
                'gray-light': 'rgb(229, 233, 240)',
                'gray-dark': 'rgb(34, 41, 57)',
                'body-bg': '#050a1c',
            },
            fontFamily: {
                sans: ['Atkinson', 'sans-serif'],
            },
            boxShadow: {
                custom: '0 2px 6px rgba(96, 115, 159, 25%), 0 8px 24px rgba(96, 115, 159, 33%), 0 16px 32px rgba(96, 115, 159, 33%)',
            },
        },
    },
    plugins: [],
} satisfies Config;
