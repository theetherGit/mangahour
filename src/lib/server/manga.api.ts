import { extendedFetch } from '$lib/server/utils';

export const getManga = async (id: string, slug: string) => {
	const mangaData = await extendedFetch(`/manga/${id}/${slug}`);
	if (mangaData) {
		return {
			suggestion: mangaData.best_to_read_next.manga,
			real: mangaData.main_manga
		};
	}
	return {
		suggestion: false,
		manga: false
	};
};

export const getMangaChapters = async (id: string, slug: string) => {
	const mangaChapterList = await extendedFetch(`/manga/${id}/${slug}/chapterlist`);
	if (mangaChapterList) {
		return mangaChapterList;
	}
	return false;
};
