<script>
  import { page } from '$app/stores';
  import Icon from '@iconify/svelte';
  import { toast } from 'svelte-sonner';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Textarea } from '$lib/components/ui/textarea';
  import { Dialog, DialogHeader, DialogContent, DialogTitle } from '$lib/components/ui/dialog';

  export let owner = '';
  export let repo = '';
  export let isAuthenticated = false;

  let activeTab = 'issues';
  let issues = [];
  let pulls = [];
  let loadingIssues = true;
  let loadingPulls = true;
  let showNewIssueDialog = false;
  let showNewPRDialog = false;
  let submitting = false;

  // New issue form
  let newIssueTitle = '';
  let newIssueBody = '';

  // New PR form
  let newPRTitle = '';
  let newPRBody = '';
  let newPRHead = '';
  let newPRBase = 'main';

  function timeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.round((now - date) / 1000 / 60);

    if (diff < 60) return `${diff} minutes ago`;
    if (diff < 1440) return `${Math.round(diff / 60)} hours ago`;
    return `${Math.round(diff / 1440)} days ago`;
  }

  async function fetchIssues() {
    loadingIssues = true;
    try {
      const res = await fetch(
        `/api/github/issues?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repo)}`,
      );
      if (res.ok) {
        const data = await res.json();
        issues = data.issues || [];
      } else if (res.status === 403) {
        issues = [];
        // Fall back to public API
        await fetchPublicIssues();
      }
    } catch {
      await fetchPublicIssues();
    } finally {
      loadingIssues = false;
    }
  }

  async function fetchPublicIssues() {
    try {
      const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues`);
      const data = await res.json();
      issues = Array.isArray(data) ? data.filter((i) => !i.pull_request) : [];
    } catch {
      issues = [];
    }
  }

  async function fetchPulls() {
    loadingPulls = true;
    try {
      const res = await fetch(
        `/api/github/pulls?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repo)}`,
      );
      if (res.ok) {
        const data = await res.json();
        pulls = data.pulls || [];
      } else if (res.status === 403) {
        pulls = [];
        await fetchPublicPulls();
      }
    } catch {
      await fetchPublicPulls();
    } finally {
      loadingPulls = false;
    }
  }

  async function fetchPublicPulls() {
    try {
      const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls`);
      const data = await res.json();
      pulls = Array.isArray(data) ? data : [];
    } catch {
      pulls = [];
    }
  }

  async function createIssue() {
    if (!newIssueTitle.trim()) return;
    submitting = true;
    try {
      const res = await fetch('/api/github/issues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ owner, repo, title: newIssueTitle, body: newIssueBody }),
      });
      if (res.ok) {
        toast.success('Issue created successfully');
        showNewIssueDialog = false;
        newIssueTitle = '';
        newIssueBody = '';
        await fetchIssues();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to create issue');
      }
    } catch {
      toast.error('Failed to create issue');
    } finally {
      submitting = false;
    }
  }

  async function createPR() {
    if (!newPRTitle.trim() || !newPRHead.trim()) return;
    submitting = true;
    try {
      const res = await fetch('/api/github/pulls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          owner,
          repo,
          title: newPRTitle,
          body: newPRBody,
          head: newPRHead,
          base: newPRBase,
        }),
      });
      if (res.ok) {
        toast.success('Pull request created successfully');
        showNewPRDialog = false;
        newPRTitle = '';
        newPRBody = '';
        newPRHead = '';
        newPRBase = 'main';
        await fetchPulls();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to create pull request');
      }
    } catch {
      toast.error('Failed to create pull request');
    } finally {
      submitting = false;
    }
  }

  async function updateIssueState(issueNumber, state) {
    try {
      const res = await fetch(`/api/github/issues/${issueNumber}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ owner, repo, state }),
      });
      if (res.ok) {
        toast.success(`Issue ${state === 'closed' ? 'closed' : 'reopened'}`);
        await fetchIssues();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to update issue');
      }
    } catch {
      toast.error('Failed to update issue');
    }
  }

  async function updatePRState(pullNumber, state) {
    try {
      const res = await fetch(`/api/github/pulls/${pullNumber}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ owner, repo, state }),
      });
      if (res.ok) {
        toast.success(`Pull request ${state === 'closed' ? 'closed' : 'reopened'}`);
        await fetchPulls();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to update pull request');
      }
    } catch {
      toast.error('Failed to update pull request');
    }
  }

  async function mergePR(pullNumber) {
    try {
      const res = await fetch(`/api/github/pulls/${pullNumber}/merge`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ owner, repo }),
      });
      if (res.ok) {
        toast.success('Pull request merged successfully');
        await fetchPulls();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to merge pull request');
      }
    } catch {
      toast.error('Failed to merge pull request');
    }
  }

  // Fetch data when owner/repo are available
  $: if (owner && repo) {
    fetchIssues();
    fetchPulls();
  }
