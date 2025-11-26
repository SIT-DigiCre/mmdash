import pkg from '@mattermost/client';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

dotenv.config();

const { Client4 } = pkg;

const REQUIRED_ENV_VARS = ['MM_USERNAME', 'MM_PASSWORD'] as const;
const missingEnv = REQUIRED_ENV_VARS.filter((name) => !process.env[name]);
if (missingEnv.length) {
	console.error(`Missing required environment variables: ${missingEnv.join(', ')}`);
	process.exit(1);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUTPUT_PATH = path.resolve(__dirname, '../src/lib/analytics.json');
const BASE_URL = process.env.MM_BASE_URL ?? 'https://mm.digicre.net';
const TEAM_NAME = process.env.MM_TEAM_NAME ?? 'digicre';

type AnalyticsData = {
	team: {
		id: string;
		name: string;
		display_name?: string;
	};
	stats: Array<{
		name: string;
		value: number;
	}>;
	postCountsDay: Array<{
		name: string;
		value: number;
	}>;
	currentDate: string;
};

async function fetchAnalytics(): Promise<AnalyticsData> {
	const client = new Client4();
	client.setUrl(BASE_URL);
	await client.login(process.env.MM_USERNAME!, process.env.MM_PASSWORD!);

	const team = await client.getTeamByName(TEAM_NAME);
	console.log(`Team: ${team.display_name ?? team.name}`);

	const currentDate = new Date().toISOString().split('T')[0];

	const analytics = await client.getAnalytics();
	const channelCount = analytics
		.filter((a) => a.name.startsWith('channel_'))
		.reduce((acc, curr) => acc + curr.value, 0);
	const postCount = analytics.find((a) => a.name === 'post_count')?.value ?? 0;
	const uniqueUserCount = analytics.find((a) => a.name === 'unique_user_count')?.value ?? 0;
	const dailyActiveUsers = analytics.find((a) => a.name === 'daily_active_users')?.value ?? 0;
	const monthlyActiveUsers = analytics.find((a) => a.name === 'monthly_active_users')?.value ?? 0;
	const postCountsDay = await client.getAnalytics('post_counts_day');

	const stats = [
		{ name: '総チャンネル数', value: channelCount },
		{ name: '総投稿数', value: postCount },
		{ name: '有効ユーザー数', value: uniqueUserCount },
		{ name: '日次アクティブユーザー数', value: dailyActiveUsers },
		{ name: '月次アクティブユーザー数', value: monthlyActiveUsers }
	];

	return {
		team: {
			id: team.id,
			name: team.name,
			display_name: team.display_name
		},
		stats,
		postCountsDay,
		currentDate
	};
}

async function main() {
	try {
		const data = await fetchAnalytics();
		await mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
		await writeFile(OUTPUT_PATH, JSON.stringify(data, null, 2), 'utf8');
		console.log(`Saved analytics data to ${OUTPUT_PATH}`);
		console.log(`Stats: ${data.stats.length} items`);
		console.log(`Post counts day: ${data.postCountsDay.length} items`);
	} catch (error) {
		console.error('Failed to fetch analytics:', error);
		process.exit(1);
	}
}

main();

