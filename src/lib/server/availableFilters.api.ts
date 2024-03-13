import { extendedFetch } from '$lib/server/utils';

export const getAllFilters = async (fetch: any) => {
	const filters = await extendedFetch(fetch, '/search/filter');
	if (filters) {
		return { ...filters, success: true };
	}
	return { success: false };
};
