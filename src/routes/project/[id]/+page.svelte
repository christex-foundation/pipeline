<script>
  import { applyAction, enhance } from '$app/forms';
  import ProjectNav from '$lib/ProjectNav.svelte';
  import ProjectAbout from '$lib/ProjectAbout.svelte';
  import DpgStatus from '$lib/dpgStatus.svelte';
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import Updates from '$lib/Updates.svelte';
  import UpdateDetail from '$lib/UpdateDetail.svelte';
  import { amountFormat } from '$lib/utils/amountFormat.js';
  import Icon from '@iconify/svelte';
  import { dateFormat } from '$lib/utils/dateTimeFormat.js';
  import { toast } from 'svelte-sonner';
  import { invalidateAll } from '$app/navigation';

  let id;
  $: id = $page.params.id;

  let user = null;
  let image;
  let banner;
  let date;
  export let data;
  let project = data.project;
  let projectUpdates = data.updates;
  let projectResource = data.resources;

  const defaultImageUrl =
    'https://zyfpmpmcpzmickajgkwp.supabase.co/storage/v1/object/public/pipeline-images/defaults/userProfile.png';

  let isFollowing = false;
  let isAddingUpdate = false;

  // async function toggleFollow() {
  //   isFollowing = !isFollowing;
  //   await bookmarkProject();
  // }

  let showUpdatePopup = false;

  function openUpdatePopup() {
    showUpdatePopup = true;
  }

  function closeUpdatePopup() {
    showUpdatePopup = false;
  }

  let activeNavItem = 'projectDetails';
  let showUpdateDetail = false;
  let selectedUpdate = null;

  const navItems = [
    { id: 'projectDetails', label: 'About', width: '70px' },
    { id: 'dpgStatus', label: 'DPG Status', width: '90px' },
    { id: 'updates', label: 'Updates', width: '95px' },
    { id: 'contributors', label: 'Contributors', width: '150px' },
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
  }

  $: date = dateFormat(project.created_at);

  $: banner = project.banner_image
    ? project.banner_image
    : 'https://zyfpmpmcpzmickajgkwp.supabase.co/storage/v1/object/public/pipeline-images/defaults/banner.png?t=2024-11-20T15%3A45%3A51.937Z';

  $: image = project.image
    ? project.image
    : 'https://zyfpmpmcpzmickajgkwp.supabase.co/storage/v1/object/public/pipeline-images/defaults/projectProf.png?t=2024-11-20T16%3A05%3A41.191Z';

  onMount(async () => {
    if (data.isAuthenticated) {
      user = data.user;
    }
  });
</script>

