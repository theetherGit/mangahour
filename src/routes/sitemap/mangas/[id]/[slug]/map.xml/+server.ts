import type { RequestHandler } from '@sveltejs/kit';
import { getMangaChapters } from '$lib/server/manga.api';

export const GET: RequestHandler = async ({ params, url }) => {
	const sitemapItems = [`/manga/${params.id}/${params.slug}`];
	const headers = {
		'Content-Type': 'application/xml',
		'Cache-Control': `public, s-maxage=${60 * 60 * 4}`
	};

	const chapters = await getMangaChapters(params.id as string, params.slug as string);
	chapters.forEach((chapter: any) => {
		sitemapItems.push(`/manga/${params.id}/${params.slug}/${chapter.id}/chapter-${chapter.slug}`);
	});
	const sitemap = `
    <?xml version="1.0" encoding="UTF-8" ?>
    <urlset
      xmlns="https://www.sitemaps.org/schemas/sitemap/0.9"
      xmlns:xhtml="https://www.w3.org/1999/xhtml"
      xmlns:mobile="https://www.google.com/schemas/sitemap-mobile/1.0"
      xmlns:news="https://www.google.com/schemas/sitemap-news/0.9"
      xmlns:image="https://www.google.com/schemas/sitemap-image/1.1"
      xmlns:video="https://www.google.com/schemas/sitemap-video/1.1"
    >
    ${sitemapItems
			.map((path) => {
				return `<url>
            <loc>${url.origin}${path}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        </url>`;
			})
			.join('')}
    </urlset>`.trim();

	return new Response(sitemap, { headers });
};
