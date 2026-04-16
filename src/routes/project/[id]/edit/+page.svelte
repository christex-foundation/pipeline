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
  <nav class="pt-8 mb-6">
    <div class="container px-8 mx-auto max-w-7xl">
      <div class="flex items-center gap-2">
        <a
          href="/project/{project.id}"
          class="flex items-center gap-2 font-medium text-gray-300 transition-colors text-body-lg hover:text-white"
        >
          <Icon icon="lucide:arrow-left" class="w-5 h-5" />
          {project.title}
        </a>
        <Icon icon="lucide:chevron-right" class="w-4 h-4 text-gray-500" />
        <span class="text-gray-400 text-body-lg">Edit Project</span>
      </div>
    </div>
  </nav>

  <!-- Header Section -->
  <div class="mb-12">
    <div class="container px-8 mx-auto max-w-7xl">
      <div class="text-center">
        <h1 class="mb-4 font-semibold leading-tight text-white text-display-2xl">Edit Project</h1>
        <p class="max-w-2xl mx-auto text-gray-300 text-body-xl">
          Update your project details and settings
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
            class="p-6 border rounded-2xl border-dashboard-gray-700 bg-dashboard-gray-900 shadow-card"
          >
            <div class="mb-6">
              <h2 class="mb-2 font-semibold text-white text-heading-xl">Project Basics</h2>
              <p class="text-gray-300 text-body-lg">Update your project information and details</p>
            </div>
            <ProjectBasics {project} />
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
                Update your project's social media and development platforms
              </p>
            </div>

            <LinksSection {project} isEdit={true} />
          </div>

          <!-- Funding Section -->
          <div
            class="p-6 border rounded-2xl border-dashboard-gray-700 bg-dashboard-gray-900 shadow-card"
          >
            <div class="mb-6">
              <h2 class="mb-2 font-semibold text-white text-heading-xl">Funding Goals</h2>
              <p class="text-gray-300 text-body-lg">
                Update your funding goals and payment preferences
              </p>
            </div>

            <FundingSection {project} isEdit={true} />
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
