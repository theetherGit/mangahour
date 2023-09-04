import {extendedFetch} from "$lib/server/utils";

export const getHomeApi = async () => {
    const homePage = await extendedFetch('/home');
    if (homePage) {
        return {
            latest: homePage.latestUpdates,
            topChaptersToday: homePage.topChaptersLast_24hr,
            topChaptersLastSixHours: homePage.topChaptersLast_6hr,
            topChaptersWeekly: homePage.topChaptersLast_7d,
            topMangaByBookmarks: homePage.topManga_bookmarks,
            topMangaByViews: homePage.topManga_views,
        }
    }
    return {
        latest: false,
        topChaptersToday: false,
        topChaptersLastSixHours: false,
        topChaptersWeekly: false,
        topMangaByBookmarks: false,
        topMangaByViews: false,
    }
};
