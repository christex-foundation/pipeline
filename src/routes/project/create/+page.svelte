<script>
  import ProjectBasics from '../ProjectBasics.svelte';
  import LinksSection from '$lib/components/LinksSection.svelte';
  import FundingSection from '$lib/components/FundingSection.svelte';
  import { applyAction, enhance } from '$app/forms';
  import { toast } from 'svelte-sonner';

  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
  import { Separator } from '$lib/components/ui/separator';
  import Icon from '@iconify/svelte';

  import { goto } from '$app/navigation';

  let loading = false;
  let loadingMatchingDPGs = false;
  let project = { title: '', bio: '' };
  let matchProjects = [];
</script>

<div class="min-h-screen bg-dashboard-black">
  <!-- Breadcrumb Navigation -->
  <nav class="mb-6 pt-8">
    <div class="container mx-auto max-w-7xl px-8">
      <div class="flex items-center gap-2">
        <a
          href="/explore"
          class="flex items-center gap-2 text-body-lg font-medium text-gray-300 transition-colors hover:text-white"
        >
          <Icon icon="lucide:arrow-left" class="h-5 w-5" />
          Explore
        </a>
        <Icon icon="lucide:chevron-right" class="h-4 w-4 text-gray-500" />
        <span class="text-body-lg text-gray-400">Create Project</span>
      </div>
    </div>
  </nav>

  <!-- Header Section -->
  <div class="mb-12">
    <div class="container mx-auto max-w-7xl px-8">
      <div class="text-center">
        <h1 class="mb-4 text-display-2xl font-semibold leading-tight text-white">
          Create a Project
        </h1>
        <p class="mx-auto max-w-2xl text-body-xl text-gray-300">
          Share your project with the world and start building your community.
        </p>
      </div>
    </div>
  </div>

  <!-- Main Form Container -->
  <div class="container mx-auto max-w-7xl px-8 pb-20">
    <form
      action=""
      method="post"
      enctype="multipart/form-data"
      use:enhance={({ cancel }) => {
        if (loading) {
          cancel();
          return;
        }

        loading = true;
        return async ({ result }) => {
          try {
            if (result.type === 'success' && result.data.redirectTo) {
              toast.success('Project has been created successfully');
              goto(result.data.redirectTo);
            } else if (result.type === 'failure') {
              toast.info(result?.data?.error || 'Could not create project');
            } else if (result.type === 'error') {
              toast.error('Could not create a project');
            }

            await applyAction(result);
          } finally {
            loading = false;
          }
        };
      }}
    >
      <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <!-- Left Column - Project Basics -->
        <div class="space-y-8">
          <div
            class="rounded-2xl border border-dashboard-gray-700 bg-dashboard-gray-900 p-6 shadow-card"
          >
            <div class="mb-6">
              <h2 class="mb-2 text-heading-xl font-semibold text-white">Project Basics</h2>
              <p class="text-body-lg text-gray-300">
                Tell us about your project and what makes it special
              </p>
            </div>
            <ProjectBasics bind:project />
            <input type="hidden" name="matchedDPGs" value={JSON.stringify(matchProjects)} />
          </div>
        </div>

        <!-- Right Column - Links & Funding -->
        <div class="space-y-8">
          <!-- Links Section -->
          <div
            class="rounded-2xl border border-dashboard-gray-700 bg-dashboard-gray-900 p-6 shadow-card"
          >
            <div class="mb-6">
              <h2 class="mb-2 text-heading-xl font-semibold text-white">Links & Social</h2>
              <p class="text-body-lg text-gray-300">
                Connect your project with social media and development platforms
              </p>
            </div>

            <LinksSection {project} />
          </div>

          <!-- Funding Section -->
          <div
            class="rounded-2xl border border-dashboard-gray-700 bg-dashboard-gray-900 p-6 shadow-card"
          >
            <div class="mb-6">
              <h2 class="mb-2 text-heading-xl font-semibold text-white">Funding Goals</h2>
              <p class="text-body-lg text-gray-300">
                Set your funding goals and payment preferences
              </p>
            </div>

            <FundingSection {project} />
          </div>
        </div>
      </div>

      <!-- Submit Button -->
      <div class="mt-12 flex justify-center">
        <Button
          type="submit"
          disabled={loading}
          class="rounded-xl bg-dashboard-yellow-400 px-8 py-3 text-label-lg font-medium text-dashboard-black transition-colors hover:bg-dashboard-yellow-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dashboard-yellow-400 disabled:pointer-events-none disabled:opacity-50"
        >
          {#if loading}
            <span class="flex items-center gap-2">
              <Icon icon="lucide:loader-2" class="h-4 w-4 animate-spin" />
              Creating Project...
            </span>
          {:else}
            Create Project
          {/if}
        </Button>
      </div>
    </form>
  </div>
</div>
