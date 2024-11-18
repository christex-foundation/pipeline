<script>
  import SearchBar from './SearchBar.svelte';
  import UserProfile from './UserProfile.svelte';
  import Logo from './Logo.svelte';
  import { onMount } from 'svelte';

  let isResourcesOpen = false;
  let isMenuOpen = false;

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

  onMount(() => {
    document.addEventListener('click', closeResources);
    return () => {
      document.removeEventListener('click', closeResources);
    };
  });
</script>

<header class="flex items-center justify-between w-full pb-6 px-60 pt-11 bg-cyan-950 max-md:px-5">
  <div
    class="flex flex-wrap gap-10 justify-between items-center self-stretch my-auto min-w-[240px] w-[1298px]"
  >
    <Logo />

    <button
      class="z-50 block md:hidden text-[#d1ea9a] focus:outline-none"
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
      class="items-center self-stretch hidden gap-10 my-auto text-sm font-medium leading-none text-center md:flex text-[#d1ea9a]"
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

    <div class="hidden md:flex gap-3.5 items-center self-stretch my-auto z-40">
      <SearchBar />
      {#if data.isAuthenticated}
        <UserProfile {data} />
      {:else}
        <a href="/sign-in" class="px-4 py-4 bg-[#d1ea9a] rounded-3xl max-md:px-3 max-md:py-3"
          >Sign up / Log in</a
        >
      {/if}
    </div>
  </div>

  {#if isMenuOpen}
    <div
      class="fixed right-0 z-40 flex flex-col items-center w-1/2 p-5 rounded-l-lg shadow-lg top-12 h-1/2 bg-cyan-950 text-[#d1ea9a]"
    >
      <div class="w-full pt-4 mt-4 border-b border-cyan-800">
        <div class="ml-[15px] mb-2">
          <UserProfile />
        </div>
      </div>
      <nav
        class="flex flex-col items-center w-full gap-4 text-sm font-medium leading-none text-center"
      >
        <a href="/explore" class="block w-full px-4 py-2 mr-3 border-b border-cyan-800"
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
            <div class="absolute left-0 z-50 w-full mt-2 rounded-md shadow-lg bg-cyan-900 top-full">
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
        <a href="/" class="block w-full px-4 py-2 mr-5 border-b border-cyan-800">Contact Us</a>
      </nav>
    </div>
  {/if}
</header>
