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
  <div class="max-w-4xl mx-auto text-center">
    <h1 class="text-[#08292c] text-[50.43px] font-semibold font-['PP Mori'] leading-[54.51px]">
      Make a Difference Today!
    </h1>
    <p class="mt-10 text-xl">Your contribution to this project will help bring it to life</p>
  </div>
</div>

<div
  class="flex justify-center w-[43%] mx-auto mt-12 space-x-6 border-2 border-[#0b383c] rounded-full py-1"
>
  {#each steps as step, index}
    <button
      class="px-6 py-6 font-semibold transition duration-300 border-2 rounded-full text-2xl w-[47%]
                       {step.active
        ? 'bg-[#0b383c] text-lime-100 border-[#0b383c]'
        : 'text-[#0b383c] border-none'}"
      on:click={() => selectStep(index)}
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
</div>
