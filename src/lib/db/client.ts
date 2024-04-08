import Dexie, { type Table } from 'dexie';
import type {
	lastReadMangaChapter,
	favouriteManga,
	mangaChapterReadHistory
} from './dbSchemaInterfaces';

export class MyMangaDB extends Dexie {
	lastReadMangaChapter!: Table<lastReadMangaChapter>;
	favouriteManga!: Table<favouriteManga>;
	mangaChapterReadHistory!: Table<mangaChapterReadHistory>;

	constructor() {
		super('myMangaHistory.db');
		this.version(4).stores({
			lastReadMangaChapter: '&id, mangaSlug, chapterSlug, chapterId, chapterNumber',
			favouriteManga: '&id, name, image, description, slug, lastUpdated',
			mangaChapterReadHistory: '&id, *chapters'
		});
	}
}

export const db = new MyMangaDB();
