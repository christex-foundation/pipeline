<script>
  import { page } from '$app/stores';
  import { Avatar, AvatarImage, AvatarFallback } from '$lib/components/ui/avatar';
  import Icon from '@iconify/svelte';

  function timeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.round((now - date) / 1000 / 60);

    if (diff < 60) return `${diff} minutes ago`;
    if (diff < 1440) return `${Math.round(diff / 60)} hours ago`;
    return `${Math.round(diff / 1440)} days ago`;
  }

  const fetchGoodFirstIssues = async () => {
    try {
      const res = await fetch(`/api/projects/${$page.params.id}/github/issues`);
      if (!res.ok) return { issues: [], count: 0 };
      return await res.json();
    } catch (_e) {
      return { issues: [], count: 0 };
    }
  };
</script>

<div class="flex w-full flex-col items-start">
  {#await fetchGoodFirstIssues()}
    <p class="text-body-md text-gray-400">Loading good first issues...</p>
  {:then { issues, count }}
    <div class="mb-3 flex items-center gap-2 text-body-sm text-gray-400">
      <Icon icon="octicon:tag-16" class="h-4 w-4" />
      <span>Good First Issues ({count})</span>
    </div>
    {#if issues.length > 0}
      <div class="w-full space-y-3">
        {#each issues as issue}
          <div
            class="rounded-xl border border-dashboard-gray-700 bg-dashboard-gray-900/50 p-4 transition-colors duration-200 hover:bg-dashboard-gray-800/50"
          >
            <div class="flex items-center gap-4">
              <div class="flex-shrink-0 rounded-lg bg-green-500/10 p-2">
                <Icon icon="octicon:issue-opened-16" class="h-5 w-5 text-green-400" />
              </div>

              <div class="min-w-0 flex-1">
                <a
                  href={issue.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="block truncate text-heading-sm font-semibold text-white transition-colors hover:text-dashboard-yellow-400"
                  title={issue.title}
                >
                  {issue.title}
                </a>
                <div class="mt-1 flex items-center gap-2 text-body-sm text-gray-400">
                  <span>#{issue.number}</span>
                  <span>·</span>
                  <span class="text-gray-300 max-lg:hidden">{issue.user?.login}</span>
                  <span>opened {timeAgo(issue.created_at)}</span>
                </div>
              </div>

              {#if issue.user}
                <Avatar class="h-8 w-8 flex-shrink-0 border border-dashboard-gray-600">
                  <AvatarImage src={issue.user.avatar_url} alt={issue.user.login} />
                  <AvatarFallback class="bg-dashboard-gray-800 text-body-sm text-gray-300">
                    {issue.user.login.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    {:else}
      <div
        class="rounded-xl border border-dashboard-gray-700 bg-dashboard-gray-900/30 p-8 text-center"
      >
        <Icon icon="octicon:issue-opened-16" class="mx-auto mb-4 h-12 w-12 text-gray-500" />
        <p class="text-heading-sm font-medium text-gray-400">No good first issues</p>
        <p class="mt-1 text-body-sm text-gray-500">
          This repository doesn't have any open issues labeled <code>good-first-issue</code> right now.
        </p>
      </div>
    {/if}
  {/await}
</div>
