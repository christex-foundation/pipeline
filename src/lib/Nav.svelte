<script>
  import UserProfile from './UserProfile.svelte';
  import Logo from './Logo.svelte';
  import { onMount } from 'svelte';
  import { searchBarOpen } from './utils.js';
  import Icon from '@iconify/svelte';
  import { Button } from '$lib/components/ui/button';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu';

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
  });

  export let data = {
    isAuthenticated: false,
    user: null,
  };
</script>

<header
  class="relative left-0 right-0 top-0 z-[99999] flex h-[84px] items-center justify-between border-b border-dashboard-gray-700 bg-dashboard-gray-900 px-4 py-5 backdrop-blur-[15px] md:px-8"
>
  <div class="flex h-6 grow-0 items-center gap-4 md:gap-12">
    <Logo />
  </div>

  <div class="ml-auto flex items-center pr-6 md:flex lg:hidden">
    <Button
      on:click={toggleMobileMenu}
      class="border-dashboard-gray-600 text-white hover:bg-dashboard-gray-800 focus:outline-none "
      aria-label="Toggle mobile menu"
      variant="outline"
    >
      {#if isMobileMenuOpen}
        <Icon icon="mdi:close" class="text-2xl" />
      {:else}
        <Icon icon="mdi:hamburger-menu" class="text-2xl" />
      {/if}
    </Button>
  </div>

  <div class="hidden w-full max-w-[480px] items-center justify-center lg:flex">
    <div
      class="align-center flex w-full items-center justify-between rounded-full border border-dashboard-gray-600 bg-dashboard-gray-800 pl-4 pr-3"
    >
      <Button
        type="button"
        class="flex w-full items-center justify-between bg-transparent p-2 hover:bg-transparent"
        on:click={() => ($searchBarOpen = !$searchBarOpen)}
      >
        <span class="text-sm text-gray-400">Search for a project....</span>
        <Icon icon="mdi:search" class="text-2xl text-gray-400" />
      </Button>
    </div>
  </div>

  <div class="grow-0 items-center justify-end gap-4 lg:flex">
    {#if data.isAuthenticated}
      <UserProfile {data} />
    {:else}
      <div>
        <a
          href="/sign-in"
          class="rounded-xl bg-dashboard-yellow-400 px-6 py-3 text-label-lg font-semibold text-dashboard-black transition-colors hover:bg-dashboard-yellow-500 max-lg:hidden"
        >
          Sign up / Log in
        </a>
      </div>
    {/if}
  </div>

  {#if isMobileMenuOpen}
    <div
      class="absolute left-0 right-0 top-[84px] w-[100%] border-b border-dashboard-gray-700 bg-dashboard-gray-900 lg:hidden"
    >
      <div class="flex w-full flex-col space-y-4 px-8 py-4">
        <div class="mx-auto mb-2 w-full max-w-[480px] items-center justify-center">
          <div
            class="align-center flex w-full items-center justify-between rounded-full border border-dashboard-gray-600 bg-dashboard-gray-800 py-2 pl-4 pr-3 max-lg:w-full"
          >
            <Button
              type="button"
              class="flex w-full items-center justify-between bg-transparent p-2 hover:bg-transparent"
              on:click={() => ($searchBarOpen = !$searchBarOpen)}
            >
              <span class="text-sm text-gray-400">Search for a project....</span>
              <Icon icon="mdi:search" class="text-2xl text-gray-400" />
            </Button>
          </div>
        </div>

        <div class="pt-4">
          {#if !data.isAuthenticated}
            <a
              href="/sign-in"
              class="block w-full rounded-xl bg-dashboard-yellow-400 px-6 py-3 text-center text-label-lg font-semibold text-dashboard-black transition-colors hover:bg-dashboard-yellow-500"
            >
              Sign up / Log in
            </a>
          {/if}
        </div>
      </div>
    </div>
  {/if}
</header>
