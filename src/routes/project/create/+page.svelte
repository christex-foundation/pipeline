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
  <nav class="pt-8 mb-6">
    <div class="container px-8 mx-auto max-w-7xl">
      <div class="flex items-center gap-2">
        <a
          href="/explore"
          class="flex items-center gap-2 font-medium text-gray-300 transition-colors text-body-lg hover:text-white"
        >
          <Icon icon="lucide:arrow-left" class="w-5 h-5" />
          Explore
        </a>
        <Icon icon="lucide:chevron-right" class="w-4 h-4 text-gray-500" />
        <span class="text-gray-400 text-body-lg">Create Project</span>
      </div>
    </div>
  </nav>

  <!-- Header Section -->
  <div class="mb-12">
    <div class="container px-8 mx-auto max-w-7xl">
      <div class="text-center">
        <h1 class="mb-4 font-semibold leading-tight text-white text-display-2xl">
          Create a Project
        </h1>
        <p class="max-w-2xl mx-auto text-gray-300 text-body-xl">
          Share your project with the world and start building your community.
        </p>
      </div>
    </div>
  </div>

  <!-- Main Form Container -->
  <div class="container px-8 pb-20 mx-auto max-w-7xl">
    <form
      action=""
      method="post"
      enctype="multipart/form-data"
      use:enhance={() => {
        loading = true;
        return async ({ result }) => {
          if (result.type === 'success' && result.data.redirectTo) {
            toast.success('Project has been created successfully');
            goto(result.data.redirectTo);
          } else if (result.type === 'failure') {
            toast.info(result?.data?.error || 'Could not create project');
          } else if (result.type === 'error') {
            toast.error('Could not create a project');
          }

          await applyAction(result);
          loading = false;
        };
      }}
    >
      <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <!-- Left Column - Project Basics -->
        <div class="space-y-8">
          <div
            class="p-6 border rounded-2xl border-dashboard-gray-700 bg-dashboard-gray-900 shadow-card"
          >
            <div class="mb-6">
              <h2 class="mb-2 font-semibold text-white text-heading-xl">Project Basics</h2>
              <p class="text-gray-300 text-body-lg">
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
            class="p-6 border rounded-2xl border-dashboard-gray-700 bg-dashboard-gray-900 shadow-card"
          >
            <div class="mb-6">
              <h2 class="mb-2 font-semibold text-white text-heading-xl">Links & Social</h2>
              <p class="text-gray-300 text-body-lg">
                Connect your project with social media and development platforms
              </p>
            </div>

            <LinksSection {project} />
          </div>

          <!-- Funding Section -->
          <div
            class="p-6 border rounded-2xl border-dashboard-gray-700 bg-dashboard-gray-900 shadow-card"
          >
            <div class="mb-6">
              <h2 class="mb-2 font-semibold text-white text-heading-xl">Funding Goals</h2>
              <p class="text-gray-300 text-body-lg">
                Set your funding goals and payment preferences
              </p>
            </div>

            <FundingSection {project} />
          </div>
        </div>
      </div>

      <!-- Submit Button -->
      <div class="flex justify-center mt-12">
        <Button
          type="submit"
          disabled={loading}
          class="px-8 py-3 font-medium transition-colors rounded-xl bg-dashboard-yellow-400 text-label-lg text-dashboard-black hover:bg-dashboard-yellow-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dashboard-yellow-400 disabled:pointer-events-none disabled:opacity-50"
        >
          {#if loading}
            <span class="flex items-center gap-2">
              <Icon icon="lucide:loader-2" class="w-4 h-4 animate-spin" />
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
