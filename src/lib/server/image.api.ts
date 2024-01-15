import {BASE_STORAGE_ENDPOINT, CHAPTER_IMAGES_ENDPOINT} from '$env/static/private';

export const getImage = async (fetch: any, type: string, id: string, slug: string) => {
	const imageEndpoint = `/uploads/${type}/${id}/${slug}`;
	return fetch(`${BASE_STORAGE_ENDPOINT}${imageEndpoint}`);
};

export const getChapterImages = async (fetch: any, type: string, id: string, slug: string) => {
	const imageEndpoint = `/${type}/${id}/${slug}`;
	return fetch(`${CHAPTER_IMAGES_ENDPOINT}${imageEndpoint}`);
};
