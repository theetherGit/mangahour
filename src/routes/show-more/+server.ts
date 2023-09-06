import type { RequestHandler } from '@sveltejs/kit';
import { extendedFetch } from '$lib/server/utils';
import { json } from '@sveltejs/kit';

export let GET: RequestHandler = async ({ url }) => {
	const { data } = await extendedFetch('/home/show-more?page=2');
	return json({
		data
	});
};
