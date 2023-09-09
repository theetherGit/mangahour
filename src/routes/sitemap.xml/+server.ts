import { getTotalMangaPageCount } from '$lib/server/sitemap';

export async function GET() {
	const headers = {
		'Content-Type': 'application/xml',
		'Cache-Control': `public, max-age=0, s-maxage=${60 * 60 * 24 * 3}`
	};

	const pageCount = await getTotalMangaPageCount();

	const sitemapIndexPages = ['/sitemap.xml/static.xml'];

	for (let i = 1; i <= pageCount; i++) {
		sitemapIndexPages.push(`/sitemap.xml/manga-list/${i}.xml`);
	}

	const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
    <sitemapindex xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    ${sitemapIndexPages
			.map((page) => {
				return `
        <sitemap>
            <loc>https://mangahour.com${page}</loc>
            <lastmod>${new Date().toISOString()}</lastmod>
        </sitemap>`;
			})
			.join('')}
    </sitemapindex>`.trim();
	return new Response(sitemapIndex, { headers });
}
