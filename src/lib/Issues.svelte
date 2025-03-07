<script>
  import { page } from '$app/stores';
  import Icon from '@iconify/svelte';

  function timeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.round((now - date) / 1000 / 60);

    if (diff < 60) return `${diff} minutes ago`;
    if (diff < 1440) return `${Math.round(diff / 60)} hours ago`;
    return `${Math.round(diff / 1440)} days ago`;
  }

  const fetchProjectIssues = async () => {
    const githubLinkSplit = $page.data?.project?.github?.split('/') || [];
    const concat = githubLinkSplit[3] + '/' + githubLinkSplit[4];

    try {
      const res = await fetch(`https://api.github.com/repos/${concat}/issues`);
      const data = await res.json();
      return data;
    } catch (_e) {
      return [];
    }
  };
</script>

<h2 class="mb-4 self-start text-3xl font-bold text-teal-950">Issues</h2>

<div class="flex w-full flex-col items-start">
  {#await fetchProjectIssues()}
    <p>loading issues...</p>
  {:then issues}
    {#each issues as issue}
      <div class="flex w-[70%] items-center gap-4 border-b border-gray-300 p-4">
        <Icon icon="codicon:issues" class="text-3xl text-green-500" />

        <div class="flex-1">
          <a
            href={issue.html_url}
            target="_blank"
            class="font-semibold text-teal-950 hover:underline"
          >
            {issue.title}
          </a>
          <p class="text-sm text-gray-500">
            #{issue.number} · <span class="text-md">{issue.user.login}</span> opened {timeAgo(
              issue.created_at,
            )}
          </p>
        </div>

        <img src={issue.user.avatar_url} alt={issue.user.login} class="h-8 w-8 rounded-full" />
      </div>
    {:else}
      <p class="text-sm italic text-gray-600">no open issues on this repo</p>
    {/each}
  {/await}
</div>
