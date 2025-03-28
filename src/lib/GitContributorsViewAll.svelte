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

  $: totalCommits = contributors.reduce((prev, curr) => prev + curr.contributions, 0);
  $: filteredContributors = contributors.filter(contributor => 
    contributor.login.toLowerCase().includes(searchQuery.toLowerCase())
  );

  onMount(async () => {
    contributors = await fetchContribs();
  });
</script>

<div class="relative flex flex-col items-start w-full gap-6">
  <Button
    variant="outline" 
    on:click={goBack}
    class="flex items-center gap-1 border-2 border-[#516027] hover:bg-[#f5f8e9] rounded-full px-4 py-2"
  >
    <Icon icon="material-symbols-light:chevron-left" class="text-2xl" />
    <span class="text-sm font-bold text-[#516027]">Back</span>
  </Button>
  
  <div class="flex flex-col items-start w-full gap-5">
    <div class="flex flex-col w-full gap-4 md:flex-row md:items-center md:justify-between">
      <h2 class="text-xl font-semibold text-black md:text-2xl">
        All Github Contributors
      </h2>
    
      <div class="relative flex items-center w-full md:w-72">
        <Input
          bind:value={searchQuery}
          type="text"
          placeholder="Search Contributors"
          class="w-full pl-4 pr-10"
        />
        <Icon icon="mdi:search" class="absolute text-xl text-gray-500 right-3" />
      </div>
    </div>

    <Card class="w-full p-0 border-0 shadow-none">
      <div class="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
        {#if filteredContributors && filteredContributors.length > 0}
          {#each filteredContributors as contributor}
            <GitContributors {contributor} {totalCommits} />
          {/each}
        {:else}
          <div class="flex items-center justify-center w-full col-span-2 py-8">
            <p class="text-gray-500">
              No contributors found
            </p>
          </div>
        {/if}
      </div>
    </Card>
  </div>
</div>