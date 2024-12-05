<script>
  import Contribute from '$lib/Contribute.svelte';
  import Apply from '$lib/apply.svelte';
  import { page } from '$app/stores';

  $: id = $page.params.id;

  let steps = [
    { label: 'Funding', active: true },
    { label: 'Resources', active: false },
  ];

  function selectStep(index) {
    steps = steps.map((step, i) => ({ ...step, active: i === index }));
  }
</script>

<div class="w-full bg-[#d1ea9a]/90 py-16">
  <div class="mx-auto max-w-4xl text-center">
    <h1 class="font-['PP Mori'] text-[50.43px] font-semibold leading-[54.51px] text-[#08292c]">
      Make a Difference Today!
    </h1>
    <p class="mt-10 text-xl">Your contribution to this project will help bring it to life</p>
  </div>
</div>

<div
  class="mx-auto mt-12 flex w-[43%] justify-center space-x-6 rounded-full border-2 border-[#0b383c] py-1"
>
  {#each steps as step, index}
    <button
      class="w-[47%] rounded-full border-2 px-6 py-6 text-2xl font-semibold transition duration-300
                       {step.active
        ? 'border-[#0b383c] bg-[#0b383c] text-lime-100'
        : 'border-none text-[#0b383c]'}"
      on:click={() => selectStep(index)}
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
