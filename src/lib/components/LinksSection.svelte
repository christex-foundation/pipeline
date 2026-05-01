<script>
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';

  export let project = {};
  export let isEdit = false;

  // Initialize so bind:value into nested undefined fields doesn't error.
  // Without these, every keystroke in a sibling input (e.g. ProjectBasics title)
  // re-renders this component and re-passes value="" — which clobbers what the
  // user just typed. bind:value owns the value through re-renders.
  project.github ??= '';
  project.website ??= '';
  project.linkedin ??= '';
  project.twitter ??= '';
  project.other ??= '';

  const inputClass =
    'w-full rounded-lg border border-dashboard-gray-600 bg-dashboard-gray-800 px-4 py-3 text-body-lg text-white focus:border-transparent focus:outline-none focus:ring-2 focus:ring-dashboard-purple-500';
</script>

<div class="space-y-6">
  <!-- GitHub -->
  <div class="space-y-2">
    <Label for="github" class="block text-label-lg font-medium text-gray-300">
      GitHub Repository
    </Label>
    <Input
      type="url"
      id="github"
      name="github"
      bind:value={project.github}
      placeholder="https://github.com/username/repo"
      class={inputClass}
    />
    <p class="text-body-sm text-gray-400">
      Optional. Want re-evaluation to run automatically when you merge PRs?
      <a
        href="https://docs.github.com/en/webhooks/using-webhooks/creating-webhooks"
        target="_blank"
        rel="noopener noreferrer"
        class="font-medium text-dashboard-purple-500 underline hover:text-dashboard-purple-400"
      >
        Set up a webhook
      </a>
      pointing at
      <code class="rounded bg-dashboard-gray-800 px-1 py-0.5 text-body-sm text-gray-300">
        https://pipeline-tau.vercel.app/api/github/webhook
      </code>.
    </p>
  </div>

  <!-- Website -->
  <div class="space-y-2">
    <Label for="website" class="block text-label-lg font-medium text-gray-300">Website</Label>
    <Input
      type="url"
      id="website"
      name="website"
      bind:value={project.website}
      placeholder="https://yourwebsite.com"
      class={inputClass}
    />
    {#if !isEdit}
      <p class="text-body-sm text-gray-400">Official project website or landing page.</p>
    {/if}
  </div>

  <!-- Social: LinkedIn + X (Twitter), side by side on wider screens -->
  <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
    <div class="space-y-2">
      <Label for="linkedin" class="block text-label-lg font-medium text-gray-300">LinkedIn</Label>
      <Input
        type="url"
        id="linkedin"
        name="linkedin"
        bind:value={project.linkedin}
        placeholder="https://linkedin.com/company/your-project"
        class={inputClass}
      />
    </div>

    <div class="space-y-2">
      <Label for="twitter" class="block text-label-lg font-medium text-gray-300">X (Twitter)</Label>
      <Input
        type="url"
        id="twitter"
        name="twitter"
        bind:value={project.twitter}
        placeholder="https://x.com/yourhandle"
        class={inputClass}
      />
    </div>
  </div>

  <!-- Other -->
  <div class="space-y-2">
    <Label for="other" class="block text-label-lg font-medium text-gray-300">
      Other link <span class="text-gray-500">(optional)</span>
    </Label>
    <Input
      type="url"
      id="other"
      name="other"
      bind:value={project.other}
      placeholder="https://"
      class={inputClass}
    />
    <p class="text-body-sm text-gray-400">
      Anywhere else you want to point people — Discord, docs site, demo, etc.
    </p>
  </div>
</div>
