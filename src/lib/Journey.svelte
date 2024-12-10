<script>
  import Learn from './Learn.svelte';
  import LearnDPG from './LearnDPG.svelte';
  import Newsletter from './Newsletter.svelte';
</script>

<section
  class="mx-auto mt-10 flex max-w-7xl flex-col items-center justify-between rounded-3xl bg-lime-300 p-6 sm:mt-16 sm:rounded-[47px] sm:p-6 lg:mt-20 lg:flex-row lg:p-12"
>
  <div class="mb-8 flex w-full flex-col self-stretch font-semibold lg:mb-0 lg:w-[45%]">
    <h1 class="text-3xl leading-tight text-teal-950 sm:text-4xl lg:text-5xl xl:text-6xl">
      Start your DPG journey now
    </h1>
    <p class="mt-2.5 text-lg leading-6 text-teal-800 sm:text-xl">
      Discover, support, and create Digital Public Goods on Pipeline.
    </p>
  </div>
  <div class="flex w-full flex-col space-y-6 self-stretch lg:w-[45%]">
    <Learn />
    <LearnDPG />
    <Newsletter />
  </div>
</section>
