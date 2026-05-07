<script>
  import { onMount } from 'svelte';
  import { countries } from 'countries-list';
  import Icon from '@iconify/svelte';

  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Textarea } from '$lib/components/ui/textarea';
  import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
  } from '$lib/components/ui/command';
  import { Popover, PopoverContent, PopoverTrigger } from '$lib/components/ui/popover';

  export let project = {};
  export let availableTags = [];

  const countryList = Object.values(countries).sort((a, b) => a.name.localeCompare(b.name));

  let selectedTags = project.tags ? [...project.tags] : [];

  let isOpen = false;
  let inputValue = '';

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
    } catch (error) {
      console.error('Failed to load project categories:', error);
    }
  }

  onMount(async () => {
    if (!availableTags.length) {
      await fetchAllCategories();
    }
  });
</script>

<div class="w-full space-y-8">
  <!-- Project Images Section -->
  <div class="space-y-4">
    <div class="space-y-2">
      <h3 class="text-label-lg font-semibold text-white">Project Images</h3>
      <p class="text-body-sm text-gray-300">
        Upload your project's banner and profile images to make it stand out
      </p>
    </div>

    <div class="relative mb-16 h-[250px] md:h-[320px]">
      <Label for="banner-upload" class="cursor-pointer">
        <div
          class="flex h-full w-full items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-dashboard-gray-600 bg-dashboard-gray-800 transition-colors duration-200 hover:border-dashboard-gray-500"
        >
          {#if ProjectBannerImage}
            <img
              src={ProjectBannerImage}
              alt="Banner"
              class="h-full w-full rounded-2xl object-cover"
            />
          {:else}
            <div class="p-8 text-center">
              <div class="mb-2 text-gray-400">
                <Icon icon="lucide:image-plus" class="mx-auto h-12 w-12" />
              </div>
              <p class="text-body-lg font-medium text-gray-300">Click to upload banner image</p>
              <p class="mt-1 text-body-sm text-gray-400">PNG, JPG, WEBP up to 10MB</p>
            </div>
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
          class="absolute -bottom-12 left-6 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-dashboard-gray-700 bg-dashboard-gray-800 shadow-xl transition-shadow duration-200 hover:shadow-2xl"
        >
          {#if ProjectProfileImage}
            <img
              src={ProjectProfileImage}
              alt="Profile"
              class="h-full w-full rounded-full object-cover"
            />
          {:else}
            <div class="p-2 text-center">
              <div class="mb-1 text-gray-400">
                <Icon icon="lucide:user" class="mx-auto h-6 w-6" />
              </div>
              <p class="text-label-sm font-medium text-gray-300">Profile</p>
            </div>
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

  <!-- Form Fields -->
  <div class="space-y-6">
    <!-- Project Title -->
    <div class="mt-16 space-y-2">
      <Label for="projectTitle" class="block text-label-lg font-medium text-gray-300">
        Project Title *
      </Label>
      <Input
        type="text"
        id="projectTitle"
        name="title"
        bind:value={project.title}
        placeholder="Enter your project title"
        class="w-full rounded-lg border border-dashboard-gray-600 bg-dashboard-gray-800 px-4 py-3 text-body-lg text-white focus:border-transparent focus:outline-none focus:ring-2 focus:ring-dashboard-purple-500"
        required
      />
      <p class="text-body-sm text-gray-400">Choose a clear, descriptive title for your project</p>
    </div>

    <!-- Project Tags -->
    <div class="space-y-2">
      <Label for="projectTags" class="block text-label-lg font-medium text-gray-300"
        >Project Tags</Label
      >
      <div
        class="relative flex min-h-[60px] w-full flex-wrap items-center rounded-lg border border-dashboard-gray-600 bg-dashboard-gray-800 px-4 py-3 transition-colors duration-200 focus-within:border-transparent focus-within:ring-2 focus-within:ring-dashboard-purple-500"
      >
        <div class="flex flex-grow flex-wrap items-center gap-2 pr-8">
          {#each selectedTags as tag}
            <span
              class="flex items-center rounded-lg bg-dashboard-purple-400 px-3 py-1 text-label-md font-medium text-dashboard-purple-900"
            >
              {#if tag.image}
                <img
                  src={tag.image || '/placeholder.svg'}
                  alt={tag.title}
                  class="mr-2 h-4 w-4 rounded"
                />
              {/if}
              {tag.title}
              <button
                type="button"
                on:click={() => removeTag(tag)}
                class="ml-2 text-sm font-bold leading-none text-dashboard-purple-900 hover:text-dashboard-purple-800"
              >
                ×
              </button>
            </span>
          {/each}
          <Input
            type="text"
            bind:value={inputValue}
            on:click={() => (isOpen = true)}
            on:focus={() => (isOpen = true)}
            placeholder="Type to add tags..."
            class="flex-grow border-none bg-transparent p-0 text-body-lg text-white outline-none focus-visible:ring-0"
          />
          <input type="hidden" name="tags" value={JSON.stringify(selectedTags)} />
        </div>

        <Popover bind:open={isOpen}>
          <PopoverTrigger>
            <button
              type="button"
              class="absolute right-4 top-1/2 -translate-y-1/2 transform rounded-md p-1 hover:bg-dashboard-gray-700 focus:outline-none"
              aria-label="Toggle tag dropdown"
            >
              <Icon
                icon="lucide:chevron-down"
                class="h-5 w-5 text-gray-400 transition-transform duration-200 {isOpen
                  ? 'rotate-180'
                  : ''}"
              />
            </button>
          </PopoverTrigger>
          <PopoverContent
            class="w-[var(--radix-popover-trigger-width)] rounded-lg border border-dashboard-gray-600 bg-dashboard-gray-800 p-0 shadow-xl"
          >
            <Command class="bg-dashboard-gray-800">
              <CommandInput
                placeholder="Search tags..."
                class="border-none bg-dashboard-gray-800 text-white"
              />
              <CommandEmpty class="text-gray-400">No tags found.</CommandEmpty>
              <CommandGroup class="max-h-60 overflow-auto">
                {#each filteredTags as tag}
                  <CommandItem
                    value={tag.title}
                    onSelect={() => addTag(tag)}
                    class="cursor-pointer text-gray-300 hover:bg-dashboard-gray-700 hover:text-white"
                  >
                    {#if tag.image}
                      <img
                        src={tag.image || '/placeholder.svg'}
                        alt={tag.title}
                        class="mr-2 h-5 w-5 rounded"
                      />
                    {/if}
                    {tag.title}
                  </CommandItem>
                {/each}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      <p class="text-body-sm text-gray-400">
        Select keywords that best describe your project category and focus
      </p>
    </div>

    <!-- Country -->
    <div class="space-y-2">
      <Label for="projectCountry" class="block text-label-lg font-medium text-gray-300"
        >Country *</Label
      >
      <Popover>
        <PopoverTrigger class="w-full">
          <Button
            variant="outline"
            class="flex w-full items-center justify-between rounded-lg border border-dashboard-gray-600 bg-dashboard-gray-800 px-4 py-3 text-body-lg hover:bg-dashboard-gray-700 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-dashboard-purple-500"
          >
            <span class="text-left {project.country ? 'text-white' : 'text-gray-400'}">
              {project.country || 'Select a country...'}
            </span>
            <Icon icon="lucide:chevron-down" class="h-5 w-5 text-gray-400" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          class="w-[var(--radix-popover-trigger-width)] rounded-lg border border-dashboard-gray-600 bg-dashboard-gray-800 p-0 shadow-xl"
        >
          <Command class="bg-dashboard-gray-800">
            <CommandInput
              placeholder="Search country..."
              class="border-none bg-dashboard-gray-800 text-white"
            />
            <CommandEmpty class="text-gray-400">No country found.</CommandEmpty>
            <CommandGroup class="max-h-60 overflow-auto">
              {#each countryList as countryOption (countryOption.name)}
                <CommandItem
                  value={countryOption.name}
                  onSelect={() => {
                    project.country = countryOption.name;
                  }}
                  class="cursor-pointer text-gray-300 hover:bg-dashboard-gray-700 hover:text-white"
                >
                  {#if project.country === countryOption.name}
                    <Icon icon="lucide:check" class="mr-2 h-4 w-4 text-dashboard-purple-400" />
                  {:else}
                    <div class="mr-2 h-4 w-4"></div>
                  {/if}
                  {countryOption.name}
                </CommandItem>
              {/each}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      <input type="hidden" name="country" value={project.country || ''} />
      <p class="text-body-sm text-gray-400">
        Choose the location where you are running the project
      </p>
    </div>

    <!-- Project Details -->
    <div class="space-y-2">
      <Label for="projectDetails" class="block text-label-lg font-medium text-gray-300">
        Project Details *
      </Label>
      <Textarea
        id="projectDetails"
        name="details"
        bind:value={project.details}
        placeholder="Tell potential contributors more about your project. Provide details that will motivate people to contribute..."
        class="min-h-[180px] w-full resize-none rounded-lg border border-dashboard-gray-600 bg-dashboard-gray-800 px-4 py-3 text-body-lg text-white focus:border-transparent focus:outline-none focus:ring-2 focus:ring-dashboard-purple-500"
        required
      />
      <p class="text-body-sm text-gray-400">
        A compelling pitch that's informative and easy to digest. Explain what makes your project
        special and why people should contribute.
      </p>
    </div>
  </div>
</div>
