import {db} from "$lib/db";

onmessage = async (e) => {
    const favManga = await db.favouriteManga.toArray();
    if (favManga.length) {
        for (const manga of favManga) {
            const response = await fetch(`/api/manga?id=${manga.id}&slug=${manga.slug}`);
            if (response.ok) {
                const manga = (await response.json()).manga;
                db.favouriteManga.update(manga.id, {
                    lastUpdated: new Date(manga['last_chapter_created_at'])
                })
            }
        }
    }
};
export {}
