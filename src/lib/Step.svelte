<!-- <script>
  export let number;
  export let title;
  export let description;
</script>

<article class="mt-24 flex w-full flex-wrap items-start gap-4 max-md:mt-10 max-md:max-w-full">
  <div
    class="flex h-[57px] min-h-[56px] w-14 items-center justify-center whitespace-nowrap rounded-3xl border-[3px] border-solid border-lime-800 bg-lime-300 px-5 text-2xl font-semibold leading-none max-md:px-5"
  >
    {number}
  </div>
  <div class="flex w-[1019px] min-w-[240px] shrink grow flex-col max-md:max-w-full">
    <h2 class="mb-2 text-[32px] font-semibold text-gray-800 max-sm:text-xl">{title}</h2>
    <p class="text-lg text-gray-700 max-sm:text-base">{description}</p>
  </div>
</article> -->



<script>
  export let number;
  export let title;
  export let description;
  import {Card } from "$lib/components/ui/card";
</script>

<Card class="p-6 shadow-lg border border-gray-200">
  <h3 class="text-2xl font-semibold mb-2">Step {number}: {title}</h3>
  <p class="text-gray-600">{description}</p>
</Card>
