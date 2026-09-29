import pkg from '@mattermost/client';
import type { Channel as MMChannel } from '@mattermost/types/channels';
import type { Post as MMPost } from '@mattermost/types/posts';
import type { UserProfile } from '@mattermost/types/users';
import dotenv from 'dotenv';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import emojiFilenames from './emoji-filenames.json' with { type: 'json' };

dotenv.config();

const { Client4 } = pkg;

type Channel = Pick<MMChannel, 'id' | 'name' | 'type'>;
type Profile = Pick<UserProfile, 'id' | 'nickname'>;
type Reaction = NonNullable<NonNullable<MMPost['metadata']>['reactions']>[number];
type EmojiCount = { name: string; count: number; image: string | null };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REACTION_OUTPUT_PATH = path.resolve(__dirname, '../src/lib/data/reaction-counts.json');
const WEEKLY_REACTION_OUTPUT_PATH = path.resolve(
	__dirname,
	'../src/lib/data/weekly-reaction-counts.json'
);
const POST_COUNTS_OUTPUT_PATH = path.resolve(__dirname, '../src/lib/data/post-counts.json');
const WEEKLY_POST_COUNTS_OUTPUT_PATH = path.resolve(
	__dirname,
	'../src/lib/data/weekly-post-counts.json'
);
const EMOJI_OUTPUT_PATH = path.resolve(__dirname, '../src/lib/data/emoji-counts.json');
const WEEKLY_EMOJI_OUTPUT_PATH = path.resolve(
	__dirname,
	'../src/lib/data/weekly-emoji-counts.json'
);
const EMOJI_IMAGE_DIR = path.resolve(__dirname, '../static/emoji');
const BASE_URL = process.env.MM_BASE_URL ?? 'https://mm.digicre.net';
const TEAM_NAME = process.env.MM_TEAM_NAME ?? 'digicre';
const MAX_CHANNELS = Number(process.env.MM_MAX_CHANNELS ?? 500);
const SYSTEM_EMOJI_FILENAMES = emojiFilenames as Record<string, string>;

/**
 * 前週の月曜0時から日曜24時までの期間を日本時間で取得
 */
