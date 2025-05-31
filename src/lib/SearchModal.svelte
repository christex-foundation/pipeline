<script>
  import Icon from '@iconify/svelte';
  import { searchBarOpen } from './utils.js';
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import { browser } from '$app/environment';
  import * as Command from '$lib/components/ui/command';
  import { searchService } from '$lib/utils/searchService.js';
  import { createDebouncer } from '$lib/utils/debounce.js';

  let searchResults = [];
  let loading = false;
  let error = null;
  let term = '';

  const updateSearchState = (loadingState, results = [], errorState = null) => {
    loading = loadingState;
    searchResults = results;
    error = errorState;
  };

  const resetSearch = () => updateSearchState(false, [], null);

  const searchProjects = async () => {
    if (!term?.trim()) {
      resetSearch();
      return;
    }

    updateSearchState(true, searchResults);

    try {
      const results = await searchService.searchProjects(term);

      if (results === null) return; // Request was cancelled

      updateSearchState(false, results);
    } catch (e) {
      updateSearchState(false, [], e.message);
    }
  };

  const debouncedSearch = createDebouncer(searchProjects, 300);

  function closeModal() {
    $searchBarOpen = false;
    term = '';
    resetSearch();
  }

  function handleKeydown(event) {
    if (event.key === 'Escape') {
      closeModal();
    }
  }

  async function handleProjectClick(projectId) {
    closeModal();
    await new Promise((resolve) => setTimeout(resolve, 50));
    window.location.href = `/project/${projectId}`;
  }

  $: if (term !== undefined) {
    debouncedSearch();
  }

  onMount(() => {
    if (browser) {
      function handleKeydown(e) {
        if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
          e.preventDefault();
          $searchBarOpen = !$searchBarOpen;
        }
      }

      document.addEventListener('keydown', handleKeydown);
      return () => {
        document.removeEventListener('keydown', handleKeydown);
      };
    }
  });
</script>

