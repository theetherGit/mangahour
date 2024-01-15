import { getMangaChapter } from '$lib/server/chapter.api';
import type { PageServerLoad } from './$types';
export const load: PageServerLoad = ({ params, fetch }) => {
	return getMangaChapter(fetch, params.id, params.slug, params.chapterId, params.chapterNumber);
};
