import type { LayoutServerLoad } from './$types';
import { getHomeLayoutApi } from '$lib/server/home.layout.api';

export const load: LayoutServerLoad = async () => {
	return getHomeLayoutApi();
};
