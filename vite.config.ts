import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	ssr: {
		external: ['@mattermost/client']
	},
	optimizeDeps: {
		include: ['@mattermost/client']
	}
});
