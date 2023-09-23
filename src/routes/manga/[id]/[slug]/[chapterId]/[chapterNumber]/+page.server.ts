import { getMangaChapter } from '$lib/server/chapter.api';
import type { PageServerLoad } from './$types';
export const load: PageServerLoad = ({ params }) => {
	return getMangaChapter(params.id, params.slug, params.chapterId, params.chapterNumber);
};
