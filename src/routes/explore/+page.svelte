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

      if (loadedProjects?.length < itemsPerPage) {
        allProjectsLoaded = true;
      }

      loadedProjects = [...loadedProjects, ...data.projects];
      // data.allProjects = loadedProjects;
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

      if (data.allProjects.length < itemsPerPage) {
        allCategoryLoaded = true;
      }

      categoryResult = data.allProjects;
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

<div class="mx-auto mt-8 flex w-full max-w-[1470px] flex-col justify-center gap-6 px-6 md:flex-row">
  <aside class="mt-[-15px] w-full max-md:overflow-x-auto md:mb-0 md:w-[28%]">
    <!--Previously, the `flex` container had `space-x-2`, causing the SDGs heading to align horizontally with the ProjectCategory,  
    leading to unintended horizontal scrolling. This update applies `flex-col` and `space-y-2` to properly stack the heading above  
    the ProjectCategory component.-->
    <div
  class="flex flex-col p-4 space-y-2 overflow-x-hidden rounded-md shadow-sm"
  style="position: sticky; top: 0; height: fit-content;"
>
  <h2 class="block mb-4 text-xl font-semibold text-gray-800">SDGs</h2><!--The `hidden` class on the `<h2>` element was preventing the "SDGs" heading from appearing on smaller screens. This update removes `hidden` and applies `block` to ensure visibility across all screen sizes. ---->
  <ProjectCategory
    on:categorySelected={handleCategorySelected}
    class="flex min-w-max md:min-w-0 md:flex-col"
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
            class="rounded-full border-2 border-[#516027] bg-[#d1ea9a] px-8 py-2 text-lg font-medium text-[#516027]"
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
              class="rounded-full border-2 border-[#516027] bg-[#d1ea9a] px-8 py-2 text-lg font-medium text-[#516027]"
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
        {#each loadedProjects as project (project.id)}
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
                class="items-center rounded-full border-2 border-[#516027] bg-[#d1ea9a] px-[30px] py-[12px] transition-colors duration-300 hover:bg-[#c1da8a]"
              >
                <span class="text-xl font-normal leading-snug text-[#516027]"> Load more </span>
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
