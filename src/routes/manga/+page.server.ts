import { advanceSearchManga } from '$lib/server/mangaSearch.api';
import { getAllFilters } from '$lib/server/availableFilters.api';
import { getHomeLayoutApi } from '$lib/server/home.layout.api';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return {
		trending: getHomeLayoutApi(),
		result: advanceSearchManga(1),
		filters: getAllFilters()
	};
};
