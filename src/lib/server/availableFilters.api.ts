import { extendedFetch } from '$lib/server/utils';

export const getAllFilters = async () => {
    const filters = await extendedFetch('/search/filter');
    if (filters) {
        return { ...filters, success: true };
    }
    return { success: false };
};
