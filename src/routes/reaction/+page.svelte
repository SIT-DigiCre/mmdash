<script lang="ts">
import type { PageProps } from '../reaction/$types';
import ReactionTable from "../../components/ReactionTable.svelte";

let { data }: PageProps = $props();
</script>

<h2>リアクション数ランキング</h2>
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
  .reaction-table-container {
    display: flex;
    flex-direction: row;
    gap: 1rem;
  }

  .reaction-table-container-item {
    flex: 1;
  }

  h3 {
    background-color: #fff;
    z-index: 90;
    margin: 0 auto;
    padding: 1rem 0;
    line-height: 1rem;
    text-align: center;
  }

  @media (max-width: 640px) {
    .reaction-table-container {
      flex-direction: column;
    }
  }
</style>
