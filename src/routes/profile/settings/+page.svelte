<script>
  import GitHubConnection from '$lib/GitHubConnection.svelte';
  import Settings from '$lib/Settings.svelte';
  import Icon from '@iconify/svelte';
  import { toast } from 'svelte-sonner';
  import { page } from '$app/stores';
  import { onMount } from 'svelte';

  export let data;
  let githubConnection = data.githubConnection;

  onMount(() => {
    const urlParams = $page.url.searchParams;
    if (urlParams.get('github') === 'linked') {
      toast.success('GitHub account connected successfully');
    } else if (urlParams.get('error') === 'github_link_failed') {
      toast.error('Failed to connect GitHub account. Please try again.');
    }
  });
</script>

<div class="min-h-screen bg-dashboard-black">
  <div class="container mx-auto max-w-4xl px-8 pb-20">
    <nav class="mb-6 pt-8">
      <div class="flex items-center gap-2">
        <a
          href="/profile"
          class="flex items-center gap-2 text-body-lg font-medium text-gray-300 transition-colors hover:text-white"
        >
          <Icon icon="mdi:arrow-left" class="h-5 w-5" />
          Profile
        </a>
        <Icon icon="mdi:chevron-right" class="h-4 w-4 text-gray-500" />
        <span class="text-body-lg text-gray-400">Settings</span>
      </div>
    </nav>

    <section class="mx-auto max-w-4xl pt-8">
      <div class="space-y-8">
        <GitHubConnection {githubConnection} />
        <Settings />
      </div>
    </section>
  </div>
</div>
