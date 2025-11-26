import analyticsData from '$lib/analytics.json';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return analyticsData;
};

export const prerender = true;