{#if $searchBarOpen}
  <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
  <div
    transition:fade={{ duration: 200 }}
    class="fixed inset-0 z-[200000] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
    on:click|self={closeModal}
    on:keydown={handleKeydown}
    role="dialog"
    aria-modal="true"
    aria-label="Search projects"
    tabindex="-1"
  >
    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
    <div
      class="search-modal-container z-[200001] mb-[30vh] w-full max-w-2xl overflow-hidden"
      on:click|stopPropagation
      on:keydown={handleKeydown}
      role="document"
      tabindex="-1"
    >
      <Command.Root class="search-command-root border-none" shouldFilter={false}>
        <div class="search-input-container">
          <Command.Input
            bind:value={term}
            placeholder="Search projects, resources, and more..."
            class="search-input"
          />
          <button on:click={closeModal} class="search-close-btn" aria-label="Close search">
            <Icon icon="mdi:close" class="text-2xl" />
          </button>
        </div>

        <Command.List class="search-results-container">
          {#if loading}
            <div class="search-loading">
              <Icon icon="svg-spinners:pulse-3" class="mr-2 text-xl" />
              Searching...
            </div>
          {:else if term && searchResults.length === 0}
            <Command.Empty class="search-empty">
              No results found for "{term}"
            </Command.Empty>
          {:else if searchResults.length > 0}
            <Command.Group heading="Projects" class="search-group">
              {#each searchResults as project (project.id)}
                <Command.Item class="search-item" onSelect={() => handleProjectClick(project.id)}>
                  <div class="search-item-content">
                    <div class="search-item-icon">
                      <Icon icon="fluent:folder-open-20-filled" class="text-xl" />
                    </div>
                    <div class="search-item-details">
                      <div class="search-item-title">{project.title}</div>
                      <div class="search-item-description">{project.bio}</div>
                    </div>
                    <Command.Shortcut class="search-item-shortcut">
                      <Icon icon="mdi:arrow-right" class="text-lg" />
                    </Command.Shortcut>
                  </div>
                </Command.Item>
              {/each}
            </Command.Group>
          {:else}
            <div class="search-placeholder">
              <Icon icon="mdi:magnify" class="mr-2 text-2xl text-gray-500" />
              Start typing to search projects, resources, and more
            </div>
          {/if}
        </Command.List>
      </Command.Root>
    </div>
  </div>
{/if}

<style>
  .search-modal-container {
    /* Black translucent glassy card - identical to UserProfile */
    background: rgba(0, 0, 0, 0.85) !important;
    border: 1px solid rgba(255, 255, 255, 0.1) !important;
    border-radius: 20px !important;

    /* Enhanced glass effect for black theme */
    backdrop-filter: blur(20px) !important;
    -webkit-backdrop-filter: blur(20px) !important;

    /* Premium shadow for black glass */
    box-shadow:
      0 25px 50px rgba(0, 0, 0, 0.6),
      0 12px 25px rgba(0, 0, 0, 0.4),
      0 6px 12px rgba(0, 0, 0, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.1),
      inset 0 -1px 0 rgba(255, 255, 255, 0.05) !important;

    /* Smooth animation */
    animation: modalAppear 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
  }

  @keyframes modalAppear {
    from {
      opacity: 0;
      transform: translateY(-8px) scale(0.96);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  /* Glass texture effects for modal */
  .search-modal-container::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    border-radius: 20px 20px 0 0;
    z-index: 1;
  }

  .search-modal-container::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 1px;
    bottom: 0;
    background: linear-gradient(180deg, transparent, rgba(255, 255, 255, 0.15), transparent);
    border-radius: 20px 0 0 20px;
    z-index: 1;
  }

  :global(.search-command-root) {
    background: transparent !important;
    border: none !important;
  }

  .search-input-container {
    padding: 24px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.08) 0%,
      rgba(255, 255, 255, 0.02) 100%
    );
    position: relative;
  }

  :global(.search-input-container > div) {
    border: none !important;
  }

  :global(.search-input) {
    width: 100% !important;
    padding: 12px 48px 12px 16px !important;
    background: rgba(255, 255, 255, 0.1) !important;
    border: 1px solid rgba(255, 255, 255, 0.2) !important;
    border-radius: 12px !important;
    color: white !important;
    font-size: 16px !important;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
    backdrop-filter: blur(8px) !important;
    -webkit-backdrop-filter: blur(8px) !important;
  }

  :global(.search-input:focus) {
    outline: none !important;
    border-color: rgba(139, 92, 246, 0.6) !important;
    background: rgba(255, 255, 255, 0.15) !important;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1) !important;
  }

  :global(.search-input::placeholder) {
    color: rgba(255, 255, 255, 0.6) !important;
  }

  .search-close-btn {
    position: absolute;
    right: 32px;
    top: 50%;
    transform: translateY(-50%);
    color: rgba(255, 255, 255, 0.7);
    transition: all 0.2s ease;
    padding: 4px;
    border-radius: 6px;
  }

  .search-close-btn:hover {
    color: white;
    background: rgba(255, 255, 255, 0.1);
  }

  :global(.search-results-container) {
    max-height: 400px !important;
    overflow-y: auto !important;
    background: transparent !important;
  }

  :global(.search-group) {
    padding: 16px 24px 8px 24px !important;
  }

  :global(.search-group [data-cmdk-group-heading]) {
    color: rgba(255, 255, 255, 0.6) !important;
    font-size: 12px !important;
    font-weight: 600 !important;
    text-transform: uppercase !important;
    letter-spacing: 0.05em !important;
    margin-bottom: 8px !important;
    padding-left: 12px !important;
  }

  :global(.search-item) {
    margin: 0 0px 4px 0px !important;
    padding: 0 !important;
    border-radius: 0px !important;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
    position: relative !important;
    overflow: hidden !important;
    background: transparent !important;
    border: none !important;
  }

  :global(.search-item:hover),
  :global(.search-item[data-selected]) {
    backdrop-filter: blur(8px) !important;
    -webkit-backdrop-filter: blur(8px) !important;
    transform: translateX(4px) !important;
  }

  :global(.search-item::before) {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: linear-gradient(180deg, transparent, rgba(139, 92, 246, 0.8), transparent);
    transform: scaleY(0);
    transition: transform 0.2s ease;
  }

  :global(.search-item:hover::before),
  :global(.search-item[data-selected]::before) {
    transform: scaleY(1);
  }

  .search-item-content {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    cursor: pointer;
  }

  .search-item-icon {
    flex-shrink: 0;
    color: rgba(139, 92, 246, 0.8);
    transition: color 0.2s ease;
  }

  :global(.search-item:hover) .search-item-icon {
    color: rgba(139, 92, 246, 1);
  }

  .search-item-details {
    flex: 1;
    min-width: 0;
  }

  .search-item-title {
    color: #d1ea9a;
    font-weight: 600;
    font-size: 14px;
    margin-bottom: 2px;
  }

  .search-item-description {
    color: rgba(255, 255, 255, 0.7);
    font-size: 12px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  :global(.search-item-shortcut) {
    color: rgba(255, 255, 255, 0.4) !important;
    font-size: 12px !important;
    opacity: 0 !important;
    transition: opacity 0.2s ease !important;
  }

  :global(.search-item:hover .search-item-shortcut) {
    opacity: 1 !important;
  }

  .search-loading,
  .search-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 32px 24px;
    color: rgba(255, 255, 255, 0.6);
    font-size: 14px;
  }

  :global(.search-empty) {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    padding: 32px 24px !important;
    color: rgba(255, 255, 255, 0.6) !important;
    font-size: 14px !important;
  }

  /* Custom scrollbar for results */
  :global(.search-results-container::-webkit-scrollbar) {
    width: 6px;
  }

  :global(.search-results-container::-webkit-scrollbar-track) {
    background: transparent;
  }

  :global(.search-results-container::-webkit-scrollbar-thumb) {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
  }

  :global(.search-results-container::-webkit-scrollbar-thumb:hover) {
    background: rgba(255, 255, 255, 0.3);
  }
</style>
