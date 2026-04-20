<script>
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';

  export let project = {};
  export let isEdit = false;
</script>

<div class="space-y-6">
  <!-- Email -->

  <!-- GitHub -->
  <div class="space-y-2">
    <Label for="github" class="block text-label-lg font-medium text-gray-300">
      GitHub Repository
    </Label>
    <Input
      type="url"
      id="github"
      name="github"
      value={project.github || ''}
      placeholder="https://github.com/username/repo"
      class="w-full rounded-lg border border-dashboard-gray-600 bg-dashboard-gray-800 px-4 py-3 text-body-lg text-white focus:border-transparent focus:outline-none focus:ring-2 focus:ring-dashboard-purple-500"
    />
    <p class="text-body-sm text-gray-400">
      Follow
      <a
        href="https://docs.github.com/en/webhooks/using-webhooks/creating-webhooks"
        target="_blank"
        class="font-medium text-dashboard-purple-500 underline hover:text-dashboard-purple-400"
      >
        this guide
      </a>
      to add the
      <a
        href="https://pipeline-tau.vercel.app/api/github/webhook"
        target="_blank"
        class="font-medium text-dashboard-purple-500 underline hover:text-dashboard-purple-400"
      >
        webhook
      </a>
      for automatic updates
    </p>
  </div>

  <!-- Website -->
  <div class="space-y-2">
    <Label for="website" class="block text-label-lg font-medium text-gray-300">Website</Label>
    <Input
      type="url"
      id="website"
      name="website"
      value={project.website || ''}
      placeholder="https://yourwebsite.com"
      class="w-full rounded-lg border border-dashboard-gray-600 bg-dashboard-gray-800 px-4 py-3 text-body-lg text-white focus:border-transparent focus:outline-none focus:ring-2 focus:ring-dashboard-purple-500"
    />
    {#if !isEdit}
      <p class="text-body-sm text-gray-400">Official project website or landing page</p>
    {/if}
  </div>
</div>
