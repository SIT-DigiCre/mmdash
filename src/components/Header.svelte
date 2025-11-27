<script lang="ts">
	import { page } from '$app/state';

	const updateDate = new Date().toISOString().split('T')[0];
</script>

<header>
	<div class="header-top">
		<h1>mmdash</h1>
		<p class="update-date">{updateDate} 更新</p>
	</div>
	<nav>
		<a href="/" aria-current={page.url.pathname === '/' ? 'page' : undefined}>ホーム</a>
		<a href="/reaction" aria-current={page.url.pathname === '/reaction' ? 'page' : undefined}>リアクション数</a>
	</nav>
</header>

<style>
	header {
		max-width: 1000px;
		margin: 0 auto;
		padding: 1rem;
		position: sticky;
		top: 0;
		background-color: #fff;
		z-index: 100;
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

