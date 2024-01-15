import { getHomeLayoutApi } from '$lib/server/home.layout.api';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({fetch}) => {
	return getHomeLayoutApi(fetch);
};
