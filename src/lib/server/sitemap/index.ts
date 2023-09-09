import { BASE_API } from '$env/static/private';

export async function getTotalMangaPageCount() {
	const response = await fetch(`${BASE_API}/search/advanced/post?page=1`, {
		method: 'post',
		body: JSON.stringify({
			includedGenres_all: [],
			includedLanguages: [],
			includedPubstatus: [],
			list_order: 'desc',
			list_type: 'added date',
			term: null
		}),
		headers: { 'Content-Type': 'application/json' }
	});
	console.log(response.type);
	if (response.ok) {
		const jsonResponse = await response.json();
		if (jsonResponse) {
			return jsonResponse.meta['last_page'];
		}
	}
	return 99;
}

export async function getMangaListPageData(page: number) {
	const response = await fetch(`${BASE_API}/search/advanced/post?page=${page}`, {
		method: 'post',
		body: JSON.stringify({
			includedGenres_all: [],
			includedLanguages: [],
			includedPubstatus: [],
			list_order: 'desc',
			list_type: 'added date',
			term: null
		}),
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
