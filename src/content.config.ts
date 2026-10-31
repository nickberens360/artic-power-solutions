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
		heroAlt: z.string().optional(),
		// Live-text hero card (rendered as HTML; og:image PNG generated at build)
		heroCard: z
			.object({
				kicker: z.string().optional(),
				title: z.string(),
				subtitle: z.string().optional(),
			})
			.optional(),
		author: z.string().default('Jim Motz'),
	}),
});

export const collections = { blog };
