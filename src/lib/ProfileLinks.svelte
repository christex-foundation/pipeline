<script>
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import Icon from '@iconify/svelte';
  import { enhance } from '$app/forms';

  export let user;
  export let githubConnection = null;
</script>

<div class="rounded-2xl border border-dashboard-gray-700 bg-dashboard-gray-900 p-6 shadow-card">
  <div class="mb-6">
    <h2 class="mb-2 text-heading-xl font-semibold text-white">Links & Social</h2>
    <p class="text-body-lg text-gray-300">
      Connect your profile with social media and development platforms
    </p>
  </div>

  <div class="space-y-8">
    <!-- X (Twitter) -->
    <div class="space-y-3">
      <Label for="twitter" class="text-label-lg font-medium text-gray-300">
        X (Twitter) Profile
      </Label>
      <Input
        type="text"
        id="twitter"
        name="twitter"
        value={user.twitter}
        placeholder="username"
        class="w-full rounded-lg border border-dashboard-gray-600 bg-dashboard-gray-800 px-4 py-3 text-body-lg text-white focus:border-dashboard-purple-500 focus:outline-none focus:ring-2 focus:ring-dashboard-purple-500"
      />
      <p class="text-body-sm text-gray-400">Share updates and engage with the community</p>
    </div>

    <!-- GitHub -->
    <div class="space-y-3">
      <Label for="github" class="text-label-lg font-medium text-gray-300">GitHub Profile</Label>

      {#if githubConnection?.connected}
        <!-- Connected state -->
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
        <!-- Hidden input to preserve github username in parent form -->
        <input type="hidden" name="github" value={githubConnection.username} />
        <p class="text-body-sm text-gray-400">
          Your GitHub account is linked. You can manage PRs and issues from project pages.
        </p>
      {:else}
        <!-- Not connected state -->
        <div class="flex gap-3">
          <Input
            id="github"
            type="text"
            name="github"
            value={user.github}
            placeholder="username"
            class="w-full rounded-lg border border-dashboard-gray-600 bg-dashboard-gray-800 px-4 py-3 text-body-lg text-white focus:border-dashboard-purple-500 focus:outline-none focus:ring-2 focus:ring-dashboard-purple-500"
          />
          <form action="?/connectGitHub" method="POST" use:enhance>
            <button
              type="submit"
              class="flex flex-shrink-0 items-center gap-2 rounded-lg bg-dashboard-gray-800 px-4 py-3 text-label-sm font-medium text-white transition-colors hover:bg-dashboard-gray-700"
            >
              <Icon icon="mdi:github" class="h-5 w-5" />
              Connect
            </button>
          </form>
        </div>
        <p class="text-body-sm text-gray-400">
          Connect your GitHub account to manage PRs and issues directly from project pages
        </p>
      {/if}
    </div>

    <!-- Discord -->
    <div class="space-y-3">
      <Label for="discord" class="text-label-lg font-medium text-gray-300">Discord Username</Label>
      <Input
        type="text"
        id="discord"
        name="discord"
        value={user.discord}
        placeholder="username#1234"
        class="w-full rounded-lg border border-dashboard-gray-600 bg-dashboard-gray-800 px-4 py-3 text-body-lg text-white focus:border-dashboard-purple-500 focus:outline-none focus:ring-2 focus:ring-dashboard-purple-500"
      />
      <p class="text-body-sm text-gray-400">Connect with the developer community on Discord</p>
    </div>

    <!-- Website -->
    <div class="space-y-3">
      <Label for="website" class="text-label-lg font-medium text-gray-300">Personal Website</Label>
      <Input
        type="url"
        id="website"
        name="web"
        value={user.website}
        placeholder="https://yourwebsite.com"
        class="w-full rounded-lg border border-dashboard-gray-600 bg-dashboard-gray-800 px-4 py-3 text-body-lg text-white focus:border-dashboard-purple-500 focus:outline-none focus:ring-2 focus:ring-dashboard-purple-500"
      />
      <p class="text-body-sm text-gray-400">Your personal website or portfolio</p>
    </div>
  </div>
</div>
