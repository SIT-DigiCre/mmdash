import reactionCountsData from '$lib/reaction-counts.json';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return reactionCountsData;
};
