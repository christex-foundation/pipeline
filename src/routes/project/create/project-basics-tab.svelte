<script>
  import { get } from 'svelte/store';
  import { createEventDispatcher } from 'svelte';

  import { onMount } from 'svelte';
  let Editor;
  import { countries } from 'countries-list';
  import { projectStore } from '$stores/projectStore.js';

  const countryList = Object.values(countries);

  let title = get(projectStore).title;
  let bio = get(projectStore).bio;
  let country = get(projectStore).country;
  let details = get(projectStore).details;

  let bannerImg = get(projectStore).bannerImage;
  let profileImg = get(projectStore).profileImage;

  let selectedTags = [...get(projectStore).tags];

  //validation
  export function validateFields() {
    return title && bio && country && details && selectedTags.length > 0;
  }

  function updateStore() {
    projectStore.update((data) => {
      data.title = title;
      data.bio = bio;
      data.tags = selectedTags;
      data.country = country;
      data.details = details;
      if (bannerImg) data.bannerImage = bannerImg;
      if (profileImg) data.profileImage = profileImg;
      return data;
    });
  }

  let isOpen = false;
  let inputValue = '';

  const dispatch = createEventDispatcher();

  let availableTags = [];

  let currentSection = 'basics';

  function toggleDropdown(event) {
    event.preventDefault();
    isOpen = !isOpen;
  }

  function addTag(tag) {
    if (!selectedTags.some((selected) => selected.title === tag.title)) {
      selectedTags = [...selectedTags, tag];
      updateStore();
      dispatch('change', selectedTags);
    }

    inputValue = '';
    isOpen = false;
  }

  function removeTag(tag) {
    selectedTags = selectedTags.filter((t) => t.title !== tag.title);
    updateStore();
    dispatch('change', selectedTags);
  }

  $: filteredTags = availableTags.filter(
    (tag) =>
      tag.title.toLowerCase().includes(inputValue.toLowerCase()) &&
      !selectedTags.some((selected) => selected.title === tag.title),
  );

  let ProjectBannerImage = null;
  let ProjectProfileImage = null;

  const authorizedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];

  async function handleBannerUpload(event) {
    const file = event.target.files[0];
    console.log('Banner file selected:', file);
    if (file) {
      if (ProjectBannerImage) URL.revokeObjectURL(ProjectBannerImage);
      ProjectBannerImage = URL.createObjectURL(file);
      let path = await handleImageUpload(file);

      bannerImg = path;
      updateStore();
    }
  }

  async function handleProfileUpload(event) {
    const file = event.target.files[0];
    if (file) {
      if (ProjectProfileImage) URL.revokeObjectURL(ProjectProfileImage);
      ProjectProfileImage = URL.createObjectURL(file);
      let path = await handleImageUpload(file);

      profileImg = path;
      updateStore();
    }
  }

  async function fetchAllCategories() {
    try {
      const response = await fetch('/api/categories', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const data = await response.json();
      availableTags = data.categories;
    } catch (error) {}
  }

  async function handleImageUpload(file) {
    // Upload the image to Supabase storage
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/file-upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.message || 'Failed to upload image');
    }

    return response.json().then((data) => {
      return data.url;
    });
  }

  onMount(async () => {
    fetchAllCategories();
    const module = await import('novel-svelte');
    Editor = module.Editor;
  });
</script>

<section
  class="flex flex-col self-center p-10 mt-5 w-full bg-white max-w-[1235px] max-md:px-5 max-md:mt-10 max-md:max-w-full"
