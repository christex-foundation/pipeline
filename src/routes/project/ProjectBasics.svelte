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

<section class="flex w-full max-w-[1235px] flex-col self-center bg-white p-6 md:p-10">
  <div class="flex flex-col w-full">
    <div class="flex flex-col w-full">
      <div class="flex flex-col items-start w-full leading-none">
        <div class="flex w-full flex-col md:w-[409px]">
          <h2 class="text-xl font-semibold text-black">Project Images</h2>
          <p class="mt-2.5 text-sm text-stone-300">
            Click to change Project's Cover & Profile photo
          </p>
        </div>
      </div>

      <div class="relative mb-24 h-[200px] self-stretch md:h-[295.61px]">
        <Label for="banner-upload" class="cursor-pointer">
          <div
            class="flex h-full w-full items-center justify-center overflow-hidden rounded-3xl bg-[#d9d9d9] md:rounded-[37.69px]"
          >
            {#if ProjectBannerImage}
              <img src={ProjectBannerImage} alt="Banner" class="object-cover w-full h-full" />
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
            class="absolute -bottom-16 left-4 flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-[#d9d9d9] md:bottom-[-92.6px] md:left-[46.69px] md:h-[185.19px] md:w-[185.19px] md:border-8"
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

    <div class="flex flex-col w-full gap-6 md:gap-9">
      <div class="flex flex-col md:flex-row md:items-start md:justify-between md:max-lg:flex-col">
        <div class="md:w-[45%] md:max-lg:w-full">
          <Label for="projectTitle" class="text-base font-semibold text-black">Project title</Label>
          <p class="mt-2.5 text-sm text-stone-400">What is the title of your project</p>
        </div>
        <div class="mt-4 md:mt-0 md:w-[50%] md:max-lg:w-full">
          <Input type="text" id="projectTitle" name="title" bind:value={project.title} />
        </div>
      </div>

      <div class="flex flex-col md:flex-row md:items-start md:justify-between md:max-lg:flex-col">
        <div class="md:w-[45%] md:max-lg:w-full">
          <Label for="projectBio" class="text-black font-basesemibold">Project bio</Label>
          <p class="mt-2.5 text-sm text-stone-400">Give a short description of your project</p>
        </div>
        <div class="mt-4 md:mt-0 md:w-[50%] md:max-lg:w-full">
          <Textarea
            id="projectBio"
            name="bio"
            bind:value={project.bio}
            class="min-h-[120px]"
            required
          ></Textarea>
        </div>
      </div>

      
      
      <div class="flex flex-col md:flex-row md:items-start md:justify-between md:max-lg:flex-col">
        <div class="md:w-[45%] md:max-lg:w-full">
          <Label for="projectTags" class="text-base font-semibold text-black">Project tags</Label>
          <p class="mt-2.5 text-sm text-stone-400">
            Select the keywords that best describe your project.
          </p>
        </div>
        <div class="mt-4 md:mt-0 md:w-[50%] md:max-lg:w-full">
          <div
            class="relative flex min-h-[50px] flex-wrap items-center rounded-3xl border-2 border-lime-800 bg-white px-4 py-3 md:px-6"
          >
            <div class="flex flex-wrap items-center flex-grow gap-2 pr-8">
              {#each selectedTags as tag}
                <span class="flex items-center px-3 py-1 rounded-full bg-lime-200 text-lime-800">
                  {#if tag.image}
                    <img
                      src={tag.image || '/placeholder.svg'}
                      alt={tag.title}
                      class="relative w-6 h-6 border-2 rounded shadow"
                    />
                  {/if}
                  <button
                    on:click={() => removeTag(tag)}
                    class="ml-2 text-lime-800 hover:text-lime-900">×</button
                  >
                </span>
              {/each}
              <Input
                type="text"
                bind:value={inputValue}
                on:click={() => (isOpen = true)}
                on:focus={() => (isOpen = true)}
                placeholder="Type to add tags"
                class="flex-grow bg-transparent border-none outline-none rounded-3xl focus-visible:ring-0"
              />
              <input type="hidden" name="tags" value={JSON.stringify(selectedTags)} />
            </div>

            <Popover bind:open={isOpen}>
              <PopoverTrigger>
                <button
                  class="absolute transform -translate-y-1/2 right-4 top-1/2 focus:outline-none"
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
              </PopoverTrigger>
              <PopoverContent
                class="w-[var(--radix-popover-trigger-width)] rounded-md border border-gray-300 bg-white p-0 shadow-lg"
              >
                <Command>
                  <CommandInput placeholder="Search tags..." />
                  <CommandEmpty>No tags found.</CommandEmpty>
                  <CommandGroup class="overflow-auto max-h-60">
                    {#each filteredTags as tag}
                      <CommandItem value={tag.title} onSelect={() => addTag(tag)}>
                        {#if tag.image}
                          <img
                            src={tag.image || '/placeholder.svg'}
                            alt={tag.title}
                            class="w-5 h-5 mr-2 rounded"
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
        </div>
      </div>


      <div class="flex flex-col md:flex-row md:items-start md:justify-between md:max-lg:flex-col">
        <div class="md:w-[40%] md:max-lg:w-full">
          <Label for="projectCountry" class="text-base font-semibold text-black">Country</Label>
          <p class="mt-2.5 text-sm text-stone-400">
            Choose the location where you are running the project.
          </p>
        </div>
        <div class="mt-4 md:mt-0 md:w-[50%] md:max-lg:w-full">
          <Popover>
            <PopoverTrigger class="w-full">
              <Button
                variant="outline"
                class="flex h-[50px] w-full items-center justify-between rounded-[75px] border-2 border-lime-800 bg-transparent pl-4 pr-3 hover:bg-transparent"
              >
                <span>
                  {project.country || '--- Select a country ---'}
                </span>
                <Icon icon="radix-icons:caret-down" class="text-2xl" />
              </Button>
            </PopoverTrigger>
            <PopoverContent class="w-[var(--radix-popover-trigger-width)] p-0">
              <Command>
                <CommandInput placeholder="Search country..." />
                <CommandEmpty>No country found.</CommandEmpty>
                <CommandGroup class="overflow-auto max-h-60">
                  {#each countryList as countryOption (countryOption.name)}
                    <CommandItem
                      value={countryOption.name}
                      onSelect={() => {
                        project.country = countryOption.name;
                      }}
                    >
                      {#if project.country === countryOption.name}
                        <Icon icon="mdi:check" class="w-4 h-4 mr-2" />
                      {:else}
                        <div class="w-4 h-4 mr-2"></div>
                      {/if}
                      {countryOption.name}
                    </CommandItem>
                  {/each}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>

          <!-- Add this hidden input to include country in form submission -->
          <input type="hidden" name="country" value={project.country || ''} />
        </div>
      </div>

      <div class="flex flex-col md:flex-row md:items-start md:justify-between md:max-lg:flex-col">
        <div class="md:w-[45%] md:max-lg:w-full">
          <Label for="projectDetails" class="text-base font-semibold text-black">
            Project details
          </Label>
          <p class="mt-2.5 text-sm text-stone-400 md:max-lg:w-full">
            Tell potential contributors more about your project. <br /> Provide details that will
            motivate people to contribute.
            <br /> A good pitch is compelling, informative, and easy to digest.
          </p>
        </div>
        <div class="mt-4 md:mt-0 md:w-[50%] md:max-lg:w-full">
          <Textarea
            id="projectDetails"
            name="details"
            bind:value={project.details}
            class="h-[140px]"
            required
          ></Textarea>
        </div>
      </div>
    </div>
  </div>
</section>
