import type { LayoutLoad } from './$types';
import { redirect } from '@sveltejs/kit';

// export const ssr = true;

export const load: LayoutLoad = async ({ url }) => {
	if (url.pathname === '/') {
		throw redirect(302, '/home');
	}
};
