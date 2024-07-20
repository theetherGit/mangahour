import { getMangaChapter } from '$lib/server/chapter.api';
import type { PageServerLoad } from './$types';
export const load: PageServerLoad = async ({ params, fetch }) => {
	const chapterData = await getMangaChapter(fetch, params.id, params.slug, params.chapterId, params.chapterNumber)
	return {
		...chapterData,
		mangaId: params.id,
		mangaSlug: params.slug,
		chapterId: params.chapterId,
		chapterNumber: params.chapterNumber,
	};
};
