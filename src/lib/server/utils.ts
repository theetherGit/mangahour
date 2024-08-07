import { BASE_API } from '$env/static/private';

export const extendedFetch = async (fetch: any, url: string, timeout = 10000) => {
	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), timeout);

	const response = await fetch(`${BASE_API}${url}`, {
		headers:{
			"Content-Type": "application/json"
		},
		signal: controller.signal,
	});
	if (response.ok) {
		const jsonResponse = await response.json();
		if (jsonResponse) {
			clearTimeout(timeoutId);
			return jsonResponse;
		}
	}
	return false;
};
