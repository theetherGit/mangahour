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
		this.version(1).stores({
			lastReadMangaChapter: '&id, chapterNumber, chapterSlug, chapterId',
			favouriteManga: '&id, name, image, description, slug',
			mangaChapterReadHistory: '&id, *chapters'
		});
	}
}

export const db = new MyMangaDB();

db.open().catch(function (err) {
	console.error (err.stack || err);
});
