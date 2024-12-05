<script>
  import { onMount } from 'svelte';
  import { countries } from 'countries-list';
  import Icon from '@iconify/svelte';

  export let project = {};

  const countryList = Object.values(countries).sort((a, b) => a.name.localeCompare(b.name));

  let selectedTags = project.tags ? [...project.tags] : [];

  let isOpen = false;
  let inputValue = '';

  let availableTags = [];

  function toggleDropdown(event) {
    event.preventDefault();
    isOpen = !isOpen;
  }

  function addTag(tag) {
    if (!selectedTags.some((selected) => selected.title === tag.title)) {
      selectedTags = [...selectedTags, tag];
    }

    inputValue = '';
    isOpen = false;
  }

  function removeTag(tag) {
    selectedTags = selectedTags.filter((t) => t.title !== tag.title);
  }

  $: filteredTags = availableTags.filter(
    (tag) =>
      tag.title.toLowerCase().includes(inputValue.toLowerCase()) &&
      !selectedTags.some((selected) => selected.title === tag.title),
  );

  let ProjectBannerImage = project.banner_image || null;
  let ProjectProfileImage = project.image || null;

  const authorizedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];

  async function handleBannerUpload(event) {
    const file = event.target.files[0];

    if (file) {
      if (ProjectBannerImage) URL.revokeObjectURL(ProjectBannerImage);
      ProjectBannerImage = URL.createObjectURL(file);
    }
  }

  async function handleProfileUpload(event) {
    const file = event.target.files[0];
    if (file) {
      if (ProjectProfileImage) URL.revokeObjectURL(ProjectProfileImage);
      ProjectProfileImage = URL.createObjectURL(file);
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

  onMount(async () => {
    fetchAllCategories();
  });
</script>

<section
  class="flex flex-col self-center p-10 w-full bg-white max-w-[1235px] max-md:px-5 max-md:mt-10 max-md:max-w-full"
>
  <div class="flex flex-col w-full mt-55 max-md:mt-10">
    <div class="flex flex-col w-full max-md:max-w-full">
      <div class="flex flex-col items-start w-full leading-none max-md:max-w-full">
        <div class="flex flex-col max-w-full w-[409px]">
          <h2 class="text-xl font-semibold text-black">Project Images</h2>
          <p class="mt-2.5 text-sm text-stone-300">
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
          name="banner_image"
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
          name="image"
          accept={authorizedExtensions.join(',')}
          on:change={handleProfileUpload}
        />
      </div>
    </div>

    <div class="flex flex-col justify-center w-full mt-10 max-md:mt-10 max-md:max-w-full">
      <div
        class="flex flex-row items-start justify-between w-full max-md:flex-col max-md:items-start"
      >
        <div class="flex flex-col">
          <label for="projectTitle" class="text-base font-semibold text-black">Project title</label>
          <p class="mt-2.5 text-sm text-stone-400">What is the title of your project</p>
        </div>
        <div class="w-[50%] max-md:w-full">
          <input
            type="text"
            id="projectTitle"
            name="title"
            bind:value={project.title}
            class="w-full border-2 border-lime-800 min-h-[50px] rounded-[75px] mt-2.5 px-4"
            required
          />
        </div>
      </div>

      <div
        class="flex flex-row items-start justify-between w-full mt-9 max-md:flex-col max-md:items-start"
      >
        <div class="flex flex-col w-[45%] max-md:w-[100%]">
          <label for="projectBio" class="text-black font-basesemibold text-">Project bio</label>
          <p class="mt-2.5 text-sm text-stone-400">Give a short description of your project</p>
        </div>
        <div class="w-[50%] max-md:w-[100%]">
          <textarea
            id="projectBio"
            name="bio"
            bind:value={project.bio}
            class="w-full border-2 border-lime-800 min-h-[120px] rounded-[31px] mt-2.5 p-4"
            required
          ></textarea>
        </div>
      </div>

      <div
        class="flex flex-row items-start justify-between w-full mt-9 max-md:flex-col max-md:items-start"
      >
        <div class="flex flex-col w-[45%] max-md:w-[100%]">
          <label for="projectTags" class="text-base font-semibold text-black">Project tags</label>
          <p class="mt-2.5 text-sm text-stone-400">
            Select the keywords that best describe your project.
          </p>
        </div>
        <div class="relative w-[50%] mt-2.5 max-md:w-full">
          <div
            class="flex flex-wrap items-center py-3 px-6 border-2 border-lime-800 min-h-[50px] rounded-[31px] bg-white"
          >
            <div class="flex flex-wrap items-center flex-grow gap-2 pr-8">
              {#each selectedTags as tag}
                <span class="flex items-center px-3 py-1 rounded-full text-lime-800 bg-lime-200">
                  <img
                  src={tag.image}
                  alt={tag.title}
                  class="relative w-6 h-6 border-2 rounded shadow"
                />
          
                  <button
                    on:click={() => removeTag(tag)}
                    class="ml-2 text-lime-800 hover:text-lime-900">×</button
                  >
                </span>
              {/each}
              <input
                type="text"
                bind:value={inputValue}
                placeholder="Type to add tags"
                class="flex-grow bg-transparent border-none outline-none rounded-[31px]"
              />
              <input type="hidden" name="tags" value={JSON.stringify(selectedTags)} />
            </div>
            <button
              on:click={toggleDropdown}
              class="absolute transform -translate-y-1/2 right-4 top-1/2 focus:outline-none"
              aria-label="Toggle tag dropdown"
            >
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/5884aaa40d84100252b9385acefd99519ea142223ddf8cccbdc39ac10099df1f?placeholderIfAbsent=true&apiKey=567aaefef2da4f73a3149c6bc21f1ea8"
                alt="Dropdown arrow"
                class="w-5 h-5 object-contain transition-transform duration-200 {isOpen
                  ? 'rotate-180'
                  : ''}"
              />
            </button>
          </div>

          {#if isOpen}
            <div
              class="absolute z-10 w-full mt-1 overflow-auto bg-white border border-gray-300 rounded-md shadow-lg max-h-60"
            >
              {#each filteredTags as tag}
                <button
                  on:click={() => addTag(tag)}
                  class="block w-full px-4 py-2 text-left hover:bg-lime-100 focus:bg-lime-200 focus:outline-none"
                >
                  {tag.title}
                </button>
              {/each}
            </div>
          {/if}
        </div>
      </div>

      <div
        class="flex flex-row items-start justify-between w-full mt-12 max-md:flex-col max-md:items-start"
      >
        <div class="flex flex-col w-[40%] max-md:w-[100%]">
          <label for="projectCountry" class="text-base font-semibold text-black"> Country </label>
          <p class="mt-2.5 text-sm text-stone-400">
            Choose the location where you are running the project.
          </p>
        </div>
        <div class="w-[50%] max-md:w-full">
          <div class="relative flex items-center border-2 border-lime-800 h-[50px] rounded-[75px]">
            <select
              id="projectCountry"
              name="country"
              bind:value={project.country}
              class="w-full h-full pl-4 pr-10 bg-transparent border-none outline-none appearance-none"
              required
            >
              <option value="" disabled selected hidden>--- Select a country ---</option>
              {#each countryList as countryOption (countryOption.name)}
                <option value={countryOption.name}>{countryOption.name}</option>
              {/each}
            </select>
            <!-- Custom Arrow Icon -->
            <Icon icon="radix-icons:caret-down" class="text-2xl" />
          </div>
        </div>
      </div>

      <div
        class="flex flex-row items-start justify-between w-full mt-9 max-md:flex-col max-md:items-start"
      >
        <div class="flex flex-col w-[45%] max-md:w-[100%]">
          <label for="projectDetails" class="text-base font-semibold text-black">
            Project details
          </label>
          <p class="mt-2.5 text-sm text-stone-400">
            Tell potential contributors more about your project. <br /> Provide details that will
            motivate people to contribute.
            <br /> A good pitch is compelling, informative, and easy to digest.
          </p>
        </div>
        <div class="w-[50%] max-md:w-full">
          <textarea
            id="projectDetails"
            name="details"
            bind:value={project.details}
            class="w-full border-2 border-lime-800 rounded-[31px] mt-2.5 p-4 h-[140px]"
            required
          ></textarea>
        </div>
      </div>
    </div>
  </div>
</section>
