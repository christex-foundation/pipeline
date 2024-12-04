<script>
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';

  let container;
  let lottie;

  onMount(async () => {
    if (browser) {
      // Dynamically import lottie and animation data only on client side
      lottie = (await import('lottie-web')).default;
      const handLoaderData = (await import('$assets/lotties/loaders/Handloader.json')).default;

      const animation = lottie.loadAnimation({
        container: container,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: handLoaderData,
      });

      return () => animation.destroy();
    }
  });
</script>

<div bind:this={container} class="w-12 h-12">
  {#if !browser}
    <!-- Optional fallback for SSR -->
    <div
      class="w-6 h-6 animate-spin rounded-full border-2 border-primary border-t-transparent"
    ></div>
  {/if}
</div>
