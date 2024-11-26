<script>
  import { createEventDispatcher } from 'svelte';
  import SearchBar from './SearchBar.svelte';
  import UserProfile from './UserProfile.svelte';
  import Logo from './Logo.svelte';
  import { onMount } from 'svelte';

  let isResourcesOpen = false;
  let isMenuOpen = false;
  let isMobileMenuOpen = false;

  const dispatch = createEventDispatcher();


  let searchTerm = '';
  let searchPage = 1;
  let itemsPerPage = 10;
  let searchResults = [];
  let allSearchLoaded = false;
  let error = null;
  let loading = false;
  let searchResultsLoaded = false;

  export let data;

  function toggleResources() {
    isResourcesOpen = !isResourcesOpen;
  }

  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
  }

  function closeResources(event) {
    if (!event.target.closest('.resources-dropdown')) {
      isResourcesOpen = false;
    }
  }

  function toggleMobileMenu() {
    isMobileMenuOpen = !isMobileMenuOpen;
    if (!isMobileMenuOpen) {
      isResourcesOpen = false;
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

  function handleInput(event) {
    searchTerm = event.target.value;
    dispatch('search', { searchTerm });
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

  onMount(() => {
    document.addEventListener('click', closeResources);
    return () => {
      document.removeEventListener('click', closeResources);
    };
  });


</script>



<header class=" top-0 left-0 right-0 z-[99999] h-[84px] px-4 md:px-8 py-5 bg-[#0b383c] backdrop-blur-[15px] flex justify-between items-center relative">

  <div class="flex items-center h-6 gap-4 md:gap-12 grow-0">
    <Logo />
  </div>

  <div class="flex items-center md:hidden">
    <button 
      on:click={toggleMobileMenu}
      class="text-white focus:outline-none"
      aria-label="Toggle mobile menu"
    >
      {#if isMobileMenuOpen}

        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      {:else}

        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      {/if}
    </button>
  </div>

  <div class="hidden md:flex w-full max-w-[480px] justify-center items-center">
    <div class="w-full pl-4 pr-3 py-3 bg-[#115d5b] rounded-[48.77px] flex justify-between items-center">
      <input
        type="text"
        placeholder="Search Projects"
        class="bg-transparent text-left text-[#a0a0a0] text-[13px] font-normal font-['Inter'] leading-tight tracking-tight outline-none flex-grow"
        bind:value={searchTerm} on:input={handleInput}/>
      <button aria-label="Search" class="relative w-5 h-5">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g id="MagnifyingGlass">
            <path id="Vector" d="M8.75 15.001C12.2018 15.001 15 12.2028 15 8.75098C15 5.2992 12.2018 2.50098 8.75 2.50098C5.29822 2.50098 2.5 5.2992 2.5 8.75098C2.5 12.2028 5.29822 15.001 8.75 15.001Z" fill="#0D909C" fill-opacity="0.3" stroke="#A0A0A0" stroke-width="1.00699" stroke-linecap="round" stroke-linejoin="round"/>
            <path id="Vector_2" d="M13.1697 13.1699L17.5001 17.5004" stroke="#A0A0A0" stroke-width="1.00699" stroke-linecap="round" stroke-linejoin="round"/>
          </g>
        </svg>
      </button>
    </div>
  </div>


  <div class="hidden md:flex grow-0 h-[42.67px] justify-end items-center gap-4">
    <div class="flex items-center gap-4">
      <a href="/" class="text-white text-base font-semibold font-['Inter'] leading-none">
        Tasks
      </a>
      <div class="relative resources-dropdown">
        <button
        on:click={toggleResources}
        class="flex items-center justify-between w-full px-4 py-4 border-b focus:outline-none border-cyan-800"
      >
          <span class="text-white text-base font-semibold font-['Inter'] leading-none">Resources</span>
          <svg width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-[17px] transform transition-transform duration-200 {isResourcesOpen ? 'rotate-180' : ''}">
            <g id="CaretDown" clip-path="url(#clip0_1224_8929)">
              <path id="Vector" d="M10.0837 4.5L6.33374 8.25L2.58374 4.5" stroke="white" stroke-width="1.67" stroke-linecap="round" stroke-linejoin="round"/>
            </g>
            <defs>
              <clipPath id="clip0_1224_8929">
                <rect width="12" height="12" fill="white" transform="translate(0.334106)"/>
              </clipPath>
            </defs>
          </svg>
        </button>
        {#if isResourcesOpen}
        
          <div class="absolute left-0 z-100 w-[15vh] mt-2 rounded-md shadow-lg bg-cyan-900 top-full">
            <a
              href="/resources/pipeline"
              class="block w-full px-4 py-3 text-left text-[#d1ea9a] hover:bg-cyan-800"
            >About Pipeline</a>
            <a
              href="/resources/digital-public-good"
              class="block w-full px-4 py-3 text-left text-[#d1ea9a] hover:bg-cyan-800"
            >About DPGs</a>
          </div>
          
        {/if}
      </div>
    </div>
    <div>
      {#if data.isAuthenticated}
        <UserProfile {data} />
      {:else}
        <a 
          href="/sign-in" 
          class="px-4 py-4 bg-[#d1ea9a] rounded-3xl text-base font-semibold"
        >
          Sign up / Log in
        </a>
      {/if}
    </div>
  </div>


  {#if isMobileMenuOpen}
    <div class="absolute top-[84px] left-0 right-0 bg-[#0b383c] md:hidden">
      <div class="flex flex-col p-4 space-y-4">

        <div class="w-full pl-4 pr-3 py-3 bg-[#115d5b] rounded-[48.77px] flex justify-between items-center">
          <input
            type="text"
            placeholder="Search Projects"
            class="bg-transparent text-left text-[#a0a0a0] text-[13px] font-normal font-['Inter'] leading-tight tracking-tight outline-none flex-grow"
            on:input={handleInput}/>
          <button aria-label="Search" class="relative w-5 h-5">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g id="MagnifyingGlass">
                <path id="Vector" d="M8.75 15.001C12.2018 15.001 15 12.2028 15 8.75098C15 5.2992 12.2018 2.50098 8.75 2.50098C5.29822 2.50098 2.5 5.2992 2.5 8.75098C2.5 12.2028 5.29822 15.001 8.75 15.001Z" fill="#0D909C" fill-opacity="0.3" stroke="#A0A0A0" stroke-width="1.00699" stroke-linecap="round" stroke-linejoin="round"/>
                <path id="Vector_2" d="M13.1697 13.1699L17.5001 17.5004" stroke="#A0A0A0" stroke-width="1.00699" stroke-linecap="round" stroke-linejoin="round"/>
              </g>
            </svg>
          </button>
        </div>

        <a href="/" class="text-white text-base font-semibold font-['Inter']">
          Tasks
        </a>

        <div class="relative resources-dropdown">
          <button
          on:click={toggleResources}
          class="flex items-center justify-between w-full px-4 py-4 border-b focus:outline-none border-cyan-800"
        >
            <span class="text-white text-base font-semibold font-['Inter'] leading-none ml-[-18px]">Resources</span>
            <svg width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-[17px] transform transition-transform duration-200 {isResourcesOpen ? 'rotate-180' : ''}">
              <g id="CaretDown" clip-path="url(#clip0_1224_8929)">
                <path id="Vector" d="M10.0837 4.5L6.33374 8.25L2.58374 4.5" stroke="white" stroke-width="1.67" stroke-linecap="round" stroke-linejoin="round"/>
              </g>
              <defs>
                <clipPath id="clip0_1224_8929">
                  <rect width="12" height="12" fill="white" transform="translate(0.334106)"/>
                </clipPath>
              </defs>
            </svg>
          </button>
          {#if isResourcesOpen}
            <div class="absolute right-0 z-[9999] top-6 w-[25vh] mt-2 rounded-md shadow-lg bg-cyan-900">
              <a
                href="/resources/pipeline"
                class="block w-full px-4 py-3 text-left text-[#d1ea9a] hover:bg-cyan-800"
              >About Pipeline</a>
              <a
                href="/resources/digital-public-good"
                class="block w-full px-4 py-3 text-left text-[#d1ea9a] hover:bg-cyan-800"
              >About DPGs</a>
            </div>
          {/if}
        </div>
        


        <div>
          {#if data.isAuthenticated}
            <UserProfile {data} />
          {:else}
            <a 
              href="/sign-in" 
              class="block w-full text-center px-4 py-4 bg-[#d1ea9a] rounded-3xl text-base font-semibold"
            >
              Sign up / Log in
            </a>
          {/if}
        </div>
      </div>
    </div>
  {/if}
</header>

