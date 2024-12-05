<script>
  import { searchBarOpen } from './utils.js';
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';

  // State management
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

  // Close modal
  function closeModal() {
    $searchBarOpen = false;
    term = '';
    searchResults = [];
  }

  // Handle keyboard events
  function handleKeydown(event) {
    if (event.key === 'Escape') {
      closeModal();
    }
  }

  // Add event listener for escape key
  onMount(() => {
    window.addEventListener('keydown', handleKeydown);
    return () => {
      window.removeEventListener('keydown', handleKeydown);
    };
  });
</script>

{#if $searchBarOpen}
  <div
    transition:fade={{ duration: 200 }}
    class="fixed inset-0 z-[100000] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
    on:click|self={closeModal}
  >
    <div
      class="mb-[30vh] w-full max-w-2xl overflow-hidden rounded-xl bg-[#0b383c] shadow-2xl"
      on:click|stopPropagation
    >
      <!-- Search Input -->
      <div class="border-b border-cyan-800 p-6">
        <div class="relative">
          <input
            autofocus
            type="text"
            bind:value={term}
            on:input={searchProjects}
            placeholder="Search projects, resources, and more..."
            class="w-full rounded-md border border-cyan-800 bg-white/10 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-600"
          />

          <!-- Close button -->
          <button
            on:click={closeModal}
            class="absolute right-2 top-1/2 -translate-y-1/2 transform text-white hover:text-gray-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>

      <!-- Search Results -->
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
                <div class="font-semibold text-[#d1ea9a]">
                  <a href="/project/{project.id}">{project.title}</a>
                </div>
                <div class="text-sm text-white/70">{project.bio}</div>
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
