import { getMangaChapter } from '$lib/server/chapter.api';
import type { PageServerLoad } from './$types';
import { getMangaChapters } from '$lib/server/manga.api';
export const load: PageServerLoad = async ({ params, fetch }) => {
	const chapterData = await getMangaChapter(fetch, params.id, params.slug, params.chapterId, params.chapterNumber)
	const streamed = {
		chapters: getMangaChapters(fetch, params.id, params.slug)
	}
	return {
		streamed,
		...chapterData,
		mangaId: params.id,
		mangaSlug: params.slug,
		chapterId: params.chapterId,
		chapterNumber: params.chapterNumber,
	};
};
