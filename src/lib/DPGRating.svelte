<script>
  import Icon from '@iconify/svelte';

  export let rating;
  /** Whether a DPG evaluation has run for this project. Controls whether we show the score or a pending state. */
  export let evaluated = true;
</script>

<div class="flex items-center gap-2 text-white">
  {#if evaluated}
    <Icon icon="tabler:checkbox" class="text-lg text-white/80" />
    <span class="text-sm font-bold text-white">{rating || 0}</span>
  {:else}
    <Icon icon="mdi:clock-outline" class="text-lg text-white/60" />
    <span class="text-sm font-medium text-white/70">Pending</span>
  {/if}
</div>
