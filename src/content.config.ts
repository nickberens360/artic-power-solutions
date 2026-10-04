import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
	// Type-check frontmatter using a schema
	schema: ({ image }) => z.object({
		title: z.string(),
		description: z.string(),
		// Transform string to Date object
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		heroImage: image().optional(),
	}),
});

const parts = defineCollection({
	schema: ({ image }) => z.object({
		title: z.string(),
		// Plain-text summary used for meta description and part cards
		description: z.string(),
		category: z.enum(['Batteries', 'Chargers', 'Drive Wheels', 'Controls']),
		heroImage: image().optional(),
		// OEM / cross-reference part numbers this part replaces (great for search)
		partNumbers: z.array(z.string()).default([]),
		// Models this part fits, e.g. "RollMover SD"
		compatibleWith: z.array(z.string()).default([]),
		// Lower numbers sort first on /parts
		order: z.number().default(100),
	}),
});

export const collections = { blog, parts };