<div class="mx-auto flex max-w-[1500px] flex-col items-start px-4 lg:flex-row lg:px-8">
  <div class="w-full max-md:w-[100%] lg:sticky lg:top-0 lg:w-[40%] lg:pr-4">
    <section class="relative mb-[64px] mt-6 flex w-full flex-col">
      <img
        loading="lazy"
        src={banner}
        class="z-0 flex h-[250px] w-full rounded-[24px] bg-stone-300 max-md:max-w-full"
        role="img"
        aria-label="Project hero image"
        alt="Project image"
      />
      <img
        loading="lazy"
        class="absolute left-1/2 z-10 h-[120px] w-[120px] -translate-x-1/2 transform rounded-full outline outline-4 outline-white max-lg:left-[20px] lg:left-[50px] lg:translate-x-0"
        style="top: 97%; transform: translateY(-50%);"
        src={image}
        alt="Project overlay image"
      />
    </section>

    <section class="mt-3 flex w-full flex-col">
      <div class="flex justify-between max-md:gap-2">
        <h1 class="break-all text-3xl font-semibold text-black max-lg:mt-2 max-lg:text-xl">
          {project.title || 'Project Title'}
        </h1>
        <div class="mt-2 flex items-center gap-1 text-base text-neutral-600">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/edd6d143a10aa89a67f0101c84563e276eb2ea6bc943000847a62b3bcaeb9863?placeholderIfAbsent=true&apiKey=567aaefef2da4f73a3149c6bc21f1ea8"
            alt="Date icon"
            class="h-[24px] w-[24px] object-contain max-md:w-[15px]"
          />
          <time datetime="2024-10" class="max-md:text-sm">Created: {date}</time>
        </div>
      </div>
      <p class="mt-3 text-xl font-light leading-8 text-black max-lg:text-base">
        {project.bio || 'Project bio'}
      </p>
    </section>

    <section class="mt-2 flex flex-wrap items-center gap-3">
      <div class="flex flex-wrap gap-2 text-lg text-lime-800">
        {#if project.tags && project.tags.length > 0}
          {#each project.tags as tag}
            <span class="rounded-md border-2 border-[#0b383c] px-2 py-0.5 text-base max-md:px-3">
              {tag.title}
            </span>
          {/each}
        {/if}
      </div>
    </section>

    {#if user}
      <div class="mt-6 flex items-center gap-3">
        {#if user.id === project.user_id}
          <a
            href="/project/{id}/edit"
            class="w-full rounded-full bg-[#0b383c] py-4 text-center text-base font-semibold text-white"
          >
            <button>EDIT PROJECT</button>
          </a>
          <button
            on:click={openUpdatePopup}
            class="w-full rounded-full bg-lime-300 py-4 text-center text-base font-semibold text-black"
          >
            ADD UPDATE
          </button>
        {:else}
          <a
            href="/project/{id}/contribute"
            class="w-full rounded-full bg-[#0b383c] py-4 text-center text-base font-semibold text-[#e9f5d3] lg:w-[50%]"
          >
            <button>CONTRIBUTE</button>
          </a>
          <form
            class="w-[50%]"
            action="?/bookmark"
            method="POST"
            use:enhance={() => {
              return async ({ result }) => {
                if (result.type === 'success') {
                  alert('Project bookmarked successfully');
                }
              };
            }}
          >
            <button
              type="submit"
              class="w-full rounded-full border-2 py-4 text-center text-base font-semibold"
              class:bg-[#e9f5d3]={isFollowing}
              class:text-black={isFollowing}
            >
              {isFollowing ? 'UNFOLLOW' : 'FOLLOW'}
            </button>
          </form>
        {/if}
      </div>
    {/if}

    {#if showUpdatePopup}
      <form
        action="?/addUpdate"
        method="POST"
        use:enhance={() => {
          return async ({ result }) => {
            if (result.type === 'success') {
              closeUpdatePopup();
            }

            await applyAction(result);
            await invalidateAll();
          };
        }}
      >
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div class="relative w-[400px] max-w-full rounded-lg bg-white p-8 shadow-lg">
            <!-- Close Button -->
            <button
              on:click={closeUpdatePopup}
              class="absolute right-2 top-2 text-2xl font-bold text-gray-500 hover:text-gray-700"
              style="z-index: 1000;"
            >
              &times;
            </button>

            <h2 class="mb-4 text-xl font-bold">Add Update</h2>
            <label class="mb-2 block text-sm font-medium text-gray-700">
              Title
              <input type="text" name="title" class="mt-1 w-full rounded-lg border p-2" require />
            </label>
            <label class="mb-4 block text-sm font-medium text-gray-700">
              Body
              <textarea
                rows="4"
                name="body"
                class="mt-1 w-full resize-none rounded-lg border p-2"
                require
              ></textarea>
            </label>
            <button
              type="submit"
              class="w-full rounded-lg bg-lime-300 py-2 text-black"
              disabled={isAddingUpdate}
            >
              {isAddingUpdate ? 'Adding Update...' : 'Add Update'}
            </button>
          </div>
        </div>
      </form>
    {/if}

    <section
      class="mt-8 flex w-full items-center justify-between gap-6 rounded-[20px] bg-lime-300 p-6 text-teal-950 max-md:mt-6"
    >
      <div class="flex w-[120px] flex-col items-center max-md:w-[80px]">
        <div class="text-5xl font-semibold max-md:text-3xl">6</div>
        <div class="text-sm max-md:text-[13px]">Contributors</div>
      </div>
      <div class="h-[100px] w-px bg-neutral-400 max-md:hidden"></div>
      <div class="flex w-[120px] flex-col items-center max-md:w-[80px]">
        <div class="text-5xl font-semibold max-md:text-3xl">
          5<span class="text-3xl">/</span><span class="text-3xl text-teal-800">9</span>
        </div>
        <div class="text-sm max-md:text-[12px]">DPG Status</div>
      </div>
      <div class="h-[100px] w-px bg-neutral-400 max-md:hidden"></div>
      <div class="flex w-[120px] flex-col items-center max-md:w-[95px]">
        <div class="text-4xl font-semibold max-md:text-3xl">
          ${amountFormat(project.current_funding || 0)}
        </div>
        <div class="text-sm max-md:text-[12px]">
          raised of ${amountFormat(project.funding_goal || 0)}
        </div>
      </div>
    </section>
  </div>

  <div class="mt-4 w-full lg:mt-0 lg:w-[60%] lg:pl-4">
    <main
      class="flex flex-col items-start rounded-[20px] bg-white px-4 py-8 max-md:mt-6 max-md:px-4"
    >
      <ProjectNav
        class="flex w-full flex-nowrap items-start overflow-x-auto whitespace-nowrap text-sm"
        {navItems}
        bind:activeItem={activeNavItem}
        on:navChange={handleNavChange}
      />

      <section class="mt-8 flex w-full max-w-full flex-col items-center">
        {#if activeNavItem === 'projectDetails'}
          <ProjectAbout {project} />
        {:else if activeNavItem === 'dpgStatus'}
          <DpgStatus {project} />
        {:else if activeNavItem === 'updates'}
          {#if showUpdateDetail}
            <UpdateDetail {data} {selectedUpdate} on:goBack={handleGoBack} />
          {:else if projectUpdates.length > 0}
            {#each projectUpdates as update}
              <Updates on:showDetail={handleShowDetail} {update} />
            {/each}
          {:else}
            <p>No updates</p>
          {/if}
        {:else if activeNavItem === 'contributors'}
          <div class="w-full px-4 md:px-10">
            <div class="mb-6 inline-flex items-center justify-start gap-1 self-stretch">
              <div
                class="text-center font-['Roboto'] text-2xl font-normal leading-loose text-black md:text-[32px]"
              >
                <slot name="header">Resources</slot>
              </div>
            </div>

            {#if projectResource.length > 0}
              <div class="w-full space-y-4">
                {#each projectResource as resource}
                  <div
                    class="flex w-full flex-col items-start justify-start rounded-lg border border-gray-100 bg-white px-4 py-5 shadow-md md:flex-row md:px-10"
                  >
                    <div class="mb-4 flex w-full justify-center md:mb-0 md:mr-6 md:w-auto">
                      <img
                        class="border-green h-[100px] w-[100px] rounded-full p-[15px] md:h-[120px] md:w-[120px]"
                        src={resource.user_profile.photo || defaultImageUrl}
                        alt={resource.user_profile.name}
                      />
                    </div>

                    <div class="flex w-full flex-col items-start justify-start">
                      <div
                        class="mb-4 flex w-full flex-col items-start justify-between md:flex-row md:items-center"
                      >
                        <div
                          class="mb-2 flex flex-col items-start md:mb-0 md:flex-row md:items-center"
                        >
                          <div
                            class="mr-0 font-['Inter'] text-lg font-semibold text-black md:mr-2 md:text-[19px]"
                          >
                            {resource.user_profile.name}
                          </div>
                          <div
                            class="mt-1 inline-flex items-center justify-center gap-[6.44px] rounded-md bg-[#e9f5d3] px-[9.65px] py-[6.44px] md:mt-0"
                          >
                            <div
                              class="font-['Inter'] text-[10.46px] font-semibold leading-[10.46px] text-[#516027]"
                            >
                              {resource.type_resource.charAt(0).toUpperCase() +
                                resource.type_resource.slice(1)}
                            </div>
                          </div>
                        </div>
                        <a target="_blank" href={resource.link} class="w-full md:w-auto">
                          <button
                            class="flex w-full items-center justify-center gap-[7.94px] rounded-[39.71px] border-2 border-[#516027] px-[9.06px] py-[5.12px] md:w-auto"
                          >
                            <div
                              class="font-['Inter'] text-[10px] font-normal leading-tight text-[#516027]"
                            >
                              View {resource.type_resource.charAt(0).toUpperCase() +
                                resource.type_resource.slice(1)}
                            </div>
                          </button>
                        </a>
                      </div>
                      <div
                        class="font-['Inter'] text-base font-normal text-[#c4c4c4] md:text-[17px]"
                      >
                        {resource.reason}
                      </div>
                    </div>
                  </div>
                {/each}
              </div>
            {:else}
              <p class="text-center italic text-gray-500">No resources</p>
            {/if}
          </div>
        {/if}
      </section>
    </main>
  </div>
</div>
