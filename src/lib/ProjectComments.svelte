<script>
  import { onMount } from 'svelte';
  import Icon from '@iconify/svelte';
  import { Button } from '$lib/components/ui/button';
  import { Textarea } from '$lib/components/ui/textarea';
  import { Avatar, AvatarImage, AvatarFallback } from '$lib/components/ui/avatar';
  import { dateTimeFormat } from '$lib/utils/dateTimeFormat.js';
  import { toast } from 'svelte-sonner';

  export let projectId;
  export let isAuthenticated = false;

  const BODY_SOFT_CAP = 2000;

  const defaultAvatar =
    'https://zyfpmpmcpzmickajgkwp.supabase.co/storage/v1/object/public/pipeline-images/defaults/userProfile.png';

  let comments = [];
  let loading = true;
  let loadError = null;

  let body = '';
  let submitting = false;

  $: remaining = BODY_SOFT_CAP - body.length;
  $: overCap = body.length > BODY_SOFT_CAP;
  $: trimmed = body.trim();
  $: canSubmit = isAuthenticated && !submitting && trimmed.length > 0 && !overCap;

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.substring(0, 2).toUpperCase();
  };

  async function loadComments() {
    loading = true;
    loadError = null;
    try {
      const res = await fetch(`/api/projects/${projectId}/comments`);
      if (!res.ok) throw new Error(`Failed to load comments (${res.status})`);
      const payload = await res.json();
      comments = payload.comments || [];
    } catch (err) {
      loadError = err.message || 'Could not load comments';
    } finally {
      loading = false;
    }
  }

  async function submitComment() {
    if (!canSubmit) return;
    submitting = true;
    try {
      const res = await fetch(`/api/projects/${projectId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: trimmed }),
      });
      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload.error || `Failed to post (${res.status})`);
      }
      body = '';
      // Refresh the list so the new comment shows with its author chip.
      await loadComments();
      toast.success('Comment posted');
    } catch (err) {
      toast.error(err.message || 'Could not post comment');
    } finally {
      submitting = false;
    }
  }

  onMount(loadComments);
</script>

<div class="space-y-6">
  <!-- Compose -->
  {#if isAuthenticated}
    <div class="rounded-xl border border-dashboard-gray-700 bg-dashboard-gray-900/50 p-4">
      <Textarea
        rows="4"
        bind:value={body}
        placeholder="Share your thoughts on this project…"
        disabled={submitting}
        class="w-full resize-none rounded-lg border border-dashboard-gray-600 bg-dashboard-gray-800 px-4 py-3 text-body-lg text-white focus:border-transparent focus:outline-none focus:ring-2 focus:ring-dashboard-purple-500"
      />
      <div class="mt-3 flex items-center justify-between">
        <span
          class="text-label-sm"
          class:text-gray-400={!overCap}
          class:text-red-400={overCap}
        >
          {remaining} characters left
        </span>
        <Button
          type="button"
          on:click={submitComment}
          disabled={!canSubmit}
          class="rounded-xl bg-dashboard-yellow-400 px-6 py-2 text-label-lg font-medium text-dashboard-black transition-colors hover:bg-dashboard-yellow-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dashboard-yellow-400 disabled:pointer-events-none disabled:opacity-50"
        >
          {#if submitting}
            <span class="flex items-center gap-2">
              <Icon icon="lucide:loader-2" class="h-4 w-4 animate-spin" />
              Posting…
            </span>
          {:else}
            Post comment
          {/if}
        </Button>
      </div>
    </div>
  {:else}
    <div
      class="flex items-center justify-between rounded-xl border border-dashboard-gray-700 bg-dashboard-gray-900/50 p-4"
    >
      <span class="text-body-md text-gray-300">Sign in to join the discussion.</span>
      <a
        href="/sign-in"
        class="rounded-xl bg-dashboard-yellow-400 px-5 py-2 text-label-lg font-medium text-dashboard-black transition-colors hover:bg-dashboard-yellow-500"
      >
        Sign in
      </a>
    </div>
  {/if}

  <!-- List -->
  {#if loading}
    <div class="flex items-center gap-2 text-body-md text-gray-400">
      <Icon icon="lucide:loader-2" class="h-4 w-4 animate-spin" />
      Loading comments…
    </div>
  {:else if loadError}
    <div class="rounded-xl border border-red-900 bg-red-950/40 p-4 text-body-md text-red-300">
      {loadError}
    </div>
  {:else if comments.length === 0}
    <div
      class="rounded-xl border border-dashed border-dashboard-gray-600 p-8 text-center text-body-md text-gray-400"
    >
      No comments yet. Be the first to share your thoughts.
    </div>
  {:else}
    <ul class="space-y-4">
      {#each comments as comment (comment.id)}
        <li class="rounded-xl border border-dashboard-gray-700 bg-dashboard-gray-900/50 p-4">
          <div class="mb-3 flex items-center gap-3">
            <Avatar class="h-9 w-9 border border-dashboard-gray-600">
              <AvatarImage
                src={comment.author?.image && comment.author.image !== ''
                  ? comment.author.image
                  : defaultAvatar}
                alt="Author"
              />
              <AvatarFallback>{getInitials(comment.author?.name)}</AvatarFallback>
            </Avatar>
            <div class="min-w-0">
              <div class="truncate text-label-lg font-medium text-white">
                {comment.author?.name || 'Anonymous'}
              </div>
              <div class="text-label-sm text-gray-400">
                {dateTimeFormat(comment.created_at)}
              </div>
            </div>
          </div>
          <p class="whitespace-pre-wrap text-body-md text-gray-200">{comment.body}</p>
        </li>
      {/each}
    </ul>
  {/if}
</div>
