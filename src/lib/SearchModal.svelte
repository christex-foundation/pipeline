<script>
  import Icon from '@iconify/svelte';
  import { searchBarOpen } from './utils.js';
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import { browser } from '$app/environment';
  import { goto } from '$app/navigation';

  let Dialog;
  let DialogContent;
  let DialogHeader;
  let clientSideLoaded = false;

  onMount(async () => {
    if (browser) {
      try {
        const module = await import('$lib/components/ui/dialog');
        Dialog = module.Dialog;
        DialogContent = module.DialogContent;
        DialogHeader = module.DialogHeader;
        clientSideLoaded = true;
      } catch (error) {
        console.error('Failed to load dialog components:', error);
      }
    }
  });

  let searchResults = [];
  let loading = false;
  let error = null;
  let term = '';

  async function searchProjects() {
    if (!term) {
      searchResults = [];
      return;
    }

    loading = true;
    try {
      const response = await fetch(`/api/projects?term=${term}&page=1&limit=10`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error(response.statusText);

      const data = await response.json();
      searchResults = data.projects;
    } catch (e) {
      error = e.message;
    } finally {
      loading = false;
    }
  }

  function closeModal() {
    $searchBarOpen = false;
    term = '';
    searchResults = [];
  }

  function handleKeydown(event) {
    if (event.key === 'Escape') {
      closeModal();
    }
  }

  function handleDialogOpen() {
    if (browser) {
      setTimeout(() => {
        const inputElement = document.getElementById('search-input');
        if (inputElement) inputElement.focus();
      }, 10);
    }
  }

  async function handleProjectClick(projectId) {
    closeModal();
    await new Promise((resolve) => setTimeout(resolve, 50));
    window.location.href = `/project/${projectId}`;
  }

  $: if ($searchBarOpen && clientSideLoaded) {
    handleDialogOpen();
  }
</script>

{#if clientSideLoaded && Dialog && DialogContent && DialogHeader && $searchBarOpen}
  <div class="fixed inset-0 z-10 bg-black/30 backdrop-blur-sm"></div>
  <svelte:component this={Dialog} bind:open={$searchBarOpen}>
    <svelte:component
      this={DialogContent}
      class="mb-[30vh] w-full max-w-2xl border-cyan-800 !bg-[#0b383c] p-0"
    >
      <div class="border-b border-cyan-800 p-6">
        <div class="relative">
          <input
            id="search-input"
            type="text"
            bind:value={term}
            on:input={searchProjects}
            placeholder="Search projects, resources, and more..."
            class="w-full rounded-md border border-cyan-800 bg-white/10 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-600 max-lg:text-sm"
          />

          <button
            on:click={closeModal}
            class="absolute right-2 top-1/2 -translate-y-1/2 transform text-white hover:text-gray-300"
          >
            <Icon icon="mdi:close" class="text-2xl" />
          </button>
        </div>
      </div>

      <div class="max-h-[500px] overflow-y-auto">
        {#if loading}
          <div class="p-6 text-center text-white">Searching...</div>
        {:else if term && searchResults.length === 0}
          <div class="p-6 text-center text-gray-400">
            No results found for "{term}"
          </div>
        {:else if searchResults.length > 0}
          <ul class="divide-y divide-cyan-800">
            {#each searchResults as project (project.id)}
              <li class="cursor-pointer px-6 py-4 hover:bg-cyan-900">
                <div
                  on:click={() => handleProjectClick(project.id)}
                  on:keydown={(e) => e.key === 'Enter' && handleProjectClick(project.id)}
                  class="block cursor-pointer"
                  tabindex="0"
                  role="link"
                >
                  <div class="font-semibold text-[#d1ea9a]">{project.title}</div>
                  <div class="text-sm text-white/70">{project.bio}</div>
                </div>
              </li>
            {/each}
          </ul>
        {:else}
          <div class="p-6 text-center text-gray-400">
            Start typing to search projects, resources, and more
          </div>
        {/if}
      </div>
    </svelte:component>
  </svelte:component>
{:else if $searchBarOpen}
  <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
  <div
    transition:fade={{ duration: 200 }}
    class="fixed inset-0 z-[100000] flex items-center justify-center !bg-black/70 p-4 !backdrop-blur-sm"
    on:click|self={closeModal}
    on:keydown={handleKeydown}
    role="dialog"
    aria-modal="true"
    aria-label="Search projects"
    tabindex="-1"
  >
    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
    <div
      class="mb-[30vh] w-full max-w-2xl overflow-hidden rounded-xl bg-[#0b383c] shadow-2xl"
      on:click|stopPropagation
      on:keydown={handleKeydown}
      role="document"
      tabindex="-1"
    >
      <div class="border-b border-cyan-800 p-6">
        <div class="relative">
          <input
            type="text"
            bind:value={term}
            on:input={searchProjects}
            placeholder="Search projects, resources, and more..."
            class="w-full rounded-md border border-cyan-800 bg-white/10 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-600 max-lg:text-sm"
          />

          <button
            on:click={closeModal}
            class="absolute right-2 top-1/2 -translate-y-1/2 transform text-white hover:text-gray-300"
            aria-label="Close search"
          >
            <Icon icon="mdi:close" class="text-2xl" />
          </button>
        </div>
      </div>

      <div class="max-h-[500px] overflow-y-auto">
        {#if loading}
          <div class="p-6 text-center text-white">Searching...</div>
        {:else if term && searchResults.length === 0}
          <div class="p-6 text-center text-gray-400">
            No results found for "{term}"
          </div>
        {:else if searchResults.length > 0}
          <ul class="divide-y divide-cyan-800">
            {#each searchResults as project (project.id)}
              <li class="cursor-pointer px-6 py-4 hover:bg-cyan-900">
                <div
                  on:click={() => handleProjectClick(project.id)}
                  on:keydown={(e) => e.key === 'Enter' && handleProjectClick(project.id)}
                  class="block cursor-pointer"
                  tabindex="0"
                  role="link"
                >
                  <div class="font-semibold text-[#d1ea9a]">{project.title}</div>
                  <div class="text-sm text-white/70">{project.bio}</div>
                </div>
              </li>
            {/each}
          </ul>
        {:else}
          <div class="p-6 text-center text-gray-400">
            Start typing to search projects, resources, and more
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}
