import { sveltekit } from '@sveltejs/kit/vite';
import { join } from 'path';
import { defineConfig } from 'vite';
import { partytownVite } from '@builder.io/partytown/utils';
import basicSsl from '@vitejs/plugin-basic-ssl'

export default defineConfig({
	plugins: [
		sveltekit(),
		partytownVite({
			// `dest` specifies where files are copied to in production
			dest: join(process.cwd(), 'static', '~partytown')
		})
	]
});
