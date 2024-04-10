import { getMangaChapter } from '$lib/server/chapter.api';
import type { PageServerLoad } from './$types';
export const load: PageServerLoad = async ({ params, fetch }) => {
	return await getMangaChapter(fetch, params.id, params.slug, params.chapterId, params.chapterNumber);
};
