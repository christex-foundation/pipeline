<!-- <script>
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
  <div 
    class="flex items-center justify-center cursor-pointer"
    on:click={loadMoreProjects}
    on:keydown={(e) => e.key === 'Enter' && loadMoreProjects()}
    role="button"
    tabindex="0"
  >
    <div
      class="px-[30px] py-[12px] bg-[#d1ea9a] rounded-full border-2 border-[#516027] inline-flex items-center hover:bg-[#c1da8a] transition-colors duration-300"
    >
      <span class="text-[#516027] text-xl font-normal leading-snug">
        Load more
      </span>
    </div>
  </div>
{/if}
{:else}
  <p class="text-center">No search results found.</p>
{/if} -->


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

<div class="flex flex-col justify-center w-full max-w-[1470px] mx-auto gap-6 px-6 mt-8 md:flex-row">


  <aside class="w-full md:w-[28%] max-md:overflow-x-auto mt-[-15px] md:mb-0">
    <div 
      class="flex p-4 space-x-2 overflow-x-scroll rounded-md shadow-sm md:flex-col md:overflow-x-visible md:space-x-0 md:space-y-2"
      style="position: sticky; top: 0; height: fit-content;"
    >
      <h2 class="hidden mb-4 text-xl font-semibold text-gray-800 md:block">
        SDGs
      </h2>
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
      <div class="text-xl font-semibold text-gray-700 col-span-full">
        Top Projects
      </div>
      {#if topProjects.length > 0}
        {#each topProjects as project}
          <Card {project} />
        {/each}
      {:else}
        <p class="text-center text-gray-600 col-span-full">No projects found.</p>
      {/if}

      <div class="mt-8 text-xl font-semibold text-gray-700 col-span-full">
        All Projects
      </div>
      {#if allProjects.length > 0}
        {#each allProjects as project}
          <Card {project} />
        {/each}
        {#if !allProjectsLoaded}
<div class="flex flex-row justify-end w-[1000px]">
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
          <span class="text-[#516027] text-xl font-normal leading-snug">
            Load more
          </span>
        </div>
      </div>
    </div>
        {/if}
      {:else}
        <p class="text-center text-gray-600 col-span-full">No projects found.</p>
      {/if}

    {:else}
      <p class="text-center text-gray-600 col-span-full">
        No search results found.
      </p>
    {/if}
  </section>
</div>
