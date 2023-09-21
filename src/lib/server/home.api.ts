import { extendedFetch } from '$lib/server/utils';

export const getHomeApi = async () => {
	const homePage = await extendedFetch('/home');
	if (homePage) {
		return {
			latest: homePage.latestUpdates
		};
	}
	return {
		latest: homePage.latestUpdates
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
