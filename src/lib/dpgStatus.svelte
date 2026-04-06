<script>
  import Icon from '@iconify/svelte';
  import * as Popover from '$lib/components/ui/popover';
  import { dateTimeWithTimeFormat, timeAgo } from '$lib/utils/dateTimeFormat.js';

  export let project;
  export let isOwner = false;
  export let evaluation = {};
  export let requestEvaluation = async () => {};
  export let isRequestingEvaluation = false;

  $: dpgStatuses = project.dpgStatus?.status;
  $: evaluationStatus = evaluation?.currentStatus || 'not_requested';
  $: currentEvaluationRun = evaluation?.currentRun || null;
  $: latestCompletedEvaluation = evaluation?.latestCompletedRun || null;
  $: latestFailedEvaluation = evaluation?.latestFailedRun || null;
  $: latestEvaluationResult = evaluation?.latestResult || null;
  $: evaluationHistory = evaluation?.history || [];
  $: hasActiveEvaluation = evaluation?.hasActiveRun === true;
  $: showHistory =
    evaluationHistory.filter((run) => ['completed', 'failed'].includes(run.status)).length > 1;

  // Separate completed and incomplete items for better focus
  $: completedItems = dpgStatuses?.filter((item) => item.overallScore === 1) || [];
  $: incompleteItems = dpgStatuses?.filter((item) => item.overallScore !== 1) || [];

  // DPG Standard icons for better visual representation
  const standardIcons = {
    'Relevance to Sustainable Development Goals (SDGs)': 'mdi:earth',
    'Use of Approved Open Licenses': 'mdi:license',
    'Clear Ownership': 'mdi:account-check',
    'Platform Independence': 'mdi:devices',
    Documentation: 'mdi:file-document',
    'Mechanism for Extracting Data and Content': 'mdi:database-export',
    'Adherence to Privacy and Applicable Laws': 'mdi:shield-lock',
    'Adherence to Standards & Best Practices': 'mdi:check-circle',
    'Do No Harm By Design': 'mdi:heart-plus',
  };

  function getIconForStandard(name) {
    return standardIcons[name] || 'mdi:checkbox-marked-circle';
  }

  function formatDate(dateStr) {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  function formatDateTime(dateStr) {
    return dateStr ? dateTimeWithTimeFormat(dateStr) : 'Not yet available';
  }

  function formatRelativeDateTime(dateStr) {
    return dateStr
      ? `${dateTimeWithTimeFormat(dateStr)} (${timeAgo(dateStr)})`
      : 'Not yet available';
  }

  function getEvaluationStatusClass(status) {
    if (status === 'completed') return 'bg-green-500/10 text-green-400';
    if (status === 'failed') return 'bg-red-500/10 text-red-400';
    if (status === 'running') return 'bg-sky-500/10 text-sky-300';
    if (status === 'pending') return 'bg-amber-500/10 text-amber-300';
    return 'bg-dashboard-gray-800 text-gray-300';
  }
</script>

<div class="w-full space-y-8">
  {#if dpgStatuses != null}
    {#if isOwner}
      <div class="flex flex-wrap items-center justify-end gap-4">
        {#if latestCompletedEvaluation}
          <span class="mr-auto text-body-sm text-gray-500">
            Last evaluated: {formatDate(latestCompletedEvaluation.completed_at)}
          </span>
        {/if}

        <button
          type="button"
          on:click={requestEvaluation}
          disabled={hasActiveEvaluation || isRequestingEvaluation}
          class="flex items-center gap-2 text-label-md font-medium text-dashboard-purple-400 transition-colors hover:text-dashboard-purple-300 disabled:opacity-50"
        >
          <Icon
            icon={hasActiveEvaluation || isRequestingEvaluation
              ? 'lucide:loader-2'
              : 'lucide:refresh-cw'}
            class={`h-4 w-4 ${hasActiveEvaluation || isRequestingEvaluation ? 'animate-spin' : ''}`}
          />
          {#if hasActiveEvaluation}
            Evaluating
          {:else}
            Re-evaluate
          {/if}
        </button>
      </div>
    {/if}

    <div class="rounded-2xl border border-dashboard-gray-700 bg-dashboard-gray-800/40 p-5">
      <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div class="space-y-2">
          <div class="flex flex-wrap items-center gap-3">
            <h3 class="text-heading-lg font-semibold text-white">DPG Evaluation</h3>
            <span
              class={`rounded-full px-3 py-1 text-body-sm font-medium ${getEvaluationStatusClass(evaluationStatus)}`}
            >
              {evaluationStatus === 'not_requested' ? 'Completed' : evaluationStatus}
            </span>
            {#if latestEvaluationResult?.score}
              <span class="text-label-md font-medium text-dashboard-yellow-300">
                {latestEvaluationResult.score}
              </span>
            {/if}
          </div>

          {#if latestEvaluationResult?.summary}
            <p class="max-w-3xl text-body-md text-gray-300">{latestEvaluationResult.summary}</p>
          {:else}
            <p class="max-w-3xl text-body-md text-gray-300">
              Detailed evaluation against Digital Public Good standards.
            </p>
          {/if}
        </div>

        {#if hasActiveEvaluation}
          <div
            class="rounded-xl border border-dashboard-gray-700 bg-dashboard-gray-900/80 px-4 py-3 text-right"
          >
            <div class="text-body-sm text-gray-400">Current run</div>
            <div class="text-body-md font-medium text-white">
              {evaluationStatus === 'running' ? 'In progress' : 'Queued'}
            </div>
            <div class="mt-1 text-body-sm text-gray-500">
              Requested {formatDate(currentEvaluationRun?.created_at)}
            </div>
          </div>
        {/if}
      </div>
    </div>

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
                class="w-96 max-w-lg space-y-4 rounded-2xl border border-dashboard-gray-700 bg-dashboard-gray-900 p-6 "
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
                class="w-96 max-w-lg space-y-4 rounded-2xl border border-dashboard-gray-700 bg-dashboard-gray-900 p-6 "
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
            {#each evaluationHistory.filter((run) => run.status === 'completed' || run.status === 'failed') as run}
              <div
                class="flex items-center justify-between rounded-lg bg-dashboard-gray-900/50 px-4 py-3"
              >
                <div class="flex items-center gap-3">
                  <Icon
                    icon={run.status === 'completed' ? 'mdi:check-circle' : 'mdi:alert-circle'}
                    class={`h-4 w-4 ${run.status === 'completed' ? 'text-green-400' : 'text-red-400'}`}
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
                    class={`text-body-xs rounded-full px-2 py-0.5 ${
                      run.status === 'completed'
                        ? 'bg-green-500/10 text-green-400'
                        : 'bg-red-500/10 text-red-400'
                    }`}
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
  {:else if hasActiveEvaluation}
    <div class="space-y-6 text-center">
      <div>
        <h3 class="mb-2 text-heading-lg font-semibold text-white">DPG Standards Evaluation</h3>
        <p class="text-body-lg text-gray-400">
          {#if evaluationStatus === 'pending'}
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
          Evaluation {evaluationStatus}
        </p>
        <p class="text-body-sm text-gray-500">
          Requested {formatDate(currentEvaluationRun?.created_at)}
        </p>
      </div>
    </div>
  {:else if evaluationStatus === 'failed'}
    <div class="space-y-6 text-center">
      <div>
        <h3 class="mb-2 text-heading-lg font-semibold text-white">DPG Standards Evaluation</h3>
        <p class="text-body-lg text-gray-400">The latest evaluation did not complete.</p>
      </div>

      <div class="flex flex-col items-center gap-4 py-8">
        <Icon icon="mdi:alert-circle-outline" class="h-16 w-16 text-red-400" />
        {#if latestFailedEvaluation?.error}
          <p class="max-w-2xl text-body-sm text-red-300">{latestFailedEvaluation.error}</p>
        {/if}

        {#if isOwner}
          <button
            type="button"
            on:click={requestEvaluation}
            disabled={isRequestingEvaluation}
            class="rounded-xl border border-dashboard-purple-500 bg-dashboard-purple-500/10 px-6 py-3 text-label-lg font-medium text-dashboard-purple-400 transition-colors hover:bg-dashboard-purple-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dashboard-purple-500 disabled:opacity-50"
          >
            <Icon
              icon={isRequestingEvaluation ? 'lucide:loader-2' : 'lucide:refresh-cw'}
              class={`mr-2 inline h-4 w-4 ${isRequestingEvaluation ? 'animate-spin' : ''}`}
            />
            Request Evaluation Again
          </button>
        {/if}
      </div>
    </div>
  {:else}
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
            type="button"
            on:click={requestEvaluation}
            disabled={isRequestingEvaluation || !project.github}
            class="rounded-xl border border-dashboard-purple-500 bg-dashboard-purple-500/10 px-6 py-3 text-label-lg font-medium text-dashboard-purple-400 transition-colors hover:bg-dashboard-purple-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dashboard-purple-500 disabled:opacity-50"
          >
            <Icon
              icon={isRequestingEvaluation ? 'lucide:loader-2' : 'lucide:play'}
              class={`mr-2 inline h-4 w-4 ${isRequestingEvaluation ? 'animate-spin' : ''}`}
            />
            Request Evaluation
          </button>
          {#if !project.github}
            <p class="text-body-sm text-gray-500">
              Add a GitHub repository before requesting an evaluation.
            </p>
          {/if}
        {/if}
      </div>
    </div>
  {/if}
</div>
