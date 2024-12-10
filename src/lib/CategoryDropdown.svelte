<!-- <script>
    import { onMount } from 'svelte';
  
    let isOpen = false;
  
    onMount(() => {
      const closeDropdown = (event) => {
        if (!event.target.closest("#dropdown-button") && !event.target.closest("#dropdown-menu")) {
          isOpen = false;
        }
      };
  
      document.addEventListener("click", closeDropdown);
  
      return () => {
        document.removeEventListener("click", closeDropdown);
      };
    });
  
    function toggleDropdown() {
      isOpen = !isOpen;
    }
  </script>
  

  <div id="dropdown-container" class="relative inline-block text-left">

    <div 
      id="dropdown-button"
      class="flex items-center justify-between h-[74px] px-8 py-4 bg-[#08292c] rounded-full cursor-pointer shadow-lg hover:bg-[#0a3a3c] transition-colors duration-200"
      on:click={toggleDropdown}
    >
      <span class="text-center text-[#e9f5d3] text-xl font-light font-['PP Mori']">Categories</span>
      <img 
        loading="lazy" 
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/2d4a598fdd378d1c45405bdd285edb8bea7753619f447a03c6873ef8e44ac6cf?placeholderIfAbsent=true&apiKey=567aaefef2da4f73a3149c6bc21f1ea8" 
        alt="" 
        class="object-contain w-8 h-8 ml-3 transition-transform duration-200 transform"
        class:rotate-180={isOpen} 
      />
    </div>
  

    {#if isOpen}
      <div 
        id="dropdown-menu"
        class="absolute left-0 mt-2 w-48 bg-[#08292c] rounded-lg shadow-md transform transition-all duration-300 ease-out opacity-0 scale-95 origin-top"
        class:opacity-100={isOpen}
        class:scale-100={isOpen}
      >
        <ul class="py-2 text-[#e9f5d3]">
          <li><a href="#" class="block px-4 py-2 hover:bg-[#0a3a3c] rounded-md transition-colors duration-200">Category 1</a></li>
          <li><a href="#" class="block px-4 py-2 hover:bg-[#0a3a3c] rounded-md transition-colors duration-200">Category 2</a></li>
          <li><a href="#" class="block px-4 py-2 hover:bg-[#0a3a3c] rounded-md transition-colors duration-200">Category 3</a></li>
        </ul>
      </div>
    {/if}
  </div>
  
   -->
