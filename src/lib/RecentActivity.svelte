<script>
  import { page } from '$app/stores';
  import { Avatar, AvatarImage, AvatarFallback } from '$lib/components/ui/avatar';
  import Icon from '@iconify/svelte';

  function timeAgo(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return '';
    const diffMin = Math.round((Date.now() - date.getTime()) / 60000);
    if (diffMin < 1) return 'just now';
    if (diffMin < 60) return `${diffMin} minutes ago`;
    if (diffMin < 1440) return `${Math.round(diffMin / 60)} hours ago`;
    return `${Math.round(diffMin / 1440)} days ago`;
  }

  function commitSubject(message) {
    if (typeof message !== 'string') return '';
    const firstLine = message.split('\n')[0] ?? '';
    return firstLine.length > 80 ? `${firstLine.slice(0, 79)}…` : firstLine;
  }

  function shortSha(sha) {
    return typeof sha === 'string' ? sha.slice(0, 7) : '';
  }

  function prVisual(pr) {
    if (pr.merged_at) {
      return { label: 'merged', color: 'text-purple-400', bg: 'bg-purple-500/10' };
    }
    if (pr.state === 'closed') {
      return { label: 'closed', color: 'text-red-400', bg: 'bg-red-500/10' };
    }
    return { label: 'open', color: 'text-green-400', bg: 'bg-green-500/10' };
  }

  function authorInitials(name) {
    if (!name) return '?';
    return name.substring(0, 2).toUpperCase();
  }

  const fetchActivity = async () => {
    try {
      const res = await fetch(`/api/projects/${$page.params.id}/github/activity`);
      const body = await res.json().catch(() => null);
      if (!res.ok) {
        return {
          commits: [],
          pullRequests: [],
          status: res.status,
          missingGithub: res.status === 404 && body?.error === 'No GitHub URL on project',
          notFound: res.status === 404 && body?.error !== 'No GitHub URL on project',
          error: body?.error ?? 'Could not load recent activity',
        };
      }
      return { ...body, status: 200, missingGithub: false, notFound: false };
    } catch (e) {
      return {
        commits: [],
        pullRequests: [],
        status: 0,
        missingGithub: false,
        notFound: false,
        error: e?.message ?? 'Network error',
      };
    }
  };
</script>

