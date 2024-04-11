import { db } from '$lib/db';
import { isFavouriteMangaUpdateCheckInProgress } from '$lib/utils';

const fetchUpdate = async (manga: any) => {
	const response = await fetch(`/api/manga?id=${manga.id}&slug=${manga.slug}`);
	if (response.ok) {
		const manga = (await response.json()).manga;
		db.favouriteManga.update(manga.id.toString(), {
			lastUpdated: new Date(manga['last_chapter_created_at'])
		});
	}
};

onmessage = async (e) => {
	isFavouriteMangaUpdateCheckInProgress.set(true)
	const favManga = await db.favouriteManga.toArray();
	if (favManga.length) {
		for (const manga of favManga) {
			await fetchUpdate(manga);
		}
	}
	isFavouriteMangaUpdateCheckInProgress.set(false)
};
export {};