>
  <form class="flex flex-col w-full mt-14 max-md:mt-10">
    <div class="flex flex-col w-full max-md:max-w-full">
      <div class="flex flex-col items-start w-full leading-none max-md:max-w-full">
        <div class="flex flex-col max-w-full w-[409px]">
          <h2 class="text-xl font-semibold text-black">Project Images</h2>
          <p class="mt-2.5 text-base text-stone-300">
            Click to change Project's Cover & Profile photo
          </p>
        </div>
      </div>

      <div class="self-stretch h-[295.61px] relative mb-[141px]">
        <label for="banner-upload" class="cursor-pointer">
          <div
            class="w-full h-full bg-[#d9d9d9] rounded-[37.69px] flex justify-center items-center overflow-hidden"
          >
            {#if ProjectBannerImage}
              <img src={ProjectBannerImage} alt="Banner" class="object-cover w-full h-full" />
            {:else}
              <div class="text-center">Click to upload banner image</div>
            {/if}
          </div>
        </label>
        <input
          type="file"
          id="banner-upload"
          class="hidden"
          accept={authorizedExtensions.join(',')}
          on:change={handleBannerUpload}
        />

        <label for="profile-upload" class="cursor-pointer">
          <div
            class="absolute bottom-[-92.6px] left-[46.69px] w-[185.19px] h-[185.19px] bg-[#d9d9d9] rounded-full border-8 border-white flex justify-center items-center overflow-hidden"
          >
            {#if ProjectProfileImage}
              <img
                src={ProjectProfileImage}
                alt="Profile"
                class="object-cover w-full h-full rounded-full"
              />
            {:else}
              <div class="text-sm text-center">Click to upload profile picture</div>
            {/if}
          </div>
        </label>
        <input
          type="file"
          id="profile-upload"
          class="hidden"
          accept={authorizedExtensions.join(',')}
          on:change={handleProfileUpload}
        />
      </div>
    </div>

    <div class="mt-10 max-md:mt-10 max-md:max-w-full grid gap-10">
      <div class="flex justify-between gap-32">
        <div class="flex flex-col gap-1 min-w-fit">
          <label for="projectTitle" class="text-xl font-semibold">Project title</label>
          <p class="text-stone-400">What is the title of your project</p>
        </div>
        <input
          type="text"
          id="projectTitle"
          name="projectTitle"
          class="w-full block border border-lime-800 rounded-md px-4"
          required
        />
      </div>

      <div class="flex justify-between gap-20">
        <div class="flex flex-col gap-1 min-w-fit">
          <label for="projectBio" class="text-xl font-semibold">Project bio</label>
          <p class="text-stone-400">Give a short description of your project</p>
        </div>
        <textarea
          id="projectBio"
          bind:value={bio}
          on:change={updateStore}
          class="w-full border border-lime-800 min-h-40 rounded-md p-2 resize-none"
          aria-required="true"
        ></textarea>
      </div>

      <div class="flex justify-between items-center gap-10">
        <div class="flex flex-col gap-1 min-w-fit">
          <label for="projectTags" class="text-xl font-semibold">Project tags</label>
          <p class="text-stone-400 max-w-xs">
            Select the keywords that best describe your project.
            <small>(separated by spaces)</small>
            <!-- Could switch to separated by commas instead -->
          </p>
        </div>
        <input
          type="text"
          id="projectTags"
          name="projectTags"
          class="w-full h-fit py-4 block border border-lime-800 rounded-md px-3"
          required
        />
      </div>

      <div class="flex justify-between items-center gap-10">
        <div class="flex flex-col gap-1 min-w-fit">
          <label for="projectCountry" class="text-xl font-semibold">Country</label>
          <p class="text-stone-400 max-w-xs">
            Choose the location where you are running the project.
          </p>
        </div>
        <select id="projectCountry" class="p-3 w-full h-fit rounded-md border-lime-800 border">
          <option selected disabled>--- Select a country ---</option>
          {#each countryList as country}
            <option value={country.name}>{country.name}</option>
          {/each}
        </select>
      </div>

      <div class="flex justify-between gap-16">
        <div class="flex flex-col gap-1 min-w-72">
          <label for="projectDetails" class="text-xl font-semibold text-black">
            Project details
          </label>
          <p class="text-stone-400 max-w-xs">
            Tell potential contributors more about your project. Provide details that will motivate
            people to contribute.
          </p>
          <p class="italic text-stone-800 text-xs">
            A good pitch is compelling, informative, and easy to digest.
          </p>
        </div>
        <textarea
          id="projectDetails"
          class="w-full border border-lime-800 rounded-md p-2 text-sm min-h-60"
        ></textarea>
      </div>
    </div>
  </form>
</section>
