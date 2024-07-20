import { getMangaChapters } from '$lib/server/manga.api';
import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ params, fetch }) => {
	if (params.id && params.slug) {
		return {
			// streamed: {
				chapters: await getMangaChapters(fetch, params.id, params.slug)
			// },
		};
	} else redirect(302, '/home');
};
