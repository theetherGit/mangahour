import {BASE_STORAGE_ENDPOINT} from "$env/static/private";

export const getImage = async (type: string, id: string, slug: string) => {
    const imageEndpoint = `/uploads/${type}/${id}/${slug}`;
    return fetch(`https://resize-image.ethercorps.workers.dev/?image=${BASE_STORAGE_ENDPOINT}${imageEndpoint}`)
};
