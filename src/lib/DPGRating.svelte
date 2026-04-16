<script>
  import Icon from '@iconify/svelte';

  export let rating;
  /** Whether a DPG evaluation has run for this project. Controls whether we show the score or a pending state. */
  export let evaluated = true;

  $: isDpgReady = evaluated && (rating ?? 0) >= 9;
</script>

<div class="flex items-center gap-2">
  {#if !evaluated}
    <Icon icon="mdi:clock-outline" class="text-lg text-white/60" />
    <span class="text-sm font-medium text-white/70">Pending</span>
  {:else if isDpgReady}
    <Icon icon="mdi:trophy" class="text-lg text-green-300" />
    <span class="text-sm font-bold text-green-300">{rating}</span>
  {:else}
    <Icon icon="tabler:checkbox" class="text-lg text-white/80" />
    <span class="text-sm font-bold text-white">{rating || 0}</span>
  {/if}
</div>
