<script>
  import { onMount } from 'svelte';

  let isDropdownOpen = false;
  let selectedOption = 'Sort by';

  function toggleDropdown() {
    isDropdownOpen = !isDropdownOpen;
  }

  function selectOption(option) {
    selectedOption = option;
    isDropdownOpen = false;
  }

  function closeDropdown(event) {
    if (!event.target.closest('.dropdown')) {
      isDropdownOpen = false;
    }
  }

  onMount(() => {
    document.addEventListener('click', closeDropdown);
    return () => {
      document.removeEventListener('click', closeDropdown);
    };
  });
</script>

<div
  class="dropdown relative my-auto flex items-center justify-center gap-1.5 self-stretch rounded-[43px] bg-teal-950 px-6 py-4 max-md:px-2"
  role="button"
  tabindex="0"
>
  <button
    on:click={toggleDropdown}
    class="dropdown relative my-auto flex items-center justify-center gap-1.5 self-stretch rounded-[43px] bg-teal-950 px-2 max-md:px-5"
    role="button"
    tabindex="0"
  >
    <span class="my-auto cursor-pointer self-stretch text-lg">{selectedOption}</span>
    <img
      loading="lazy"
      src="https://cdn.builder.io/api/v1/image/assets/TEMP/06ffd7e20c2e1885ffcdb09988de28f3f926e106789fafcb6c3b52dba9b903f8?placeholderIfAbsent=true&apiKey=567aaefef2da4f73a3149c6bc21f1ea8"
      alt=""
      class="my-auto aspect-square w-6 shrink-0 self-stretch object-contain"
    />
  </button>

  {#if isDropdownOpen}
    <div class="absolute top-12 z-10 mt-2 w-48 rounded-md bg-teal-950 shadow-lg">
      <ul class="py-2">
        <li class="cursor-pointer px-4 py-2" on:click={() => selectOption('Option 1')}>Option 1</li>
        <li class="cursor-pointer px-4 py-2" on:click={() => selectOption('Option 2')}>Option 2</li>
        <li class="cursor-pointer px-4 py-2" on:click={() => selectOption('Option 3')}>Option 3</li>
      </ul>
    </div>
  {/if}
</div>

<style>
  .dropdown {
    position: relative;
  }
</style>
