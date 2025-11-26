import adapter from '@sveltejs/adapter-cloudflare-workers';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapter(),
		prerender: {
			handleHttpError: ({ path, status, referrer }) => {
				// プリレンダリング中の401エラーを無視（認証が必要なルートは後で動的に処理される）
				if (status === 401) {
					console.warn(`Skipping ${path} due to 401 error (authentication required)`);
					return;
				}
				// その他のエラーは通常通りエラーとして扱う
				throw new Error(`${status} ${path}${referrer ? ` (linked from ${referrer})` : ''}`);
			}
		}
	}
};

export default config;
