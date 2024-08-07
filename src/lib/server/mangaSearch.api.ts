import { BASE_API } from '$env/static/private';

export const initialSearchParams = {
	includedGenres_all: [],
	includedLanguages: [],
	includedPubstatus: [],
	list_order: 'desc',
	list_type: 'added date',
	term: null
};

const headers = new Headers()
headers.append('Content-Type', 'application/json')

export async function advanceSearchManga(fetch:any, page: number, params = initialSearchParams) {
	const response = await fetch(`${BASE_API}/search/advanced/post?page=${page}`, {
		method: 'post',
		body: JSON.stringify(params),
		headers: headers
	});
	if (response.ok) {
		const jsonResponse = await response.json();
		if (jsonResponse) {
			return {
				data: jsonResponse.data,
				currentPage: jsonResponse.meta['current_page'],
				lastPage: jsonResponse.meta['last_page'],
				total: jsonResponse.meta['total']
			};
		}
	}
	return {
		data: false,
		currentPage: false,
		lastPage: false,
		total: 0
	};
}
