<script>
  import Apply from '$lib/apply.svelte';
  import Issues from '$lib/Issues.svelte';
  import DpgStatus from '$lib/dpgStatus.svelte';
  import { page } from '$app/stores';
  import { parseGithubRepo } from '$lib/utils/github.js';
  import { ChevronRight, ArrowLeft, GitBranch, Award, CheckCircle, Circle } from 'lucide-svelte';
  import Icon from '@iconify/svelte';
  import { fly, fade, scale } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';

  $: id = $page.params.id;
  export let data;
  let project = data.project;

  // Track what the user wants to help with
  let selectedContributionType = null; // 'issue' or 'dpg'
  let selectedItem = null; // The specific issue or DPG standard
  let currentStep = 1; // 1: Choose area, 2: Submit resource

  // Get incomplete DPG standards
  $: incompleteStandards =
    project.dpgStatus?.status?.filter((item) => item.overallScore !== 1) || [];

  function selectContribution(type, item) {
    selectedContributionType = type;
    selectedItem = item;
    currentStep = 2;

    // Smooth scroll to form with offset for better UX
    setTimeout(() => {
      const formElement = document.getElementById('contribution-form');
      const yOffset = -80; // Offset for better visual positioning
      const y = formElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }, 300);
  }

  function goBackToSelection() {
    currentStep = 1;
    selectedContributionType = null;
    selectedItem = null;

    // Scroll back to selection area
    setTimeout(() => {
      document.getElementById('selection-area').scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 100);
  }

  function clearSelection() {
    selectedContributionType = null;
    selectedItem = null;
  }

  let activeTab = 'funding';

  let steps = [
    { label: 'Funding', active: false },
    { label: 'Resources', active: true },
  ];

  function selectStep(index) {
    if (!steps[index].disabled) {
      steps = steps.map((step, i) => ({ ...step, active: i === index }));
    }
  }
</script>

<!-- Dark background with gradient hero section -->
<div class="w-full bg-gradient-to-br from-dashboard-purple-500 to-dashboard-purple-600 py-16">
  <div class="mx-auto max-w-6xl px-8">
    <!-- Breadcrumb Navigation -->
    <nav class="mb-8">
      <div class="flex items-center gap-2">
        <a
          href="/project/{id}"
          class="flex items-center gap-2 text-body-lg font-medium text-white/80 transition-colors hover:text-white"
        >
          <ArrowLeft class="h-5 w-5" />
          {project.title || 'Project'}
        </a>
        <ChevronRight class="h-4 w-4 text-white/60" />
        <span class="text-body-lg text-white/90">Contribute to</span>
      </div>
    </nav>

    <!-- Hero Content with Progress Indicator -->
    <div class="space-y-6 text-center">
      <div>
        <h1 class="mb-2 text-display-md text-white lg:mb-4 lg:text-display-lg">Contribute to</h1>
        <h2 class="mb-2 text-heading-xl text-white">{project.title || 'Project Title'}</h2>
        <p class="text-body-xl text-white/90">
          Help this project by contributing resources to specific needs
        </p>
      </div>

      <!-- Step Progress Indicator -->
      <div class="mt-8 flex items-center justify-center gap-4">
        <div class="flex items-center gap-2">
          {#if currentStep >= 1}
            <div in:scale={{ duration: 300 }}>
              <CheckCircle class="h-6 w-6 text-dashboard-yellow-400" />
            </div>
          {:else}
            <Circle class="h-6 w-6 text-white/40" />
          {/if}
          <span class="text-body-lg font-medium text-white">Choose Area</span>
        </div>
        <div class="h-0.5 w-8 bg-white/20">
          <div
            class="h-full bg-dashboard-yellow-400 transition-all duration-500 ease-out"
            style="width: {currentStep >= 2 ? '100%' : '0%'}"
          ></div>
        </div>
        <div class="flex items-center gap-2">
          {#if currentStep >= 2}
            <div in:scale={{ duration: 300 }}>
              <CheckCircle class="h-6 w-6 text-dashboard-yellow-400" />
            </div>
          {:else}
            <Circle class="h-6 w-6 text-white/40" />
          {/if}
          <span class="text-body-lg font-medium text-white">Submit Resource</span>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Main content with dark theme -->
<div class="min-h-screen bg-dashboard-black">
  <div class="mx-auto w-full max-w-6xl px-8 py-12">
    {#if currentStep === 1}
      <!-- Step 1: Area Selection -->
      <div
        id="selection-area"
        class="space-y-12"
        in:fly={{ y: 20, duration: 400, easing: quintOut }}
      >
        <div class="space-y-4 text-center">
          <h2 class="text-heading-xl text-white">What would you like to help with?</h2>
          <p class="mx-auto max-w-2xl text-body-lg text-gray-300">
            Choose a specific area where your resources can make the biggest impact. We'll guide you
            through the contribution process.
          </p>
        </div>

        <div class="grid gap-8 lg:grid-cols-2">
          <!-- GitHub Issues Card -->
          <div class="space-y-6" in:fly={{ x: -20, duration: 500, delay: 100 }}>
            <div class="space-y-3 text-center">
              <div
                class="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-dashboard-purple-500"
              >
                <GitBranch class="h-8 w-8 text-white" />
              </div>
              <h3 class="text-heading-lg text-white">Development Tasks</h3>
              <p class="text-body-md text-gray-400">
                Help with specific GitHub issues and development tasks
              </p>
            </div>

            <div
              class="rounded-2xl border border-dashboard-gray-700 bg-dashboard-gray-900 p-4 shadow-card md:p-6"
            >
              {#await (async () => {
                const repo = parseGithubRepo(project?.github);
                if (!repo) return [];
                try {
                  const res = await fetch(`https://api.github.com/repos/${repo.owner}/${repo.repo}/issues`);
                  return await res.json();
                } catch (_e) {
                  return [];
                }
              })()}
                <div class="flex flex-col items-center justify-center space-y-4 py-6 md:py-8">
                  <div class="animate-spin">
                    <Icon icon="lucide:loader-2" class="h-8 w-8 text-dashboard-purple-500" />
                  </div>
                  <p class="text-body-md text-gray-400">Loading development tasks...</p>
                </div>
              {:then issues}
                {#if issues.length > 0}
                  <div class="space-y-4">
                    <div class="flex items-center justify-between">
                      <span class="text-label-lg font-medium text-gray-300"
                        >{issues.length} open issues</span
                      >
                      <span
                        class="rounded-full bg-dashboard-success-500/10 px-3 py-1 text-body-sm font-medium text-dashboard-success-500"
                        >Active</span
                      >
                    </div>

                    <div class="max-h-60 space-y-3 overflow-y-auto md:max-h-80">
                      {#each issues.slice(0, 4) as issue, index}
                        <button
                          class="group w-full rounded-xl border border-dashboard-gray-700 bg-dashboard-gray-800 p-3 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-dashboard-purple-500/50 hover:bg-dashboard-gray-700 hover:shadow-cardHover md:p-4"
                          on:click={() => selectContribution('issue', issue)}
                          in:fly={{ y: 10, duration: 300, delay: index * 50 }}
                        >
                          <div class="flex items-center gap-3">
                            <div
                              class="flex-shrink-0 rounded-lg bg-dashboard-success-500/10 p-2 transition-colors group-hover:bg-dashboard-success-500/20"
                            >
                              <Icon
                                icon="octicon:issue-opened-16"
                                class="h-4 w-4 text-dashboard-success-500"
                              />
                            </div>
                            <div class="min-w-0 flex-1">
                              <h4
                                class="line-clamp-2 text-body-lg font-medium text-white transition-colors group-hover:text-dashboard-purple-300 md:truncate"
                              >
                                #{issue.number}
                                {issue.title}
                              </h4>
                              <p class="truncate text-body-sm text-gray-400">
                                by {issue.user.login}
                              </p>
                            </div>
                            <Icon
                              icon="mdi:arrow-right"
                              class="h-5 w-5 flex-shrink-0 text-gray-400 transition-all group-hover:translate-x-1 group-hover:text-dashboard-purple-400"
                            />
                          </div>
                        </button>
                      {/each}

                      {#if issues.length > 4}
                        <div class="pt-2 text-center">
                          <span class="text-body-sm text-gray-500"
                            >and {issues.length - 4} more issues...</span
                          >
                        </div>
                      {/if}
                    </div>
                  </div>
                {:else}
                  <div class="flex flex-col items-center justify-center space-y-4 py-8 md:py-12">
                    <div class="rounded-2xl bg-dashboard-gray-800 p-4">
                      <Icon icon="mdi:check-circle" class="h-12 w-12 text-dashboard-success-500" />
                    </div>
                    <div class="text-center">
                      <h4 class="text-heading-sm font-medium text-white">All caught up!</h4>
                      <p class="mt-1 text-body-sm text-gray-400">No open issues at the moment</p>
                    </div>
                  </div>
                {/if}
              {/await}
            </div>
          </div>

          <!-- DPG Standards Card -->
          {#if incompleteStandards.length > 0}
            <div class="space-y-6" in:fly={{ x: 20, duration: 500, delay: 200 }}>
              <div class="space-y-3 text-center">
                <div
                  class="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-dashboard-yellow-400"
                >
                  <Award class="h-8 w-8 text-dashboard-black" />
                </div>
                <h3 class="text-heading-lg text-white">DPG Standards</h3>
                <p class="text-body-md text-gray-400">
                  Help meet Digital Public Good certification standards
                </p>
              </div>

              <div
                class="rounded-2xl border border-dashboard-gray-700 bg-dashboard-gray-900 p-6 shadow-card"
              >
                <div class="space-y-4">
                  <div class="flex items-center justify-between">
                    <span class="text-label-lg font-medium text-gray-300"
                      >{incompleteStandards.length} standards need attention</span
                    >
                    <span
                      class="rounded-full bg-dashboard-warning-500/10 px-3 py-1 text-body-sm font-medium text-dashboard-warning-500"
                      >In Progress</span
                    >
                  </div>

                  <div class="max-h-80 space-y-3 overflow-y-auto">
                    {#each incompleteStandards.slice(0, 4) as standard, index}
                      <button
                        class="group w-full rounded-xl border border-dashboard-gray-700 bg-dashboard-gray-800 p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-dashboard-yellow-400/50 hover:bg-dashboard-gray-700 hover:shadow-cardHover"
                        on:click={() => selectContribution('dpg', standard)}
                        in:fly={{ y: 10, duration: 300, delay: index * 50 }}
                      >
                        <div class="flex items-start gap-3">
                          <div
                            class="flex-shrink-0 rounded-lg bg-dashboard-error-500/10 p-2 transition-colors group-hover:bg-dashboard-error-500/20"
                          >
                            <Icon
                              icon="mdi:alert-circle"
                              class="h-4 w-4 text-dashboard-error-500"
                            />
                          </div>
                          <div class="min-w-0 flex-1">
                            <h4
                              class="line-clamp-2 text-body-lg font-medium text-white transition-colors group-hover:text-dashboard-yellow-400"
                            >
                              {standard.name}
                            </h4>
                            <p class="mt-1 text-body-sm text-gray-400">
                              Requires documentation & evidence
                            </p>
                          </div>
                          <Icon
                            icon="mdi:arrow-right"
                            class="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400 transition-all group-hover:translate-x-1 group-hover:text-dashboard-yellow-400"
                          />
                        </div>
                      </button>
                    {/each}

                    {#if incompleteStandards.length > 4}
                      <div class="pt-2 text-center">
                        <span class="text-body-sm text-gray-500"
                          >and {incompleteStandards.length - 4} more standards...</span
                        >
                      </div>
                    {/if}
                  </div>
                </div>
              </div>
            </div>
          {:else}
            <!-- DPG Complete State -->
            <div class="space-y-6" in:fly={{ x: 20, duration: 500, delay: 200 }}>
              <div class="space-y-3 text-center">
                <div
                  class="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-dashboard-success-500"
                >
                  <Award class="h-8 w-8 text-white" />
                </div>
                <h3 class="text-heading-lg text-white">DPG Standards</h3>
                <p class="text-body-md text-gray-400">
                  Digital Public Good certification standards
                </p>
              </div>

              <div
                class="rounded-2xl border border-dashboard-gray-700 bg-dashboard-gray-900 p-6 shadow-card"
              >
                <div class="flex flex-col items-center justify-center space-y-4 py-12">
                  <div class="rounded-2xl bg-dashboard-gray-800 p-4">
                    <Icon icon="mdi:trophy" class="h-12 w-12 text-dashboard-success-500" />
                  </div>
                  <div class="text-center">
                    <h4 class="text-heading-sm font-medium text-white">All standards met!</h4>
                    <p class="mt-1 text-body-sm text-gray-400">
                      This project has achieved DPG certification
                    </p>
                  </div>
                </div>
              </div>
            </div>
          {/if}
        </div>
      </div>
    {:else if currentStep === 2}
      <!-- Step 2: Resource Submission -->
      <div
        id="contribution-form"
        class="space-y-8"
        in:fly={{ y: 20, duration: 400, easing: quintOut }}
      >
        <!-- Back button and selection summary -->
        <div class="flex items-center justify-between">
          <button
            on:click={goBackToSelection}
            class="flex items-center gap-2 rounded-lg px-4 py-2 text-gray-300 transition-colors hover:bg-dashboard-gray-800 hover:text-white"
          >
            <ArrowLeft class="h-4 w-4" />
            <span class="text-body-md">Choose different area</span>
          </button>
        </div>

        <!-- Selected item display -->
        <div
          class="rounded-2xl border border-dashboard-purple-500/30 bg-gradient-to-r from-dashboard-purple-500/5 to-dashboard-purple-600/5 p-6 backdrop-blur-sm"
          in:scale={{ duration: 300, delay: 100 }}
        >
          <div class="flex items-start gap-4">
            <div
              class="rounded-xl border border-dashboard-purple-500/20 bg-dashboard-purple-500/10 p-3"
            >
              {#if selectedContributionType === 'issue'}
                <Icon icon="octicon:issue-opened-16" class="h-6 w-6 text-dashboard-purple-400" />
              {:else}
                <Icon icon="mdi:award" class="h-6 w-6 text-dashboard-purple-400" />
              {/if}
            </div>
            <div class="flex-1">
              <div class="mb-2 flex items-center gap-2">
                <h3 class="text-heading-lg text-white">Contributing to:</h3>
                <span
                  class="rounded-full bg-dashboard-purple-500/20 px-2 py-1 text-body-sm text-dashboard-purple-300"
                >
                  {selectedContributionType === 'issue' ? 'Development Task' : 'DPG Standard'}
                </span>
              </div>
              <h4 class="mb-3 text-heading-md text-dashboard-purple-200">
                {#if selectedContributionType === 'issue'}
                  Issue #{selectedItem.number}: {selectedItem.title}
                {:else}
                  {selectedItem.name}
                {/if}
              </h4>
              {#if selectedContributionType === 'dpg' && selectedItem.explanation}
                <p class="text-body-md leading-relaxed text-gray-300">
                  {selectedItem.explanation}
                </p>
              {/if}
            </div>
          </div>
        </div>

        <!-- Resource submission form -->
        <div in:fly={{ y: 20, duration: 400, delay: 200 }}>
          <Apply {id} {selectedContributionType} {selectedItem} />
        </div>
      </div>
    {/if}
  </div>
</div>
