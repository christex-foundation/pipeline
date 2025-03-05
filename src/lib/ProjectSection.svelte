<script>
  import Card from '../lib/Card.svelte';

  export let projects = [];
  export let bookmarkProjects = [];
  export let contributed = [];

  let navSections = [
    { id: 'created', label: 'Projects created' },
    { id: 'contributed', label: 'Projects contributed' },
    { id: 'following', label: 'Following' },
  ];

  let currentSection = 'created';

  function handleNavigation(id) {
    currentSection = id;
  }
</script>

<section class="mx-auto flex max-w-[1235px] flex-col items-center p-7 max-md:mt-10 max-md:px-5">
  <div class="w-full max-w-[1156px]">
    <nav class="flex mb-4 space-x-6">
      {#each navSections as section}
        <button
          class="border-b-4 px-4 py-3 text-base font-semibold transition-all duration-200
                  {section.id === currentSection ? 'border-b-[#bde25b] opacity-100' : 'opacity-50'}"
          on:click={() => handleNavigation(section.id)}
        >
          {section.label}
        </button>
      {/each}
    </nav>

    <div class="mt-8">
      {#if currentSection === 'created'}
        <div class="grid grid-cols-1 gap-4 mt-8 md:grid-cols-2 lg:grid-cols-3">
          {#each projects as project}
            <Card {project} />
          {:else}
            <p>No projects found.</p>
          {/each}
        </div>
      {:else if currentSection === 'contributed'}
        <div class="grid grid-cols-1 gap-4 mt-8 md:grid-cols-2 lg:grid-cols-3">
          {#each contributed as project}
            <Card {project} />
          {:else}
            <p>No contributed projects found.</p>
          {/each}
        </div>
      {:else if currentSection === 'following'}
        <div class="grid grid-cols-1 gap-4 mt-8 md:grid-cols-2 lg:grid-cols-3">
          {#each bookmarkProjects as project}
            <Card {project} />
          {:else}
            <p>No followed projects found.</p>
          {/each}
        </div>
      {/if}
    </div>
  </div>
</section>
