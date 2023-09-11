onmessage = async (e) => {
    const {db} = await import("$lib/db");
    const {type, payload} = e.data;

    if (type === 'add') {
        db.favouriteManga.add(payload)
    }

    if (type === 'put') {
        db.favouriteManga.put(payload)
    }

    if (type === 'get') {
        const payloadData = await db.favouriteManga.get(payload.id);
        postMessage({
            type,
            payload: { manga: payloadData }
        })
    }

    if (type === 'delete') {
        await db.favouriteManga.delete(payload.id)
    }
};
