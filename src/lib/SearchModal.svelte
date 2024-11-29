<script>
	import { searchBarOpen } from './utils.js';
  import { createEventDispatcher, onMount } from 'svelte';
  import { fade } from 'svelte/transition';

  // Props
  // export let searchBarOpen = $searchBarOpen;
  export let searchTerm = '';

  // State management
  let searchResults = [];
  let loading = false;
  let error = null;

  // Event dispatcher
  // const dispatch = createEventDispatcher();

  // Search function (async to simulate API call)
  async function searchProjects(term) {
    if (!term) {
      searchResults = [];
      return;
    }

    loading = true;
    try {
      // Simulated search - replace with actual API call
      const mockProjects = [
        { id: 1, name: 'Digital Health Initiative', description: 'Improving healthcare access' },
        { id: 2, name: 'Education Technology Platform', description: 'Online learning solutions' },
        { id: 3, name: 'Climate Action Tracker', description: 'Environmental monitoring system' }
      ];

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Filter projects based on search term
      searchResults = mockProjects.filter(project => 
        project.name.toLowerCase().includes(term.toLowerCase()) ||
        project.description.toLowerCase().includes(term.toLowerCase())
      );
    } catch (e) {
      error = e.message;
      searchResults = [];
    } finally {
      loading = false;
    }
  }

  // Handle search input
  function handleSearch() {
    searchProjects(searchTerm);
  }

  // Close modal
  function closeModal() {
    $searchBarOpen = false;
    searchTerm = '';
    searchResults = [];
  }

  // Select a search result
  function selectResult(result) {
    dispatch('select', result);
    closeModal();
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
    class="fixed inset-0 z-[100000] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 "
    on:click|self={closeModal}
  >
    <div 
      class="w-full max-w-2xl bg-[#0b383c] rounded-xl shadow-2xl overflow-hidden mb-[30vh]"
      on:click|stopPropagation
    >
      <!-- Search Input -->
      <div class="p-6 border-b border-cyan-800">
        <div class="relative">
          <input 
            type="text" 
            bind:value={searchTerm}
            on:input={handleSearch}
            placeholder="Search projects, resources, and more..." 
            class="w-full px-4 py-3 text-white border rounded-md bg-white/10 border-cyan-800 focus:outline-none focus:ring-2 focus:ring-cyan-600"
          />
          
          <!-- Close button -->
          <button 
            on:click={closeModal}
            class="absolute text-white transform -translate-y-1/2 right-2 top-1/2 hover:text-gray-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          
        </div>
      </div>

      <!-- Search Results -->
      <div class="max-h-[500px] overflow-y-auto">
        {#if loading}
          <div class="p-6 text-center text-white">
            Searching...
          </div>
        {:else if searchTerm && searchResults.length === 0}
          <div class="p-6 text-center text-gray-400">
            No results found for "{searchTerm}"
          </div>
        {:else if searchResults.length > 0}
          <ul class="divide-y divide-cyan-800">
            {#each searchResults as result (result.id)}
              <li 
                on:click={() => selectResult(result)}
                class="px-6 py-4 cursor-pointer hover:bg-cyan-900"
              >
                <div class="text-[#d1ea9a] font-semibold">{result.name}</div>
                <div class="text-sm text-white/70">{result.description}</div>
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