import { extendedFetch } from '$lib/server/utils';

export const getMangaChapter = async (
	fetch: any,
	mangaId: string,
	mangaSlug: string,
	chapterId: string,
	chapterSlug: string
) => {
	const chapterData = await extendedFetch(
		fetch,
		`/manga/${mangaId}/${mangaSlug}/${chapterId}/${chapterSlug}`
	);
	if (chapterData) {
		return {
			chapter: chapterData.chapter,
			nextChapter: chapterData.next_chapter,
			prevChapter: chapterData.prev_chapter
		};
	}
	return {
		chapter: false,
		nextChapter: false,
		prevChapter: false
	};
};
