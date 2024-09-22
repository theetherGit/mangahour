import { getHomeLayoutApi } from '$lib/server/home.layout.api';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ fetch }) => {
	// return await getHomeLayoutApi(fetch);
	return {
		topChaptersToday: false,
		topChaptersLastSixHours: false,
		topChaptersWeekly: false,
		topMangaByBookmarks: false,
		topMangaByViews: false
	}
};
