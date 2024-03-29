import type { RequestHandler } from '@sveltejs/kit';
import { extendedFetch } from '$lib/server/utils';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url, fetch }) => {
	const term = url.searchParams.get('query');
	if (term && term.length > 2) {
		const responseData = await extendedFetch(fetch, `/search?term=${term}`);

		if (responseData) {
			return json({
				results: responseData.data
			});
		}
	}
	return json({
		results: []
	});
};
