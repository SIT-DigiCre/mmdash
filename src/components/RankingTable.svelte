<script lang="ts">
	type RankingTableProps = {
		data: {
			nickname: string;
			count: number;
			image?: string | null;
		}[];
		countLabel?: string;
		nameLabel?: string;
	};

	let {
		data,
		countLabel = 'リアクション数',
		nameLabel = 'ユーザー名'
	}: RankingTableProps = $props();
</script>

<div class="table-container">
	<table class="reaction-table">
		<thead>
			<tr>
				<th class="rank-header">順位</th>
				<th class="name-header">{nameLabel}</th>
				<th class="count-header">{countLabel}</th>
			</tr>
		</thead>
		<tbody>
			{#each data as item, index}
				<tr>
					<td class="rank-cell">{index + 1}</td>
					<td class="name-cell">
						{#if item.image}
							<img class="name-image" src={item.image} alt="" width="24" height="24" />
						{/if}
						<span class="name-text">{item.nickname}</span>
					</td>
					<td class="count-cell google-sans-flex">{item.count.toLocaleString()}</td>
				</tr>
			{/each}
			<tr>
				<td class="rank-cell">合計</td>
				<td class="name-cell"></td>
				<td class="count-cell google-sans-flex"
					>{data.reduce((acc, item) => acc + item.count, 0).toLocaleString()}</td
				>
			</tr>
		</tbody>
	</table>
</div>

<style>
	.table-container {
		border: 1px solid #000;
		border-radius: 0.5rem;
		background-color: #fff;
		overflow-x: scroll;
	}

	.reaction-table {
		width: 100%;
		table-layout: fixed;
		border-collapse: collapse;
		font-size: 1rem;
		font-feature-settings: initial;
	}

	.reaction-table thead {
		background-color: #000;
		color: #fff;
	}

	.reaction-table th {
		padding: 1rem 1.25rem;
		font-weight: 600;
		font-size: 0.875rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		border-bottom: 1px solid #000;
	}

	.reaction-table th:first-child {
		border-top-left-radius: 0.3rem;
	}

	.reaction-table th:last-child {
		border-top-right-radius: 0.3rem;
	}

	.rank-header {
		width: 5rem;
		text-align: start;
		white-space: nowrap;
	}

	.name-header {
		width: auto;
		text-align: start;
	}

	.count-header {
		width: 9rem;
		text-align: end;
		white-space: nowrap;
	}

	.reaction-table tbody tr {
		border-bottom: 1px solid #e5e5e5;
		transition: background-color 0.2s ease;
	}

	.reaction-table tbody tr:last-child {
		border-top: 2px double #000;
		border-bottom: none;
	}

	.reaction-table tbody tr:last-child td:first-child {
		border-end-start-radius: 0.5rem;
	}

	.reaction-table tbody tr:last-child td:last-child {
		border-end-end-radius: 0.5rem;
	}

	.reaction-table tbody tr:hover {
		background-color: #f5f5f5;
	}

	.reaction-table td {
		padding: 1rem 1.25rem;
		color: #000;
	}

	.rank-cell {
		text-align: center;
		font-weight: 600;
		color: #666;
	}

	.name-cell {
		font-weight: 500;
		overflow: hidden;
		white-space: nowrap;
	}

	.name-text {
		display: inline-block;
		max-width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		vertical-align: bottom;
	}

	.name-cell:has(.name-image) .name-text {
		max-width: calc(100% - 1.5rem - 0.5rem);
	}

	.naank-header {
		width: 3.5rem;
	}

	.count-header {
		width: 6.5rem;
	}

	.rme-image {
		width: 1.5rem;
		height: 1.5rem;
		margin-right: 0.5rem;
		vertical-align: -0.3rem;
		object-fit: contain;
	}

	.count-cell {
		text-align: right;
		font-size: 1.25rem;
	}

	@media (max-width: 640px) {
		.reaction-table th,
		.reaction-table td {
			padding: 0.75rem 0.875rem;
			font-size: 0.875rem;
		}

		.reaction-table .count-cell {
			font-size: 1rem;
		}
	}
</style>
