<script>
  import Card from '$lib/Card.svelte';

  export let data;
</script>

<div class="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
  {#each data?.following || [] as project}
    <Card {project} />
  {:else}
    <p>No followed projects found.</p>
  {/each}
</div>
