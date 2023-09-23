import { advanceSearchManga } from '$lib/server/mangaSearch.api';
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, url }) => {
	const filters = await request.json();
	const page = url.searchParams.get('page') ?? '1';
	const response = await advanceSearchManga(parseInt(page), filters);
	return json(response);
};
