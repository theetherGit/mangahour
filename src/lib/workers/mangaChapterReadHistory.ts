import { db } from '$lib/db';

onmessage = async (e) => {
	const { type, payload } = e.data;

	if (type === 'add') {
		db.mangaChapterReadHistory.add(payload);
	}

	if (type === 'put') {
		db.mangaChapterReadHistory.put(payload);
	}

	if (type === 'get') {
		const payloadData = await db.mangaChapterReadHistory.get(payload.id);
		postMessage({
			type,
			payload: {
				manga: payloadData
			}
		});
	}

	if (type === 'delete') {
		await db.mangaChapterReadHistory.delete(payload.id);
	}
};
