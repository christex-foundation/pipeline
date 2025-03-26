 <script>
  import { onMount } from 'svelte';
  import { countries } from 'countries-list';
  import Icon from '@iconify/svelte';

  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import { Checkbox } from "$lib/components/ui/checkbox";
  import { Textarea } from "$lib/components/ui/textarea";

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
  class="flex w-full max-w-[1235px] flex-col self-center bg-white p-10 max-md:mt-10 max-md:max-w-full max-md:px-5"
>
  <div class="mt-55 flex w-full flex-col max-md:mt-10">
    <div class="flex w-full flex-col max-md:max-w-full">
      <div class="flex w-full flex-col items-start leading-none max-md:max-w-full">
        <div class="flex w-[409px] max-w-full flex-col">
          <h2 class="text-xl font-semibold text-black">Project Images</h2>
          <p class="mt-2.5 text-sm text-stone-300">
            Click to change Project's Cover & Profile photo
          </p>
        </div>
      </div>

      <div class="relative mb-[141px] h-[295.61px] self-stretch">
        <Label for="banner-upload" class="cursor-pointer">
          <div
            class="flex h-full w-full items-center justify-center overflow-hidden rounded-[37.69px] bg-[#d9d9d9]"
          >
            {#if ProjectBannerImage}
              <img src={ProjectBannerImage} alt="Banner" class="h-full w-full object-cover" />
            {:else}
              <div class="text-center">Click to upload banner image</div>
            {/if}
          </div>
        </Label>
        <input
          type="file"
          id="banner-upload"
          name="banner_image"
          class="hidden"
          accept={authorizedExtensions.join(',')}
          on:change={handleBannerUpload}
        />

        <Label for="profile-upload" class="cursor-pointer">
          <div
            class="absolute bottom-[-92.6px] left-[46.69px] flex h-[185.19px] w-[185.19px] items-center justify-center overflow-hidden rounded-full border-8 border-white bg-[#d9d9d9]"
          >
            {#if ProjectProfileImage}
              <img
                src={ProjectProfileImage}
                alt="Profile"
                class="h-full w-full rounded-full object-cover"
              />
            {:else}
              <div class="text-center text-sm">Click to upload profile picture</div>
            {/if}
          </div>
        </Label>
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

    <div class="mt-10 flex w-full flex-col justify-center max-md:mt-10 max-md:max-w-full">
      <div
        class="flex w-full flex-row items-start justify-between max-md:flex-col max-md:items-start"
      >
        <div class="flex flex-col">
          <Label for="projectTitle" class="text-base font-semibold text-black">Project title</Label>
          <p class="mt-2.5 text-sm text-stone-400">What is the title of your project</p>
        </div>
        <div class="w-[50%] max-md:w-full">
          <Input
            type="text"
            id="projectTitle"
            name="title"
            bind:value={project.title}
           
          />
        </div>
      </div>

      <div
        class="mt-9 flex w-full flex-row items-start justify-between max-md:flex-col max-md:items-start"
      >
        <div class="flex w-[45%] flex-col max-md:w-[100%]">
          <Label for="projectBio" class="font-basesemibold text- text-black">Project bio</Label>
          <p class="mt-2.5 text-sm text-stone-400">Give a short description of your project</p>
        </div>
        <div class="w-[50%] max-md:w-[100%]">
          <Textarea
            id="projectBio"
            name="bio"
            bind:value={project.bio}
            class="mt-2.5 min-h-[120px]"
            required
          ></Textarea>
        </div>
      </div>

      <div
        class="mt-9 flex w-full flex-row items-start justify-between max-md:flex-col max-md:items-start"
      >
        <div class="flex w-[45%] flex-col max-md:w-[100%]">
          <Label for="projectTags" class="text-base font-semibold text-black">Project tags</Label>
          <p class="mt-2.5 text-sm text-stone-400">
            Select the keywords that best describe your project.
          </p>
        </div>
        <div class="relative mt-2.5 w-[50%] max-md:w-full">
          <div
            class="flex min-h-[50px] flex-wrap items-center rounded-[31px] border-2 border-lime-800 bg-white px-6 py-3"
          >
            <div class="flex flex-grow flex-wrap items-center gap-2 pr-8">
              {#each selectedTags as tag}
                <span class="flex items-center rounded-full bg-lime-200 px-3 py-1 text-lime-800">
                  <img
                    src={tag.image}
                    alt={tag.title}
                    class="relative h-6 w-6 rounded border-2 shadow"
                  />

                  <button
                    on:click={() => removeTag(tag)}
                    class="ml-2 text-lime-800 hover:text-lime-900">×</button
                  >
                </span>
              {/each}
              <Input
                type="text"
                bind:value={inputValue}
                placeholder="Type to add tags"
                class="flex-grow rounded-[31px] border-none bg-transparent outline-none"
              />
              <input type="hidden" name="tags" value={JSON.stringify(selectedTags)} />
            </div>
            <button
              on:click={toggleDropdown}
              class="absolute right-4 top-1/2 -translate-y-1/2 transform focus:outline-none"
              aria-label="Toggle tag dropdown"
            >
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/5884aaa40d84100252b9385acefd99519ea142223ddf8cccbdc39ac10099df1f?placeholderIfAbsent=true&apiKey=567aaefef2da4f73a3149c6bc21f1ea8"
                alt="Dropdown arrow"
                class="h-5 w-5 object-contain transition-transform duration-200 {isOpen
                  ? 'rotate-180'
                  : ''}"
              />
            </button>
          </div>

          {#if isOpen}
            <div
              class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-300 bg-white shadow-lg"
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
        class="mt-12 flex w-full flex-row items-start justify-between max-md:flex-col max-md:items-start"
      >
        <div class="flex w-[40%] flex-col max-md:w-[100%]">
          <Label for="projectCountry" class="text-base font-semibold text-black"> Country </Label>
          <p class="mt-2.5 text-sm text-stone-400">
            Choose the location where you are running the project.
          </p>
        </div>
        <div class="w-[50%] max-md:w-full">
          <div class="relative flex h-[50px] items-center rounded-[75px] border-2 border-lime-800">
            <select
              id="projectCountry"
              name="country"
              bind:value={project.country}
              class="h-full w-full appearance-none border-none bg-transparent pl-4 pr-10 outline-none"
              required
            >
              <option value="" disabled selected hidden>--- Select a country ---</option>
              {#each countryList as countryOption (countryOption.name)}
                <option value={countryOption.name}>{countryOption.name}</option>
              {/each}
            </select>
          
            <Icon icon="radix-icons:caret-down" class="text-2xl" />
          </div>
        </div>
      </div>

      <div
        class="mt-9 flex w-full flex-row items-start justify-between max-md:flex-col max-md:items-start"
      >
        <div class="flex w-[45%] flex-col max-md:w-[100%]">
          <Label for="projectDetails" class="text-base font-semibold text-black">
            Project details
          </Label>
          <p class="mt-2.5 text-sm text-stone-400">
            Tell potential contributors more about your project. <br /> Provide details that will
            motivate people to contribute.
            <br /> A good pitch is compelling, informative, and easy to digest.
          </p>
        </div>
        <div class="w-[50%] max-md:w-full">
          <Textarea
            id="projectDetails"
            name="details"
            bind:value={project.details}
            class="mt-2.5 h-[140px] "
            required
          ></Textarea>
        </div>
      </div>
    </div>
  </div>
</section> 


<!-- 
<script>
  import { onMount } from 'svelte';
  import { countries } from 'countries-list';
  import Icon from '@iconify/svelte';
  import { Command, CommandInput, CommandList, CommandItem, CommandGroup } from "$lib/components/ui/command";
  import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "$lib/components/ui/select";
  import { Badge } from "$lib/components/ui/badge";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import { Checkbox } from "$lib/components/ui/checkbox";
  import { Textarea } from "$lib/components/ui/textarea";

  export let project = {};

  const countryList = Object.values(countries).sort((a, b) => a.name.localeCompare(b.name));

  let selectedTags = project.tags ? [...project.tags] : [];
  let availableTags = [];
  let inputValue = '';

  function addTag(tag) {
    if (!selectedTags.some((selected) => selected.title === tag.title)) {
      selectedTags = [...selectedTags, tag];
    }
    inputValue = '';
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
  class="flex w-full max-w-[1235px] flex-col self-center bg-white p-10 max-md:mt-10 max-md:max-w-full max-md:px-5"
>
  <div class="mt-55 flex w-full flex-col max-md:mt-10">
    <div class="flex w-full flex-col max-md:max-w-full">
      <div class="flex w-full flex-col items-start leading-none max-md:max-w-full">
        <div class="flex w-[409px] max-w-full flex-col">
          <h2 class="text-xl font-semibold text-black">Project Images</h2>
          <p class="mt-2.5 text-sm text-stone-300">
            Click to change Project's Cover & Profile photo
          </p>
        </div>
      </div>

      <div class="relative mb-[141px] h-[295.61px] self-stretch">
        <Label for="banner-upload" class="cursor-pointer">
          <div
            class="flex h-full w-full items-center justify-center overflow-hidden rounded-[37.69px] bg-[#d9d9d9]"
          >
            {#if ProjectBannerImage}
              <img src={ProjectBannerImage} alt="Banner" class="h-full w-full object-cover" />
            {:else}
              <div class="text-center">Click to upload banner image</div>
            {/if}
          </div>
        </Label>
        <input
          type="file"
          id="banner-upload"
          name="banner_image"
          class="hidden"
          accept={authorizedExtensions.join(',')}
          on:change={handleBannerUpload}
        />

        <Label for="profile-upload" class="cursor-pointer">
          <div
            class="absolute bottom-[-92.6px] left-[46.69px] flex h-[185.19px] w-[185.19px] items-center justify-center overflow-hidden rounded-full border-8 border-white bg-[#d9d9d9]"
          >
            {#if ProjectProfileImage}
              <img
                src={ProjectProfileImage}
                alt="Profile"
                class="h-full w-full rounded-full object-cover"
              />
            {:else}
              <div class="text-center text-sm">Click to upload profile picture</div>
            {/if}
          </div>
        </Label>
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

    <div class="mt-10 flex w-full flex-col justify-center max-md:mt-10 max-md:max-w-full">
      <div
        class="flex w-full flex-row items-start justify-between max-md:flex-col max-md:items-start"
      >
        <div class="flex flex-col">
          <Label for="projectTitle" class="text-base font-semibold text-black">Project title</Label>
          <p class="mt-2.5 text-sm text-stone-400">What is the title of your project</p>
        </div>
        <div class="w-[50%] max-md:w-full">
          <Input
            type="text"
            id="projectTitle"
            name="title"
            bind:value={project.title}
          />
        </div>
      </div>

      <div
        class="mt-9 flex w-full flex-row items-start justify-between max-md:flex-col max-md:items-start"
      >
        <div class="flex w-[45%] flex-col max-md:w-[100%]">
          <Label for="projectBio" class="font-basesemibold text- text-black">Project bio</Label>
          <p class="mt-2.5 text-sm text-stone-400">Give a short description of your project</p>
        </div>
        <div class="w-[50%] max-md:w-[100%]">
          <Textarea
            id="projectBio"
            name="bio"
            bind:value={project.bio}
            class="mt-2.5 min-h-[120px]"
            required
          ></Textarea>
        </div>
      </div>


      <div class="mt-9 flex w-full flex-row items-start justify-between max-md:flex-col max-md:items-start">
        <div class="flex w-[45%] flex-col max-md:w-[100%]">
          <Label for="projectTags" class="text-base font-semibold text-black">Project tags</Label>
          <p class="mt-2.5 text-sm text-stone-400">
            Select the keywords that best describe your project.
          </p>
        </div>
        <div class="w-[50%] max-md:w-full">
          <div class="flex flex-col space-y-2">
            <div class="flex flex-wrap gap-2">
              {#each selectedTags as tag}
                <Badge variant="outline" class="bg-lime-100 text-lime-800 border-lime-800">
                  {#if tag.image}
                    <img src={tag.image} alt={tag.title} class="mr-2 h-4 w-4 rounded" />
                  {/if}
                  {tag.title}
                  <button 
                    on:click={() => removeTag(tag)} 
                    class="ml-1 rounded-full hover:bg-lime-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                  </button>
                </Badge>
              {/each}
            </div>
            
            <div class="relative">
              <Command class="rounded-lg border border-lime-800">
                <CommandInput 
                  placeholder="Search tags..." 
                  bind:value={inputValue}
                  class="border-none focus:ring-0" 
                />
                <CommandList>
                  <CommandGroup heading="Available Tags">
                    {#each filteredTags as tag}
                      <CommandItem
                        onSelect={() => addTag(tag)}
                        class="cursor-pointer hover:bg-lime-100"
                      >
                        {#if tag.image}
                          <img src={tag.image} alt={tag.title} class="mr-2 h-5 w-5 rounded" />
                        {/if}
                        {tag.title}
                      </CommandItem>
                    {/each}
                  </CommandGroup>
                </CommandList>
              </Command>
              <input type="hidden" name="tags" value={JSON.stringify(selectedTags)} />
            </div>
          </div>
        </div>
      </div>


      <div class="mt-12 flex w-full flex-row items-start justify-between max-md:flex-col max-md:items-start">
        <div class="flex w-[40%] flex-col max-md:w-[100%]">
          <Label for="projectCountry" class="text-base font-semibold text-black">Country</Label>
          <p class="mt-2.5 text-sm text-stone-400">
            Choose the location where you are running the project.
          </p>
        </div>
        <div class="w-[50%] max-md:w-full">
          <Select name="country" bind:value={project.country}>
            <SelectTrigger class="h-[50px] rounded-[75px] border-2 border-lime-800">
              <SelectValue placeholder="Select a country" />
            </SelectTrigger>
            <SelectContent>
              {#each countryList as countryOption (countryOption.name)}
                <SelectItem value={countryOption.name}>{countryOption.name}</SelectItem>
              {/each}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div
        class="mt-9 flex w-full flex-row items-start justify-between max-md:flex-col max-md:items-start"
      >
        <div class="flex w-[45%] flex-col max-md:w-[100%]">
          <Label for="projectDetails" class="text-base font-semibold text-black">
            Project details
          </Label>
          <p class="mt-2.5 text-sm text-stone-400">
            Tell potential contributors more about your project. <br /> Provide details that will
            motivate people to contribute.
            <br /> A good pitch is compelling, informative, and easy to digest.
          </p>
        </div>
        <div class="w-[50%] max-md:w-full">
          <Textarea
            id="projectDetails"
            name="details"
            bind:value={project.details}
            class="mt-2.5 h-[140px] "
            required
          ></Textarea>
        </div>
      </div>
    </div>
  </div>
</section> -->