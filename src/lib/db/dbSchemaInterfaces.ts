export interface lastReadMangaChapter {
	id: string; // Manga Id
	mangaSlug: string;
	chapterSlug: string;
	chapterId: string;
	chapterNumber: string;
}

export interface favouriteManga {
	id: string; // Manga Id
	name: string;
	image: string;
	description: string;
	slug: string;
	lastUpdated: Date;
}

export interface mangaChapterReadHistory {
	id: string; // Manga Id
	chapters: Array<string>;
}

interface mangaChapterReadHistoryChapters {
	id: string;
	slug: string;
	number: string;
}
