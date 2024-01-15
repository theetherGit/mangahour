import type { RequestHandler } from '@sveltejs/kit';
import { extendedFetch } from '$lib/server/utils';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({fetch}) => {
	const { data } = await extendedFetch(fetch,'/home/show-more?page=2');
	return json({
		data
	});
};
