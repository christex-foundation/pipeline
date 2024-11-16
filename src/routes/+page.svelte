<script>
  import Card from '$lib/Card.svelte';
  import Dpg from '$lib/DPG.svelte';
  import Examples from '$lib/Examples.svelte';
  import ExampleSection from '$lib/ExampleSection.svelte';
  import Faq from '$lib/FAQ.svelte';
  import Footer from '$lib/Footer.svelte';
  import Header from '$lib/Header.svelte';
  import Hero from '$lib/Hero.svelte';
  import How from '$lib/How.svelte';
  import Journey from '$lib/Journey.svelte';
  import LearnMoreButton from '$lib/LearnMoreButton.svelte';
  import SubHero from '$lib/SubHero.svelte';
  import ViewAllButton from '$lib/ViewAllButton.svelte';
  import Why from '$lib/Why.svelte';

  export let data;
</script>

<main class="flex flex-col self-stretch w-full pb-48 bg-teal-950 max-md:pb-24">
  <Header {data} />
  <Hero {data} />
</main>

<div class="container px-4 mx-auto mt-20 sm:px-6 lg:px-8">
  <div class="flex flex-wrap justify-between items-center gap-4 max-w-[1156px] mx-auto">
    <h2 class="text-2xl font-semibold text-black sm:text-xl md:text-4xl max-md:text-2xl">
      Featured Projects
    </h2>
    <ViewAllButton class="max-md:text-sm max-md:px-4 max-md:py-2" />
  </div>

  <div
    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-[1156px] mx-auto px-[13.70px] pt-[13.70px] pb-[20.55px]"
  >
    {#each data.featureProjects as project}
      <Card {project} />
    {:else}
      <p>No projects found.</p>
    {/each}
  </div>

  <div class="max-w-4xl mx-auto mt-20">
    <Dpg />
  </div>

  <div class="w-full max-w-[1076px] mx-auto mt-16">
    <ExampleSection />
  </div>

  <div class="w-full max-w-[1076px] mx-auto mt-16">
    <Examples />
  </div>

  <div class="flex justify-center max-w-4xl mx-auto mt-8 mb-16 text-center">
    <LearnMoreButton />
  </div>
</div>

<SubHero />

<div class="w-full max-w-[1076px] mx-auto mt-16">
  <How />
</div>

<div class="w-full max-w-[1076px] mx-auto mt-16">
  <Why />
</div>

<Faq />
<Journey />
<Footer />
