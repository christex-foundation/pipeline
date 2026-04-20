<script>
  import Icon from '@iconify/svelte';
  import * as HoverCard from '$lib/components/ui/hover-card';
  import { getIconForStandard } from '$lib/utils/dpgStandards.js';

  /** @type {{ status?: Array<{ name?: string, overallScore?: number }> } | null | undefined} */
  export let dpgStatus = null;
  /** @type {number} */
  export let count = 0;

  const TOTAL_CRITERIA = 9;

  $: hasEvaluation = Array.isArray(dpgStatus?.status) && dpgStatus.status.length > 0;
  $: criteria = padCriteria(dpgStatus?.status);
  $: stage = getStage(count);

  /**
   * @param {Array<{ name?: string, overallScore?: number }> | undefined} status
   */
  function padCriteria(status) {
    const items = Array.isArray(status) ? status.slice(0, TOTAL_CRITERIA) : [];
    const padding = Array.from({ length: TOTAL_CRITERIA - items.length }, () => ({
      name: 'Not yet evaluated',
      overallScore: 0,
      pending: true,
    }));
    return [...items, ...padding];
  }

  /**
   * @param {number} n
   */
  function getStage(n) {
    if (n >= 9) return { label: 'DPG-Ready', classes: 'bg-green-500/15 text-green-300' };
    if (n >= 6)
      return {
        label: 'Nearly Ready',
        classes: 'bg-dashboard-yellow-400/15 text-dashboard-yellow-400',
      };
    if (n >= 3)
      return {
        label: 'In Progress',
        classes: 'bg-dashboard-purple-500/15 text-dashboard-purple-300',
      };
    return { label: 'Early', classes: 'bg-dashboard-gray-700/60 text-gray-400' };
  }
</script>

<div class="space-y-3">
  <!-- Headline + stage chip -->
  <div class="flex items-baseline justify-between gap-2">
    {#if hasEvaluation}
      <div class="flex items-baseline gap-1">
        <span class="text-display-md font-bold text-white">{count}</span>
        <span class="text-body-sm text-gray-400">/ {TOTAL_CRITERIA} criteria met</span>
      </div>
      <span class="rounded-full px-2.5 py-0.5 text-label-sm font-medium {stage.classes}">
        {stage.label}
      </span>
    {:else}
      <div class="flex items-center gap-2">
        <Icon icon="mdi:clock-outline" class="h-4 w-4 text-gray-500" />
        <span class="text-body-sm text-gray-400">Awaiting DPG evaluation</span>
      </div>
    {/if}
  </div>

  <!-- 9 segmented pips with per-criterion tooltip -->
  <div class="flex gap-1" role="list" aria-label="DPG readiness by criterion">
    {#each criteria as item, i (i)}
      <HoverCard.Root openDelay={80} closeDelay={100}>
        <HoverCard.Trigger
          class="group/pip flex-1 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-dashboard-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-dashboard-gray-900"
          role="listitem"
          aria-label={item.name ?? 'criterion'}
        >
          <div
            class="h-2 w-full rounded-full transition-colors duration-200 {item.overallScore === 1
              ? 'bg-gradient-to-r from-dashboard-purple-500 to-dashboard-purple-400 group-hover/pip:from-dashboard-purple-400 group-hover/pip:to-dashboard-purple-300'
              : item.pending
                ? 'bg-dashboard-gray-700/60 group-hover/pip:bg-dashboard-gray-600/60'
                : 'bg-dashboard-gray-700 ring-1 ring-inset ring-red-500/20 group-hover/pip:bg-dashboard-gray-600'}"
          ></div>
        </HoverCard.Trigger>
        <HoverCard.Content
          side="top"
          sideOffset={8}
          class="w-auto max-w-[220px] border-dashboard-gray-700 bg-dashboard-gray-900 px-3 py-2"
        >
          <p class="text-label-md font-medium leading-tight text-white">
            {item.name}
          </p>
          <div class="mt-1 flex items-center gap-1">
            {#if item.overallScore === 1}
              <Icon icon="mdi:check-circle" class="h-3.5 w-3.5 text-green-400" />
              <span class="text-body-sm text-green-300">Complete</span>
            {:else if item.pending}
              <Icon icon="mdi:clock-outline" class="h-3.5 w-3.5 text-gray-400" />
              <span class="text-body-sm text-gray-400">Not yet evaluated</span>
            {:else}
              <Icon icon="mdi:alert-circle-outline" class="h-3.5 w-3.5 text-red-400" />
              <span class="text-body-sm text-red-300">Needs attention</span>
            {/if}
          </div>
        </HoverCard.Content>
      </HoverCard.Root>
    {/each}
  </div>
</div>
