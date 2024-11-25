<script>
  import Contributors from '../../../lib/Contributors.svelte';
  import ProjectNav from '../../../lib/ProjectNav.svelte';
  import ProjectAbout from '../../../lib/ProjectAbout.svelte';
  import DpgStatus from '../../../lib/dpgStatus.svelte';
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import Updates from '../../../lib/Updates.svelte';
  import UpdateDetail from '../../../lib/UpdateDetail.svelte';
  import Resources from '../../../lib/Resources.svelte';
  import { amountFormat } from '$lib/utils/amountFormat.js';
  import Icon from '@iconify/svelte';

  let id;
  $: id = $page.params.id;

  let project = {};
  let projectUpdates = [];
  let projectResource = [];
  let loading = true;
  let user = null;
  let error = null;
  let image;
  let banner;
  export let data;

  let isFollowing = false;
  let isAddingUpdate = false;

  async function getSingleProject() {
    try {
      const response = await fetch(`/api/projects/singleProject/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const data = await response.json();
      project = data.project;
    } catch (error) {
      error = e.message;
      alert(error);
    } finally {
      loading = false;
    }
  }

  async function toggleFollow() {
    isFollowing = !isFollowing;
    await bookmarkProject();
  }

  let showUpdatePopup = false;
  let updateTitle = '';
  let updateBody = '';

  function openUpdatePopup() {
    showUpdatePopup = true;
  }

  function closeUpdatePopup() {
    showUpdatePopup = false;
    updateTitle = '';
    updateBody = '';
  }

  async function submitUpdate() {
    isAddingUpdate = true;
    try {
      const response = await fetch(`/api/projects/singleProject/${id}/projectUpdates/store`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: updateTitle, body: updateBody }),
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      closeUpdatePopup();

      await getProjectUpdates();

      alert('Update added successfully');
    } catch (e) {
      alert(e.message);
    } finally {
      isAddingUpdate = false;
    }
  }

  async function getProjectUpdates() {
    try {
      const response = await fetch(`/api/projects/singleProject/${id}/projectUpdates`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const data = await response.json();

      projectUpdates = data.projectUpdates;
    } catch (error) {
      alert(error);
    } finally {
      loading = false;
    }
  }

  async function getProjectResources() {
    try {
      const response = await fetch(`/api/projects/singleProject/${id}/contribution/resources`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const data = await response.json();

      projectResource = data.resources;
    } catch (error) {
      alert(error);
    } finally {
      loading = false;
    }
  }

  async function bookmarkProject() {
    try {
      const response = await fetch(`/api/projects/singleProject/${id}/bookmark`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      alert('Project bookmarked successfully');
    } catch (e) {
      alert(e.message);
    }
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

  onMount(async () => {
    project.banner_image
      ? (banner = project.image)
      : (banner =
          'https://zyfpmpmcpzmickajgkwp.supabase.co/storage/v1/object/public/pipeline-images/defaults/banner.png?t=2024-11-20T15%3A45%3A51.937Z');
    project.image
      ? (image = project.image)
      : (image =
          'https://zyfpmpmcpzmickajgkwp.supabase.co/storage/v1/object/public/pipeline-images/defaults/projectProf.png?t=2024-11-20T16%3A05%3A41.191Z');
    await getSingleProject();
    await getProjectUpdates();
    await getProjectResources();
    if (data.isAuthenticated) {
      user = data.user;
    }
  });
</script>

<div class="flex items-start max-w-[1500px] mx-auto px-4">
  <div class="flex flex-col w-full max-w-[40%] pr-4 sticky top-0">
    <section class="flex relative flex-col mt-6 w-full mb-[64px]">
      <!-- svelte-ignore a11y-no-redundant-roles -->
      <!-- svelte-ignore a11y-img-redundant-alt -->
      <img
        loading="lazy"
        src={banner}
        class="flex z-0 w-full bg-stone-300 h-[250px] rounded-[24px] max-md:max-w-full"
        role="img"
        aria-label="Project hero image"
        alt="Project image"
      />
      <!-- svelte-ignore a11y-img-redundant-alt -->
      <img
        loading="lazy"
        class="absolute z-10 w-[120px] h-[120px] rounded-full outline outline-4 outline-white"
        style="top: 97%; left: 50px; transform: translateY(-50%);"
        src={image}
        alt="Project overlay image"
      />
    </section>

    <section class="flex flex-col w-full mt-3">
      <div class="flex justify-between">
        <h1 class="text-3xl font-semibold text-black max-md:text-2xl break-all">
          {project.title || 'Project Title'}
        </h1>
        <div class="flex items-center gap-1 mt-2 text-base text-neutral-600">
          <Icon icon="ph:calendar" class="text-2xl" />
          <time datetime="2024-10">Created: October 2024</time>
        </div>
      </div>
      <p class="mt-3 text-xl font-light leading-8 text-black">
        {project.bio || 'Project bio'}
      </p>
    </section>

    <section class="flex flex-wrap items-center gap-3 mt-2">
      <div class="flex flex-wrap gap-2 text-lg text-lime-800">
        {#if project.tags && project.tags.length > 0}
          {#each project.tags as tag}
            <span class="px-2 py-0.5 text-base border-2 rounded-md border-[#0b383c] max-md:px-3">
              {tag.title}
            </span>
          {/each}
        {/if}
      </div>
    </section>

    {#if user}
      <div class="flex items-center gap-3 mt-6">
        {#if user.id === project.user_id}
          <a
            href="/project/{id}/edit"
            class="w-full py-4 text-base font-semibold text-center text-white bg-[#0b383c] rounded-full"
          >
            <button>EDIT PROJECT</button>
          </a>
          <button
            on:click={openUpdatePopup}
            class="w-full py-4 text-base font-semibold text-center text-black rounded-full bg-lime-300"
          >
            ADD UPDATE
          </button>
        {:else}
          <a
            href="/project/{id}/contribute"
            class="bg-[#0b383c] text-[#e9f5d3] text-center text-base font-semibold py-4 rounded-full w-[50%]"
          >
            <button>CONTRIBUTE</button>
          </a>
          <button
            on:click={toggleFollow}
            class="border-2 text-center text-base font-semibold py-4 rounded-full w-[50%]"
            class:bg-[#e9f5d3]={isFollowing}
            class:text-black={isFollowing}
          >
            {isFollowing ? 'UNFOLLOW' : 'FOLLOW'}
          </button>
        {/if}
      </div>
    {/if}

    {#if showUpdatePopup}
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div class="relative bg-white p-8 rounded-lg shadow-lg w-[400px] max-w-full">
          <!-- Close Button -->
          <button
            on:click={closeUpdatePopup}
            class="absolute text-2xl font-bold text-gray-500 top-2 right-2 hover:text-gray-700"
            style="z-index: 1000;"
          >
            &times;
          </button>

          <h2 class="mb-4 text-xl font-bold">Add Update</h2>
          <label class="block mb-2 text-sm font-medium text-gray-700">
            Title
            <input
              type="text"
              bind:value={updateTitle}
              class="w-full p-2 mt-1 border rounded-lg"
              require
            />
          </label>
          <label class="block mb-4 text-sm font-medium text-gray-700">
            Body
            <textarea
              bind:value={updateBody}
              rows="4"
              class="w-full p-2 mt-1 border rounded-lg resize-none"
              require
            ></textarea>
          </label>
          <button
            on:click={submitUpdate}
            class="w-full py-2 text-black rounded-lg bg-lime-300"
            disabled={isAddingUpdate}
          >
            {isAddingUpdate ? 'Adding Update...' : 'Add Update'}
          </button>
        </div>
      </div>
    {/if}

    <section
      class="flex flex-wrap gap-6 justify-between items-center p-6 mt-8 w-full bg-lime-300 rounded-[20px] text-teal-950 max-md:mt-6"
    >
      <div class="flex flex-col items-center w-[120px]">
        <div class="text-5xl font-semibold max-md:text-3xl">6</div>
        <div class="text-sm">Contributors</div>
      </div>
      <div class="w-px h-[100px] bg-neutral-400"></div>
      <div class="flex flex-col items-center w-[120px]">
        <div class="text-5xl font-semibold max-md:text-3xl">
          5<span class="text-3xl">/</span><span class="text-3xl text-teal-800">9</span>
        </div>
        <div class="text-sm">DPG Status</div>
      </div>
      <div class="w-px h-[100px] bg-neutral-400"></div>
      <div class="flex flex-col items-center w-[120px]">
        <div class="text-5xl font-semibold max-md:text-3xl">
          ${amountFormat(project.current_funding || 0)}
        </div>
        <div class="text-sm">
          raised of ${amountFormat(project.funding_goal || 0)}
        </div>
      </div>
    </section>
  </div>

  <div class="flex flex-col w-[80%] max-w-[60%] bg-white pl-4 overflow-y-auto">
    <main
      class="flex flex-col items-start px-4 py-8 bg-white rounded-[20px] max-md:px-4 max-md:mt-6"
    >
      <ProjectNav
        class="flex items-start w-full overflow-x-auto text-sm flex-nowrap whitespace-nowrap"
        {navItems}
        bind:activeItem={activeNavItem}
        on:navChange={handleNavChange}
      />

      <section class="flex flex-col items-center w-full max-w-full mt-8 overflow-hidden">
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
          <Contributors />
          <div class="inline-flex items-center self-stretch justify-start gap-1">
            <div
              class="text-center text-black text-[32px] font-normal font-['Roboto'] leading-loose"
            >
              <slot name="header">Resources</slot>
            </div>
          </div>
          {#if projectResource.length > 0}
            {#each projectResource as resource}
              <Resources
                username={resource.user_profile.name}
                title={resource.title}
                description={resource.reason}
                likes={187}
                comments={64}
              >
                <span slot="header">My Resources</span>
                <img slot="icon" src="icon.png" alt="Resource icon" />
                <img slot="profile-icon" src="profile-icon.png" alt="User" />
              </Resources>
            {/each}
          {:else}
            <p>No resources</p>
          {/if}
        {/if}
      </section>
    </main>
  </div>
</div>
