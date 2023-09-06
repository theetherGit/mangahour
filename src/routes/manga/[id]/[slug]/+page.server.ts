import type { PageServerLoad } from './$types';
import { getManga, getMangaChapters } from '$lib/server/manga.api';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const id = params.id;
	const slug = params.slug;
	if (id && slug) {
		return {
			streamed: {
				chapters: getMangaChapters(id, slug),
			},
			manga: getManga(id, slug)
		};
	} else throw redirect(302, '/home');
};
