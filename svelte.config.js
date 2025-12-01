import adapter from '@sveltejs/adapter-cloudflare-workers';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter(),
		prerender: {
			handleHttpError: ({ path, status, referrer }) => {
				if (status === 401) {
					console.warn(`Skipping ${path} due to 401 error (authentication required)`);
					return;
				}
				throw new Error(`${status} ${path}${referrer ? ` (linked from ${referrer})` : ''}`);
			}
		}
	}
};

export default config;
