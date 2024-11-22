

<script>
  import { onMount } from "svelte";
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
  
  let loading = true;

  let categories = [];

  async function fetchAllCategories() {
    try {
      const response = await fetch('/api/categories', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const data = await response.json();

      categories = [
        { id: 0, title: "All Projects", active: true },
        ...data.categories.map(category => ({ ...category, active: false }))
      ];
    } catch (error) {
      
    }
  }

  onMount(() => {
    fetchAllCategories();
  })

  function setActiveCategory(selectedCategory) {

    if (selectedCategory.id === 0) {
      setAllProjects();
      return;
    }

    categories = categories.map(category => ({
      ...category,
      active: category.title === selectedCategory.title
    }));

    dispatch('categorySelected', selectedCategory);

  }

  function setAllProjects(){
    categories = categories.map(category => ({ ...category, active: false }));
    dispatch('categorySelected', '');
  }


</script>

<nav
  class="flex flex-wrap items-center max-w-full gap-2 pb-4 mt-8 overflow-x-auto text-sm leading-none text-lime-800"
  style="scroll-snap-type: x mandatory;"
  aria-label="Project Categories"
>

  {#each categories as category}
  <div class="h-[29px] px-3 py-2 rounded-[36px] border-2 justify-center items-center inline-flex 
              {category.active ? 'bg-[#e9f5d3] border-[#bfce95]' : 'bg-white border-neutral-200'}">
    <button 
      class="text-center text-[13px] font-base font-['Inter'] leading-[13px] 
              {category.active ? 'text-black' : 'text-black'}"
      aria-current={category.active ? 'page' : undefined}
      on:click={() => setActiveCategory(category)}> 
      {category.title}
    </button>
  </div>
{/each}


  
</nav>

