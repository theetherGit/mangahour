import type { RequestHandler } from '@sveltejs/kit';
import { getMangaListPageData } from '$lib/server/sitemap';
import { getMangaChapters } from '$lib/server/manga.api';

export const GET: RequestHandler = async ({ params, url }) => {
	const sitemapItems = [];
	const headers = {
		'Content-Type': 'application/xml',
		'Cache-Control': `public, max-age=0, s-maxage=${60 * 60 * 6}`
	};
	const mangaList = await getMangaListPageData(parseInt(params.id as string));

	for (const manga of mangaList) {
		sitemapItems.push(`/manga/${manga.id}/${manga.slug}`);
		const chapters = await getMangaChapters(manga.id, manga.slug);
		chapters.forEach((chapter: any) => {
			sitemapItems.push(`/manga/${manga.id}/${manga.slug}/${chapter.id}/chapter-${chapter.slug}`);
		});
	}
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
