<script lang="ts">
import type { PageProps } from '../reaction/$types';
import ReactionTable from "../../components/ReactionTable.svelte";

let { data }: PageProps = $props();
</script>

<h2 class="page-title">リアクション数ランキング</h2>
<p>公開チャンネルにおける投稿のみを対象としています。</p>
<div class="reaction-table-container">
  <div class="reaction-table-container-item">
    <h3>累計</h3>
    <ReactionTable data={data.reactionCountsData.reactionCountsList} />
  </div>
  <div class="reaction-table-container-item">
    <h3>先週</h3>
    <ReactionTable data={data.weeklyReactionCountsData.reactionCountsList} />
  </div>
</div>

<style>
  .page-title {
    font-size: 1.75rem;
    font-weight: 600;
    margin: 0 0 1.5rem 0;
    color: #000;
    letter-spacing: -0.02em;
  }

  .reaction-table-container {
    display: flex;
    flex-direction: row;
    gap: 1rem;
  }

  .reaction-table-container-item {
    flex: 1;
  }

  @media (max-width: 640px) {
    .page-title {
      font-size: 1.5rem;
      margin-bottom: 1rem;
    }

    .reaction-table-container {
      flex-direction: column;
    }
  }
</style>
