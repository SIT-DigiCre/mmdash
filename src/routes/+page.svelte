<script lang="ts">
import type { PageProps } from './$types';
import CardGrid from '../components/CardGrid.svelte';
import BarChart from '../components/BarChart.svelte';

let { data }: PageProps = $props();
</script>

<svelte:head>
  <title>mmdash</title>
  <meta name="description" content="https://mm.digicre.net のダッシュボード" />
  <meta property="og:title" content="mmdash" />
  <meta property="og:description" content="https://mm.digicre.net のダッシュボード" />
  <meta property="og:image" content="https://mmdash.digicre.workers.dev/opengraph-image.png" />
  <meta property="og:url" content="https://mmdash.digicre.workers.dev" />
  <meta property="og:type" content="website" />
  <meta property="og:locale" content="ja_JP" />
  <meta property="og:site_name" content="mmdash" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="mmdash" />
  <meta name="twitter:description" content="https://mm.digicre.net のダッシュボード" />
  <meta name="twitter:image" content="https://mmdash.digicre.workers.dev/opengraph-image.png" />
</svelte:head>
<h1>mmdash</h1>
<p>{data.currentDate} 更新</p>
<h2>統計データ</h2>
<CardGrid cards={data.stats} />
<h2>日別投稿数</h2>
<BarChart data={data.postCountsDay} />
