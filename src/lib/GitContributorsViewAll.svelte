<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import GitContributors from '$lib/GitContributors.svelte';
  import { page } from '$app/stores';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Card } from '$lib/components/ui/card';
  import Icon from '@iconify/svelte';

  const dispatch = createEventDispatcher();

  function goBack() {
    dispatch('goBack');
  }

  const githubLinkSplit = $page.data?.project?.github?.split('/') || [];
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

  let contributors = [];
  let searchQuery = '';

  $: totalCommits = Array.isArray(contributors)
    ? contributors.reduce((prev, curr) => prev + curr.contributions, 0)
    : 0;

  $: filteredContributors = Array.isArray(contributors)
    ? contributors.filter((contributor) =>
        contributor.login?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : [];

  onMount(async () => {
    contributors = await fetchContribs();
  });
</script>

<div class="relative flex w-full flex-col items-start gap-6">
  <Button
    variant="outline"
    on:click={() => {
      goBack();
    }}
    class="flex items-center gap-1 rounded-full border-2 border-[#516027] px-4 py-2 hover:bg-[#f5f8e9]"
  >
    <Icon icon="material-symbols-light:chevron-left" class="text-2xl" />
    <span class="text-sm font-bold text-[#516027]">Back</span>
  </Button>

  <div class="flex w-full flex-col items-start gap-5">
    <div class="flex w-full flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <h2 class="text-xl font-semibold text-black md:text-2xl">All Github Contributors</h2>

      <div class="relative flex w-full items-center md:w-72">
        <Input
          bind:value={searchQuery}
          type="text"
          placeholder="Search Contributors"
          class="w-full pl-4 pr-10"
        />
        <Icon icon="mdi:search" class="absolute right-3 text-xl text-gray-500" />
      </div>
    </div>

    <Card class="w-full border-0 p-0 shadow-none">
      <div class="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
        {#if filteredContributors && filteredContributors.length > 0}
          {#each filteredContributors as contributor}
            <GitContributors {contributor} {totalCommits} />
          {/each}
        {:else}
          <div class="col-span-2 flex w-full items-center justify-center py-8">
            <p class="text-gray-500">No contributors found</p>
          </div>
        {/if}
      </div>
    </Card>
  </div>
</div>
