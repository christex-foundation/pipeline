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
  class="top-0 left-0 right-0 z-[99999] h-[84px] px-4 md:px-8 py-5 bg-[#0b383c] backdrop-blur-[15px] flex justify-between items-center relative"
>
  <div class="flex items-center h-6 gap-4 md:gap-12 grow-0">
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

  <div class="hidden lg:flex w-full max-w-[480px] justify-center items-center">
    <div
      class="w-full pl-4 pr-3 bg-[#115d5b] rounded-[48.77px] flex justify-between items-center align-center"
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

  <div class="hidden lg:flex grow-0 h-[42.67px] justify-end items-center gap-4">
    <div class="flex items-center gap-4">
      <a href="/" class="text-white text-base font-semibold font-['Inter'] leading-none"> Tasks </a>

      <div class="relative resources-dropdown">
        <button
          on:click={toggleResources}
          class="flex items-center justify-between w-full px-4 py-4 border-b focus:outline-none border-cyan-800"
        >
          <span class="text-white text-base font-semibold font-['Inter'] leading-none">
            Resources
          </span>
          <Icon
            icon="radix-icons:caret-down"
            class="text-2xl text-white transform transition-transform duration-200 {isResourcesOpen &&
              'rotate-180'}"
          />
        </button>

        {#if isResourcesOpen}
          <div
            class="absolute left-0 z-100 w-[15vh] mt-2 rounded-md shadow-lg bg-cyan-900 top-full"
          >
            <a
              href="/resources/pipeline"
              class="block w-full px-4 py-3 text-left text-[#d1ea9a] hover:bg-cyan-800"
              >About Pipeline</a
            >
            <a
              href="/resources/digital-public-good"
              class="block w-full px-4 py-3 text-left text-[#d1ea9a] hover:bg-cyan-800"
              >About DPGs</a
            >
          </div>
        {/if}
      </div>
    </div>

    <!-- User Authentication -->
    <div>
      {#if data.isAuthenticated}
        <UserProfile {data} />
      {:else}
        <a href="/sign-in" class="px-4 py-4 bg-[#d1ea9a] rounded-3xl text-base font-semibold">
          Sign up / Log in
        </a>
      {/if}
    </div>
  </div>

  <!-- Mobile Menu -->
  {#if isMobileMenuOpen}
    <div class="absolute top-[84px] left-0 right-0 bg-[#0b383c] lg:hidden w-[100%]">
      <div class="flex flex-col w-full px-8 py-4 space-y-4 ">
        <!-- Mobile Search -->
        <div class="w-full max-w-[480px] justify-center items-center mb-2">
          <div
            class="w-full pl-4 pr-3 bg-[#115d5b] rounded-[48.77px] flex justify-between items-center align-center py-2 max-lg:w-full"
          >
            <button
              type="button"
              class="flex justify-between w-full mt-2"
              on:click={() => ($searchBarOpen = !$searchBarOpen)}
            >
              <span
                class="text-white text-base font-semibold font-['Inter'] leading-none ml-[-18px] max-lg:px-8"
                >Search for a project...</span
              >
              <!-- <Icon
                icon="radix-icons:caret-down"
                class="text-2xl text-white transform transition-transform duration-200 {isResourcesOpen &&
                  'rotate-180'}"
              /> -->
            </button>
          </div>
        </div>

        <!-- Other Menu Items -->
        <a href="/" class="text-white text-base font-semibold font-['Inter']"> Tasks </a>

        <!-- Mobile Resources Dropdown -->
        <div class="relative resources-dropdown">
          <button
            on:click={toggleResources}
            class="flex items-center justify-between w-full px-4 py-4 border-b focus:outline-none border-cyan-800"
          >
            <span class="text-white text-base font-semibold font-['Inter'] leading-none ml-[-18px]">
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

          {#if isResourcesOpen}
            <div
              class="absolute right-0 z-[9999] top-6 w-[25vh] mt-2 rounded-md shadow-lg bg-cyan-900"
            >
              <a
                href="/resources/pipeline"
                class="block w-full px-4 py-3 text-left text-[#d1ea9a] hover:bg-cyan-800"
                >About Pipeline</a
              >
              <a
                href="/resources/digital-public-good"
                class="block w-full px-4 py-3 text-left text-[#d1ea9a] hover:bg-cyan-800"
                >About DPGs</a
              >
            </div>
          {/if}
        </div>

        <!-- Mobile Authentication -->
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