</script>

<div class="space-y-6">
  <!-- Tab Switcher -->
  <div class="flex items-center justify-between">
    <div class="flex gap-2">
      <button
        class="rounded-lg px-4 py-2 text-label-lg font-medium transition-colors {activeTab ===
        'issues'
          ? 'bg-dashboard-purple-500 text-white'
          : 'text-gray-400 hover:text-white'}"
        on:click={() => (activeTab = 'issues')}
      >
        <Icon icon="octicon:issue-opened-16" class="mr-2 inline h-4 w-4" />
        Issues
        {#if issues.length > 0}
          <span
            class="ml-1 rounded-full bg-dashboard-gray-700 px-2 py-0.5 text-label-sm text-gray-300"
            >{issues.length}</span
          >
        {/if}
      </button>
      <button
        class="rounded-lg px-4 py-2 text-label-lg font-medium transition-colors {activeTab ===
        'pulls'
          ? 'bg-dashboard-purple-500 text-white'
          : 'text-gray-400 hover:text-white'}"
        on:click={() => (activeTab = 'pulls')}
      >
        <Icon icon="octicon:git-pull-request-16" class="mr-2 inline h-4 w-4" />
        Pull Requests
        {#if pulls.length > 0}
          <span
            class="ml-1 rounded-full bg-dashboard-gray-700 px-2 py-0.5 text-label-sm text-gray-300"
            >{pulls.length}</span
          >
        {/if}
      </button>
    </div>

    {#if isAuthenticated}
      <div class="flex gap-2">
        {#if activeTab === 'issues'}
          <Button
            class="rounded-lg bg-green-600 px-4 py-2 text-label-sm font-medium text-white hover:bg-green-700"
            on:click={() => (showNewIssueDialog = true)}
          >
            <Icon icon="lucide:plus" class="mr-1 inline h-4 w-4" />
            New Issue
          </Button>
        {:else}
          <Button
            class="rounded-lg bg-green-600 px-4 py-2 text-label-sm font-medium text-white hover:bg-green-700"
            on:click={() => (showNewPRDialog = true)}
          >
            <Icon icon="lucide:plus" class="mr-1 inline h-4 w-4" />
            New PR
          </Button>
        {/if}
      </div>
    {/if}
  </div>

  <!-- Issues Tab -->
  {#if activeTab === 'issues'}
    {#if loadingIssues}
      <p class="text-body-md text-gray-400">Loading issues...</p>
    {:else if issues.length > 0}
      <div class="w-full space-y-3">
        {#each issues as issue}
          <div
            class="rounded-xl border border-dashboard-gray-700 bg-dashboard-gray-900/50 p-4 transition-colors duration-200 hover:bg-dashboard-gray-800/50"
          >
            <div class="flex items-center gap-4">
              <div
                class="flex-shrink-0 rounded-lg p-2 {issue.state === 'open'
                  ? 'bg-green-500/10'
                  : 'bg-purple-500/10'}"
              >
                <Icon
                  icon={issue.state === 'open'
                    ? 'octicon:issue-opened-16'
                    : 'octicon:issue-closed-16'}
                  class="h-5 w-5 {issue.state === 'open' ? 'text-green-400' : 'text-purple-400'}"
                />
              </div>

              <div class="min-w-0 flex-1">
                <a
                  href={issue.html_url}
                  target="_blank"
                  class="block truncate text-heading-sm font-semibold text-white transition-colors hover:text-dashboard-yellow-400"
                  title={issue.title}
                >
                  {issue.title}
                </a>
                <div class="mt-1 flex items-center gap-2 text-body-sm text-gray-400">
                  <span>#{issue.number}</span>
                  <span>·</span>
                  <span class="text-gray-300 max-lg:hidden">{issue.user.login}</span>
                  <span>opened {timeAgo(issue.created_at)}</span>
                </div>
              </div>

              {#if isAuthenticated}
                <div class="flex flex-shrink-0 gap-2">
                  {#if issue.state === 'open'}
                    <button
                      class="rounded-lg border border-dashboard-gray-600 bg-dashboard-gray-800 px-3 py-1.5 text-label-sm text-gray-300 transition-colors hover:bg-dashboard-gray-700 hover:text-white"
                      on:click={() => updateIssueState(issue.number, 'closed')}
                    >
                      Close
                    </button>
                  {:else}
                    <button
                      class="rounded-lg border border-dashboard-gray-600 bg-dashboard-gray-800 px-3 py-1.5 text-label-sm text-gray-300 transition-colors hover:bg-dashboard-gray-700 hover:text-white"
                      on:click={() => updateIssueState(issue.number, 'open')}
                    >
                      Reopen
                    </button>
                  {/if}
                </div>
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
        <p class="text-heading-sm font-medium text-gray-400">No open issues</p>
        <p class="mt-1 text-body-sm text-gray-500">
          This repository doesn't have any open issues at the moment.
        </p>
      </div>
    {/if}
  {/if}

  <!-- Pull Requests Tab -->
  {#if activeTab === 'pulls'}
    {#if loadingPulls}
      <p class="text-body-md text-gray-400">Loading pull requests...</p>
    {:else if pulls.length > 0}
      <div class="w-full space-y-3">
        {#each pulls as pr}
          <div
            class="rounded-xl border border-dashboard-gray-700 bg-dashboard-gray-900/50 p-4 transition-colors duration-200 hover:bg-dashboard-gray-800/50"
          >
            <div class="flex items-center gap-4">
              <div
                class="flex-shrink-0 rounded-lg p-2 {pr.state === 'open'
                  ? 'bg-green-500/10'
                  : pr.merged_at
                    ? 'bg-purple-500/10'
                    : 'bg-red-500/10'}"
              >
                <Icon
                  icon={pr.merged_at
                    ? 'octicon:git-merge-16'
                    : pr.state === 'open'
                      ? 'octicon:git-pull-request-16'
                      : 'octicon:git-pull-request-closed-16'}
                  class="h-5 w-5 {pr.state === 'open'
                    ? 'text-green-400'
                    : pr.merged_at
                      ? 'text-purple-400'
                      : 'text-red-400'}"
                />
              </div>

              <div class="min-w-0 flex-1">
                <a
                  href={pr.html_url}
                  target="_blank"
                  class="block truncate text-heading-sm font-semibold text-white transition-colors hover:text-dashboard-yellow-400"
                  title={pr.title}
                >
                  {pr.title}
                </a>
                <div class="mt-1 flex items-center gap-2 text-body-sm text-gray-400">
                  <span>#{pr.number}</span>
                  <span>·</span>
                  <span class="text-gray-300 max-lg:hidden">{pr.user.login}</span>
                  <span>opened {timeAgo(pr.created_at)}</span>
                  <span>·</span>
                  <span class="text-gray-500">{pr.head.ref} → {pr.base.ref}</span>
                </div>
              </div>

              {#if isAuthenticated && pr.state === 'open'}
                <div class="flex flex-shrink-0 gap-2">
                  <button
                    class="rounded-lg bg-purple-600 px-3 py-1.5 text-label-sm font-medium text-white transition-colors hover:bg-purple-700"
                    on:click={() => mergePR(pr.number)}
                  >
                    Merge
                  </button>
                  <button
                    class="rounded-lg border border-dashboard-gray-600 bg-dashboard-gray-800 px-3 py-1.5 text-label-sm text-gray-300 transition-colors hover:bg-dashboard-gray-700 hover:text-white"
                    on:click={() => updatePRState(pr.number, 'closed')}
                  >
                    Close
                  </button>
                </div>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    {:else}
      <div
        class="rounded-xl border border-dashboard-gray-700 bg-dashboard-gray-900/30 p-8 text-center"
      >
        <Icon icon="octicon:git-pull-request-16" class="mx-auto mb-4 h-12 w-12 text-gray-500" />
        <p class="text-heading-sm font-medium text-gray-400">No open pull requests</p>
        <p class="mt-1 text-body-sm text-gray-500">
          This repository doesn't have any open pull requests at the moment.
        </p>
      </div>
    {/if}
  {/if}
</div>

<!-- New Issue Dialog -->
{#if showNewIssueDialog}
  <Dialog open onOpenChange={() => (showNewIssueDialog = false)}>
    <DialogContent
      class="fixed w-full max-w-md rounded-2xl border border-dashboard-gray-700 bg-dashboard-gray-900 p-6 shadow-card sm:left-[50%] sm:top-[50%] sm:translate-x-[-50%] sm:translate-y-[-50%]"
    >
      <DialogHeader>
        <DialogTitle class="mb-4 text-heading-lg font-semibold text-white">New Issue</DialogTitle>
      </DialogHeader>

      <form on:submit|preventDefault={createIssue} class="space-y-4">
        <div>
          <Label class="mb-2 block text-label-lg font-medium text-gray-300">Title</Label>
          <Input
            type="text"
            bind:value={newIssueTitle}
            class="w-full rounded-lg border border-dashboard-gray-600 bg-dashboard-gray-800 px-4 py-3 text-body-lg text-white focus:border-transparent focus:outline-none focus:ring-2 focus:ring-dashboard-purple-500"
            required
            disabled={submitting}
          />
        </div>

        <div>
          <Label class="mb-2 block text-label-lg font-medium text-gray-300">Description</Label>
          <Textarea
            rows="4"
            bind:value={newIssueBody}
            class="w-full resize-none rounded-lg border border-dashboard-gray-600 bg-dashboard-gray-800 px-4 py-3 text-body-lg text-white focus:border-transparent focus:outline-none focus:ring-2 focus:ring-dashboard-purple-500"
            disabled={submitting}
          />
        </div>

        <Button
          type="submit"
          class="w-full rounded-xl bg-green-600 px-6 py-3 text-label-lg font-medium text-white transition-colors hover:bg-green-700 disabled:opacity-50"
          disabled={submitting || !newIssueTitle.trim()}
        >
          {#if submitting}
            <Icon icon="lucide:loader-2" class="mr-2 inline h-4 w-4 animate-spin" />
            Creating...
          {:else}
            Create Issue
          {/if}
        </Button>
      </form>
    </DialogContent>
  </Dialog>
{/if}

<!-- New PR Dialog -->
{#if showNewPRDialog}
  <Dialog open onOpenChange={() => (showNewPRDialog = false)}>
    <DialogContent
      class="fixed w-full max-w-md rounded-2xl border border-dashboard-gray-700 bg-dashboard-gray-900 p-6 shadow-card sm:left-[50%] sm:top-[50%] sm:translate-x-[-50%] sm:translate-y-[-50%]"
    >
      <DialogHeader>
        <DialogTitle class="mb-4 text-heading-lg font-semibold text-white">
          New Pull Request
        </DialogTitle>
      </DialogHeader>

      <form on:submit|preventDefault={createPR} class="space-y-4">
        <div>
          <Label class="mb-2 block text-label-lg font-medium text-gray-300">Title</Label>
          <Input
            type="text"
            bind:value={newPRTitle}
            class="w-full rounded-lg border border-dashboard-gray-600 bg-dashboard-gray-800 px-4 py-3 text-body-lg text-white focus:border-transparent focus:outline-none focus:ring-2 focus:ring-dashboard-purple-500"
            required
            disabled={submitting}
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <Label class="mb-2 block text-label-lg font-medium text-gray-300">Head Branch</Label>
            <Input
              type="text"
              bind:value={newPRHead}
              placeholder="feature-branch"
              class="w-full rounded-lg border border-dashboard-gray-600 bg-dashboard-gray-800 px-4 py-3 text-body-lg text-white focus:border-transparent focus:outline-none focus:ring-2 focus:ring-dashboard-purple-500"
              required
              disabled={submitting}
            />
          </div>
          <div>
            <Label class="mb-2 block text-label-lg font-medium text-gray-300">Base Branch</Label>
            <Input
              type="text"
              bind:value={newPRBase}
              placeholder="main"
              class="w-full rounded-lg border border-dashboard-gray-600 bg-dashboard-gray-800 px-4 py-3 text-body-lg text-white focus:border-transparent focus:outline-none focus:ring-2 focus:ring-dashboard-purple-500"
              required
              disabled={submitting}
            />
          </div>
        </div>

        <div>
          <Label class="mb-2 block text-label-lg font-medium text-gray-300">Description</Label>
          <Textarea
            rows="4"
            bind:value={newPRBody}
            class="w-full resize-none rounded-lg border border-dashboard-gray-600 bg-dashboard-gray-800 px-4 py-3 text-body-lg text-white focus:border-transparent focus:outline-none focus:ring-2 focus:ring-dashboard-purple-500"
            disabled={submitting}
          />
        </div>

        <Button
          type="submit"
          class="w-full rounded-xl bg-green-600 px-6 py-3 text-label-lg font-medium text-white transition-colors hover:bg-green-700 disabled:opacity-50"
          disabled={submitting || !newPRTitle.trim() || !newPRHead.trim()}
        >
          {#if submitting}
            <Icon icon="lucide:loader-2" class="mr-2 inline h-4 w-4 animate-spin" />
            Creating...
          {:else}
            Create Pull Request
          {/if}
        </Button>
      </form>
    </DialogContent>
  </Dialog>
{/if}
