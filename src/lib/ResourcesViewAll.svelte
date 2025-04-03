<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import ResourceCard from './ResourceCard.svelte';
  import Icon from '@iconify/svelte';
  import { Button } from '$lib/components/ui/button';

  const dispatch = createEventDispatcher();

  function goBack() {
    dispatch('goBack');
  }

  export let resources = [];

  let searchTerm = '';
  let filteredResources = resources;

  $: filteredResources = resources.filter(
    (resource) =>
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.category.toLowerCase().includes(searchTerm.toLowerCase()),
  );
</script>

<div
  class="relative inline-flex h-[1639.94px] w-[70%] flex-col items-start justify-start gap-9 max-md:w-full"
>
  <Button class="inline-flex items-center gap-1" on:click={goBack}>
    <div
      class="flex items-center justify-center gap-1 rounded-[39.71px] border-2 border-[#516027] py-2 pl-1 pr-4"
    >
      <Icon icon="material-symbols-light:chevron-left" class="text-2xl" />
      <span class="text-center font-['Inter'] text-[13px] font-bold leading-[13px] text-[#516027]">
        Back
      </span>
    </div>
  </Button>

  <div class="flex h-[1567.94px] flex-col items-start justify-start gap-5 self-stretch">
    <div class="flex items-center self-stretch justify-between max-md:flex-wrap">
      <div
        class="w-full font-['Inter'] text-[18px] font-semibold leading-7 text-black md:text-[23px]"
      >
        All Project Resources
      </div>

      <div class="flex items-center w-full gap-2 md:w-auto">
        <div
          class="flex h-9 w-full items-center justify-between rounded-[39.71px] border border-[#e2e2e2] py-2 pl-4 pr-3 md:w-[250px]"
        >
          <input
            type="text"
            bind:value={searchTerm}
            placeholder="Search Resources"
            class="w-full border-none text-start font-['Inter'] text-[13px] font-normal leading-tight tracking-tight text-[#a0a0a0]"
          />
          <Icon icon="mdi:search" class="text-2xl" />
        </div>
      </div>
    </div>

    <div class="flex flex-wrap items-start w-full gap-4">
      {#if filteredResources.length > 0}
        <div class="flex flex-wrap items-start w-full gap-4">
          {#each filteredResources as resource (resource.id)}
            <ResourceCard {...resource} />
          {/each}
        </div>
      {:else}
        <p class="w-full text-center font-['Inter'] text-[16px] text-gray-500">
          No resources found.
        </p>
      {/if}
    </div>
  </div>
</div>
