import { advanceSearchManga } from '$lib/server/mangaSearch.api';
import { getAllFilters } from '$lib/server/availableFilters.api';
import { getHomeLayoutApi } from '$lib/server/home.layout.api';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({fetch}) => {
	return {
		trending: getHomeLayoutApi(fetch),
		result: advanceSearchManga(1),
		filters: getAllFilters(fetch)
	};
};
