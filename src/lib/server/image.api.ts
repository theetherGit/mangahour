import { BASE_STORAGE_ENDPOINT } from '$env/static/private';

// https://resize-image.ethercorps.workers.dev/?image=${BASE_STORAGE_ENDPOINT}${imageEndpoint}

export const getImage = async (type: string, id: string, slug: string) => {
	const imageEndpoint = `/uploads/${type}/${id}/${slug}`;
	return fetch(`${BASE_STORAGE_ENDPOINT}${imageEndpoint}`);
};
