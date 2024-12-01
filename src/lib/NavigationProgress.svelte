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
  
  <div class="progress-container fixed top-0 left-0 w-full h-[5px] bg-trans" class:visible={$progress > 0}>
    <div class="progress-bar" style="width: {$progress * 100}%"></div>
  </div>
  
  <style>
    .progress-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 5px;
      background: transparent;
      z-index: 9999;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.3s ease;
    }
  
    .progress-container.visible {
      opacity: 1;
    }
  
    .progress-bar {
      height: 100%;
      background: #bde25b; /* Tailwind's blue-500 */
      transition: width 0.3s ease;
    }
  </style>
  
  