import emojiCountsData from '$lib/data/emoji-counts.json';
import weeklyEmojiCountsData from '$lib/data/weekly-emoji-counts.json';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return { emojiCountsData, weeklyEmojiCountsData };
};
