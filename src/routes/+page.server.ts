import analyticsData from '$lib/data/analytics.json';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return analyticsData;
};

export const prerender = true;
