<script>
  import ProjectBasics from '../../ProjectBasics.svelte';
  import LinksSection from '$lib/components/LinksSection.svelte';
  import FundingSection from '$lib/components/FundingSection.svelte';
  import { applyAction, enhance } from '$app/forms';
  import { toast } from 'svelte-sonner';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import Icon from '@iconify/svelte';

  export let data;
  const { project } = data;

  let loading = false;
  export let form;

  $: if (form?.error) {
    toast.error(form?.error);
  }

  let bannerImage = project.banner_image || null;
  let profileImage = project.image || null;

  function handleBannerUpload(event) {
    const file = event.target.files[0];
    if (file) {
      bannerImage = URL.createObjectURL(file);
    }
  }

  function handleProfileUpload(event) {
    const file = event.target.files[0];
    if (file) {
      profileImage = URL.createObjectURL(file);
    }
  }
</script>

<div class="min-h-screen bg-dashboard-black">
  <!-- Breadcrumb Navigation -->
  <nav class="mb-6 pt-8">
    <div class="container mx-auto max-w-7xl px-8">
      <div class="flex items-center gap-2">
        <a
          href="/project/{project.id}"
          class="flex items-center gap-2 text-body-lg font-medium text-gray-300 transition-colors hover:text-white"
        >
          <Icon icon="lucide:arrow-left" class="h-5 w-5" />
          {project.title}
        </a>
        <Icon icon="lucide:chevron-right" class="h-4 w-4 text-gray-500" />
        <span class="text-body-lg text-gray-400">Edit Project</span>
      </div>
    </div>
  </nav>

  <!-- Header Section -->
  <div class="mb-12">
    <div class="container mx-auto max-w-7xl px-8">
      <div class="text-center">
        <h1 class="mb-4 text-display-2xl font-semibold leading-tight text-white">Edit Project</h1>
        <p class="mx-auto max-w-2xl text-body-xl text-gray-300">
          Update your project details and settings
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
      use:enhance={() => {
        loading = true;
        return async ({ result }) => {
          if (result.type === 'failure') {
            toast.warn(result?.data?.error || 'failed to edit project');
          } else if (result.type === 'error') {
            toast.error('could not update project');
          } else {
            toast.success('Project updated successfully');
          }

          loading = false;
          await applyAction(result);
        };
      }}
    >
      <Input type="hidden" name="old_image" value={project.image} />
      <Input type="hidden" name="old_banner" value={project.banner_image} />

      <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <!-- Left Column - Project Basics -->
        <div class="space-y-8">
          <div
            class="rounded-2xl border border-dashboard-gray-700 bg-dashboard-gray-900 p-6 shadow-card"
          >
            <div class="mb-6">
              <h2 class="mb-2 text-heading-xl font-semibold text-white">Project Basics</h2>
              <p class="text-body-lg text-gray-300">Update your project information and details</p>
            </div>
            <ProjectBasics {project} />
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
                Update your project's social media and development platforms
              </p>
            </div>

            <LinksSection {project} isEdit={true} />
          </div>

          <!-- Funding Section -->
          <div
            class="rounded-2xl border border-dashboard-gray-700 bg-dashboard-gray-900 p-6 shadow-card"
          >
            <div class="mb-6">
              <h2 class="mb-2 text-heading-xl font-semibold text-white">Funding Goals</h2>
              <p class="text-body-lg text-gray-300">
                Update your funding goals and payment preferences
              </p>
            </div>

            <FundingSection {project} isEdit={true} />
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
              Updating...
            </span>
          {:else}
            Update Project
          {/if}
        </Button>
      </div>
    </form>
  </div>
</div>
