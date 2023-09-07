import type {RequestHandler} from "@sveltejs/kit";
import {json} from "@sveltejs/kit";
import {getMangaChapters} from "$lib/server/manga.api";

export const GET: RequestHandler = async ({url}) => {
    const id = url.searchParams.get('id') as string;
    const slug = url.searchParams.get('slug') as string;
    if (id && slug) {
        return json( {
            chapters: await getMangaChapters( id, slug )
        } )
    }
    return json( {chapters: false})
};
