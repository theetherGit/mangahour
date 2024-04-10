import { BASE_API } from '$env/static/private';
import { initialSearchParams } from '$lib/server/mangaSearch.api';

export async function getTotalMangaPageCount(fetch: any) {
	const response = await fetch(`${BASE_API}/search/advanced/post?page=1`, {
		method: 'post',
		body: JSON.stringify(initialSearchParams),
		headers: { 'Content-Type': 'application/json' }
	});
	if (response.ok) {
		const jsonResponse = await response.json();
		if (jsonResponse) {
			return jsonResponse.meta['last_page'];
		}
	}
	return 99;
}

export async function getMangaListPageData(fetch: any, page: number) {
	const response = await fetch(`${BASE_API}/search/advanced/post?page=${page}`, {
		method: 'post',
		body: JSON.stringify(initialSearchParams),
		headers: { 'Content-Type': 'application/json' }
	});
	if (response.ok) {
		const jsonResponse = await response.json();
		if (jsonResponse) {
			return jsonResponse.data;
		}
	}
	return [];
}
