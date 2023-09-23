import { getHomeLayoutApi } from '$lib/server/home.layout.api';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
	return getHomeLayoutApi();
};
