import { userAgentFromString } from '@edge-runtime/user-agent'
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ request }) => {
	const parser = userAgentFromString(request.headers.get('user-agent') || '');

	return {
		ua: request.headers.get('user-agent'),
		parser
	}
}