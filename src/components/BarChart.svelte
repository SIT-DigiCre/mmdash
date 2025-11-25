<script lang="ts">
  type BarChartProps = {
    data: {
      name: string;
      value: number;
    }[];
  }

  let { data }: BarChartProps = $props();
  const maxValue = data.reduce((max, item) => Math.max(max, item.value), 0);
  const scale = 40 / maxValue;
  const scaledData = data.map(item => ({
    ...item,
    width: item.value * scale
  }));
</script>

<div class="bar-chart">
  {#each scaledData as item}
    <div class="bar-chart-item">
      <div class="bar-chart-item-name">{item.name}</div>
      <div class="bar-chart-item-bar" style="width: {item.width}%;"></div>
      <div class="bar-chart-item-value">{item.value}</div>
    </div>
  {/each}
</div>

<style>
  .bar-chart {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .bar-chart-item {
    height: 1rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 1rem;
  }

  .bar-chart-item-name {
    display: flex;
    justify-content: flex-end;
    width: 100px;
    font-size: 0.75rem;
    font-weight: bold;
  }

  .bar-chart-item-bar {
    height: 0.5rem;
    background-image: linear-gradient(to right, #000, #e1e1e1);
  }
</style>
