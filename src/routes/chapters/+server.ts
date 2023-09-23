import { getMangaChapters } from '$lib/server/manga.api';
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url }) => {
	const id = url.searchParams.get('id') as string;
	const slug = url.searchParams.get('slug') as string;
	if (id && slug) {
		return json({
			chapters: await getMangaChapters(id, slug)
		});
	}
	return json({ chapters: false });
};
