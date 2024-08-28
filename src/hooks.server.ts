import { type Handle, redirect } from '@sveltejs/kit';
import {userAgentFromString} from '@edge-runtime/user-agent';

export const handle: Handle = async ({ event, resolve }) => {
	if (event.url.pathname === '/dont-do-this-bad-thing') {
		return resolve(event)
	}

	const parser = userAgentFromString(event.request.headers.get('user-agent') || '');

	if (!parser.browser || !parser.browser.name) {
		return redirect(307, '/dont-do-this-bad-thing')
	}

	if (!parser.device || (!parser.device.vendor && !parser.device.model && !parser.device.type)) {
		return redirect(307, '/dont-do-this-bad-thing')
	}

	return resolve(event);
};