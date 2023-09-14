import type { RequestHandler } from '@sveltejs/kit';
import { getMangaListPageData } from '$lib/server/sitemap';

export const GET: RequestHandler = async ({ params, url }) => {
    const mangaListPageIndexItems = [];
    const headers = {
        'Content-Type': 'application/xml',
        'Cache-Control': `public, s-maxage=${60 * 60 * 24}`
    };
    const mangaList = await getMangaListPageData(parseInt(params.number as string));

    for (const manga of mangaList) {
        mangaListPageIndexItems.push(`/sitemap/mangas/${manga.id}/${manga.slug}/map.xml`);
    }
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <sitemapindex xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" targetNamespace="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${mangaListPageIndexItems
                .map((page) => {
                    return `
            <sitemap>
                <loc>${url.origin}${page}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        </sitemap>`;
})
.join('')}
</sitemapindex>`.trim();

    return new Response(sitemap, { headers });
};
