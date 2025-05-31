<script>
  import { applyAction, enhance } from '$app/forms';
  import { invalidateAll } from '$app/navigation';
  import { page } from '$app/stores';
  import GitContributors from '$lib/GitContributors.svelte';
  import GitContributorsViewAll from '$lib/GitContributorsViewAll.svelte';
  import GitUpdate from '$lib/GitUpdate.svelte';
  import ProjectAbout from '$lib/ProjectAbout.svelte';
  import ProjectNav from '$lib/ProjectNav.svelte';
  import ResourceCard from '$lib/ResourceCard.svelte';
  import ResourcesViewAll from '$lib/ResourcesViewAll.svelte';
  import UpdateDetail from '$lib/UpdateDetail.svelte';
  import Updates from '$lib/Updates.svelte';
  import DpgStatus from '$lib/dpgStatus.svelte';
  import CategoryTag from '$lib/CategoryTag.svelte';
  import { amountFormat } from '$lib/utils/amountFormat.js';
  import { dateFormat } from '$lib/utils/dateTimeFormat.js';
  import Icon from '@iconify/svelte';
  import { onMount } from 'svelte';
  import Issues from '$lib/Issues.svelte';
  import { Dialog, DialogHeader, DialogContent, DialogTitle } from '$lib/components/ui/dialog';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Button } from '$lib/components/ui/button';
  import { Textarea } from '$lib/components/ui/textarea';
  import { Card, CardContent } from '$lib/components/ui/card';
  import { Separator } from '$lib/components/ui/separator';

  import { format } from 'date-fns';
  import { toast } from 'svelte-sonner';

  let id;
  $: id = $page.params.id;

  let user = null;
  let image;
  let banner;
  let date;

  export let data;
  const project = data.project;
  const totalResources = data.totalResources;

  const githubLinkSplit = project?.github?.split('/') || [];
  const concat = githubLinkSplit[3] + '/' + githubLinkSplit[4];

  const fetchContribs = async () => {
    try {
      const res = await fetch(`https://api.github.com/repos/${concat}/contributors`);
      const data = await res.json();
      return data;
    } catch (_e) {
      return [];
    }
  };

  let showGitDetail = false;
  let showResourceDetail = false;

  function toggleGitDetail() {
    showGitDetail = !showGitDetail;
    showResourceDetail = false;
  }

  function toggleResourceDetail() {
    showResourceDetail = !showResourceDetail;
    showGitDetail = false;
  }

  const defaultImageUrl =
    'https://zyfpmpmcpzmickajgkwp.supabase.co/storage/v1/object/public/pipeline-images/defaults/userProfile.png';

  let isFollowing = false;
  let showPopup = false;
  let popupMessage = '';
  let isAddingUpdate = false;

  let showUpdatePopup = false;

  function openUpdatePopup() {
    showUpdatePopup = true;
  }

  function closeUpdatePopup() {
    showUpdatePopup = false;
  }

  let activeNavItem = 'dpgStatus';
  let showUpdateDetail = false;
  let selectedUpdate = null;

  const navItems = [
    { id: 'dpgStatus', label: 'DPG Assessment', width: '150px' },
    { id: 'tasks', label: 'Issues & Tasks', width: '120px' },
  ];

  function handleNavChange(event) {
    activeNavItem = event.detail;
    showUpdateDetail = false;
  }

  function handleShowDetail(event) {
    selectedUpdate = event.detail.update;
    showUpdateDetail = true;
  }

  function handleGoBack() {
    showUpdateDetail = false;
    selectedUpdate = null;
    showGitDetail = false;
    showResourceDetail = false;
    showGitDetail = showGitDetail;
  }

  $: date = project.created_at ? format(new Date(project.created_at), 'd/M/yy') : '';

  $: banner = project.banner_image
    ? project.banner_image
    : 'https://zyfpmpmcpzmickajgkwp.supabase.co/storage/v1/object/public/pipeline-images/defaults/banner.png?t=2024-11-20T15%3A45%3A51.937Z';

  $: image = project.image
    ? project.image
    : 'https://zyfpmpmcpzmickajgkwp.supabase.co/storage/v1/object/public/pipeline-images/defaults/projectProf.png?t=2024-11-20T16%3A05%3A41.191Z';

  let contributors = [];
  let comments = [];

  onMount(async () => {
    if (data.isAuthenticated) {
      user = data.user;
    }

    contributors = await fetchContribs();
  });

  let totalCommits = 0;

  $: {
    if (Array.isArray(contributors)) {
      totalCommits = contributors.reduce((prev, curr) => prev + curr.contributions, 0) || 0;
    }
  }
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
        <span class="text-body-lg text-gray-400">{project.title || 'Project Details'}</span>
      </div>
    </div>
  </nav>

  <div class="container mx-auto max-w-7xl px-8">
    <!-- Hero Section - Comprehensive Layout -->
    <div class="mb-8 flex flex-col gap-8 md:flex-row">
      <!-- Project Image -->
      <div class="flex-shrink-0 md:flex-shrink-0">
        <img
          loading="lazy"
          src={image}
          class="h-64 w-full rounded-2xl bg-dashboard-gray-800 object-cover shadow-card md:h-64 md:w-48"
          alt="Project image"
        />
      </div>

      <!-- Main Project Info -->
      <div class="flex-1 space-y-6">
        <!-- Title and Metadata -->
        <div class="space-y-4">
          <div class="space-y-2">
            <div class="flex items-center gap-3 text-body-sm text-gray-400">
              <Icon icon="lucide:calendar" class="h-4 w-4" />
              <time datetime={project.created_at}>Created {date}</time>
            </div>
            <h1 class="text-display-xl font-semibold leading-tight text-white">
              {project.title || 'Project Title'}
            </h1>
          </div>

          <!-- DPG Status - Prominent -->
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-3">
              <Icon icon="lucide:shield-check" class="h-5 w-5 text-dashboard-yellow-400" />
              <div class="text-heading-md font-semibold text-white">
                {project.dpgCount}<span class="text-gray-400">/9</span>
              </div>
              <span class="text-body-md text-gray-300">DPG Standards</span>
            </div>
            <div class="h-2 w-32 rounded-full bg-dashboard-gray-700">
              <div
                class="h-2 rounded-full bg-gradient-to-r from-dashboard-yellow-400 to-dashboard-purple-500 transition-all duration-300"
                style="width: {(project.dpgCount / 9) * 100}%"
              ></div>
            </div>
          </div>

          <!-- Tags -->
          {#if project.tags && project.tags.length > 0}
            <div class="flex flex-wrap gap-2">
              {#each project.tags as tag}
                <div class="transform transition-transform duration-200 hover:scale-105">
                  <CategoryTag {tag} />
                </div>
              {/each}
            </div>
          {/if}
        </div>

        <!-- Action Buttons -->
        {#if user}
          <div class="flex gap-3">
            <a
              href="/project/{id}/contribute"
              class="rounded-xl bg-dashboard-yellow-400 px-6 py-3 text-label-lg font-medium text-dashboard-black transition-colors hover:bg-dashboard-yellow-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dashboard-yellow-400 disabled:pointer-events-none disabled:opacity-50"
            >
              <Icon icon="lucide:heart-handshake" class="mr-2 inline h-4 w-4" />
              Contribute
            </a>

            {#if user.id === project.user_id}
              <a
                href="/project/{id}/edit"
                class="rounded-xl border border-dashboard-gray-600 bg-dashboard-gray-800 px-6 py-3 text-label-lg font-medium text-white transition-colors hover:bg-dashboard-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              >
                <Icon icon="lucide:edit" class="mr-2 inline h-4 w-4" />
                Edit
              </a>
            {:else}
              <form
                action="?/bookmark"
                method="POST"
                use:enhance={() => {
                  return async ({ result }) => {
                    if (result.type === 'success') {
                      isFollowing = !isFollowing;
                      toast.success(
                        isFollowing
                          ? 'Project followed successfully'
                          : 'Project unfollowed successfully',
                      );
                    }
                  };
                }}
              >
                <button
                  type="submit"
                  class="rounded-xl border border-dashboard-gray-600 bg-dashboard-gray-800 px-6 py-3 text-label-lg font-medium text-white transition-colors hover:bg-dashboard-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  class:bg-dashboard-purple-500={isFollowing}
                  class:border-dashboard-purple-500={isFollowing}
                  class:hover:bg-dashboard-purple-600={isFollowing}
                >
                  <Icon
                    icon={isFollowing ? 'lucide:user-check' : 'lucide:user-plus'}
                    class="mr-2 inline h-4 w-4"
                  />
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
              </form>
            {/if}
          </div>
        {/if}
      </div>

      <!-- Right Sidebar - Stats & Contributors -->
      <div class="w-full flex-shrink-0 space-y-6 md:w-80">
        <!-- Stats Grid -->
        <div
          class="grid grid-cols-2 gap-4 rounded-xl border border-dashboard-gray-700 bg-dashboard-gray-900/50 p-4"
        >
          <div class="text-center">
            <div class="text-display-md font-semibold text-white">
              ${amountFormat(project.current_funding || 0)}
            </div>
            <div class="text-label-sm text-gray-400">
              raised of ${amountFormat(project.funding_goal || 0)}
            </div>
          </div>
          <div class="text-center">
            <div class="text-display-md font-semibold text-white">
              {totalResources}
            </div>
            <div class="text-label-sm text-gray-400">updates</div>
          </div>
        </div>

        <!-- Contributors - Compact Style -->
        <div class="rounded-xl border border-dashboard-gray-700 bg-dashboard-gray-900/50 p-4">
          <div class="mb-3 flex items-center justify-between">
            <h3 class="text-heading-md font-semibold text-white">Contributors</h3>
            <!-- {#if contributors.length > 6}
              <button
                class="text-gray-400 transition-colors text-label-sm hover:text-white"
                on:click={toggleGitDetail}
              >
                View all
              </button>
            {/if} -->
          </div>

          <!-- Avatar Row -->
          <div class="flex items-center -space-x-2">
            {#if Array.isArray(contributors) && contributors.length > 0}
              {#each contributors.slice(0, 6) as contributor}
                <img
                  src={contributor.avatar_url || defaultImageUrl}
                  alt={contributor.login || 'Contributor'}
                  class="h-10 w-10 rounded-full border-2 border-dashboard-gray-700 bg-dashboard-gray-800 transition-transform hover:z-10 hover:scale-110"
                  title={contributor.login || 'Contributor'}
                />
              {/each}
              {#if contributors.length > 6}
                <div
                  class="flex h-10 w-10 items-center justify-center rounded-full border-2 border-dashboard-gray-700 bg-dashboard-gray-800 text-xs font-medium text-gray-300"
                >
                  +{contributors.length - 6}
                </div>
              {/if}
            {:else}
              <div
                class="flex h-10 w-10 items-center justify-center rounded-full border-2 border-dashed border-dashboard-gray-600 text-gray-500"
              >
                <Icon icon="lucide:users" class="h-5 w-5" />
              </div>
            {/if}
          </div>
        </div>
      </div>
    </div>

    <!-- Project About Section -->
    <div class="mb-8">
      <ProjectAbout {project} />
    </div>

    <!-- Detailed Sections - Minimal Tabs -->
    <div class="rounded-2xl border border-dashboard-gray-700 bg-dashboard-gray-900 p-6 shadow-card">
      <ProjectNav
        class="flex w-full flex-nowrap items-start overflow-x-auto whitespace-nowrap text-sm"
        {navItems}
        bind:activeItem={activeNavItem}
        on:navChange={handleNavChange}
      />

      <section class="mt-8">
        {#if activeNavItem === 'dpgStatus'}
          <div class="space-y-6">
            <div class="text-center">
              <h2 class="mb-2 text-display-md font-semibold text-white lg:text-display-xl">
                DPG Compliance Assessment
              </h2>
              <p class="text-body-lg text-gray-300">
                Detailed evaluation against Digital Public Good standards
              </p>
            </div>
            <DpgStatus {user} {project} />
          </div>
        {:else if activeNavItem === 'tasks'}
          <div class="space-y-6">
            <div>
              <h2 class="mb-2 text-display-md font-semibold text-white lg:text-display-xl">
                Issues & Tasks
              </h2>
              <p class="text-body-lg text-gray-300">Open issues and development tasks</p>
            </div>
            <Issues />
          </div>
        {/if}
      </section>
    </div>
  </div>
</div>

<!-- Modals -->
{#if showGitDetail}
  <Dialog open onOpenChange={() => (showGitDetail = false)}>
    <DialogContent class="max-w-4xl">
      <GitContributorsViewAll on:goBack={handleGoBack} />
    </DialogContent>
  </Dialog>
{/if}

{#if showResourceDetail}
  <Dialog open onOpenChange={() => (showResourceDetail = false)}>
    <DialogContent class="max-w-4xl">
      <ResourcesViewAll on:goBack={handleGoBack} />
    </DialogContent>
  </Dialog>
{/if}

{#if showUpdatePopup}
  <Dialog open onOpenChange={closeUpdatePopup}>
    <DialogContent
      class="fixed w-full max-w-md rounded-2xl border border-dashboard-gray-700 bg-dashboard-gray-900 p-6 shadow-card sm:left-[50%] sm:top-[50%] sm:translate-x-[-50%] sm:translate-y-[-50%]"
    >
      <DialogHeader>
        <DialogTitle class="mb-4 text-heading-lg font-semibold text-white">Add Update</DialogTitle>
      </DialogHeader>

      <form
        action="?/addUpdate"
        method="POST"
        use:enhance={() => {
          return async ({ form, result }) => {
            if (result.type === 'success') {
              closeUpdatePopup();
              form.reset();
            }
            await applyAction(result);
          };
        }}
        class="space-y-4"
      >
        <div>
          <Label class="mb-2 block text-label-lg font-medium text-gray-300">Title</Label>
          <Input
            type="text"
            name="title"
            class="w-full rounded-lg border border-dashboard-gray-600 bg-dashboard-gray-800 px-4 py-3 text-body-lg text-white focus:border-transparent focus:outline-none focus:ring-2 focus:ring-dashboard-purple-500"
            required
            disabled={isAddingUpdate}
          />
        </div>

        <div>
          <Label class="mb-2 block text-label-lg font-medium text-gray-300">Body</Label>
          <Textarea
            rows="4"
            name="body"
            class="w-full resize-none rounded-lg border border-dashboard-gray-600 bg-dashboard-gray-800 px-4 py-3 text-body-lg text-white focus:border-transparent focus:outline-none focus:ring-2 focus:ring-dashboard-purple-500"
            required
            disabled={isAddingUpdate}
          />
        </div>

        <Button
          type="submit"
          class="w-full rounded-xl bg-dashboard-yellow-400 px-6 py-3 text-label-lg font-medium text-dashboard-black transition-colors hover:bg-dashboard-yellow-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dashboard-yellow-400 disabled:pointer-events-none disabled:opacity-50"
          disabled={isAddingUpdate}
        >
          {#if isAddingUpdate}
            <span class="flex items-center justify-center gap-2">
              <Icon icon="lucide:loader-2" class="h-4 w-4 animate-spin" />
              Adding Update...
            </span>
          {:else}
            Add Update
          {/if}
        </Button>
      </form>
    </DialogContent>
  </Dialog>
{/if}
