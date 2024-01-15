import { extendedFetch } from '$lib/server/utils';

export const getHomeApi = async (fetch: any) => {
	const homePage = await extendedFetch(fetch,'/home');
	if (homePage) {
		return {
			latest: homePage.latestUpdates
		};
	}
	return {
		latest: homePage.latestUpdates
	};
};
