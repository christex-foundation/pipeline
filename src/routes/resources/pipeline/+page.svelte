<script>
  import Journey from '../../../lib/Journey.svelte';
  import Step from '../../../lib/Step.svelte';
  import { steps } from './pipelineSteps.js';
</script>

<div
  class="w-[100%] h-[417px] bg-[#d1ea9a]/70 justify-center items-center gap-2.5 inline-flex mb-20"
>
  <div class="flex-col justify-start items-center gap-[14.67px] inline-flex">
    <div
      class="text-center text-black text-[89.62px] font-semibold font-['PP Mori'] leading-[98.58px]"
    >
      How Pipeline Works
    </div>
  </div>
</div>

<main class="flex items-center justify-center w-full overflow-hidden">
  <img src="/how.png" alt="Description of the image" class="object-cover w-full h-full" />
</main>

<section class="flex items-center justify-center w-full text-black px-7 max-md:px-5">
  <div class="flex flex-col items-center w-full max-w-[1101px]">
    {#each steps as step}
      <Step number={step.number} title={step.title} description={step.description} />
    {/each}
  </div>
</section>

<div class="w-full max-w-[1076px] mx-auto mt-16">
  <Journey />
</div>

<style>
  :global(body),
  :global(html) {
    margin: 0;
    padding: 0;
  }
</style>
