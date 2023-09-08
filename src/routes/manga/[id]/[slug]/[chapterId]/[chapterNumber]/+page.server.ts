import type { PageServerLoad } from './$types';
import { getMangaChapter } from '$lib/server/chapter.api';
export const load: PageServerLoad = ({ params }) => {
	return getMangaChapter(params.id, params.slug, params.chapterId, params.chapterNumber);
};
