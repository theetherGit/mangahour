import type { LayoutLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: LayoutLoad = async (event ) => {
	if (!['/', '/favourite'].includes(event.url.pathname) ) {
		redirect(302, '/');
	}
};