import type { RequestHandler } from '@sveltejs/kit';
import { getChapterImages } from '$lib/server/image.api';

export const GET: RequestHandler = async ({ url, fetch }) => {
	const type = url.searchParams.get('type') as string;
	const mangaId = url.searchParams.get('id') as string;
	const slug = url.searchParams.get('slug') as string;
	if (!slug) {
		return fetch('https://cdn.mangahour.com/Untitled%20design.png');
	}

	// setHeaders({
	//     'cache-control': 'public, immutable, no-transform, max-age=31536000'
	// });

	return getChapterImages(fetch, type, mangaId, slug);
};
