import type { RequestHandler } from '@sveltejs/kit';
import { getManga } from '$lib/server/manga.api';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url }) => {
	const data = await getManga(
		url.searchParams.get('id') as string,
		url.searchParams.get('slug') as string
	);

	if (data.real) {
		return json({
			manga: data.real
		});
	}

	return json({
		manga: false
	});
};
