<script>
	import ProjectCategory from '../../lib/ProjectCategory.svelte';
    import Nav from '../../lib/Nav.svelte';   
    import Search from '../../lib/Search.svelte';
    import CategoryDropdown from '../../lib/CategoryDropdown.svelte';
    import SortDropdown from '../../lib/SortDropdown.svelte';
    import Card from '../../lib/Card.svelte';
    import Footer from '../../lib/Footer.svelte';
  import { onMount } from 'svelte';
  
    let activeCategory = 'Categories';
    let activeFilter = 'All projects';
  
    const filters = ['All projects', 'Design', 'Engineering', 'Art', 'Development'];   

    let allProjects = []
    let topProjects = []
    let loading = true;
    let error = null;


    async function fetchAllProjects() {
        try {
            const response = await fetch('/api/projects/allprojects', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
            throw new Error(response.statusText);
            }

            const data = await response.json();

            allProjects = data.projects;

        }  catch (error) {
        error = e.message;
        alert(error);
      }finally{
        loading = false;
      }
    }

    async function fetchTopProjects() {
        try {
            const response = await fetch('/api/projects/allprojects', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
            throw new Error(response.statusText);
            }

            const data = await response.json();

            topProjects = data.projects.slice(0, 3);

        }  catch (error) {
        error = e.message;
        alert(error);
      }finally{
        loading = false;
      }
    }

onMount(() => {
    fetchAllProjects();
    fetchTopProjects();
})

</script>

<div class="w-full min-h-screen bg-white">
    <Nav />
    <div class="w-full bg-[#d1ea9a]/90 py-16">
        <div class="max-w-4xl mx-auto text-center">
            <h1 class="text-[#08292c] text-[45.43px] font-semibold font-['PP Mori'] leading-[54.51px]">
                Discover impact projects, donate directly,<br/>& participate in funding rounds.
                
            </h1>
        </div>
    </div>

    <div class="flex justify-center w-full px-4">
        <main class="flex flex-col mt-24 w-full text-2xl max-w-[965px] max-md:mt-10 max-md:max-w-full">
            <section class="flex flex-wrap items-center justify-between w-full gap-5 font-thin leading-none text-center text-lime-100 max-md:max-w-full">
                <Search />
                <CategoryDropdown />
                <SortDropdown />
            </section>
            <ProjectCategory />
        </main>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-[1156px] mx-auto px-[13.70px] pt-[13.70px] pb-[20.55px] text-5xl font-semibold mt-20">Top Projects</div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-[1156px] mx-auto px-[13.70px] pt-[13.70px] pb-[20.55px]">
        {#if topProjects.length > 0}    
            {#each topProjects as project}
        <Card {project}/> 
        {/each}
        {:else}
        <p>No projects found.</p>
      
        {/if}
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-[1156px] mx-auto px-[13.70px] pt-[13.70px] pb-[20.55px] text-5xl font-semibold mt-20">All Projects</div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-[1156px] mx-auto px-[13.70px] pt-[13.70px] pb-[20.55px]">
        {#if allProjects.length > 0}    
            {#each allProjects as project}
        <Card {project}/> 
        {/each}
        {:else}
        <p>No projects found.</p>
      
        {/if}
    </div>

    <div class="flex items-center justify-center">
        <div class="px-[30px] py-[18px] bg-[#d1ea9a] rounded-full border-2 border-[#516027] inline-flex items-center">
          <button class="text-[#516027] text-xl font-normal font-['Inter'] leading-snug">Load more</button>
        </div>
      </div>
      
  
    <Footer />
</div>