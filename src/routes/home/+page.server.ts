import type { PageServerLoad } from './$types';
import { getHomeApi } from '$lib/server/home.api';

export const load: PageServerLoad = async () => {
	return {
		home: getHomeApi()
	};
};
