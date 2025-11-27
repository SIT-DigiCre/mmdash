<script lang="ts">
  type ReactionTableProps = {
    data: {
      nickname: string;
      count: number;
    }[];
  }

  let { data }: ReactionTableProps = $props();
</script>

<div class="table-container">
  <table class="reaction-table">
    <thead>
      <tr>
        <th class="rank-header">順位</th>
        <th class="name-header">ユーザー名</th>
        <th class="count-header">リアクション数</th>
      </tr>
    </thead>
    <tbody>
      {#each data as item, index}
        <tr>
          <td class="rank-cell">{index + 1}</td>
          <td class="name-cell">{item.nickname}</td>
          <td class="count-cell">{item.count.toLocaleString()}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<style>
  .table-container {
    overflow-x: auto;
    border: 1px solid #000;
    border-radius: 0.5rem;
    background-color: #fff;
  }

  .reaction-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.9375rem;
  }

  .reaction-table thead {
    background-color: #000;
    color: #fff;
  }

  .reaction-table th {
    padding: 1rem 1.25rem;
    text-align: left;
    font-weight: 600;
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-bottom: 1px solid #000;
  }

  .reaction-table th:first-child {
    border-top-left-radius: 0.5rem;
  }

  .reaction-table th:last-child {
    border-top-right-radius: 0.5rem;
  }

  .rank-header {
    width: 80px;
    text-align: center;
  }

  .name-header {
    width: auto;
  }

  .count-header {
    width: 150px;
    text-align: right;
  }

  .reaction-table tbody tr {
    border-bottom: 1px solid #e5e5e5;
    transition: background-color 0.2s ease;
  }

  .reaction-table tbody tr:last-child {
    border-bottom: none;
  }

  .reaction-table tbody tr:hover {
    background-color: #f5f5f5;
  }

  .reaction-table td {
    padding: 1rem 1.25rem;
    color: #000;
  }

  .rank-cell {
    text-align: center;
    font-weight: 600;
    color: #666;
  }

  .name-cell {
    font-weight: 500;
  }

  .count-cell {
    text-align: right;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    font-size: 1.25rem;
  }

  @media (max-width: 640px) {
    .reaction-table th,
    .reaction-table td {
      padding: 0.75rem 0.875rem;
      font-size: 0.875rem;
    }

    .rank-header {
      width: 60px;
    }

    .count-header {
      width: 120px;
    }

    .reaction-table .count-cell {
      font-size: 1rem;
    }
  }
</style>

