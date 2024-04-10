import { getManga, getMangaChapters } from '$lib/server/manga.api';
import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, fetch }) => {
	const id = params.id;
	const slug = params.slug;
	if (id && slug) {
		return {
			streamed: {
				chapters: getMangaChapters(fetch, id, slug)
			},
			manga: await getManga(fetch, id, slug)
		};
	} else redirect(302, '/home');
};
