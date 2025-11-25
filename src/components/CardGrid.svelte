<script lang="ts">
  import type { CardProps } from './Card.svelte';
	import Card from './Card.svelte';

  type CardGridProps = {
    cards: CardProps[];
  }

  let { cards }: CardGridProps = $props();
</script>

<div class="card-grid">
  {#each cards as card}
    <Card name={card.name} value={card.value} />
  {/each}
</div>

<style>
  .card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 0.5rem;
  }
</style>
