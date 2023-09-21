import { db } from '$lib/db';

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
	const favManga = await db.favouriteManga.toArray();
	if (favManga.length) {
		for (const manga of favManga) {
			fetchUpdate(manga);
		}
	}
};
export {};
