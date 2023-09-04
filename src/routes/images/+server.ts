import type { RequestHandler } from "@sveltejs/kit";
import {getImage} from "$lib/server/image.api";

export const GET: RequestHandler = async ({url, setHeaders}) => {
    const type = url.searchParams.get('type') as string;
    const mangaId = url.searchParams.get('id') as string;
    const slug = url.searchParams.get('slug') as string;
    if (!slug) {
        return fetch('https://cdn.mangahour.com/Untitled%20design.png')
    }

    // setHeaders({
    //     'cache-control': 'public, immutable, no-transform, max-age=31536000'
    // });

    return getImage(type, mangaId, slug)
};
