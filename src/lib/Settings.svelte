<script>
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { enhance } from '$app/forms';
  import { toast } from 'svelte-sonner';
  import Icon from '@iconify/svelte';

  let showConfirm = false;
  let deleting = false;
  let exporting = false;

  async function downloadMyData() {
    exporting = true;
    try {
      const response = await fetch('/api/profile/export?format=json');

      if (!response.ok) {
        throw new Error('Failed to export data');
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');

      const disposition = response.headers.get('content-disposition');
      const filenameMatch = disposition?.match(/filename="(.+)"/);
      a.href = downloadUrl;
      a.download = filenameMatch?.[1] || `pipeline-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      a.remove();

      toast.success('Your data has been downloaded');
    } catch (error) {
      toast.error('Failed to download data. Please try again.');
    } finally {
      exporting = false;
    }
  }
</script>

<div class="rounded-2xl border border-dashboard-gray-700 bg-dashboard-gray-900 p-6 shadow-card">
  <div class="mb-6">
    <h2 class="mb-2 text-heading-xl font-semibold text-white">Account Settings</h2>
    <p class="text-body-lg text-gray-300">Update your password and account preferences</p>
  </div>

  <form class="space-y-8">
    <!-- Current Password -->
    <div class="space-y-3">
      <Label for="currentPassword" class="text-label-lg font-medium text-gray-300"
        >Current Password</Label
      >
      <Input
        type="password"
        id="currentPassword"
        aria-required="true"
        class="w-full rounded-lg border border-dashboard-gray-600 bg-dashboard-gray-800 px-4 py-3 text-body-lg text-white focus:border-dashboard-purple-500 focus:outline-none focus:ring-2 focus:ring-dashboard-purple-500"
      />
    </div>

    <!-- New Password -->
    <div class="space-y-3">
      <Label for="newPassword" class="text-label-lg font-medium text-gray-300">New Password</Label>
      <Input
        type="password"
        id="newPassword"
        aria-required="true"
        class="w-full rounded-lg border border-dashboard-gray-600 bg-dashboard-gray-800 px-4 py-3 text-body-lg text-white focus:border-dashboard-purple-500 focus:outline-none focus:ring-2 focus:ring-dashboard-purple-500"
      />
    </div>

    <!-- Confirm Password -->
    <div class="space-y-3">
      <Label for="confirmPassword" class="text-label-lg font-medium text-gray-300"
        >Confirm Password</Label
      >
      <Input
        type="password"
        id="confirmPassword"
        aria-required="true"
        class="w-full rounded-lg border border-dashboard-gray-600 bg-dashboard-gray-800 px-4 py-3 text-body-lg text-white focus:border-dashboard-purple-500 focus:outline-none focus:ring-2 focus:ring-dashboard-purple-500"
      />
    </div>

    <!-- Action Buttons -->
    <div class="flex flex-col gap-4 pt-4 sm:flex-row sm:justify-between">
      <button
        type="submit"
        class="rounded-xl bg-dashboard-purple-500 px-6 py-3 text-label-lg font-medium text-white transition-colors hover:bg-dashboard-purple-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dashboard-purple-500"
      >
        Update Password
      </button>

      <div class="flex gap-3">
        <button
          type="button"
          on:click={downloadMyData}
          disabled={exporting}
          class="rounded-xl border border-dashboard-gray-600 px-4 py-3 text-label-lg font-medium text-gray-300 transition-colors hover:bg-dashboard-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dashboard-gray-500 disabled:pointer-events-none disabled:opacity-50"
        >
          {#if exporting}
            <span class="flex items-center gap-2">
              <Icon icon="lucide:loader-2" class="h-4 w-4 animate-spin" />
              Exporting...
            </span>
          {:else}
            <span class="flex items-center gap-2">
              <Icon icon="mdi:download" class="h-4 w-4" />
              Download My Data
            </span>
          {/if}
        </button>

        <button
          type="button"
          on:click={() => (showConfirm = true)}
          class="rounded-xl bg-dashboard-error-500 px-6 py-3 text-label-lg font-medium text-white transition-colors hover:bg-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
        >
          Delete Account
        </button>
      </div>
    </div>
  </form>
</div>

<!-- Delete Confirmation Modal -->
{#if showConfirm}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    on:click|self={() => (showConfirm = false)}
  >
    <div class="mx-4 w-full max-w-md rounded-2xl border border-dashboard-gray-700 bg-dashboard-gray-900 p-6 shadow-xl">
      <div class="mb-4 flex items-center gap-3">
        <div class="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/20">
          <Icon icon="mdi:alert-outline" class="h-5 w-5 text-red-400" />
        </div>
        <h3 class="text-heading-lg font-semibold text-white">Delete Account</h3>
      </div>

      <p class="mb-6 text-body-lg text-gray-300">
        This action is <strong class="text-red-400">permanent</strong> and cannot be undone. All your
        data, projects, and profile information will be permanently removed.
      </p>

      <div class="flex justify-end gap-3">
        <button
          type="button"
          on:click={() => (showConfirm = false)}
          class="rounded-xl border border-dashboard-gray-600 px-5 py-2.5 text-label-lg font-medium text-gray-300 transition-colors hover:bg-dashboard-gray-800"
        >
          Cancel
        </button>

        <form
          action="/profile/edit?/deleteAccount"
          method="POST"
          use:enhance={() => {
            deleting = true;
            return async ({ result }) => {
              if (result.type === 'failure') {
                toast.error(String(result?.data?.error || 'Failed to delete account'));
                deleting = false;
                showConfirm = false;
              }
            };
          }}
        >
          <button
            type="submit"
            disabled={deleting}
            class="rounded-xl bg-red-600 px-5 py-2.5 text-label-lg font-medium text-white transition-colors hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:pointer-events-none disabled:opacity-50"
          >
            {#if deleting}
              <span class="flex items-center gap-2">
                <Icon icon="lucide:loader-2" class="h-4 w-4 animate-spin" />
                Deleting...
              </span>
            {:else}
              Yes, Delete My Account
            {/if}
          </button>
        </form>
      </div>
    </div>
  </div>
{/if}
