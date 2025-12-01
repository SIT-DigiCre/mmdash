<script lang="ts">
  import { onNavigate } from '$app/navigation';
	import type { LayoutProps } from './$types';
	import favicon from '$lib/assets/favicon.svg';
	import Header from '../components/Header.svelte';
	import BackToTop from '../components/BackToTop.svelte';
	import Footer from '../components/Footer.svelte';

	let { children }: LayoutProps = $props();

   onNavigate((navigation) => {
    if (!document.startViewTransition) return;

    return new Promise((resolve) => {
      document.startViewTransition(async () => {
        resolve();
        await navigation.complete;
      });
	 });
	});
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
<Footer />
<BackToTop />

<style>
  @font-face {
    font-family: "LINE Seed JP";
    src: url("/fonts/LINESeedJP_OTF_Rg.woff2") format("woff2");
    font-weight: 400;
    font-style: normal;
  }

  @font-face {
    font-family: "LINE Seed JP";
    src: url("/fonts/LINESeedJP_OTF_Bd.woff2") format("woff2");
    font-weight: 800;
    font-style: normal;
  }

  :global(html) {
    scroll-behavior: smooth;
  }

  :global(body) {
    font-family: "LINE Seed JP", sans-serif;
    font-optical-sizing: auto;
    font-weight: 400;
    font-style: normal;
    font-variation-settings:
      "slnt" 0,
      "wdth" 100,
      "GRAD" 0,
      "ROND" 0;
    margin: 0;
    box-sizing: border-box;
  }

  :global(h2) {
    font-size: 1.75rem;
    line-height: 1;
    font-weight: 800;
    margin: 1.5rem 0 1rem 0;
    padding: 0;
    color: #000;
    letter-spacing: -0.02em;
  }

  :global(.google-sans-flex) {
    font-family: "Google Sans Flex", sans-serif;
    font-optical-sizing: auto;
    font-weight: 700;
    font-style: normal;
    font-variation-settings:
      "slnt" 0,
      "wdth" 100,
      "GRAD" 0,
      "ROND" 0;
    font-variant-numeric: tabular-nums;
  }
  
	main {
		max-width: 1000px;
		margin: 0 auto 3rem;
		padding: 0 1rem;
	}

  @keyframes fade-in {
    from {
      opacity: 0;
    }
  }

  @keyframes fade-out {
    to {
      opacity: 0;
    }
  }

  @keyframes slide-from-right {
    from {
      transform: translateX(30px);
    }
  }

  @keyframes slide-to-left {
    to {
      transform: translateX(-30px);
    }
  }

  :root::view-transition-old(root) {
    animation:
      90ms cubic-bezier(0.4, 0, 1, 1) both fade-out,
      300ms cubic-bezier(0.4, 0, 0.2, 1) both slide-to-left;
  }

  :root::view-transition-new(root) {
    animation:
      210ms cubic-bezier(0, 0, 0.2, 1) 90ms both fade-in,
      300ms cubic-bezier(0.4, 0, 0.2, 1) both slide-from-right;
  }
</style>
