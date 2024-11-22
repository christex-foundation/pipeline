<script>
  import { steps } from './pipelineSteps.js';
  import illustration from './how.png';
  import Newsletter from './Newsletter.svelte';
</script>

<div class="h-40 md:h-[45dvh] bg-[#d1ea9a]/70 mb-20 grid place-content-center">
  <h1 class="text-center text-4xl md:text-7xl font-semibold">How Pipeline Works</h1>
</div>

<main>
  <img src={illustration} alt="How Pipeline Works Illustations" class="object-cover" />

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

  <section class="max-w-6xl mx-auto mt-36">
    <div
      class="grid max-sm:gap-10 md:grid-cols-2 items-center py-10 px-5 md:px-14 bg-lime-300 max-md:rounded-3xl rounded-[3rem]"
    >
      <div class="font-semibold max-w-sm">
        <h3 class="text-5xl text-teal-950 mb-5">Start your DPG journey now</h3>
        <p class="text-lg md:text-xl text-teal-800">
          Discover, support, and create Digital Public Goods on Pipeline.
        </p>
      </div>

      <div class="flex flex-col gap-5">
        <!-- Learn about pipeline -->
        <div class="flex items-center justify-between p-5 bg-lime-100 rounded-3xl">
          <div class="flex flex-col gap-1 min-w-fit">
            <h2 class="text-2xl font-semibold">Learn about Pipeline</h2>
            <p class="font-light">Get to know about the community</p>
          </div>
          <a href="/">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/b57dd1b95e7392c3d06e9edef7c8e0583a52ef5efb38bdd9d4b163b315b64c06?placeholderIfAbsent=true&apiKey=567aaefef2da4f73a3149c6bc21f1ea8"
              alt="upper right arrow"
            />
          </a>
        </div>

        <!-- Learn about DPG -->
        <div class="flex items-center justify-between p-5 bg-lime-100 rounded-3xl">
          <div class="flex flex-col gap-1 min-w-fit">
            <h2 class="text-2xl font-semibold">Learn about DPGs</h2>
            <p class="font-light max-sm:max-w-[15rem]">Get to know about Digital Public Goods</p>
          </div>
          <a href="/">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/b57dd1b95e7392c3d06e9edef7c8e0583a52ef5efb38bdd9d4b163b315b64c06?placeholderIfAbsent=true&apiKey=567aaefef2da4f73a3149c6bc21f1ea8"
              alt="upper right arrow"
            />
          </a>
        </div>

        <!-- leaving it as a separate component since we might need to use it on another page -->
        <Newsletter />
      </div>
    </div>
  </section>
</main>
