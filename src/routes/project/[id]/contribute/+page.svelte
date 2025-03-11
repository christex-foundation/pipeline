<script>
  import Contribute from '$lib/Contribute.svelte';
  import Apply from '$lib/apply.svelte';
  import { page } from '$app/stores';

  $: id = $page.params.id;
  export let data;
  let project = data.project;

  let steps = [
    { label: 'Funding', active: false, disabled: true },
    { label: 'Resources', active: true, disabled: false },
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

<div
  class="mx-auto mt-12 flex w-[90%] justify-center space-x-6 rounded-full border-2 border-[#0b383c] py-1 sm:w-[75%] md:w-[50%]"
>
  {#each steps as step, index}
    <button
      class="w-[45%] rounded-full border-2 px-4 py-4 text-xl font-semibold transition duration-300 sm:w-[47%] sm:px-5 sm:py-5 sm:text-2xl md:px-6 md:py-6
             {step.active
        ? 'border-[#0b383c] bg-[#0b383c] text-lime-100'
        : 'cursor-not-allowed border-none text-[#0b383c] opacity-50'}"
      on:click={() => selectStep(index)}
      disabled={step.disabled}
    >
      {step.label}
    </button>
  {/each}
</div>

<div class="mx-auto mt-8 max-w-4xl">
  {#if steps[0].active}
    <Contribute />
  {:else if steps[1].active}
    <Apply {id} />
  {/if}
</div>
