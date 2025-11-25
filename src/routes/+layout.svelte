<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import type { LayoutProps } from './$types';

	let { children, data }: LayoutProps = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<h1>mmdash</h1>
<p>{data.currentDate} 更新</p>
<nav>
	<a href="/">ホーム</a>
	<a href="/reaction">リアクション数</a>
</nav>

{@render children()}
