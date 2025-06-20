<script>
  import ProfileForm from '$lib/ProfileForm.svelte';
  import ProfileLinks from '$lib/ProfileLinks.svelte';
  import Settings from '$lib/Settings.svelte';
  import Interests from '$lib/Interests.svelte';
  import Icon from '@iconify/svelte';
  import { applyAction, enhance } from '$app/forms';
  import { toast } from 'svelte-sonner';

  let activeNavItem = 'Profile';
  let loading = false;
  export let data;
  let user = data.user;
</script>

<!-- Main Content Container -->
<div class="min-h-screen bg-dashboard-black">
  <div class="container mx-auto max-w-7xl px-8 pb-20">
    <!-- Breadcrumb Navigation -->
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
        <span class="text-body-lg text-gray-400">Edit Profile</span>
      </div>
    </nav>

    <!-- Content Section -->
    <section class="mx-auto max-w-7xl pt-8">
      <form
        action="?/updateProfile"
        method="POST"
        class="flex w-full flex-col items-center"
        enctype="multipart/form-data"
        use:enhance={() => {
          loading = true;
          return async ({ result }) => {
            if (result.type === 'failure') {
              const errorMessage = String(result?.data?.error || 'failed to edit profile');
              toast.error(errorMessage);
            } else if (result.type === 'error') {
              toast.error('could not update profile');
            } else {
              toast.success('Profile updated successfully');
            }
            loading = false;
            await applyAction(result);
          };
        }}
      >
        <div class="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <!-- Left Column - Profile Information -->
          <div class="space-y-8">
            <ProfileForm {user} />
          </div>

          <!-- Right Column - Links & Social -->
          <div class="space-y-8">
            <ProfileLinks {user} />
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="mt-16">
          <button
            type="submit"
            class="rounded-xl bg-dashboard-purple-500 px-8 py-3 text-label-lg font-medium text-white transition-colors hover:bg-dashboard-purple-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dashboard-purple-500 disabled:pointer-events-none disabled:opacity-50"
            disabled={loading}
          >
            {#if loading}
              <span class="flex items-center gap-2">
                <Icon icon="lucide:loader-2" class="h-4 w-4 animate-spin" />
                Updating Profile...
              </span>
            {:else}
              Update Profile
            {/if}
          </button>
        </div>
      </form>
    </section>
  </div>
</div>

<style>
  .selected {
    transform: scale(1.05);
    font-weight: 600;
  }
</style>