function getWeeklyWindowJST(): { start: number; end: number } {
	const JST_OFFSET_MS = 9 * 60 * 60 * 1000; // UTCとの時差9時間
	const now = Date.now();
	const nowJST = now + JST_OFFSET_MS;
	const dayOfWeek = new Date(nowJST).getUTCDay();
	const daysToMonday = dayOfWeek === 0 ? 1 : dayOfWeek === 1 ? 0 : dayOfWeek - 1;
	const currentWeekMondayJST = new Date(nowJST);
	currentWeekMondayJST.setUTCDate(currentWeekMondayJST.getUTCDate() - daysToMonday);
	currentWeekMondayJST.setUTCHours(0, 0, 0, 0);
	// 前週の月曜日を取得（現在の週の月曜日から7日引く）
	const mondayJST = new Date(currentWeekMondayJST);
	mondayJST.setUTCDate(mondayJST.getUTCDate() - 7);
	const sundayJST = new Date(mondayJST);
	sundayJST.setUTCDate(mondayJST.getUTCDate() + 6);
	sundayJST.setUTCHours(23, 59, 59, 999);
	const start = mondayJST.getTime() - JST_OFFSET_MS;
	const end = sundayJST.getTime() - JST_OFFSET_MS;
	return { start, end };
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchRankings() {
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
	const emojiCounts: Record<string, number> = {};
	const weeklyEmojiCounts: Record<string, number> = {};
	const postCounts: Record<string, number> = {};
	const weeklyPostCounts: Record<string, number> = {};
	let processedChannels = 0;
	for (const channel of channelList) {
		const posts: { id: string; user_id: string; create_at: number; reactions: Reaction[] }[] = [];
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
					user_id: post.user_id ?? '',
					create_at: post.create_at ?? 0,
					reactions: (post.metadata?.reactions ?? []) as Reaction[]
				}))
			);

			if (newPosts.length < 200) {
				break;
			}
			postsPage++;
			await sleep(150);
		}
		console.log(`Channel '${channel.name.slice(0, 8)}...' total posts ${posts.length}`);

		for (const post of posts) {
			for (const reaction of post.reactions) {
				const userId = reaction.user_id;
				reactionCounts[userId] = (reactionCounts[userId] ?? 0) + 1;

				const emojiName = reaction.emoji_name;
				if (emojiName) {
					emojiCounts[emojiName] = (emojiCounts[emojiName] ?? 0) + 1;
				}

				const createdAt = reaction.create_at ?? 0;
				if (createdAt >= start && createdAt <= end) {
					weeklyReactionCounts[userId] = (weeklyReactionCounts[userId] ?? 0) + 1;
					if (emojiName) {
						weeklyEmojiCounts[emojiName] = (weeklyEmojiCounts[emojiName] ?? 0) + 1;
					}
				}
			}
			if (post.user_id) {
				postCounts[post.user_id] = (postCounts[post.user_id] ?? 0) + 1;
				if (post.create_at >= start && post.create_at <= end) {
					weeklyPostCounts[post.user_id] = (weeklyPostCounts[post.user_id] ?? 0) + 1;
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

	const postCountsList = Object.entries(postCounts)
		.map(([userId, count]) => ({
			userId,
			nickname: profileMap.get(userId) ?? '',
			count
		}))
		.sort((a, b) => b.count - a.count);

	const weeklyPostCountsList = Object.entries(weeklyPostCounts)
		.map(([userId, count]) => ({
			userId,
			nickname: profileMap.get(userId) ?? '',
			count
		}))
		.sort((a, b) => b.count - a.count);

	const emojiCountsList = topEmojiCounts(emojiCounts);
	const weeklyEmojiCountsList = topEmojiCounts(weeklyEmojiCounts);
	await attachEmojiImages(client, emojiCountsList, weeklyEmojiCountsList);

	return {
		reactionCountsList,
		weeklyReactionCountsList,
		postCountsList,
		weeklyPostCountsList,
		emojiCountsList,
		weeklyEmojiCountsList
	};
}

function topEmojiCounts(counts: Record<string, number>): EmojiCount[] {
	return Object.entries(counts)
		.map(([name, count]) => ({ name, count, image: null }))
		.sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

/**
 * 上位絵文字の画像を Mattermost から取得し、static/emoji に保存する。
 * システム絵文字は認証不要。カスタム絵文字の画像 API は認証が必要なので、ここで同梱する。
 */
async function attachEmojiImages(
	client: InstanceType<typeof Client4>,
	...lists: EmojiCount[][]
): Promise<void> {
	const entries = new Map<string, EmojiCount[]>();
	for (const list of lists) {
		for (const entry of list) {
			const group = entries.get(entry.name) ?? [];
			group.push(entry);
			entries.set(entry.name, group);
		}
	}

	const customNames = [...entries.keys()].filter((name) => !SYSTEM_EMOJI_FILENAMES[name]);
	const customIds = new Map<string, string>();
	// /api/v4/emoji/names は一度に 200 件まで
	const EMOJI_NAMES_BATCH_SIZE = 200;
	for (let i = 0; i < customNames.length; i += EMOJI_NAMES_BATCH_SIZE) {
		const batch = customNames.slice(i, i + EMOJI_NAMES_BATCH_SIZE);
		try {
			const customEmojis = await client.getCustomEmojisByNames(batch);
			for (const emoji of customEmojis) {
				customIds.set(emoji.name, emoji.id);
			}
		} catch (error) {
			console.error(
				`Failed to resolve custom emoji ids (${i + 1}-${i + batch.length}/${customNames.length}):`,
				error
			);
		}
	}

	await mkdir(EMOJI_IMAGE_DIR, { recursive: true });
	await mkdir(path.join(EMOJI_IMAGE_DIR, 'custom'), { recursive: true });

	for (const [name, group] of entries) {
		const systemFilename = SYSTEM_EMOJI_FILENAMES[name];
		const customId = customIds.get(name);
		const imagePath = systemFilename
			? `/emoji/${systemFilename}.png`
			: customId
				? `/emoji/custom/${customId}.png`
				: null;
		for (const entry of group) {
			entry.image = imagePath;
		}
		if (!imagePath) {
			console.warn(`No image for emoji '${name}'`);
			continue;
		}

		const url = systemFilename
			? `${BASE_URL}/static/emoji/${systemFilename}.png`
			: client.getCustomEmojiImageUrl(customId!);
		const filePath = path.join(EMOJI_IMAGE_DIR, imagePath.slice('/emoji/'.length));
		try {
			const response = await fetch(url, {
				headers: customId ? { Authorization: `Bearer ${client.getToken()}` } : {}
			});
			if (!response.ok) {
				throw new Error(`HTTP ${response.status}`);
			}
			await writeFile(filePath, Buffer.from(await response.arrayBuffer()));
		} catch (error) {
			console.error(`Failed to download emoji '${name}' from ${url}:`, error);
			for (const entry of group) {
				entry.image = null;
			}
		}
	}
}

async function main() {
	try {
		const {
			reactionCountsList,
			weeklyReactionCountsList,
			postCountsList,
			weeklyPostCountsList,
			emojiCountsList,
			weeklyEmojiCountsList
		} = await fetchRankings();
		const dataDir = path.dirname(REACTION_OUTPUT_PATH);
		await mkdir(dataDir, { recursive: true });

		const reactionTotalData = { reactionCountsList };
		const reactionWeeklyData = { reactionCountsList: weeklyReactionCountsList };
		const postTotalData = { postCountsList };
		const postWeeklyData = { postCountsList: weeklyPostCountsList };
		const emojiTotalData = { emojiCountsList };
		const emojiWeeklyData = { emojiCountsList: weeklyEmojiCountsList };

		await writeFile(REACTION_OUTPUT_PATH, JSON.stringify(reactionTotalData, null, 2), 'utf8');
		await writeFile(
			WEEKLY_REACTION_OUTPUT_PATH,
			JSON.stringify(reactionWeeklyData, null, 2),
			'utf8'
		);
		await writeFile(POST_COUNTS_OUTPUT_PATH, JSON.stringify(postTotalData, null, 2), 'utf8');
		await writeFile(
			WEEKLY_POST_COUNTS_OUTPUT_PATH,
			JSON.stringify(postWeeklyData, null, 2),
			'utf8'
		);
		await writeFile(EMOJI_OUTPUT_PATH, JSON.stringify(emojiTotalData, null, 2), 'utf8');
		await writeFile(WEEKLY_EMOJI_OUTPUT_PATH, JSON.stringify(emojiWeeklyData, null, 2), 'utf8');

		console.log(
			`Saved ${reactionCountsList.length} total reaction entries to ${REACTION_OUTPUT_PATH}`
		);
		console.log(
			`Saved ${weeklyReactionCountsList.length} weekly reaction entries to ${WEEKLY_REACTION_OUTPUT_PATH}`
		);
		console.log(`Saved ${postCountsList.length} total post entries to ${POST_COUNTS_OUTPUT_PATH}`);
		console.log(
			`Saved ${weeklyPostCountsList.length} weekly post entries to ${WEEKLY_POST_COUNTS_OUTPUT_PATH}`
		);
		console.log(`Saved ${emojiCountsList.length} total emoji entries to ${EMOJI_OUTPUT_PATH}`);
		console.log(
			`Saved ${weeklyEmojiCountsList.length} weekly emoji entries to ${WEEKLY_EMOJI_OUTPUT_PATH}`
		);
	} catch (error) {
		console.error('Failed to fetch rankings:', error);
		process.exit(1);
	}
}

main();
