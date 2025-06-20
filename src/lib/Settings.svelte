<script>
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
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

      <button
        type="button"
        class="rounded-xl bg-dashboard-error-500 px-6 py-3 text-label-lg font-medium text-white transition-colors hover:bg-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
      >
        Delete Account
      </button>
    </div>
  </form>
</div>
