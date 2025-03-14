<script>
  import Card from '$lib/Card.svelte';

  export let data;
</script>

<div class="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
  {#each data.projects as project}
    <Card {project} />
  {:else}
    <p class="text-gray-500 italic">No projects found.</p>
  {/each}
</div>
