<script>
  import { onMount } from 'svelte';
  import Icon from '@iconify/svelte';
  import { timeAgo } from '$lib/utils/dateTimeFormat.js';

  let activities = [];
  let loading = true;
  let error = null;

  const typeConfig = {
    created: {
      icon: 'mdi:folder-plus',
      color: 'text-dashboard-purple-500',
      bg: 'bg-dashboard-purple-500/10',
    },
    contributed: { icon: 'mdi:account-group', color: 'text-blue-400', bg: 'bg-blue-400/10' },
    followed: { icon: 'mdi:heart', color: 'text-pink-400', bg: 'bg-pink-400/10' },
    update: {
      icon: 'mdi:newspaper-variant-outline',
      color: 'text-dashboard-success-500',
      bg: 'bg-dashboard-success-500/10',
    },
    comment: {
      icon: 'mdi:comment-outline',
      color: 'text-dashboard-yellow-400',
      bg: 'bg-dashboard-yellow-400/10',
    },
  };

  onMount(async () => {
    try {
      const res = await fetch('/api/profile/activity?limit=50');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load activity');
      activities = data.activities || [];
    } catch (e) {
      error = e.message;
    } finally {
      loading = false;
    }
  });
</script>

{#if loading}
  <div class="space-y-4">
    {#each Array(5) as _}
      <div
        class="flex animate-pulse items-start gap-4 rounded-2xl border border-dashboard-gray-700 bg-dashboard-gray-900/50 p-5"
      >
        <div class="h-10 w-10 flex-shrink-0 rounded-full bg-dashboard-gray-700"></div>
        <div class="flex-1 space-y-2">
          <div class="h-4 w-2/3 rounded bg-dashboard-gray-700"></div>
          <div class="h-3 w-1/3 rounded bg-dashboard-gray-700"></div>
        </div>
      </div>
    {/each}
  </div>
{:else if error}
  <div class="flex min-h-[400px] items-center justify-center">
    <div
      class="rounded-2xl border border-dashboard-gray-700 bg-dashboard-gray-900/50 p-8 text-center"
    >
      <p class="text-body-md text-gray-400">{error}</p>
    </div>
  </div>
{:else if activities.length === 0}
  <div class="flex min-h-[400px] items-center justify-center">
    <div class="max-w-md text-center">
      <div
        class="mb-6 rounded-2xl border border-dashboard-gray-700 bg-dashboard-gray-900/50 p-8 backdrop-blur-sm"
      >
        <div
          class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-dashboard-gray-800"
        >
          <Icon icon="mdi:clock-outline" class="h-8 w-8 text-gray-500" />
        </div>
        <h3 class="mb-2 text-heading-lg text-white">No activity yet</h3>
        <p class="mb-6 text-body-md text-gray-400">
          Your activity will appear here as you create projects, contribute, and engage with the
          community.
        </p>
        <a href="/explore">
          <button
            class="focus-ring mx-auto flex items-center justify-center gap-2 rounded-xl bg-dashboard-purple-500 px-6 py-3 text-label-lg font-medium text-white transition-all duration-200 hover:scale-105 hover:bg-dashboard-purple-600"
          >
            <Icon icon="mdi:compass-outline" class="h-5 w-5" />
            Explore Projects
          </button>
        </a>
      </div>
    </div>
  </div>
{:else}
  <div class="space-y-3">
    {#each activities as activity}
      {@const config = typeConfig[activity.type] || typeConfig.created}
      <div
        class="flex items-start gap-4 rounded-2xl border border-dashboard-gray-700 bg-dashboard-gray-900/50 p-5 backdrop-blur-sm transition-all duration-200 hover:border-dashboard-gray-600 hover:bg-dashboard-gray-900"
      >
        <div class="flex-shrink-0">
          <div class="flex h-10 w-10 items-center justify-center rounded-full {config.bg}">
            <Icon icon={config.icon} class="h-5 w-5 {config.color}" />
          </div>
        </div>
        <div class="min-w-0 flex-1">
          <p class="text-body-md text-gray-200">
            {activity.description}
            {#if activity.projectId && activity.projectTitle}
              <a
                href="/project/{activity.projectId}"
                class="font-medium text-dashboard-yellow-400 transition-colors hover:text-dashboard-yellow-300"
              >
                {activity.projectTitle}
              </a>
            {/if}
          </p>
          <p class="mt-1 text-body-sm text-gray-500">{timeAgo(activity.createdAt)}</p>
        </div>
      </div>
    {/each}
  </div>
{/if}
