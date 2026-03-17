<script>
  import Icon from '@iconify/svelte';

  const criteria = [
    {
      id: 1,
      name: 'Relevance to Sustainable Development Goals (SDGs)',
      status: 'pass',
      description: 'Clear alignment with SDG targets and measurable impact indicators.',
      icon: 'mdi:earth'
    },
    {
      id: 2,
      name: 'Use of Approved Open Licenses',
      status: 'pass',
      description: 'MIT License - approved open source license properly documented.',
      icon: 'mdi:license'
    },
    {
      id: 3,
      name: 'Clear Ownership',
      status: 'pass',
      description: 'Ownership and governance structure clearly defined and documented.',
      icon: 'mdi:account-check'
    },
    {
      id: 4,
      name: 'Platform Independence',
      status: 'pass',
      description: 'Functional open alternatives available without significant changes.',
      icon: 'mdi:devices'
    },
    {
      id: 5,
      name: 'Documentation',
      status: 'pass',
      description: 'Comprehensive documentation covering all aspects of the project.',
      icon: 'mdi:file-document'
    },
    {
      id: 6,
      name: 'Mechanism for Extracting Data and Content',
      status: 'fail',
      description: 'API endpoints for data export in JSON, CSV, and XML formats required.',
      icon: 'mdi:database-export',
      issue: 423,
      issueTitle: 'Implement Data Export API for DPG Compliance'
    },
    {
      id: 7,
      name: 'Adherence to Privacy and Applicable Laws',
      status: 'pass',
      description: 'Privacy policy, terms of service, and legal pages have been created.',
      icon: 'mdi:shield-lock'
    },
    {
      id: 8,
      name: 'Adherence to Standards & Best Practices',
      status: 'pass',
      description: 'Standards and best practices documentation in place.',
      icon: 'mdi:check-circle'
    },
    {
      id: 9,
      name: 'Do No Harm By Design',
      status: 'fail',
      description: 'Content moderation, safety features, and user protection required.',
      icon: 'mdi:heart-plus',
      issue: 425,
      issueTitle: 'Implement Content Moderation and Safety Features'
    }
  ];

  const currentScore = criteria.filter(c => c.status === 'pass').length;
  const totalCriteria = criteria.length;
  const percentage = Math.round((currentScore / totalCriteria) * 100);

  const completedCriteria = criteria.filter(c => c.status === 'pass');
  const remainingCriteria = criteria.filter(c => c.status === 'fail');

  function exportReport() {
    const report = {
      title: 'DPG Compliance Report',
      generatedAt: new Date().toISOString(),
      overallScore: {
        current: currentScore,
        total: totalCriteria,
        percentage: percentage
      },
      criteria: criteria.map(c => ({
        id: c.id,
        name: c.name,
        status: c.status.toUpperCase(),
        description: c.description,
        linkedIssue: c.issue || null
      })),
      summary: {
        completed: completedCriteria.length,
        remaining: remainingCriteria.length,
        readyForCertification: percentage >= 100
      }
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dpg-compliance-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
</script>

<svelte:head>
  <title>DPG Compliance Dashboard - Pipeline</title>
  <meta name="description" content="Track Digital Public Goods compliance status and progress toward certification" />
</svelte:head>

<div class="min-h-screen bg-dashboard-gray-900">
  <div class="container mx-auto px-4 py-12">
    <div class="mx-auto max-w-5xl">
      <div class="mb-8 text-center">
        <div class="mb-2 flex items-center justify-center gap-3">
          <Icon icon="mdi:shield-check" class="text-4xl text-dashboard-purple-500" />
          <h1 class="text-4xl font-bold text-white">DPG Compliance Dashboard</h1>
        </div>
        <p class="text-lg text-gray-400">Track progress toward Digital Public Goods certification</p>
      </div>

      <div class="mb-12 grid gap-6 md:grid-cols-3">
        <div class="rounded-2xl border border-dashboard-gray-700 bg-dashboard-gray-800 p-6 text-center">
          <Icon icon="mdi:trophy" class="mx-auto mb-3 h-10 w-10 text-dashboard-yellow-400" />
          <div class="text-4xl font-bold text-white">
            {currentScore}<span class="text-2xl text-gray-400">/{totalCriteria}</span>
          </div>
          <div class="mt-1 text-gray-400">Criteria Complete</div>
        </div>

        <div class="rounded-2xl border border-dashboard-gray-700 bg-dashboard-gray-800 p-6 text-center">
          <Icon icon="mdi:progress-check" class="mx-auto mb-3 h-10 w-10 text-dashboard-purple-500" />
          <div class="text-4xl font-bold text-white">{percentage}%</div>
          <div class="mt-1 text-gray-400">Progress</div>
        </div>

        <div class="rounded-2xl border border-dashboard-gray-700 bg-dashboard-gray-800 p-6 text-center">
          <Icon icon="mdi:target" class="mx-auto mb-3 h-10 w-10 text-green-400" />
          <div class="text-4xl font-bold text-white">{remainingCriteria.length}</div>
          <div class="mt-1 text-gray-400">Remaining</div>
        </div>
      </div>

      <div class="mb-8">
        <div class="h-6 overflow-hidden rounded-full bg-dashboard-gray-700">
          <div
            class="h-full transition-all duration-700 ease-out bg-gradient-to-r from-dashboard-yellow-400 to-dashboard-purple-500"
            style="width: {percentage}%"
          ></div>
        </div>
      </div>

      {#if remainingCriteria.length > 0}
        <div class="mb-12 rounded-2xl border border-dashboard-gray-700 bg-dashboard-gray-800 p-6">
          <div class="mb-4 flex items-center gap-3">
            <Icon icon="mdi:alert-circle" class="h-6 w-6 text-dashboard-yellow-400" />
            <h2 class="text-xl font-semibold text-white">Action Required</h2>
          </div>
          <p class="mb-4 text-gray-300">
            The following criteria need attention to achieve full DPG compliance:
          </p>
          <div class="grid gap-4 md:grid-cols-2">
            {#each remainingCriteria as criterion}
              <a
                href="https://github.com/christex-foundation/pipeline/issues/{criterion.issue}"
                target="_blank"
                class="group flex items-start gap-4 rounded-xl border border-red-500/30 bg-red-500/5 p-4 transition-all hover:border-red-500/50 hover:bg-red-500/10"
              >
                <div class="flex-shrink-0 rounded-lg bg-red-500/10 p-2">
                  <Icon icon={criterion.icon} class="h-5 w-5 text-red-400" />
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="font-medium text-white line-clamp-2">{criterion.name}</h3>
                  <p class="mt-1 text-sm text-red-300">{criterion.description}</p>
                  <div class="mt-2 flex items-center gap-2 text-sm text-dashboard-purple-400">
                    <span>Issue #{criterion.issue}</span>
                    <Icon icon="mdi:arrow-right" class="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </a>
            {/each}
          </div>
        </div>
      {/if}

      <div class="mb-12">
        <h2 class="mb-6 text-2xl font-semibold text-white">All Criteria Status</h2>
        <div class="space-y-3">
          {#each criteria as criterion}
            <div
              class="flex w-full items-center gap-4 rounded-xl border border-dashboard-gray-700 bg-dashboard-gray-800 p-4"
            >
              <div
                class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg {criterion.status ===
                'pass'
                  ? 'bg-green-500/10'
                  : 'bg-red-500/10'}"
              >
                <Icon
                  icon={criterion.status === 'pass' ? 'mdi:check' : 'mdi:close'}
                  class="h-5 w-5 {criterion.status === 'pass' ? 'text-green-400' : 'text-red-400'}"
                />
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="font-medium text-white">{criterion.name}</h3>
                <p class="text-sm text-gray-400">{criterion.description}</p>
                {#if criterion.issue}
                  <a
                    href="https://github.com/christex-foundation/pipeline/issues/{criterion.issue}"
                    target="_blank"
                    class="mt-2 inline-flex items-center gap-1 text-sm text-dashboard-purple-400 hover:text-dashboard-purple-300"
                  >
                    <Icon icon="mdi:github" class="h-4 w-4" />
                    <span>Issue #{criterion.issue}</span>
                    <Icon icon="mdi:open-in-new" class="h-3 w-3" />
                  </a>
                {/if}
              </div>
              <div class="flex-shrink-0">
                <span
                  class="rounded-full px-3 py-1 text-xs font-medium {criterion.status === 'pass'
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-red-500/20 text-red-400'}"
                >
                  {criterion.status === 'pass' ? 'Compliant' : 'Pending'}
                </span>
              </div>
            </div>
          {/each}
        </div>
      </div>

      <div class="rounded-2xl border border-dashboard-gray-700 bg-dashboard-gray-800 p-6">
        <div class="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div>
            <h3 class="text-xl font-semibold text-white">Export Compliance Report</h3>
            <p class="text-gray-400">Download a JSON report of the current compliance status</p>
          </div>
          <button
            on:click={exportReport}
            class="flex items-center gap-2 rounded-xl bg-dashboard-purple-500 px-6 py-3 font-medium text-white transition-colors hover:bg-dashboard-purple-600"
          >
            <Icon icon="mdi:download" class="h-5 w-5" />
            Export Report
          </button>
        </div>
      </div>

      <div class="mt-12 text-center">
        <p class="text-gray-400">
          For more information about DPG standards, visit the
          <a
            href="https://www.digitalpublicgoods.net/standard"
            target="_blank"
            class="text-dashboard-purple-400 hover:text-dashboard-purple-300"
          >
            Digital Public Goods Standard
          </a>
        </p>
      </div>
    </div>
  </div>
</div>
