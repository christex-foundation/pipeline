<script>
  import Icon from '@iconify/svelte';
  import { enhance } from '$app/forms';

  export let githubConnection = null;
</script>

<div class="rounded-2xl border border-dashboard-gray-700 bg-dashboard-gray-900 p-6 shadow-card">
  <div class="mb-6">
    <h2 class="mb-2 text-heading-xl font-semibold text-white">GitHub Connection</h2>
    <p class="text-body-lg text-gray-300">
      Connect your GitHub account to sync your verified username to your profile
    </p>
  </div>

  {#if githubConnection && githubConnection.connected}
    <div
      class="flex items-center justify-between rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3"
    >
      <div class="flex items-center gap-3">
        <div class="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/20">
          <Icon icon="mdi:github" class="h-5 w-5 text-green-400" />
        </div>
        <div>
          <p class="text-body-lg font-medium text-white">{githubConnection.username}</p>
          <p class="text-body-sm text-green-400">Connected</p>
        </div>
      </div>
      <form action="?/disconnectGitHub" method="POST" use:enhance>
        <button
          type="submit"
          class="rounded-lg border border-dashboard-gray-600 bg-dashboard-gray-800 px-4 py-2 text-label-sm font-medium text-gray-300 transition-colors hover:bg-dashboard-gray-700 hover:text-white"
        >
          Disconnect
        </button>
      </form>
    </div>
    <p class="mt-3 text-body-sm text-gray-400">
      Your GitHub account is linked and your profile can use the verified username.
    </p>
  {:else}
    <div class="flex items-center gap-4">
      <form action="?/connectGitHub" method="POST" use:enhance>
        <button
          type="submit"
          class="flex items-center gap-2 rounded-lg bg-dashboard-gray-800 px-6 py-3 text-label-sm font-medium text-white transition-colors hover:bg-dashboard-gray-700"
        >
          <Icon icon="mdi:github" class="h-5 w-5" />
          Connect GitHub
        </button>
      </form>
    </div>
    <p class="mt-3 text-body-sm text-gray-400">
      Link your GitHub account to sync your verified GitHub username.
    </p>
  {/if}
</div>