<div class="flex w-full flex-col items-start">
  {#await fetchActivity()}
    <p class="text-body-md text-gray-400">Loading recent activity…</p>
  {:then result}
    {#if result.missingGithub}
      <div
        class="w-full rounded-xl border border-dashboard-gray-700 bg-dashboard-gray-900/30 p-8 text-center"
      >
        <Icon icon="octicon:link-16" class="mx-auto mb-4 h-12 w-12 text-gray-500" />
        <p class="text-heading-sm font-medium text-gray-400">No GitHub URL set</p>
        <p class="mt-1 text-body-sm text-gray-500">
          Add a GitHub URL to your project to see commits and pull requests.
        </p>
      </div>
    {:else if result.notFound}
      <div
        class="w-full rounded-xl border border-dashboard-gray-700 bg-dashboard-gray-900/30 p-8 text-center"
      >
        <Icon icon="octicon:alert-16" class="mx-auto mb-4 h-12 w-12 text-gray-500" />
        <p class="text-heading-sm font-medium text-gray-400">Recent activity is unavailable</p>
        <p class="mt-1 text-body-sm text-gray-500">
          The linked GitHub repo may have moved or been deleted.
        </p>
      </div>
    {:else}
      {#if result.error}
        <div class="mb-4 w-full rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-3">
          <p class="text-body-sm text-yellow-300">
            Recent activity is temporarily unavailable. Showing cached data where possible.
          </p>
        </div>
      {/if}

      <!-- Recent Commits -->
      <div class="mb-3 flex items-center gap-2 text-body-sm text-gray-400">
        <Icon icon="octicon:git-commit-16" class="h-4 w-4" />
        <span>Recent Commits ({result.commits?.length ?? 0})</span>
      </div>
      {#if result.commits && result.commits.length > 0}
        <div class="mb-8 w-full space-y-3">
          {#each result.commits as commit (commit.sha)}
            <div
              class="rounded-xl border border-dashboard-gray-700 bg-dashboard-gray-900/50 p-4 transition-colors duration-200 hover:bg-dashboard-gray-800/50"
            >
              <div class="flex items-center gap-4">
                <div class="flex-shrink-0 rounded-lg bg-blue-500/10 p-2">
                  <Icon icon="octicon:git-commit-16" class="h-5 w-5 text-blue-400" />
                </div>

                <div class="min-w-0 flex-1">
                  <a
                    href={commit.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="block truncate text-heading-sm font-semibold text-white transition-colors hover:text-dashboard-yellow-400"
                    title={commit.message}
                  >
                    {commitSubject(commit.message)}
                  </a>
                  <div class="mt-1 flex items-center gap-2 text-body-sm text-gray-400">
                    <code class="text-gray-500">{shortSha(commit.sha)}</code>
                    <span>·</span>
                    <span class="text-gray-300 max-lg:hidden">
                      {commit.author?.login ?? commit.author?.name ?? 'unknown'}
                    </span>
                    <span>committed {timeAgo(commit.committed_at)}</span>
                  </div>
                </div>

                <Avatar class="h-8 w-8 flex-shrink-0 border border-dashboard-gray-600">
                  {#if commit.author?.avatar_url}
                    <AvatarImage
                      src={commit.author.avatar_url}
                      alt={commit.author.login ?? 'commit author'}
                    />
                  {/if}
                  <AvatarFallback class="bg-dashboard-gray-800 text-body-sm text-gray-300">
                    {authorInitials(commit.author?.login ?? commit.author?.name)}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          {/each}
        </div>
      {:else}
        <div
          class="mb-8 w-full rounded-xl border border-dashboard-gray-700 bg-dashboard-gray-900/30 p-6 text-center"
        >
          <p class="text-body-md text-gray-500">No commits yet.</p>
        </div>
      {/if}

      <!-- Recent Pull Requests -->
      <div class="mb-3 flex items-center gap-2 text-body-sm text-gray-400">
        <Icon icon="octicon:git-pull-request-16" class="h-4 w-4" />
        <span>Recent Pull Requests ({result.pullRequests?.length ?? 0})</span>
      </div>
      {#if result.pullRequests && result.pullRequests.length > 0}
        <div class="w-full space-y-3">
          {#each result.pullRequests as pr (pr.number)}
            {@const visual = prVisual(pr)}
            <div
              class="rounded-xl border border-dashboard-gray-700 bg-dashboard-gray-900/50 p-4 transition-colors duration-200 hover:bg-dashboard-gray-800/50"
            >
              <div class="flex items-center gap-4">
                <div class="flex-shrink-0 rounded-lg p-2 {visual.bg}">
                  <Icon icon="octicon:git-pull-request-16" class="h-5 w-5 {visual.color}" />
                </div>

                <div class="min-w-0 flex-1">
                  <a
                    href={pr.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="block truncate text-heading-sm font-semibold text-white transition-colors hover:text-dashboard-yellow-400"
                    title={pr.title}
                  >
                    {pr.title}
                  </a>
                  <div class="mt-1 flex items-center gap-2 text-body-sm text-gray-400">
                    <span>#{pr.number}</span>
                    <span>·</span>
                    <span class="rounded-full px-2 py-0.5 text-label-sm {visual.color} {visual.bg}">
                      {visual.label}
                    </span>
                    <span class="text-gray-300 max-lg:hidden">{pr.user?.login ?? 'unknown'}</span>
                    <span>updated {timeAgo(pr.updated_at)}</span>
                  </div>
                </div>

                {#if pr.user?.avatar_url}
                  <Avatar class="h-8 w-8 flex-shrink-0 border border-dashboard-gray-600">
                    <AvatarImage src={pr.user.avatar_url} alt={pr.user.login ?? 'pr author'} />
                    <AvatarFallback class="bg-dashboard-gray-800 text-body-sm text-gray-300">
                      {authorInitials(pr.user.login)}
                    </AvatarFallback>
                  </Avatar>
                {/if}
              </div>
            </div>
          {/each}
        </div>
      {:else}
        <div
          class="w-full rounded-xl border border-dashboard-gray-700 bg-dashboard-gray-900/30 p-6 text-center"
        >
          <p class="text-body-md text-gray-500">No pull requests yet.</p>
        </div>
      {/if}
    {/if}
  {/await}
</div>
