<script>
  import Search from './../../lib/Search.svelte';
  import ProjectCategory from '../../lib/ProjectCategory.svelte';
  import Nav from '../../lib/Nav.svelte';
  import CategoryDropdown from '../../lib/CategoryDropdown.svelte';
  import SortDropdown from '../../lib/SortDropdown.svelte';
  import Card from '../../lib/Card.svelte';
  import Footer from '../../lib/Footer.svelte';
  import { onMount } from 'svelte';

  let allProjects = [];
  let topProjects = [];
  let searchResults = [];
  let categoryResult = [];
  let loading = true;
  let error = null;
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

      allProjects = [...allProjects, ...data.projects];
    } catch (error) {
      error = e.message;
      alert(error);
    } finally {
      loading = false;
    }
  }

  async function fetchTopProjects() {
    try {
      const response = await fetch('/api/projects', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const data = await response.json();

      topProjects = data.projects.slice(0, 3);
    } catch (error) {
      error = e.message;
      alert(error);
    } finally {
      loading = false;
    }
  }

  async function searchProjects(term) {
    try {
      const response = await fetch(
        `/api/projects?term=${term}&page=${searchPage}&limit=${itemsPerPage}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        },
      );

      if (!response.ok) throw new Error(response.statusText);

      const data = await response.json();

      if (data.projects.length < itemsPerPage) {
        allSearchLoaded = true;
      }

      searchResults = data.projects;
    } catch (e) {
      error = e.message;
      alert(error);
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
      error = e.message;
      alert(error);
    } finally {
      categoryResultLoaded = false;
    }
  }

  function loadMoreProjects() {
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

  function handleSearch(event) {
    searchTerm = event.detail.searchTerm;
    searchPage = 1; // set page to 1 when searching on new term
    searchResults = [];
    searchResultsLoaded = false;

    if (searchTerm) {
      searchProjects(searchTerm);
    }
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

  onMount(() => {
    fetchAllProjects();
    fetchTopProjects();
  });
</script>

<div class="w-full bg-[#d1ea9a]/90 py-16 mb-16">
  <div class="max-w-4xl mx-auto text-center">
    <h1 class="text-[#08292c] text-[45.43px] font-semibold font-['PP Mori'] leading-[54.51px]">
      Discover impact projects, donate directly,<br />& participate in funding rounds.
    </h1>
  </div>
</div>

<div class="flex justify-center w-full px-4">
  <main class="flex flex-col mt-18 text-2xl max-w-[965px] max-md:mt-10 max-md:max-w-full">
    <section
      class="flex flex-wrap items-center justify-between w-full font-thin leading-none text-center text-lime-100 max-md:max-w-full"
    >
      <Search on:search={handleSearch} />
    </section>
    <ProjectCategory on:categorySelected={handleCategorySelected} />
  </main>
</div>

{#if searchTerm && searchResults.length > 0}
  <div
    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-[1156px] mx-auto px-[13.70px] pt-[13.70px] pb-[20.55px] text-5xl font-semibold mt-12"
  >
    Search results for: "{searchTerm}"
  </div>
  <div
    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-[1156px] mx-auto px-[13.70px] pt-[13.70px] pb-[20.55px]"
  >
    {#each searchResults as project}
      <Card {project} />
    {/each}
  </div>
  {#if !searchResultsLoaded && !allSearchLoaded}
    <div class="flex items-center justify-center mt-8">
      <button
        on:click={loadMoreSearchResults}
        class="px-[30px] py-[12px] bg-[#d1ea9a] rounded-full border-2 border-[#516027] text-[#516027] text-xl font-normal leading-snug"
        >Load more</button
      >
    </div>
  {/if}

  <!-- Category Results -->
{:else if selectedTag}
  <div
    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-[1156px] mx-auto px-[13.70px] pt-[13.70px] pb-[20.55px] text-5xl font-semibold mt-12"
  >
    Projects in: "{selectedTag}"
  </div>
  {#if categoryResult.length > 0}
    <div
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-[1156px] mx-auto px-[13.70px] pt-[13.70px] pb-[20.55px]"
    >
      {#each categoryResult as project}
        <Card {project} />
      {/each}
    </div>

    {#if !categoryResultLoaded && !allCategoryLoaded}
      <div class="flex items-center justify-center mt-8">
        <button
          on:click={loadMoreCategoryResults}
          class="px-[30px] py-[12px] bg-[#d1ea9a] rounded-full border-2 border-[#516027] text-[#516027] text-xl font-normal leading-snug"
          >Load more</button
        >
      </div>
    {/if}
  {:else}
    <p>No projects found for "{selectedTag}".</p>
  {/if}
{:else if !searchTerm}
  <div
    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-[1156px] mx-auto px-[13.70px] pt-[13.70px] pb-[20.55px] text-5xl font-semibold mt-12"
  >
    Top Projects
  </div>
  <div
    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-[1156px] mx-auto px-[13.70px] pt-[13.70px] pb-[20.55px]"
  >
    {#if topProjects.length > 0}
      {#each topProjects as project}
        <Card {project} />
      {/each}
    {:else}
      <p>No projects found.</p>
    {/if}
  </div>

  <div
    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-[1156px] mx-auto px-[13.70px] pt-[13.70px] pb-[20.55px] text-5xl font-semibold mt-20"
  >
    All Projects
  </div>
  <div
    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-[1156px] mx-auto px-[13.70px] pt-[13.70px] pb-[20.55px]"
  >
    {#if allProjects.length > 0}
      {#each allProjects as project}
        <Card {project} />
      {/each}
    {:else}
      <p>No projects found.</p>
    {/if}
  </div>

  {#if !allProjectsLoaded}
    <div class="flex items-center justify-center">
      <div
        class="px-[30px] py-[12px] bg-[#d1ea9a] rounded-full border-2 border-[#516027] inline-flex items-center"
      >
        <button on:click={loadMoreProjects} class="text-[#516027] text-xl font-normal leading-snug"
          >Load more</button
        >
      </div>
    </div>
  {/if}
{:else}
  <p class="text-center">No search results found.</p>
{/if}
