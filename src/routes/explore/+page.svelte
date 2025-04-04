<script>
  import ProjectCategory from '$lib/ProjectCategory.svelte';
  import Card from '$lib/Card.svelte';
  import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
  } from '$lib/components/ui/accordion';
  import { Button } from '$lib/components/ui/button';

  export let data;
  let loadedProjects = data.allProjects;

  let searchResults = [];
  let categoryResult = [];
  let loading = true;
  let searchTerm = '';
  let selectedTag = '';

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

<div class="mx-auto mt-8 flex w-full max-w-[1470px] flex-col justify-center gap-6 px-6 md:flex-col lg:flex-row">
  <aside class="w-full md:mb-0 lg:w-[28%] lg:sticky lg:top-0 lg:self-start">
    <div
      class="p-4 rounded-md shadow-sm"
      style="position: sticky; top: 0; height: fit-content;"
    >
      <span class="hidden mb-4 md:block">SDGs</span>
      <Accordion type="single" value="sdgs" collapsible>
        <AccordionItem value="sdgs">
          <AccordionTrigger class="no-underline hover:no-underline focus:no-underline">
            Select SDG Category
          </AccordionTrigger>
          <AccordionContent>
            <ProjectCategory on:categorySelected={handleCategorySelected} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  </aside>

  <section class="grid items-start flex-1 grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {#if searchTerm && searchResults.length > 0}
      <div class="text-xl font-semibold text-gray-700 col-span-full sm:col-span-2 lg:col-span-3">
        Search results for: "{searchTerm}"
      </div>
      {#each searchResults as project}
        <Card {project} />
      {/each}
      {#if !searchResultsLoaded && !allSearchLoaded}
        <div class="flex items-center justify-center mt-8 col-span-full sm:col-span-2 lg:col-span-3">
          <Button on:click={loadMoreSearchResults}>Load more</Button>
        </div>
      {/if}
    {:else if selectedTag}
      <div class="text-xl font-semibold text-gray-700 col-span-full sm:col-span-2 lg:col-span-3">
        Projects in: "{selectedTag}"
      </div>
      {#if categoryResult.length > 0}
        {#each categoryResult as project}
          <Card {project} class="!h-auto !flex-shrink-0" />
        {/each}
        {#if !categoryResultLoaded && !allCategoryLoaded}
          <div class="flex items-center justify-center mt-8 col-span-full sm:col-span-2 lg:col-span-3">
            <Button on:click={loadMoreCategoryResults}>Load more</Button>
          </div>
        {/if}
      {:else}
        <p class="text-center text-gray-600 col-span-full sm:col-span-2 lg:col-span-3">
          No projects found for "{selectedTag}".
        </p>
      {/if}
    {:else if !searchTerm}
      <div class="text-xl font-semibold text-gray-700 col-span-full sm:col-span-2 lg:col-span-3">Top Projects</div>
      {#each data.topProjects as project}
        <Card {project} />
      {:else}
        <p class="text-center text-gray-600 col-span-full sm:col-span-2 lg:col-span-3">No projects found.</p>
      {/each}

      <div class="mt-8 text-xl font-semibold text-gray-700 col-span-full sm:col-span-2 lg:col-span-3">All Projects</div>
      {#if data.allProjects.length > 0}
        {#each loadedProjects as project (project.id)}
          <Card {project} />
        {/each}
        {#if !allProjectsLoaded}
          <div class="flex items-center justify-center flex-grow w-full mt-8 col-span-full sm:col-span-2 lg:col-span-3">
            <div
              class="flex cursor-pointer"
              on:click={loadMoreProjects}
              on:keydown={(e) => e.key === 'Enter' && loadMoreProjects()}
              role="button"
              tabindex="0"
            >
              <Button
                class="items-center rounded-full border-2 border-[#516027] bg-[#d1ea9a] px-[30px] py-[12px] transition-colors duration-300 hover:bg-[#c1da8a]"
              >
                <span class="text-xl font-normal leading-snug text-[#516027]"> Load more </span>
              </Button>
            </div>
          </div>
        {/if}
      {:else}
        <p class="text-center text-gray-600 col-span-full sm:col-span-2 lg:col-span-3">No projects found.</p>
      {/if}
    {:else}
      <p class="text-center text-gray-600 col-span-full sm:col-span-2 lg:col-span-3">No search results found.</p>
    {/if}
  </section>
</div>