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
        `/api/projects/projectByCategory?categoryIds=${tag}&page=${categoryPage}&limit=${itemsPerPage}`,
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
    const selectedCategories = event.detail;
    if (selectedCategories && selectedCategories.length > 0) {
      const categoryIds = selectedCategories.map((cat) => cat.id);
      selectedTag = selectedCategories.map((cat) => cat.title).join(', ');
      projectByCategory(categoryIds);
    } else {
      selectedTag = '';
      // Reset to show all projects when no categories are selected
      loadedProjects = data.allProjects;
      categoryResult = [];
    }
  }
</script>

<!-- Main container with dark background and proper spacing -->
<div class="min-h-screen bg-dashboard-black">
  <div class="container mx-auto max-w-7xl px-8">
    <!-- Breadcrumb Navigation -->
    <nav class="mb-6 pt-8">
      <div class="flex items-center gap-2">
        <a
          href="/"
          class="text-body-lg font-medium text-gray-300 transition-colors hover:text-white"
        >
          Home
        </a>
        <svg class="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
        <span class="text-body-lg text-gray-400">Explore Projects</span>
      </div>
    </nav>

    <!-- Main content layout -->
    <div class="flex flex-col gap-8 lg:flex-row">
      <!-- Sidebar -->
      <aside class="w-full lg:w-80 lg:flex-shrink-0">
        <div class="sticky top-8">
          <div
            class="rounded-2xl border border-dashboard-gray-700 bg-dashboard-gray-900 p-6 shadow-card"
          >
            <h3 class="mb-4 text-heading-lg text-gray-300">Filter Projects</h3>

            <ProjectCategory on:categorySelected={handleCategorySelected} />
          </div>
        </div>
      </aside>

      <!-- Main content -->
      <main class="min-w-0 flex-1">
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {#if searchTerm && searchResults.length > 0}
            <div class="col-span-full">
              <h2 class="text-heading-xl text-white">
                Search results for: <span class="text-dashboard-yellow-400">"{searchTerm}"</span>
              </h2>
            </div>
            {#each searchResults as project}
              <Card {project} />
            {/each}
            {#if !searchResultsLoaded && !allSearchLoaded}
              <div class="col-span-full mt-8 flex items-center justify-center">
                <button
                  on:click={loadMoreSearchResults}
                  class="group rounded-xl border-2 border-dashboard-gray-600 px-8 py-3 text-label-lg font-medium text-gray-300 transition-all duration-300 hover:border-dashboard-gray-500 hover:bg-dashboard-gray-800/50 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dashboard-purple-500 disabled:pointer-events-none disabled:opacity-50"
                >
                  <span class="flex items-center gap-2">
                    Load more results
                    <svg
                      class="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                      />
                    </svg>
                  </span>
                </button>
              </div>
            {/if}
          {:else if selectedTag}
            <div class="col-span-full">
              <h2 class="text-heading-xl text-white">
                Projects in: <span class="text-dashboard-yellow-400">"{selectedTag}"</span>
              </h2>
            </div>
            {#if categoryResult.length > 0}
              {#each categoryResult as project}
                <Card {project} class="!h-auto !flex-shrink-0" />
              {/each}
              {#if !categoryResultLoaded && !allCategoryLoaded}
                <div class="col-span-full mt-8 flex items-center justify-center">
                  <button
                    on:click={loadMoreCategoryResults}
                    class="group rounded-xl border-2 border-dashboard-gray-600 px-8 py-3 text-label-lg font-medium text-gray-300 transition-all duration-300 hover:border-dashboard-gray-500 hover:bg-dashboard-gray-800/50 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dashboard-purple-500 disabled:pointer-events-none disabled:opacity-50"
                  >
                    <span class="flex items-center gap-2">
                      Load more
                      <svg
                        class="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M19 14l-7 7m0 0l-7-7m7 7V3"
                        />
                      </svg>
                    </span>
                  </button>
                </div>
              {/if}
            {:else}
              <div
                class="col-span-full rounded-2xl border border-dashboard-gray-700 bg-dashboard-gray-900 p-8 text-center"
              >
                <p class="text-body-lg text-gray-400">
                  No projects found for "{selectedTag}".
                </p>
                <p class="mt-2 text-body-md text-gray-500">
                  Try selecting a different category or browse all projects.
                </p>
              </div>
            {/if}
          {:else if !searchTerm}
            <!-- Top Projects Section -->
            <div class="col-span-full">
              <h2 class="text-heading-xl text-white">Top Projects</h2>
              <p class="mt-2 text-body-lg text-gray-400">
                Featured projects making the biggest impact
              </p>
            </div>
            {#each data.topProjects as project}
              <Card {project} />
            {:else}
              <div
                class="p-8 text-center border col-span-full rounded-2xl border-dashboard-gray-700 bg-dashboard-gray-900"
              >
                <p class="text-gray-400 text-body-lg">No featured projects available.</p>
              </div>
            {/each}

            <!-- All Projects Section -->
            <div class="col-span-full mt-8">
              <h2 class="text-heading-xl text-white">All Projects</h2>
              <p class="mt-2 text-body-lg text-gray-400">
                Discover and support projects across all categories
              </p>
            </div>

            <!-- Create Project CTA Card -->
            <div
              class="group relative overflow-hidden rounded-2xl border border-dashboard-gray-700 bg-dashboard-gray-900 p-6 shadow-card transition-all duration-300 hover:border-dashboard-gray-600 hover:shadow-lg"
            >
              <div class="flex h-full flex-col items-center justify-center text-center">
                <!-- Icon -->
                <div class="mb-4 rounded-full bg-dashboard-purple-500/10 p-4">
                  <svg
                    class="h-8 w-8 text-dashboard-purple-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </div>

                <!-- Text Content -->
                <h3 class="mb-2 text-heading-md text-white">Create Your Project</h3>
                <p class="mb-4 text-body-md text-gray-400">
                  Have an innovative idea? Start your own project and connect with supporters who
                  believe in your vision.
                </p>

                <!-- CTA Button -->
                <a
                  href="/project/create"
                  class="rounded-xl bg-dashboard-purple-500 px-6 py-2 font-medium text-white transition-colors duration-300 hover:bg-dashboard-purple-600"
                >
                  <span class="flex items-center gap-2">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    Start Creating
                  </span>
                </a>
              </div>
            </div>

            {#if data.allProjects.length > 0}
              {#each loadedProjects as project (project.id)}
                <Card {project} />
              {/each}
              {#if !allProjectsLoaded}
                <div class="col-span-full mt-8 flex w-full flex-grow items-center justify-center">
                  <div
                    class="flex cursor-pointer"
                    on:click={loadMoreProjects}
                    on:keydown={(e) => e.key === 'Enter' && loadMoreProjects()}
                    role="button"
                    tabindex="0"
                  >
                    <button
                      class="group rounded-xl border-2 border-dashboard-gray-600 px-8 py-3 text-label-lg font-medium text-gray-300 transition-all duration-300 hover:border-dashboard-gray-500 hover:bg-dashboard-gray-800/50 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dashboard-purple-500 disabled:pointer-events-none disabled:opacity-50"
                    >
                      <span class="flex items-center gap-2">
                        Load more
                        <svg
                          class="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M19 14l-7 7m0 0l-7-7m7 7V3"
                          />
                        </svg>
                      </span>
                    </button>
                  </div>
                </div>
              {/if}
            {:else}
              <div
                class="col-span-full rounded-2xl border border-dashboard-gray-700 bg-dashboard-gray-900 p-8 text-center"
              >
                <p class="text-body-lg text-gray-400">No projects found.</p>
                <p class="mt-2 text-body-md text-gray-500">Check back later for new projects.</p>
              </div>
            {/if}
          {:else}
            <div
              class="col-span-full rounded-2xl border border-dashboard-gray-700 bg-dashboard-gray-900 p-8 text-center"
            >
              <p class="text-body-lg text-gray-400">No search results found.</p>
              <p class="mt-2 text-body-md text-gray-500">
                Try adjusting your search terms or browse all projects.
              </p>
            </div>
          {/if}
        </div>
      </main>
    </div>
  </div>
</div>
