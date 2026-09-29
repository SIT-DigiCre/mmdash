<script lang="ts">
	import type { PageProps } from './$types';
	import RankingTable from '../../components/RankingTable.svelte';

	let { data }: PageProps = $props();

	const total = $derived(
		data.emojiCountsData.emojiCountsList.map((item) => ({
			nickname: `:${item.name}:`,
			count: item.count,
			image: item.image
		}))
	);
	const weekly = $derived(
		data.weeklyEmojiCountsData.emojiCountsList.map((item) => ({
			nickname: `:${item.name}:`,
			count: item.count,
			image: item.image
		}))
	);
</script>

<svelte:head>
	<title>絵文字ランキング | mmdash</title>
	<meta property="og:url" content="https://mmdash.digicre.workers.dev/emojis" />
</svelte:head>

<h2>絵文字ランキング</h2>
<p>公開チャンネルにおける投稿のみを対象としています。累計・先週それぞれ上位50件です。</p>
<div class="reaction-table-container">
	<div class="reaction-table-container-item">
		<div class="reaction-table-container-item-header">
			<h3 id="total">累計</h3>
			<a href="#weekly">先週を見る</a>
		</div>
		<RankingTable data={total} countLabel="回数" nameLabel="絵文字" />
	</div>
	<div class="reaction-table-container-item">
		<div class="reaction-table-container-item-header">
			<h3 id="weekly">先週</h3>
			<a href="#total">累計を見る</a>
		</div>
		<RankingTable data={weekly} countLabel="回数" nameLabel="絵文字" />
	</div>
</div>

<style>
	.reaction-table-container {
		display: flex;
		flex-direction: row;
		gap: 1rem;
	}

	.reaction-table-container-item {
		flex: 1;
	}

	.reaction-table-container-item-header {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}

	.reaction-table-container-item-header a {
		display: none;
		font-size: 0.75rem;
		color: #000;
		text-decoration: underline;
		text-decoration-color: color-mix(in srgb, currentcolor, transparent 40%);
		text-underline-offset: 0.25em;
	}

	.reaction-table-container-item-header a:hover {
		color: #666;
	}

	.reaction-table-container-item-header a:hover {
		text-decoration: underline;
	}

	h3 {
		background-color: #fff;
		z-index: 90;
		margin: 0;
		padding: 1rem 0;
		line-height: 1rem;
		text-align: center;
	}

	@media (max-width: 640px) {
		.reaction-table-container {
			flex-direction: column;
		}

		.reaction-table-container-item-header {
			justify-content: space-between;
			margin: 0 1rem;
		}

		.reaction-table-container-item-header a {
			display: block;
		}
	}
</style>
