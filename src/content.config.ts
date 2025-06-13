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

// New collection for Parts
const parts = defineCollection({
	schema: ({ image }) => z.object({
		title: z.string(),
		partNumber: z.string(),
		description: z.string(),
		heroImage: image().optional(),
	}),
});

export const collections = { blog, parts };