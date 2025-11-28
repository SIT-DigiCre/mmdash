<script lang="ts">
import type { PageProps } from './$types';
import CardGrid from '../components/CardGrid.svelte';
import BarChart from '../components/BarChart.svelte';

let { data }: PageProps = $props();
</script>

<svelte:head>
  <title>統計データ | mmdash</title>
  <meta property="og:url" content="https://mmdash.digicre.workers.dev/" />
</svelte:head>

<h2>統計データ</h2>
<CardGrid cards={data.stats} />
<h2>日別投稿数</h2>
<BarChart data={data.postCountsDay} />
