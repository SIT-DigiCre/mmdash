<script lang="ts">
	import { page } from '$app/state';

	const BUILD_TIME = import.meta.env.VITE_BUILD_TIME;
</script>

<header>
	<div class="header-top">
		<h1>mmdash</h1>
		{#if BUILD_TIME}
			<p class="update-date">
				<time datetime={BUILD_TIME}>
					{new Date(BUILD_TIME).toLocaleDateString('ja-JP', { timeZone: 'Asia/Tokyo', year: 'numeric', month: 'long', day: "numeric" })}
				</time> 更新
			</p>
		{/if}
	</div>
	<nav>
		<a href="/" aria-current={page.url.pathname === '/' ? 'page' : undefined}>ホーム</a>
		<a href="/posts" aria-current={page.url.pathname === '/posts' ? 'page' : undefined}>投稿数</a>
		<a href="/reaction" aria-current={page.url.pathname === '/reaction' ? 'page' : undefined}>リアクション数</a>
	</nav>
</header>

<style>
	header {
		max-width: 1000px;
		margin: 0 auto;
		padding: 1rem;
		background-color: #fff;
		z-index: 100;
		view-transition-name: header;
	}

	.header-top {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		margin-bottom: 1rem;
		gap: 1rem;
	}

	h1 {
		margin: 0;
		font-size: 2rem;
		font-weight: 700;
		color: #000;
	}

	.update-date {
		margin: 0;
		font-size: 0.875rem;
		color: #666;
		white-space: nowrap;
	}

	nav {
		display: flex;
		gap: 0.5rem;
	}

	nav a {
		padding: 0.25rem 0.5rem;
		border: 1px solid #000;
		border-radius: 0.25rem;
		background-color: #fff;
		color: #000;
		text-decoration: none;
		font-size: 0.75rem;
		transition: background-color 0.2s, color 0.2s;
	}

	nav a:hover {
		background-color: #000;
		color: #fff;
	}

	nav a[aria-current="page"] {
		background-color: #000;
		color: #fff;
	}
</style>

