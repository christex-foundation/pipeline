<script>
  import { Tabs, TabsList, TabsTrigger, TabsContent } from '$lib/components/ui/tabs';
  import Contribute from '$lib/Contribute.svelte';
  import Apply from '$lib/apply.svelte';
  import { page } from '$app/stores';

  $: id = $page.params.id;
  export let data;
  let project = data.project;

  let activeTab = 'funding';

  let steps = [
    { label: 'Funding', active: false },
    { label: 'Resources', active: true },
  ];

  function selectStep(index) {
    if (!steps[index].disabled) {
      steps = steps.map((step, i) => ({ ...step, active: i === index }));
    }
  }
</script>

<div class="w-full bg-[#d1ea9a]/90 py-16">
  <div class="mx-auto max-w-4xl text-center">
    <h1
      class="font-['Inter'] text-5xl font-semibold leading-[54.51px] text-[#08292c] max-lg:text-2xl"
    >
      You Are Contributing To - {project.title || 'Project Title'}
    </h1>
    <p class="mt-10 text-xl">Your contribution to this project will help bring it to life</p>
  </div>
</div>

<Tabs bind:value={activeTab} class="mx-auto mt-12 w-full max-w-4xl">
  <div class="flex w-full justify-center">
    <TabsList
      class="flex h-auto w-full justify-center space-x-6 !rounded-full border-2 !border-[#0b383c] bg-transparent py-1"
    >
      <TabsTrigger
        value="funding"
        class={`w-[45%] rounded-full border-2 px-4 py-4 text-xl font-semibold transition duration-300 sm:w-[47%] sm:px-5 sm:py-5 sm:text-2xl md:px-6 md:py-6 ${activeTab === 'funding' ? '!rounded-full border-2 border-[#0b383c] !bg-[#0b383c] !text-lime-100' : 'border-transparent text-[#0b383c] opacity-50'}`}
      >
        Funding
      </TabsTrigger>

      <TabsTrigger
        value="resources"
        class={`rounded-full border-2 px-4 py-4 text-xl font-semibold transition duration-300 sm:w-[47%] sm:px-5 sm:py-5 sm:text-2xl md:px-6 md:py-6 ${activeTab === 'resources' ? '!rounded-full border-2 border-[#0b383c] !bg-[#0b383c] !text-lime-100' : 'border-transparent text-[#0b383c] opacity-50'}`}
      >
        Resources
      </TabsTrigger>
    </TabsList>
  </div>

  <div class="mx-auto mt-8 max-w-4xl">
    <TabsContent value="funding">
      <Contribute />
    </TabsContent>
    <TabsContent value="resources">
      <Apply {id} />
    </TabsContent>
  </div>
</Tabs>
