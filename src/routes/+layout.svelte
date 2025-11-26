<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>mmdash</title>
  <meta name="description" content="https://mm.digicre.net のダッシュボード" />
  <meta property="og:title" content="mmdash" />
  <meta property="og:description" content="https://mm.digicre.net のダッシュボード" />
  <meta property="og:image" content="https://mmdash.digicre.workers.dev/opengraph-image.png" />
  <meta property="og:type" content="website" />
  <meta property="og:locale" content="ja_JP" />
  <meta property="og:site_name" content="mmdash" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="mmdash" />
  <meta name="twitter:description" content="https://mm.digicre.net のダッシュボード" />
  <meta name="twitter:image" content="https://mmdash.digicre.workers.dev/opengraph-image.png" />
</svelte:head>

<h1>mmdash</h1>
<p>{new Date().toISOString().split('T')[0]} 更新</p>
<nav>
	<a href="/">ホーム</a>
	<a href="/reaction">リアクション数</a>
</nav>

{@render children()}
