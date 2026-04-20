<script>
  import Icon from '@iconify/svelte';
  import * as Popover from '$lib/components/ui/popover';
  import { getIconForStandard } from '$lib/utils/dpgStandards.js';

  export let project;
  export let isOwner = false;
  export let evaluations = { active: null, latest: null, history: [] };

  $: dpgStatuses = project.dpgStatus?.status;

  // Separate completed and incomplete items for better focus
  $: completedItems = dpgStatuses?.filter((item) => item.overallScore === 1) || [];
  $: incompleteItems = dpgStatuses?.filter((item) => item.overallScore !== 1) || [];

  let requesting = false;
  let errorMessage = '';

  async function handleRequestEvaluation() {
    requesting = true;
    errorMessage = '';
    try {
      const res = await fetch(`/api/projects/${project.id}/evaluate`, {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success) {
        evaluations = { ...evaluations, active: data.evaluation };
      } else {
        errorMessage = data.message || 'Failed to request evaluation';
      }
    } catch (err) {
      console.error('Failed to request evaluation:', err);
      errorMessage = 'Something went wrong. Please try again.';
    } finally {
      requesting = false;
    }
  }

  function formatDate(dateStr) {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  $: hasActiveEvaluation = evaluations?.active != null;
  $: showHistory =
    evaluations?.history?.filter((h) => h.status === 'completed' || h.status === 'failed').length >
    0;
</script>

<div class="w-full space-y-8">
  <!-- Evaluation Controls (owner only, shown when results exist) -->
  {#if isOwner && dpgStatuses}
    <div class="flex flex-wrap items-center justify-end gap-4">
      {#if evaluations?.latest}
        <span class="mr-auto text-body-sm text-gray-500">
          Last evaluated: {formatDate(evaluations.latest.completed_at)}
        </span>
      {/if}

      <button
        on:click={handleRequestEvaluation}
        disabled={hasActiveEvaluation || requesting}
        class="flex items-center gap-2 text-label-md font-medium text-dashboard-purple-400 transition-colors hover:text-dashboard-purple-300 disabled:opacity-50"
      >
        <Icon
          icon={requesting || hasActiveEvaluation ? 'lucide:loader-2' : 'lucide:refresh-cw'}
          class="h-4 w-4 {requesting || hasActiveEvaluation ? 'animate-spin' : ''}"
        />
        {#if hasActiveEvaluation}
          Evaluating
        {:else}
          Re-evaluate
        {/if}
      </button>
    </div>

    {#if errorMessage}
      <p class="text-body-sm text-red-400">{errorMessage}</p>
    {/if}
  {/if}

  {#if dpgStatuses != null}
    <!-- Progress Overview -->
    <div class="space-y-4 text-center">
      <div
        class="inline-flex items-center gap-4 rounded-2xl border border-dashboard-gray-700 bg-gradient-to-r from-dashboard-purple-500/10 to-dashboard-yellow-400/10 px-6 py-4"
      >
        <Icon icon="mdi:trophy" class="h-8 w-8 text-dashboard-yellow-400" />
        <div>
          <div class="text-display-lg font-semibold text-white">
            {project.dpgCount}<span class="text-gray-400">/9</span>
          </div>
          <div class="text-body-md text-gray-300">Standards Complete</div>
        </div>
      </div>

      <div class="mx-auto h-4 w-full max-w-md overflow-hidden rounded-full bg-dashboard-gray-700">
        <div
          class="h-4 bg-gradient-to-r from-dashboard-yellow-400 to-dashboard-purple-500 transition-all duration-700 ease-out"
          style="width: {(project.dpgCount / 9) * 100}%"
        ></div>
      </div>
    </div>

    <!-- Action Required Section - Highlight Incomplete Items -->
    {#if incompleteItems.length > 0}
      <div class="space-y-4">
        <div class="flex items-center gap-3">
          <Icon icon="mdi:alert-circle" class="h-6 w-6 text-dashboard-yellow-400" />
          <h3 class="text-heading-lg font-semibold text-white">
            Action Required ({incompleteItems.length} remaining)
          </h3>
        </div>

        <div class="grid gap-4 md:grid-cols-2">
          {#each incompleteItems as item}
            <Popover.Root>
              <Popover.Trigger
                class="group rounded-xl border border-red-500/30 bg-red-500/5 p-4 text-left transition-all duration-200 hover:border-red-500/50 hover:bg-red-500/10"
              >
                <div class="flex items-start gap-3">
                  <div class="flex-shrink-0 rounded-lg bg-red-500/10 p-2">
                    <Icon icon={getIconForStandard(item.name)} class="h-5 w-5 text-red-400" />
                  </div>
                  <div class="min-w-0 flex-1">
                    <h4 class="line-clamp-2 text-heading-sm font-medium text-white">
                      {item.name}
                    </h4>
                    <p class="mt-1 text-body-sm text-red-300">Needs attention</p>
                  </div>
                  <Icon
                    icon="mdi:arrow-right"
                    class="h-4 w-4 text-red-400 transition-transform group-hover:translate-x-1"
                  />
                </div>
              </Popover.Trigger>

              <Popover.Content
                class="w-96 max-w-lg space-y-4 rounded-2xl border border-dashboard-gray-700 bg-dashboard-gray-900 p-6"
              >
                <div class="mb-4 flex items-center gap-3">
                  <Icon
                    icon={getIconForStandard(item.name)}
                    class="h-6 w-6 text-dashboard-yellow-400"
                  />
                  <h4 class="text-heading-md font-semibold text-white">{item.name}</h4>
                </div>

                <div class="space-y-4">
                  <div
                    class="rounded-xl border border-dashboard-gray-600 bg-dashboard-gray-900 p-4"
                  >
                    <div class="mb-3 flex items-center gap-2">
                      <Icon icon="mage:stars-b" class="h-5 w-5 text-dashboard-yellow-400" />
                      <span class="text-label-lg font-medium text-dashboard-yellow-400"
                        >AI Assessment</span
                      >
                    </div>
                    <p class="text-body-md leading-relaxed text-gray-300">
                      {item.explanation ||
                        'This standard requires further review and documentation.'}
                    </p>
                  </div>

                  <div class="rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-4">
                    <div class="mb-2 flex items-center gap-2">
                      <Icon icon="mdi:lightbulb" class="h-5 w-5 text-yellow-400" />
                      <span class="text-label-md font-medium text-yellow-400">Next Steps</span>
                    </div>
                    <p class="text-body-sm text-gray-300">
                      Review the requirements for this standard and update your project
                      documentation accordingly.
                    </p>
                  </div>
                </div>
              </Popover.Content>
            </Popover.Root>
          {/each}
        </div>
      </div>
    {/if}

    <!-- Completed Standards Section -->
    {#if completedItems.length > 0}
      <div class="space-y-4">
        <div class="flex items-center gap-3">
          <Icon icon="mdi:check-circle" class="h-6 w-6 text-green-400" />
          <h3 class="text-heading-lg font-semibold text-white">
            Completed Standards ({completedItems.length})
          </h3>
        </div>

        <div class="grid gap-3 md:grid-cols-3">
          {#each completedItems as item}
            <Popover.Root>
              <Popover.Trigger
                class="group rounded-xl border border-green-500/30 bg-green-500/5 p-4 text-left transition-all duration-200 hover:bg-green-500/10"
              >
                <div class="flex items-center gap-3">
                  <div class="flex-shrink-0 rounded-lg bg-green-500/10 p-2">
                    <Icon icon={getIconForStandard(item.name)} class="h-5 w-5 text-green-400" />
                  </div>
                  <div class="min-w-0 flex-1">
                    <h4 class="line-clamp-2 text-heading-sm font-medium text-white">
                      {item.name}
                    </h4>
                    <div class="mt-1 flex items-center gap-1">
                      <Icon icon="mdi:check" class="h-3 w-3 text-green-400" />
                      <span class="text-body-sm text-green-300">Complete</span>
                    </div>
                  </div>
                </div>
              </Popover.Trigger>

              <Popover.Content
                class="w-96 max-w-lg space-y-4 rounded-2xl border border-dashboard-gray-700 bg-dashboard-gray-900 p-6"
              >
                <div class="mb-4 flex items-center gap-3">
                  <Icon icon={getIconForStandard(item.name)} class="h-6 w-6 text-green-400" />
                  <h4 class="text-heading-md font-semibold text-white">{item.name}</h4>
                  <Icon icon="mdi:check-circle" class="h-5 w-5 text-green-400" />
                </div>

                <div class="space-y-4">
                  <div class="rounded-xl border border-green-500/30 bg-green-500/5 p-4">
                    <div class="mb-2 flex items-center gap-2">
                      <Icon icon="mdi:check-circle" class="h-5 w-5 text-green-400" />
                      <span class="text-label-md font-medium text-green-400">Status: Complete</span>
                    </div>
                    <p class="text-body-sm text-gray-300">
                      This standard has been successfully met by your project.
                    </p>
                  </div>

                  <div
                    class="rounded-xl border border-dashboard-gray-600 bg-dashboard-gray-900 p-4"
                  >
                    <div class="mb-3 flex items-center gap-2">
                      <Icon icon="mage:stars-b" class="h-5 w-5 text-dashboard-yellow-400" />
                      <span class="text-label-md font-medium text-dashboard-yellow-400"
                        >AI Assessment</span
                      >
                    </div>
                    <p class="text-body-md leading-relaxed text-gray-300">
                      {item.explanation || 'This standard has been successfully implemented.'}
                    </p>
                  </div>
                </div>
              </Popover.Content>
            </Popover.Root>
          {/each}
        </div>
      </div>
    {/if}

    <!-- Final Recommendation -->
    <div class="rounded-2xl border border-dashboard-gray-700 bg-dashboard-gray-800/50 p-6">
      <div class="mb-4 flex items-center gap-3">
        <Icon icon="mdi:star-check" class="h-6 w-6 text-dashboard-yellow-400" />
        <h3 class="text-heading-lg font-semibold text-white">Overall Assessment</h3>
      </div>

      <div class="rounded-xl border border-dashboard-gray-600 bg-dashboard-gray-900 p-4">
        <p class="mb-4 text-body-lg leading-relaxed text-gray-300">
          {project.dpgStatus.final_recommendation}
        </p>

        <div class="flex items-center gap-4 border-t border-dashboard-gray-700 pt-4">
          <div class="flex items-center gap-2">
            <div class="h-3 w-3 rounded-full bg-green-400"></div>
            <span class="text-body-sm text-gray-400">{completedItems.length} Complete</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="h-3 w-3 rounded-full bg-red-400"></div>
            <span class="text-body-sm text-gray-400">{incompleteItems.length} Remaining</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="h-3 w-3 rounded-full bg-dashboard-yellow-400"></div>
            <span class="text-body-sm text-gray-400"
              >{Math.round((project.dpgCount / 9) * 100)}% Complete</span
            >
          </div>
        </div>
      </div>
    </div>
  {:else if hasActiveEvaluation}
    <!-- Pending/Running State (no previous results) -->
    <div class="space-y-6 text-center">
      <div>
        <h3 class="mb-2 text-heading-lg font-semibold text-white">DPG Standards Evaluation</h3>
        <p class="text-body-lg text-gray-400">
          {#if evaluations.active.status === 'pending'}
            Your evaluation request is queued and will be processed shortly.
          {:else}
            Analyzing project compliance with Digital Public Good standards...
          {/if}
        </p>
      </div>

      <div class="flex flex-col items-center gap-4 py-12">
        <div class="relative">
          <Icon icon="lucide:loader-2" class="h-12 w-12 animate-spin text-dashboard-yellow-400" />
        </div>
        <p class="text-body-lg font-medium text-gray-300">
          Evaluation {evaluations.active.status}
        </p>
        <p class="text-body-sm text-gray-500">
          Requested {formatDate(evaluations.active.created_at)}
        </p>
      </div>
    </div>
  {:else}
    <!-- No Evaluation State -->
    <div class="space-y-6 text-center">
      <div>
        <h3 class="mb-2 text-heading-lg font-semibold text-white">DPG Standards Evaluation</h3>
        <p class="text-body-lg text-gray-400">
          {#if isOwner}
            Request an evaluation to see how your project aligns with DPG standards.
          {:else}
            This project has not been evaluated yet.
          {/if}
        </p>
      </div>

      <div class="flex flex-col items-center gap-4 py-12">
        <Icon icon="mdi:clipboard-check-outline" class="h-16 w-16 text-dashboard-gray-600" />
        {#if isOwner}
          <button
            on:click={handleRequestEvaluation}
            disabled={requesting}
            class="rounded-xl border border-dashboard-purple-500 bg-dashboard-purple-500/10 px-6 py-3 text-label-lg font-medium text-dashboard-purple-400 transition-colors hover:bg-dashboard-purple-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dashboard-purple-500 disabled:opacity-50"
          >
            <Icon
              icon={requesting ? 'lucide:loader-2' : 'lucide:play'}
              class="mr-2 inline h-4 w-4 {requesting ? 'animate-spin' : ''}"
            />
            Request Evaluation
          </button>
          {#if errorMessage}
            <div
              class="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-body-sm text-red-300"
            >
              <Icon icon="mdi:alert-circle" class="h-4 w-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          {/if}
        {/if}
      </div>
    </div>
  {/if}

  <!-- Evaluation History -->
  {#if showHistory}
    <details class="group rounded-xl border border-dashboard-gray-700 bg-dashboard-gray-800/30">
      <summary
        class="flex cursor-pointer items-center justify-between p-4 text-heading-sm font-medium text-gray-300 hover:text-white"
      >
        <span>Previous Evaluations</span>
        <Icon
          icon="lucide:chevron-down"
          class="h-4 w-4 transition-transform group-open:rotate-180"
        />
      </summary>
      <div class="border-t border-dashboard-gray-700 p-4">
        <div class="space-y-2">
          {#each evaluations.history.filter((h) => h.status === 'completed' || h.status === 'failed') as run}
            <div
              class="flex items-center justify-between rounded-lg bg-dashboard-gray-900/50 px-4 py-3"
            >
              <div class="flex items-center gap-3">
                <Icon
                  icon={run.status === 'completed' ? 'mdi:check-circle' : 'mdi:alert-circle'}
                  class="h-4 w-4 {run.status === 'completed' ? 'text-green-400' : 'text-red-400'}"
                />
                <span class="text-body-sm text-gray-300">
                  {formatDate(run.completed_at || run.created_at)}
                </span>
              </div>
              <div class="flex items-center gap-2">
                {#if run.result?.score}
                  <span class="text-body-sm text-gray-400">{run.result.score}</span>
                {/if}
                <span
                  class="text-body-xs rounded-full px-2 py-0.5 {run.status === 'completed'
                    ? 'bg-green-500/10 text-green-400'
                    : 'bg-red-500/10 text-red-400'}"
                >
                  {run.status}
                </span>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </details>
  {/if}
</div>
