<script>
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  export let user;
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
      <Input
        id="github"
        type="text"
        name="github"
        value={user.github}
        placeholder="username"
        class="w-full rounded-lg border border-dashboard-gray-600 bg-dashboard-gray-800 px-4 py-3 text-body-lg text-white focus:border-dashboard-purple-500 focus:outline-none focus:ring-2 focus:ring-dashboard-purple-500"
      />
      <p class="text-body-sm text-gray-400">Showcase your code repositories and contributions</p>
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
