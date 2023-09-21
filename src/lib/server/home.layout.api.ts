import { extendedFetch } from '$lib/server/utils';

export const getHomeLayoutApi = async () => {
	const homePage = await extendedFetch('/home');
	if (homePage) {
		return {
			topChaptersToday: homePage.topChaptersLast_24hr,
			topChaptersLastSixHours: homePage.topChaptersLast_6hr,
			topChaptersWeekly: homePage.topChaptersLast_7d,
			topMangaByBookmarks: homePage.topManga_bookmarks,
			topMangaByViews: homePage.topManga_views
		};
	}
	return {
		topChaptersToday: false,
		topChaptersLastSixHours: false,
		topChaptersWeekly: false,
		topMangaByBookmarks: false,
		topMangaByViews: false
	};
};

export const getLatestChapters = async () => {
	const homePage = await extendedFetch('/home');
	if (homePage) {
		return {
			latest: homePage.latestUpdates
		};
	}
	return {
		latest: false
	};
};
