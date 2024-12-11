<script>
  import ProjectCategory from '$lib/ProjectCategory.svelte';
  import Card from '$lib/Card.svelte';

  export let data;
  let loadedProjects = data.allProjects;

  let searchResults = [];
  let categoryResult = [];
  let loading = true;
  let searchTerm = '';
  let selectedTag = '';

  // Pagination state
  let currentPage = 1;
  let searchPage = 1;
  let categoryPage = 1;
  const itemsPerPage = 6;
  let allProjectsLoaded = false;
  let allSearchLoaded = false;
  let allCategoryLoaded = false;
  let searchResultsLoaded = false;
  let categoryResultLoaded = false;

  // TODO: we would find a way around it later
  async function fetchAllProjects() {
    try {
      const response = await fetch(`/api/projects?page=${currentPage}&limit=${itemsPerPage}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const data = await response.json();

      if (data.projects.length < itemsPerPage) {
        allProjectsLoaded = true;
      }

      loadedProjects = [...loadedProjects, ...data.projects];
    } catch (error) {
      alert(error.message);
    } finally {
      loading = false;
    }
  }

  async function projectByCategory(tag) {
    categoryResultLoaded = true;
    try {
      const response = await fetch(
        `/api/projects/projectByCategory/${tag}?&page=${categoryPage}&limit=${itemsPerPage}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        },
      );

      if (!response.ok) throw new Error(response.statusText);

      const data = await response.json();

      if (data.projects.length < itemsPerPage) {
        allCategoryLoaded = true;
      }

      categoryResult = data.projects;
    } catch (e) {
      alert(e.message);
    } finally {
      categoryResultLoaded = false;
    }
  }

  async function loadMoreProjects() {
    currentPage += 1;
    fetchAllProjects();
  }

  function loadMoreSearchResults() {
    searchPage += 1;
    searchProjects(searchTerm);
  }

  function loadMoreCategoryResults() {
    categoryPage += 1;
    projectByCategory(selectedTag);
  }

  function handleCategorySelected(event) {
    const selectedCategory = event.detail;
    if (selectedCategory) {
      selectedTag = selectedCategory.title;
      projectByCategory(selectedCategory.id);
    } else {
      selectedTag = '';
    }
  }
</script>

<div class="flex flex-col justify-center w-full max-w-[1470px] mx-auto gap-6 px-6 mt-8 md:flex-row">
  <aside class="w-full md:w-[28%] max-md:overflow-x-auto mt-[-15px] md:mb-0">
    <div
      class="flex p-4 space-x-2 overflow-x-scroll rounded-md shadow-sm md:flex-col md:overflow-x-visible md:space-x-0 md:space-y-2"
      style="position: sticky; top: 0; height: fit-content;"
    >
      <h2 class="hidden mb-4 text-xl font-semibold text-gray-800 md:block">SDGs</h2>
      <ProjectCategory
        on:categorySelected={handleCategorySelected}
        class="flex md:flex-col min-w-max md:min-w-0"
      />
    </div>
  </aside>

  <section class="grid flex-1 grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
    {#if searchTerm && searchResults.length > 0}
      <div class="text-xl font-semibold text-gray-700 col-span-full">
        Search results for: "{searchTerm}"
      </div>
      {#each searchResults as project}
        <Card {project} />
      {/each}
      {#if !searchResultsLoaded && !allSearchLoaded}
        <div class="flex items-center justify-center mt-8 col-span-full">
          <button
            on:click={loadMoreSearchResults}
            class="px-8 py-2 bg-[#d1ea9a] rounded-full border-2 border-[#516027] text-[#516027] text-lg font-medium"
          >
            Load more
          </button>
        </div>
      {/if}
    {:else if selectedTag}
      <div class="text-xl font-semibold text-gray-700 col-span-full">
        Projects in: "{selectedTag}"
      </div>
      {#if categoryResult.length > 0}
        {#each categoryResult as project}
          <Card {project} />
        {/each}
        {#if !categoryResultLoaded && !allCategoryLoaded}
          <div class="flex items-center justify-center mt-8 col-span-full">
            <button
              on:click={loadMoreCategoryResults}
              class="px-8 py-2 bg-[#d1ea9a] rounded-full border-2 border-[#516027] text-[#516027] text-lg font-medium"
            >
              Load more
            </button>
          </div>
        {/if}
      {:else}
        <p class="text-center text-gray-600 col-span-full">
          No projects found for "{selectedTag}".
        </p>
      {/if}
    {:else if !searchTerm}
      <div class="text-xl font-semibold text-gray-700 col-span-full">Top Projects</div>
      {#each data.topProjects as project}
        <Card {project} />
      {:else}
        <p class="text-center text-gray-600 col-span-full">No projects found.</p>
      {/each}

      <div class="mt-8 text-xl font-semibold text-gray-700 col-span-full">All Projects</div>
      {#if data.allProjects.length > 0}
        {#each data.allProjects as project}
          <Card {project} />
        {/each}
        {#if !allProjectsLoaded}
          <div class="flex items-center justify-center flex-grow w-full mt-8 col-span-full">
            <div
              class="flex cursor-pointer"
              on:click={loadMoreProjects}
              on:keydown={(e) => e.key === 'Enter' && loadMoreProjects()}
              role="button"
              tabindex="0"
            >
              <div
                class="px-[30px] py-[12px] bg-[#d1ea9a] rounded-full border-2 border-[#516027] items-center hover:bg-[#c1da8a] transition-colors duration-300"
              >
                <span class="text-[#516027] text-xl font-normal leading-snug"> Load more </span>
              </div>
            </div>
          </div>
        {/if}
      {:else}
        <p class="text-center text-gray-600 col-span-full">No projects found.</p>
      {/if}
    {:else}
      <p class="text-center text-gray-600 col-span-full">No search results found.</p>
    {/if}
  </section>
</div>
