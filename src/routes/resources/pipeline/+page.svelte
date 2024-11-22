<script>
  import Journey from '../../../lib/Journey.svelte';
  import { steps } from './pipelineSteps.js';
  import howPipelineWorksImg from './how.png';
</script>

<div class="h-40 md:h-[45dvh] bg-[#d1ea9a]/70 mb-20 grid place-content-center">
  <h1 class="text-center text-4xl md:text-7xl font-semibold">How Pipeline Works</h1>
</div>

<main>
  <img src={howPipelineWorksImg} alt="How Pipeline Works Illustations" class="object-cover" />

  <section class="grid max-w-4xl mx-auto px-4 md:px-10">
    {#each steps as step}
      <article class="gap-3 md:gap-5 mt-24 flex items-center justify-center">
        <span
          class="text-sm self-start w-28 h-7 font-semibold bg-lime-300 rounded-full border-lime-800 border-2 md:h-10 md:w-20 grid place-content-center"
        >
          {step.number}
        </span>

        <div class="grid gap-2">
          <h2 class="text-2xl min-w-fit font-semibold max-md:-mt-1">{step.title}</h2>
          <p class="text-lg font-light leading-7">{step.description}</p>
        </div>
      </article>
    {/each}
  </section>

  <div class="w-full max-w-[1076px] mx-auto mt-16">
    <Journey />
  </div>
</main>
