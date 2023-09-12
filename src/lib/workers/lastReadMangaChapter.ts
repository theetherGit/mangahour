import {db} from "$lib/db";

onmessage = async (e) => {
    const {type, payload} = e.data;

    if (type === 'get') {
        const payloadData = await db.lastReadMangaChapter.get(payload.id)
        postMessage({
            type,
            payload: { manga: payloadData }
        })
    }

    if ( type === 'bulk' ) {
        const payloadData = new Map();
        const allReadHistory = await db.lastReadMangaChapter.each( (manga) => {
            payloadData.set(manga.id, manga)
        });

        postMessage({
            type,
            payload: payloadData
        })
    }

    if (type === 'add') {
        db.lastReadMangaChapter.add(payload)
    }

    if (type === 'put') {
        db.lastReadMangaChapter.put(payload)
    }

    if (type === 'delete') {
        await db.lastReadMangaChapter.delete(payload.id)
    }
};
