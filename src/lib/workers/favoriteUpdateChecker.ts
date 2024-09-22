import { db } from '$lib/db';

const fetchUpdate = async (manga: any, currentIndex: number) => {
	const response = await fetch(`/api/manga?id=${manga.id}&slug=${manga.slug}`);
	if (response.ok) {
		const manga = (await response.json()).manga;
		db.favouriteManga.update(manga.id.toString(), {
			lastUpdated: new Date(manga['last_chapter_created_at'])
		});
	}
	return currentIndex
};

onmessage = async (e) => {
	const favManga = await db.favouriteManga.toArray();
	const totalFavManga = favManga.length
	if (totalFavManga) {
		const updateGroup = []
		postMessage({type: 'status', payload: true})
		for (const [index, manga] of favManga.entries()) {
			 updateGroup.push(fetchUpdate(manga, index));
		}
		const resolved = await Promise.all(updateGroup); // check what to do with resolved
		postMessage({type: 'status', payload: false})
		postMessage({type: 'last_fav_check_timestamp', payload: 'IDC'})
	}
};
export {};
