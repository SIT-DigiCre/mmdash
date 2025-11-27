import reactionCountsData from '$lib/data/reaction-counts.json';
import weeklyReactionCountsData from '$lib/data/weekly-reaction-counts.json';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return { reactionCountsData, weeklyReactionCountsData };
};
