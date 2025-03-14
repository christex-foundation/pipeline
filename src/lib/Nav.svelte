<script>
  import UserProfile from './UserProfile.svelte';
  import Logo from './Logo.svelte';
  import { onMount } from 'svelte';
  import { searchBarOpen } from './utils.js';
  import Icon from '@iconify/svelte';

  let isResourcesOpen = false;
  let isMobileMenuOpen = false;
  let isSearchModalOpen = false;

  function toggleResources() {
    isResourcesOpen = !isResourcesOpen;
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

  onMount(() => {
    document.addEventListener('click', closeResources);

    if (isSearchModalOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    document.addEventListener('click', closeResources);
    return () => {
      document.removeEventListener('click', closeResources);
    };
  });

  export let data = {
    isAuthenticated: false,
    user: null,
  };
</script>

<header
  class="relative left-0 right-0 top-0 z-[99999] flex h-[84px] items-center justify-between bg-[#0b383c] px-4 py-5 backdrop-blur-[15px] md:px-8"
>
  <div class="flex items-center h-6 gap-4 grow-0 md:gap-12">
    <Logo />
  </div>

  <div class="flex items-center md:flex lg:flex">
    <button
      on:click={toggleMobileMenu}
      class="text-white focus:outline-none lg:hidden"
      aria-label="Toggle mobile menu"
    >
      {#if isMobileMenuOpen}
        <Icon icon="mdi:close" class="text-2xl" />
      {:else}
        <Icon icon="mdi:hamburger-menu" class="text-2xl" />
      {/if}
    </button>
  </div>

  <div class="hidden w-full max-w-[480px] items-center justify-center lg:flex">
    <div
      class="align-center flex w-full items-center justify-between rounded-[48.77px] bg-[#115d5b] pl-4 pr-3"
    >
      <button
        type="button"
        class="flex items-center justify-between w-full p-2"
        on:click={() => ($searchBarOpen = !$searchBarOpen)}
      >
        <span class="text-sm text-white/50">Search for a project....</span>
        <Icon icon="mdi:search" class="text-2xl text-white/50" />
      </button>
    </div>
  </div>

  <div class="hidden h-[42.67px] grow-0 items-center justify-end gap-4 lg:flex">
    <div class="flex items-center gap-4">
      <a href="/" class="font-['Inter'] text-base font-semibold leading-none text-white"> Tasks </a>
<<<<<<< HEAD
             
=======

>>>>>>> upstream/main
      <div class="relative resources-dropdown">
        <button
          on:click={toggleResources}
          class="flex items-center justify-between w-full px-4 py-4 border-b border-cyan-800 focus:outline-none"
        >
          <span class="font-['Inter'] text-base font-semibold leading-none text-white">
            Resources
          </span>
          <Icon
            icon="radix-icons:caret-down"
            class="transform text-2xl text-white transition-transform duration-200 {isResourcesOpen &&
              'rotate-180'}"
          />
        </button>
         <!--The dropdown links were styled to prevent text from breaking onto a new line and to include a rounded hover effect.-->
        {#if isResourcesOpen}
          <div
            class="absolute left-0 block mt-2 rounded-md shadow-lg w-36 z-100 top-full bg-cyan-900" 
          >
            <a
              href="/resources/pipeline"
              class="flex w-full px-4 py-3 text-left text-[#d1ea9a] hover:bg-cyan-800 hover:rounded-md"
              >About Pipeline</a
            >
            <a
              href="/resources/digital-public-good"
              class="flex w-full px-4 py-3 text-left text-[#d1ea9a] hover:bg-cyan-800 hover:rounded-md"
              >About DPGs</a
            >
          </div>
        {/if}
      </div>
    </div>

    <div>
      {#if data.isAuthenticated}
        <UserProfile {data} />
      {:else}
        <a href="/sign-in" class="rounded-3xl bg-[#d1ea9a] px-4 py-4 text-base font-semibold">
          Sign up / Log in
        </a>
      {/if}
    </div>
  </div>

  {#if isMobileMenuOpen}
    <div class="absolute left-0 right-0 top-[84px] w-[100%] bg-[#0b383c] lg:hidden">
      <div class="flex flex-col w-full px-8 py-4 space-y-4">
<<<<<<< HEAD
        <!-- Mobile Search -->
=======
>>>>>>> upstream/main
        <div class="mb-2 w-full max-w-[480px] items-center justify-center">
          <div
            class="align-center flex w-full items-center justify-between rounded-[48.77px] bg-[#115d5b] py-2 pl-4 pr-3 max-lg:w-full"
          >
            <button
              type="button"
<<<<<<< HEAD
              class="flex justify-between w-full "
              on:click={() => ($searchBarOpen = !$searchBarOpen)}
            >
              <span
                class="ml-[-18px] font-['Inter'] text-base py-2 font-semibold leading-none text-white/50 max-lg:px-8"
=======
              class="flex justify-between w-full mt-2"
              on:click={() => ($searchBarOpen = !$searchBarOpen)}
            >
              <span
                class="ml-[-18px] font-['Inter'] text-base font-semibold leading-none text-white max-lg:px-8 max-md:mb-[4px]"
>>>>>>> upstream/main
                >Search for a project...</span
              >
          </div>
        </div>

        <a href="/" class="font-['Inter'] text-base font-semibold text-white"> Tasks </a>

<<<<<<< HEAD
        <!-- Mobile Resources Dropdown -->
=======
>>>>>>> upstream/main
        <div class="relative resources-dropdown">
          <button
            on:click={toggleResources}
            class="flex items-center justify-between w-full px-4 py-4 border-b border-cyan-800 focus:outline-none"
          >
            <span class="ml-[-18px] font-['Inter'] text-base font-semibold leading-none text-white">
              Resources
            </span>
            <svg
              width="13"
              height="12"
              viewBox="0 0 13 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="w-[17px] transform transition-transform duration-200 {isResourcesOpen
                ? 'rotate-180'
                : ''}"
            >
              <g id="CaretDown" clip-path="url(#clip0_1224_8929)">
                <path
                  id="Vector"
                  d="M10.0837 4.5L6.33374 8.25L2.58374 4.5"
                  stroke="white"
                  stroke-width="1.67"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_1224_8929">
                  <rect width="12" height="12" fill="white" transform="translate(0.334106)" />
                </clipPath>
              </defs>
            </svg>
          </button>
         <!--The dropdown links were styled to prevent them from floating so they can properly extend the navbar downward when clicked.-->
          {#if isResourcesOpen}
            <div
              class=" block right-0 top-6 z-[9999] mt-2 w-36"
            >
              <a
                href="/resources/pipeline"
                class="flex w-full px-4 py-3 text-left text-[#d1ea9a] hover:bg-cyan-800 hover:rounded-md"
                >About Pipeline</a
              >
              <a
                href="/resources/digital-public-good"
                class="flex w-full px-4 py-3 text-left text-[#d1ea9a] hover:bg-cyan-800 hover:rounded-md"
                >About DPGs</a
              >
            </div>
          {/if}
        </div>

        <div>
          {#if data.isAuthenticated}
            <UserProfile {data} />
          {:else}
            <a
              href="/sign-in"
              class="block w-full rounded-3xl bg-[#d1ea9a] px-4 py-4 text-center text-base font-semibold"
            >
              Sign up / Log in
            </a>
          {/if}
        </div>
      </div>
    </div>
  {/if}
</header>
