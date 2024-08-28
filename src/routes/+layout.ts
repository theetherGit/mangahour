import type { LayoutLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: LayoutLoad = async (event ) => {
	if (event.url.pathname === '/') {
		redirect(302, '/home');
	}
};