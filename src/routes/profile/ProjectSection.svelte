<script>
  import Card from '$lib/Card.svelte';

  export let projects = [];

  const tabs = [
    { id: 'created', label: 'Projects created' },
    { id: 'contributed', label: 'Projects contributed' },
    { id: 'notifications', label: 'Notifications' },
  ];

  let currentTab = tabs[0].id;
</script>

<section class="flex flex-col items-center p-7 max-w-7xl mx-auto max-md:px-5 max-md:mt-10">
  <div class="w-full max-w-6xl">
    <nav class="flex mb-4 space-x-6">
      {#each tabs as tab (tab.id)}
        <button
          type="button"
          class="px-4 py-3 text-base font-semibold transition-all duration-200 border-b-4
                  {tab.id === currentTab ? 'border-b-[#bde25b] opacity-100' : 'opacity-50'}"
          on:click={() => (currentTab = tab.id)}
        >
          {tab.label}
        </button>
      {/each}
    </nav>

    <div class="mt-8">
      {#if currentTab === 'created'}
        <div class="grid grid-cols-1 gap-4 mt-8 md:grid-cols-2 lg:grid-cols-3">
          {#each projects as project}
            <Card {project} />
          {:else}
            <p>No projects found.</p>
          {/each}
        </div>
      {:else if currentTab === 'contributed'}
        <div class="grid grid-cols-1 gap-4 mt-8 md:grid-cols-2 lg:grid-cols-3">
          {#each projects as project}
            <Card {project} />
          {:else}
            <p>You haven't contributed to any projects yet'.</p>
          {/each}
        </div>
      {:else if currentTab === 'notifications'}
        <div class="grid grid-cols-1 gap-4 mt-8 md:grid-cols-2 lg:grid-cols-3">
          {#each projects as project}
            <Card {project} />
          {:else}
            <p>No notifications found.</p>
          {/each}
        </div>
      {/if}
    </div>
  </div>
</section>
