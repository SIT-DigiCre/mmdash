<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import type { LayoutProps } from './$types';
	import Header from '../components/Header.svelte';

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

<Header />

<main>
{@render children()}
</main>

<style>
  :global(body) {
    margin: 0;
  }
  
	main {
		max-width: 1000px;
		margin: 0 auto;
		padding: 2rem 1rem;
	}
</style>
