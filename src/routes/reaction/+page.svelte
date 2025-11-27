<script lang="ts">
import type { PageProps } from '../reaction/$types';
import ReactionTable from "../../components/ReactionTable.svelte";

let { data }: PageProps = $props();
</script>

<h2 class="page-title">リアクション数ランキング</h2>
<ReactionTable data={data.reactionCountsList} />

<style>
  .page-title {
    font-size: 1.75rem;
    font-weight: 600;
    margin: 0 0 1.5rem 0;
    color: #000;
    letter-spacing: -0.02em;
  }

  @media (max-width: 640px) {
    .page-title {
      font-size: 1.5rem;
      margin-bottom: 1rem;
    }
  }
</style>
