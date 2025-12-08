import pkg from '@mattermost/client';
import type { Channel as MMChannel } from '@mattermost/types/channels';
import type { Post as MMPost } from '@mattermost/types/posts';
import type { UserProfile } from '@mattermost/types/users';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

dotenv.config();

const { Client4 } = pkg;

type Channel = Pick<MMChannel, 'id' | 'name' | 'type'>;
type Profile = Pick<UserProfile, 'id' | 'nickname'>;
type Reaction = NonNullable<NonNullable<MMPost['metadata']>['reactions']>[number];

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUTPUT_PATH = path.resolve(__dirname, '../src/lib/data/reaction-counts.json');
const WEEKLY_OUTPUT_PATH = path.resolve(__dirname, '../src/lib/data/weekly-reaction-counts.json');
const BASE_URL = process.env.MM_BASE_URL ?? 'https://mm.digicre.net';
const TEAM_NAME = process.env.MM_TEAM_NAME ?? 'digicre';
const MAX_CHANNELS = Number(process.env.MM_MAX_CHANNELS ?? 500);

/**
 * 直近の月曜0時から日曜24時までの期間を日本時間で取得
 */
function getWeeklyWindowJST(): { start: number; end: number } {
	const JST_OFFSET_MS = 9 * 60 * 60 * 1000; // UTCとの時差9時間
	const now = Date.now();
	const nowJST = now + JST_OFFSET_MS;
	const dayOfWeek = new Date(nowJST).getUTCDay();
	const daysToMonday = dayOfWeek === 0 ? 1 : dayOfWeek === 1 ? 0 : dayOfWeek - 1;
	const mondayJST = new Date(nowJST);
	mondayJST.setUTCDate(mondayJST.getUTCDate() - daysToMonday);
	mondayJST.setUTCHours(0, 0, 0, 0);
	const sundayJST = new Date(mondayJST);
	sundayJST.setUTCDate(mondayJST.getUTCDate() + 6);
	sundayJST.setUTCHours(23, 59, 59, 999);
	const start = mondayJST.getTime() - JST_OFFSET_MS;
	const end = sundayJST.getTime() - JST_OFFSET_MS;
	return { start, end };
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchReactionCounts() {
	const client = new Client4();
	client.setUrl(BASE_URL);
	await client.login(process.env.MM_USERNAME!, process.env.MM_PASSWORD!);

	const team = await client.getTeamByName(TEAM_NAME);
	console.log(`Team: ${team.display_name ?? team.name}`);

	const channels: Channel[] = [];
	let channelsPage = 0;
	while (true) {
		const newChannels = await client.getAllChannels(
			channelsPage,
			200,
			undefined,
			false,
			false,
			false,
			false,
			false,
			false
		);
		console.log(`Fetched channels page ${channelsPage} (${newChannels.length})`);
		channels.push(...newChannels);
		if (newChannels.length < 200) {
			break;
		}
		channelsPage++;
	}

	const channelList = channels
		.filter((channel) => channel.type === 'O')
		.map((channel) => ({
			id: channel.id,
			name: channel.name
		}));
	console.log(`Public channels: ${channelList.length}`);

	const profiles: Profile[] = [];
	let profilesPage = 0;
	while (true) {
		const newProfiles = await client.getProfiles(profilesPage, 200);
		console.log(`Fetched profiles page ${profilesPage} (${newProfiles.length})`);
		profiles.push(...newProfiles);
		if (newProfiles.length < 200) {
			break;
		}
		profilesPage++;
	}

	const profileMap = new Map(profiles.map((profile) => [profile.id, profile.nickname ?? '']));

	const { start, end } = getWeeklyWindowJST();
	const reactionCounts: Record<string, number> = {};
	const weeklyReactionCounts: Record<string, number> = {};
	let processedChannels = 0;
	for (const channel of channelList) {
		const posts: { id: string; reactions: Reaction[] }[] = [];
		let postsPage = 0;
		while (true) {
			const response = await client.getPosts(channel.id, postsPage, 200);
			const newPosts = Object.values(response.posts ?? {});
			console.log(
				`Channel '${channel.name.slice(0, 8)}...' posts page ${postsPage} (${newPosts.length})`
			);
			posts.push(
				...newPosts.map((post) => ({
					id: post.id,
					reactions: (post.metadata?.reactions ?? []) as Reaction[]
				}))
			);

			if (newPosts.length < 200) {
				break;
			}
			postsPage++;
			await sleep(200);
		}
		console.log(`Channel '${channel.name.slice(0, 8)}...' total posts ${posts.length}`);

		for (const post of posts) {
			for (const reaction of post.reactions) {
				const userId = reaction.user_id;
				reactionCounts[userId] = (reactionCounts[userId] ?? 0) + 1;

				const createdAt = reaction.create_at ?? 0;
				if (createdAt >= start && createdAt <= end) {
					weeklyReactionCounts[userId] = (weeklyReactionCounts[userId] ?? 0) + 1;
				}
			}
		}

		processedChannels++;
		if (processedChannels >= MAX_CHANNELS) {
			break;
		}
	}

	const reactionCountsList = Object.entries(reactionCounts)
		.map(([userId, count]) => ({
			userId,
			nickname: profileMap.get(userId) ?? '',
			count
		}))
		.sort((a, b) => b.count - a.count);

	const weeklyReactionCountsList = Object.entries(weeklyReactionCounts)
		.map(([userId, count]) => ({
			userId,
			nickname: profileMap.get(userId) ?? '',
			count
		}))
		.sort((a, b) => b.count - a.count);

	return { reactionCountsList, weeklyReactionCountsList };
}

async function main() {
	try {
		const { reactionCountsList, weeklyReactionCountsList } = await fetchReactionCounts();
		await mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
		const totalData = { reactionCountsList };
		const weeklyData = { reactionCountsList: weeklyReactionCountsList };

		await writeFile(OUTPUT_PATH, JSON.stringify(totalData, null, 2), 'utf8');
		await writeFile(WEEKLY_OUTPUT_PATH, JSON.stringify(weeklyData, null, 2), 'utf8');

		console.log(`Saved ${reactionCountsList.length} total entries to ${OUTPUT_PATH}`);
		console.log(`Saved ${weeklyReactionCountsList.length} weekly entries to ${WEEKLY_OUTPUT_PATH}`);
	} catch (error) {
		console.error('Failed to fetch reaction counts:', error);
		process.exit(1);
	}
}

main();
