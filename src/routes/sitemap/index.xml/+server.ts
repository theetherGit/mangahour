import { getTotalMangaPageCount } from '$lib/server/sitemap';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url }) => {
	const headers = {
		'Content-Type': 'application/xml',
		'Cache-Control': `public, s-maxage=${60 * 60 * 24 * 2}`
	};

	const pageCount = await getTotalMangaPageCount();

	const sitemapIndexPages = ['/sitemap/static.xml'];

	for (let i = 1; i <= pageCount; i++) {
		sitemapIndexPages.push(`/sitemap/mangas/page-${i}-index.xml`);
	}

	const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
    <sitemapindex xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" targetNamespace="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${sitemapIndexPages
			.map((page) => {
				return `
        <sitemap>
            <loc>${url.origin}${page}</loc>
            <lastmod>${new Date().toISOString()}</lastmod>
        </sitemap>`;
			})
			.join('')}
    </sitemapindex>`.trim();
	return new Response(sitemapIndex, { headers });
};
