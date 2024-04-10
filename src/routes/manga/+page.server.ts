import { advanceSearchManga } from '$lib/server/mangaSearch.api';
import { getAllFilters } from '$lib/server/availableFilters.api';
import { getHomeLayoutApi } from '$lib/server/home.layout.api';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	const [trending, result, filters] = await Promise.all([
		getHomeLayoutApi(fetch),
		advanceSearchManga(fetch, 1),
		getAllFilters(fetch)
	]);
	return { trending, result, filters };
};
