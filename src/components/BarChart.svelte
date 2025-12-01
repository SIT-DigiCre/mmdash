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
      <time class="bar-chart-item-name google-sans-flex" datetime={item.name}>{new Date(item.name).toLocaleDateString('ja-JP', { month: "2-digit", day: "2-digit" })}</time>
      <div class="bar-chart-item-bar" style="width: {item.width}%;"></div>
      <div class="bar-chart-item-value google-sans-flex">{item.value.toLocaleString()}</div>
    </div>
  {/each}
</div>

<style>
  .bar-chart {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 2rem;
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
    width: 50px;
    font-size: 0.75rem;
  }

  .bar-chart-item-bar {
    height: 0.5rem;
    background-image: linear-gradient(to right, #000, #e1e1e1);
  }
</style>
