import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

/**
 * Build-time social-share (og:image) PNGs for posts that use `heroCard`.
 * Same layout as src/components/HeroCard.astro, at 1200x630.
 */
const require = createRequire(import.meta.url);
const font = (weight: number) =>
	readFile(require.resolve(`@fontsource/inter/files/inter-latin-${weight}-normal.woff`));

export const getStaticPaths: GetStaticPaths = async () => {
	const posts = await getCollection('blog', (p) => Boolean(p.data.heroCard));
	return posts.map((post) => ({
		params: { slug: post.id.replace(/\.md$/, '') },
		props: { card: post.data.heroCard! },
	}));
};

type Card = NonNullable<CollectionEntry<'blog'>['data']['heroCard']>;
type Node = { type: string; props: Record<string, unknown> };
const h = (type: string, style: Record<string, unknown>, children?: unknown): Node => ({
	type,
	props: { style, children },
});

export const GET: APIRoute = async ({ props }) => {
	const { kicker, title, subtitle } = props.card as Card;
	const W = 1200;
	const H = 630;
	const u = W / 100; // 1cqi equivalent

	const body = h('div', { display: 'flex', flexDirection: 'column' }, [
		kicker && h('div', { color: '#e11414', fontSize: 2.7 * u, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.02em', marginBottom: 1.8 * u }, kicker),
		h('div', { color: '#fff', fontSize: 6.8 * u, fontWeight: 700, lineHeight: 1.08, letterSpacing: '-0.015em', maxWidth: 82 * u }, title),
		subtitle && h('div', { color: '#b3b8c4', fontSize: 3.1 * u, fontWeight: 500, lineHeight: 1.35, maxWidth: 76 * u, marginTop: 2 * u }, subtitle),
	].filter(Boolean));

	// Satori sizes boxes content-box style, so everything is positioned
	// absolutely inside a fixed W x H canvas (no outer padding/border).
	const tree = h(
		'div',
		{
			width: W,
			height: H,
			display: 'flex',
			position: 'relative',
			backgroundColor: '#1f222b',
			backgroundImage: `repeating-linear-gradient(45deg, transparent 0px, transparent ${1.1 * u}px, rgba(255,255,255,0.025) ${1.1 * u}px, rgba(255,255,255,0.025) ${2.2 * u}px)`,
			fontFamily: 'Inter',
		},
		[
			h('div', { position: 'absolute', left: 0, top: 0, width: 1.4 * u, height: H, backgroundColor: '#e11414' }),
			// Text block is vertically centred in the space above the brand line, so the card has no empty band.
			h('div', { position: 'absolute', left: 7.6 * u, right: 7.6 * u, top: 0, bottom: 10 * u, display: 'flex', alignItems: 'center' }, [body]),
			h('div', { position: 'absolute', left: 7.6 * u, bottom: 5 * u, color: '#fff', fontSize: 2.2 * u, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }, 'Artic Power Solutions'),
		],
	);

	const svg = await satori(tree as any, {
		width: W,
		height: H,
		fonts: await Promise.all(
			([500, 600, 700] as const).map(async (weight) => ({ name: 'Inter', data: await font(weight), weight, style: 'normal' as const })),
		),
	});
	const png = new Resvg(svg, { fitTo: { mode: 'width', value: W } }).render().asPng();

	return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
