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

const REQUIRED_ENV_VARS = ['MM_USERNAME', 'MM_PASSWORD'] as const;
const missingEnv = REQUIRED_ENV_VARS.filter((name) => !process.env[name]);
if (missingEnv.length) {
	console.error(`Missing required environment variables: ${missingEnv.join(', ')}`);
	process.exit(1);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUTPUT_PATH = path.resolve(__dirname, '../src/lib/data/reaction-counts.json');
const BASE_URL = process.env.MM_BASE_URL ?? 'https://mm.digicre.net';
const TEAM_NAME = process.env.MM_TEAM_NAME ?? 'digicre';
const MAX_CHANNELS = Number(process.env.MM_MAX_CHANNELS ?? 500);

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
		const newChannels = (await client.getAllChannels(
			channelsPage,
			200,
			undefined,
			false,
			false,
			false,
			false,
			false,
			false
		)) as Channel[];
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
		const newProfiles = (await client.getProfiles(profilesPage, 200)) as Profile[];
		console.log(`Fetched profiles page ${profilesPage} (${newProfiles.length})`);
		profiles.push(...newProfiles);
		if (newProfiles.length < 200) {
			break;
		}
		profilesPage++;
	}

	const profileMap = new Map(profiles.map((profile) => [profile.id, profile.nickname ?? '']));

	const reactionCounts: Record<string, number> = {};
	let processedChannels = 0;
	for (const channel of channelList) {
		const posts: { id: string; reactions: Reaction[] }[] = [];
		let postsPage = 0;
		while (true) {
			const response = await client.getPosts(channel.id, postsPage, 200);
			const newPosts = Object.values(response.posts ?? {});
			console.log(`Channel '${channel.name}' posts page ${postsPage} (${newPosts.length})`);
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
		console.log(`Channel '${channel.name}' total posts ${posts.length}`);

		for (const post of posts) {
			for (const reaction of post.reactions) {
				reactionCounts[reaction.user_id] = (reactionCounts[reaction.user_id] ?? 0) + 1;
			}
		}

		processedChannels++;
		if (processedChannels >= MAX_CHANNELS) {
			break;
		}
		await sleep(200);
	}

	const reactionCountsList = Object.entries(reactionCounts)
		.map(([userId, count]) => ({
			userId,
			nickname: profileMap.get(userId) ?? '',
			count
		}))
		.sort((a, b) => b.count - a.count);

	return { team, reactionCountsList };
}

async function main() {
	try {
		const data = await fetchReactionCounts();
		await mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
		await writeFile(OUTPUT_PATH, JSON.stringify(data, null, 2), 'utf8');
		console.log(`Saved ${data.reactionCountsList.length} entries to ${OUTPUT_PATH}`);
	} catch (error) {
		console.error('Failed to fetch reaction counts:', error);
		process.exit(1);
	}
}

main();
