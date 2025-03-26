<!-- <script>
  import Contribute from '$lib/Contribute.svelte';
  import Apply from '$lib/apply.svelte';
  import { page } from '$app/stores';

  $: id = $page.params.id;
  export let data;
  let project = data.project;

  let steps = [
    { label: 'Funding', active: true },
    { label: 'Resources', active: false },
  ];

  function selectStep(index) {
    if (!steps[index].disabled) {
      steps = steps.map((step, i) => ({ ...step, active: i === index }));
    }
  }
</script>

<div class="w-full bg-[#d1ea9a]/90 py-16">
  <div class="max-w-4xl mx-auto text-center">
    <h1
      class="font-['Inter'] text-5xl font-semibold leading-[54.51px] text-[#08292c] max-lg:text-2xl"
    >
      You Are Contributing To - {project.title || 'Project Title'}
    </h1>
    <p class="mt-10 text-xl">Your contribution to this project will help bring it to life</p>
  </div>
</div>

<div
  class="mx-auto mt-12 flex w-[90%] justify-center space-x-6 rounded-full border-2 border-[#0b383c] py-1 sm:w-[75%] md:w-[50%]"
>
  {#each steps as step, index}
    <button
      class="w-[45%] rounded-full border-2 px-4 py-4 text-xl font-semibold transition duration-300 sm:w-[47%] sm:px-5 sm:py-5 sm:text-2xl md:px-6 md:py-6
             {step.active
        ? 'border-[#0b383c] bg-[#0b383c] text-lime-100'
        : ' border-none text-[#0b383c] opacity-50'}"
      on:click={() => selectStep(index)}
      disabled={step.disabled}
    >
      {step.label}
    </button>
  {/each}
</div>

<div class="max-w-4xl mx-auto mt-8">
  {#if steps[0].active}
    <Contribute />
  {:else if steps[1].active}
    <Apply {id} />
  {/if}
</div> -->



 <script>
  import { Tabs, TabsList, TabsTrigger, TabsContent } from '$lib/components/ui/tabs';
  import Contribute from '$lib/Contribute.svelte';
  import Apply from '$lib/apply.svelte';
  import { page } from '$app/stores';

  $: id = $page.params.id;
  export let data;
  let project = data.project;

  let activeTab = "funding";
</script>

<div class="w-full bg-[#d1ea9a]/90 py-16">
  <div class="max-w-4xl mx-auto text-center">
    <h1
      class="font-['Inter'] text-5xl font-semibold leading-[54.51px] text-[#08292c] max-lg:text-2xl"
    >
      You Are Contributing To - {project.title || 'Project Title'}
    </h1>
    <p class="mt-10 text-xl">Your contribution to this project will help bring it to life</p>
  </div>
</div>



<!-- <Tabs defaultValue="funding" class="w-full max-w-4xl mx-auto mt-12">

  <div class="flex justify-center w-full">
    <TabsList class="flex justify-center w-full space-x-6 !rounded-full border-2 !border-[#0b383c] py-1 bg-transparent h-auto">
      <TabsTrigger 
  value="funding" 
  class="w-[45%] sm:w-[47%] !rounded-full border-2 px-4 py-4 sm:px-5 sm:py-5 md:px-6 md:py-6 text-xl sm:text-2xl font-semibold transition duration-300 
         data-[state=active]:border-[#0b383c] data-[state=active]:bg-[#0b383c] data-[state=active]:text-lime-100 
         data-[state=inactive]:border-none data-[state=inactive]:text-[#0b383c] data-[state=inactive]:opacity-50"
>
  Funding
</TabsTrigger>

<TabsTrigger 
  value="resources" 
  class="w-[45%] sm:w-[47%] !rounded-full border-2 px-4 py-4 sm:px-5 sm:py-5 md:px-6 md:py-6 text-xl sm:text-2xl font-semibold transition duration-300 
         data-[state=active]:border-[#0b383c] data-[state=active]:bg-[#0b383c] data-[state=active]:text-lime-100 
         data-[state=inactive]:border-none data-[state=inactive]:text-[#0b383c] data-[state=inactive]:opacity-50"
>
  Resources
</TabsTrigger>

    </TabsList>
  </div>

  <div class="max-w-4xl mx-auto mt-8">
    <TabsContent value="funding">
      <Contribute />
    </TabsContent>
    <TabsContent value="resources">
      <Apply {id} />
    </TabsContent>
  </div>
</Tabs> -->

<Tabs bind:value={activeTab} class="w-full max-w-4xl mx-auto mt-12">
  <div class="flex justify-center w-full">
    <TabsList class="flex justify-center w-full space-x-6 !rounded-full border-2 !border-[#0b383c] py-1 bg-transparent h-auto">
      <TabsTrigger 
        value="funding" 
        class={`w-[45%] sm:w-[47%] rounded-full border-2 px-4 py-4 sm:px-5 sm:py-5 md:px-6 md:py-6 text-xl sm:text-2xl font-semibold transition duration-300 
          ${activeTab === 'funding' ? '!bg-[#0b383c] !text-lime-100 border-[#0b383c] border-2 !rounded-full' : 'text-[#0b383c] opacity-50 border-transparent'}`}
      >
        Funding
      </TabsTrigger>
      
      <TabsTrigger 
        value="resources" 
        class={`w-[45%] sm:w-[47%] !rounded-full border-2 px-4 py-4 sm:px-5 sm:py-5 md:px-6 md:py-6 text-xl sm:text-2xl font-semibold transition duration-300 
          ${activeTab === 'resources' ? '!bg-[#0b383c] !text-lime-100 border-[#0b383c] border-2 !rounded-full]' : 'text-[#0b383c] opacity-50 border-transparent'}`}
      >
        Resources
      </TabsTrigger>
    </TabsList>
  </div>

  <div class="max-w-4xl mx-auto mt-8">
    <TabsContent value="funding">
      <Contribute />
    </TabsContent>
    <TabsContent value="resources">
      <Apply {id} />
    </TabsContent>
  </div>
</Tabs>

