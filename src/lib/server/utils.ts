import { BASE_API } from '$env/static/private';

export const extendedFetch = async (url: string, timeout = 2000) => {
	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), timeout);

	const response = await fetch(`${BASE_API}${url}`, {
		signal: controller.signal
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
