<script>
  import SearchBar from './SearchBar.svelte';
  import UserProfile from './UserProfile.svelte';
  import Logo from './Logo.svelte';
  import { onMount, onDestroy } from 'svelte';
  import { afterNavigate } from '$app/navigation';

  let isResourcesOpen = false;
  let isMenuOpen = false;
  let dropdown;

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

  function handleScroll() {
    if (isMenuOpen) {
      isMenuOpen = false;
    }
  }

  function handleClickOutside(event) {
    const dropdown = document.querySelector('.dropdown-menu');
    if (isMenuOpen && dropdown && !dropdown.contains(event.target)) {
      isMenuOpen = false;
    }
  }

  onMount(() => {
    window.addEventListener('scroll', handleScroll);
    document.addEventListener('click', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleClickOutside);
    };
  });

  // close the resources dropdown on every navigation
  afterNavigate(() => (isResourcesOpen = false));
</script>

<header class="flex items-center justify-between w-full px-6 py-4 bg-cyan-950 lg:px-16">
  <div class="flex items-center justify-between w-full mt-2">
    <Logo />

    <button
      class="z-50 lg:hidden text-[#d1ea9a] focus:outline-none"
      on:click={toggleMenu}
      aria-label="Toggle Menu"
    >
      <svg
        class="w-8 h-8"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 6h16M4 12h16m-7 6h7"
        />
      </svg>
    </button>

    <nav
      class="items-center self-stretch hidden gap-10 my-auto text-sm font-medium leading-none text-center lg:flex text-[#d1ea9a]"
    >
      <a href="/explore" class="gap-0.5 self-stretch my-auto text-base">Explore Projects</a>

      <div class="relative resources-dropdown">
        <button
          on:click={toggleResources}
          class="flex gap-0.5 items-center self-stretch my-auto whitespace-nowrap focus:outline-none"
        >
          <span class="self-stretch my-auto text-bas">Resources</span>
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/e816977c627d70abd1c95d4ce2ad2f32e49e85597447cdf82aaa7f9042ea8b80"
            alt=""
            class="object-contain shrink-0 self-stretch my-auto aspect-square w-[17px] transform transition-transform duration-200 {isResourcesOpen
              ? 'rotate-180'
              : ''}"
          />
        </button>
        {#if isResourcesOpen}
          <div
            class="absolute z-10 w-48 py-2 mt-2 transform -translate-x-1/2 rounded-md shadow-lg top-full left-1/2 bg-cyan-900"
          >
            <a
              href="/resources/pipeline"
              class="block px-4 py-3 text-left text-[#d1ea9a] hover:bg-cyan-800 text-bas"
              >About Pipeline</a
            >
            <a
              href="/resources/digital-public-good"
              class="block px-4 py-3 text-left text-[#d1ea9a] hover:bg-cyan-800 text-bas"
              >About DPGs</a
            >
          </div>
        {/if}
      </div>
      <a href="/" class="gap-0.5 self-stretch my-auto text-base">Contact Us</a>
    </nav>

    <div class="hidden lg:flex gap-3.5 items-center self-stretch my-auto z-40">
      <SearchBar />
      {#if data.isAuthenticated}
        <UserProfile {data} />
      {:else}
        <a href="/sign-in" class="px-4 py-2 text-sm bg-[#d1ea9a] rounded-full">
          Sign up / Log in
        </a>
      {/if}
    </div>
  </div>

  {#if isMenuOpen}
    <div
      bind:this={dropdown}
      class="fixed top-0 right-0 z-40 flex flex-col items-start w-1/2 p-5 h-96 bg-cyan-950 text-[#d1ea9a] shadow-lg lg:hidden overflow-y-auto"
    >
      <div class="w-full pt-4 mt-4 border-b border-cyan-800">
        <div class="mb-2 ml-4">
          <UserProfile />
        </div>
      </div>

      <nav
        class="flex flex-col items-start w-full gap-4 mt-4 text-sm font-medium leading-none text-left"
      >
        <a href="/explore" class="block w-full px-4 py-2 border-b border-cyan-800"
          >Explore Projects</a
        >

        <div class="relative w-full resources-dropdown">
          <button
            on:click={toggleResources}
            class="flex items-center justify-between w-full px-4 py-4 border-b focus:outline-none border-cyan-800"
          >
            <span>Resources</span>
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/e816977c627d70abd1c95d4ce2ad2f32e49e85597447cdf82aaa7f9042ea8b80"
              alt=""
              class="w-[17px] transform transition-transform duration-200 {isResourcesOpen
                ? 'rotate-180'
                : ''}"
            />
          </button>
          {#if isResourcesOpen}
            <div class="absolute left-0 z-50 w-full mt-2 rounded-md shadow-lg bg-cyan-900">
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
        <a href="/" class="block w-full px-4 py-2 border-b border-cyan-800">Contact Us</a>
      </nav>
    </div>
  {/if}
</header>
