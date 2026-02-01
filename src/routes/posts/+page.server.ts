import postCountsData from '$lib/data/post-counts.json';
import weeklyPostCountsData from '$lib/data/weekly-post-counts.json';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return { postCountsData, weeklyPostCountsData };
};
