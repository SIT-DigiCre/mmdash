<script lang="ts">
import type { PageProps } from '../reaction/$types';

let { data }: PageProps = $props();
</script>

<h2>リアクション数ランキング</h2>
<table>
  <thead>
    <tr>
      <th>ユーザー名</th>
      <th>リアクション数</th>
    </tr>
  </thead>
  <tbody>
    {#each data.reactionCountsList as item}
      <tr>
        <td>{item.nickname}</td>
        <td>{item.count}</td>
      </tr>
    {/each}
  </tbody>
</table>
