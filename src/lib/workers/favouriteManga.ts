import { db } from '$lib/db';

onmessage = async (e) => {
	const { type, payload } = e.data;

	if (type === 'get') {
		const payloadData = await db.favouriteManga.get(payload.id);
		postMessage({
			type,
			payload: { manga: payloadData }
		});
	}

	if (type === 'bulk') {
		const payloadData = new Map();
		const allFavManga = await db.favouriteManga.each((manga) => {
			payloadData.set(manga.id, manga);
		});

		postMessage({
			type,
			payload: payloadData
		});
	}

	if (type === 'add') {
		db.favouriteManga.add(payload);
	}

	if (type === 'put') {
		db.favouriteManga.put(payload);
	}

	if (type === 'delete') {
		db.favouriteManga.delete(payload.id);
	}
};
