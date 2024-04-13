import { db } from '$lib/db';
import { isFavouriteMangaUpdateCheckInProgress } from '$lib/utils';
import { get } from 'svelte/store';

const fetchUpdate = async (manga: any, totalFavManga: number, currentIndex: number) => {
	const response = await fetch(`/api/manga?id=${manga.id}&slug=${manga.slug}`);
	if (response.ok) {
		const manga = (await response.json()).manga;
		db.favouriteManga.update(manga.id.toString(), {
			lastUpdated: new Date(manga['last_chapter_created_at'])
		});
	}
	postMessage({type: 'status', payload: totalFavManga - currentIndex - 1 !== 0})
};

onmessage = async (e) => {
	const favManga = await db.favouriteManga.toArray();
	const totalFavManga = favManga.length
	if (totalFavManga) {
		postMessage({type: 'status', payload: true})
		for (const [index, manga] of favManga.entries()) {
			await fetchUpdate(manga, totalFavManga, index);
		}
	}
};
export {};
