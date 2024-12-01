<script>
  import { navigating } from '$app/stores';
  import { tweened } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';

  const progress = tweened(0, {
    duration: 300,
    easing: cubicOut
  });

  $: if ($navigating) {
    progress.set(0.75);
  } else {
    progress.set(1).then(() => {
      setTimeout(() => progress.set(0), 200);
    });
  }
</script>

<div class="fixed top-0 left-0 w-full h-[5px] bg-transparent z-50 pointer-events-none transition-opacity duration-300 ease-in-out opacity-0" class:opacity-100={$progress > 0}>
  <div class="h-full bg-[#bde25b] transition-width duration-300 ease-in-out" style="width: {$progress * 100}%"></div>
</div>