import type { PageServerLoad } from './$types';
import pkg from '@mattermost/client';
import { MM_USERNAME, MM_PASSWORD } from '$env/static/private';
const { Client4 } = pkg;

export const load: PageServerLoad = async () => {
	const client = new Client4();
	client.setUrl('https://mm.digicre.net');
	await client.login(MM_USERNAME, MM_PASSWORD);
	const team = await client.getTeamByName('digicre');

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
	return { team, stats, postCountsDay, currentDate };
};
