<script>
  import { onMount } from 'svelte';

  let mounted = false;

  onMount(() => {
    mounted = true;
  });
</script>

<main class="mx-auto flex w-[1045px] max-w-full flex-col items-center justify-center px-4">
  <section class="text-center">
    <h1
      class="mb-4 text-5xl leading-[55px] font-semibold text-black max-md:text-3xl max-md:leading-[49px]"
    >
      What are<br />Digital Public Goods?
    </h1>
    <p
      class="font-Inter text-[45px] leading-[57px] font-light text-zinc-950 max-md:text-2xl max-md:leading-[56px]"
    >
      These are resources, tools, or content that are made available and accessible to the public.
    </p>
  </section>
</main>

{#if mounted}
  <span class="sr-only">Content loaded</span>
{/if}
