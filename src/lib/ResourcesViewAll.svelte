<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import ResourceCard from './ResourceCard.svelte';
  import Icon from '@iconify/svelte';

  const dispatch = createEventDispatcher();

  function goBack() {
    dispatch('goBack');
  }

  const resources = [
    {
      id: 1,
      title: 'Onboading Demo video',
      author: 'Joseph Kerr',
      category: 'Media',
      description:
        'Nulla sit obcaecati Nulla sit obcaecati Nulla sit obcaecati Nulla sit obcaecati Nulla sit obcaecati Nulla sit obcaecati',
      imageUrl:
        'https://cdn.builder.io/api/v1/image/assets/TEMP/580f77e5-d2eb-430b-8974-3ed3b77829c8?placeholderIfAbsent=true&apiKey=567aaefef2da4f73a3149c6bc21f1ea8',
    },
    {
      id: 2,
      title: 'Marketing Flyer Design',
      author: 'Joseph Kerr',
      category: 'Design',
      description:
        'Nulla sit obcaecati Nulla sit obcaecati Nulla sit obcaecati Nulla sit obcaecati Nulla sit obcaecati Nulla sit obcaecati',
      imageUrl:
        'https://cdn.builder.io/api/v1/image/assets/TEMP/b31f7283-74b4-4669-b0f7-1cf219d8ccad?placeholderIfAbsent=true&apiKey=567aaefef2da4f73a3149c6bc21f1ea8',
    },
    {
      id: 3,
      title: 'UI/UX Case Study',
      author: 'Joseph Kerr',
      category: 'Document',
      description:
        'Nulla sit obcaecati Nulla sit obcaecati Nulla sit obcaecati Nulla sit obcaecati Nulla sit obcaecati Nulla sit obcaecati',
      imageUrl:
        'https://cdn.builder.io/api/v1/image/assets/TEMP/79e93884-0a53-4158-8d0b-6f18819002ac?placeholderIfAbsent=true&apiKey=567aaefef2da4f73a3149c6bc21f1ea8',
    },
    {
      id: 4,
      title: 'Onboading Demo video',
      author: 'Joseph Kerr',
      category: 'Media',
      description:
        'Nulla sit obcaecati Nulla sit obcaecati Nulla sit obcaecati Nulla sit obcaecati Nulla sit obcaecati Nulla sit obcaecati',
      imageUrl:
        'https://cdn.builder.io/api/v1/image/assets/TEMP/3108468c-54ac-442b-a540-6bc12e0ded13?placeholderIfAbsent=true&apiKey=567aaefef2da4f73a3149c6bc21f1ea8',
    },
  ];

  let searchTerm = '';
  let filteredResources = resources;

  $: filteredResources = resources.filter(
    (resource) =>
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.category.toLowerCase().includes(searchTerm.toLowerCase()),
  );
</script>

<div class="relative inline-flex h-[1639.94px] flex-col items-start justify-start gap-9">
  <button class="inline-flex items-center justify-start gap-1 self-stretch" on:click={goBack}>
    <div
      class="flex items-center justify-center gap-1 rounded-[39.71px] border-2 border-[#516027] py-2 pl-1 pr-4"
    >
      <Icon icon="material-symbols-light:chevron-left" class="text-2xl" />
      <span class="text-center font-['Inter'] text-[13px] font-bold leading-[13px] text-[#516027]">
        Back
      </span>
    </div>
  </button>

  <div class="flex h-[1567.94px] flex-col items-start justify-start gap-5 self-stretch">
    <div class="flex items-center justify-between self-stretch">
      <div class="w-[258px] font-['Inter'] text-[23px] font-semibold leading-7 text-black">
        All Project Resources
      </div>

      <div class="flex items-center gap-2">
        <div
          class="flex h-9 items-center justify-between rounded-[39.71px] border border-[#e2e2e2] py-2 pl-4 pr-3"
        >
          <input
            type="text"
            bind:value={searchTerm}
            placeholder="Search Resources"
            class="border-none text-start font-['Inter'] text-[13px] font-normal leading-tight tracking-tight text-[#a0a0a0]"
          />
          <Icon icon="mdi:search" text="text-2xl" />
        </div>
      </div>
    </div>

    <div class="mt-5 flex w-full flex-wrap items-start gap-4 max-md:max-w-full">
      {#each filteredResources as resource (resource.id)}
        <ResourceCard {...resource} />
      {/each}
    </div>
  </div>
</div>
