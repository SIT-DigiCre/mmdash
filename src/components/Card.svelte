<script lang="ts">
  export type CardProps = {
    name: string;
    value: number;
  }

	let { name, value }: CardProps = $props();
</script>

<dl class="card">
	<dt>{name}</dt>
	<dd class="google-sans-flex">{value.toLocaleString()}</dd>
</dl>

<style>
  .card {
    background-color: #f0f0f0;
    padding: 1rem;
    margin: 0;
    border-radius: 0.5rem;
  }
  .card dt {
    font-size: 0.75rem;
    margin: 0;
  }
  .card dd {
    font-size: 2rem;
    margin: 0;
  }
</style>
