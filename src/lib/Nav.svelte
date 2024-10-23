<!-- <script>
    import SearchBar from './SearchBar.svelte';
    import UserProfile from './UserProfile.svelte';
    import Logo from './Logo.svelte';
    import { onMount } from 'svelte';

    let isResourcesOpen = false;

    function toggleResources() {
        isResourcesOpen = !isResourcesOpen;
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

<header class="flex items-center justify-between pb-6 px-60 pt-11 bg-cyan-950 max-md:px-5">
  <div class="flex flex-wrap gap-10 justify-between items-center self-stretch my-auto min-w-[240px] w-[1298px]">
    <Logo />  
    <nav class="flex gap-10 justify-center items-center self-stretch my-auto text-sm font-medium leading-none text-center text-lime-300 min-w-[240px] max-md:max-w-full">
      <a href="/explore" class="gap-0.5 self-stretch my-auto">Explore Projects</a>
      <a href="/createProject" class="gap-2.5 self-stretch my-auto">Create Project</a>
      <div class="relative resources-dropdown">
        <button 
          on:click={toggleResources}
          class="flex gap-0.5 items-center self-stretch my-auto whitespace-nowrap focus:outline-none"
        >
          <span class="self-stretch my-auto">Resources</span>
          <img 
            loading="lazy" 
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/e816977c627d70abd1c95d4ce2ad2f32e49e85597447cdf82aaa7f9042ea8b80?placeholderIfAbsent=true&apiKey=567aaefef2da4f73a3149c6bc21f1ea8" 
            alt="" 
            class="object-contain shrink-0 self-stretch my-auto aspect-square w-[17px] transform transition-transform duration-200 {isResourcesOpen ? 'rotate-180' : ''}"
          />
        </button>
        {#if isResourcesOpen}
          <div class="absolute z-10 w-48 py-2 mt-2 transform -translate-x-1/2 rounded-md shadow-lg top-full left-1/2 bg-cyan-900">
            <a href="/about" class="block px-4 py-3 text-left text-lime-300 hover:bg-cyan-800">About Pipeline</a>
            <a href="/dpgs" class="block px-4 py-3 text-left text-lime-300 hover:bg-cyan-800">About DPGs</a>
          </div>
        {/if}
      </div>
    </nav>
    <div class="flex gap-3.5 items-center self-stretch my-auto min-w-[240px]">
      <SearchBar />
      <UserProfile />
    </div>
  </div>
</header>

<style>
  /* Add any additional styles here if needed */
</style> -->


<script>
  import SearchBar from './SearchBar.svelte';
  import UserProfile from './UserProfile.svelte';
  import Logo from './Logo.svelte';
  import { onMount } from 'svelte';

  let isResourcesOpen = false;

  function toggleResources() {
      isResourcesOpen = !isResourcesOpen;
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

<header class="flex justify-between items-center px-60 pt-11 pb-6 bg-cyan-950 max-md:px-5 w-[100%]">
  <div class="flex flex-wrap gap-10 justify-between items-center self-stretch my-auto min-w-[240px] w-[1298px]">
    <Logo />  
    <nav class="flex gap-10 justify-center items-center self-stretch my-auto text-sm font-medium leading-none text-center text-lime-300 min-w-[240px] max-md:max-w-full">
      <a href="/explore" class="gap-0.5 self-stretch my-auto">Explore Projects</a>
      <a href="/createProject" class="gap-2.5 self-stretch my-auto">Create Project</a>
      <div class="relative resources-dropdown">
        <button 
          on:click={toggleResources}
          class="flex gap-0.5 items-center self-stretch my-auto whitespace-nowrap focus:outline-none"
        >
          <span class="self-stretch my-auto">Resources</span>
          <img 
            loading="lazy" 
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/e816977c627d70abd1c95d4ce2ad2f32e49e85597447cdf82aaa7f9042ea8b80" 
            alt="" 
            class="object-contain shrink-0 self-stretch my-auto aspect-square w-[17px] transform transition-transform duration-200 {isResourcesOpen ? 'rotate-180' : ''}"
          />
        </button>
        {#if isResourcesOpen}
          <div class="absolute z-10 w-48 py-2 mt-2 transform -translate-x-1/2 rounded-md shadow-lg top-full left-1/2 bg-cyan-900">
            <a href="/about" class="block px-4 py-3 text-left text-lime-300 hover:bg-cyan-800">About Pipeline</a>
            <a href="/dpgs" class="block px-4 py-3 text-left text-lime-300 hover:bg-cyan-800">About DPGs</a>
          </div>
        {/if}
      </div>
    </nav>
    <div class="flex gap-3.5 items-center self-stretch my-auto min-w-[240px]">
      <SearchBar />
      <UserProfile /> <!-- This triggers the profile dropdown -->
    </div>
  </div>
</header>
