<!-- <script>
  import { createEventDispatcher, onMount } from 'svelte';
  import GitContributors from '$lib/GitContributors.svelte';
  import Icon from '@iconify/svelte';
  import { page } from '$app/stores';

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

  $: totalCommits = contributors.reduce((prev, curr) => prev + curr.contributions, 0);

  onMount(async () => {
    contributors = await fetchContribs();
  });
</script>

<div class="relative inline-flex h-[1639.94px] flex-col items-start justify-start gap-9">
  <button class="inline-flex items-center self-stretch justify-start gap-1" on:click={goBack}>
    <div
      class="flex items-center justify-center gap-1 rounded-[39.71px] border-2 border-[#516027] py-2 pl-1 pr-4"
    >
      <Icon icon="material-symbols-light:chevron-left" class="text-2xl" />
      <span class="text-center font-['Inter'] text-[13px] font-bold leading-[13px] text-[#516027]"
        >Back</span
      >
    </div>
  </button>
  <div class="flex h-[1567.94px] flex-col items-start justify-start gap-5 self-stretch">
    <div class="flex items-center self-stretch justify-between">
   
      <div class="w-[258px] font-['Inter'] text-[23px] font-semibold leading-7 text-black">
        All Github Contributors
      </div>


      <div class="flex items-center gap-2">
        <div
          class="flex h-9 items-center justify-between rounded-[39.71px] border border-[#e2e2e2] py-2 pl-4 pr-3"
        >
          <input
            type="text"
            placeholder="Search Contributors"
            class="border-none text-center font-['Inter'] text-[13px] font-normal leading-tight tracking-tight text-[#a0a0a0]"
          />
          <Icon icon="mdi:search" text="text-2xl" />
        </div>
      </div>
    </div>

    <div class="grid items-start w-full grid-cols-2 gap-4 mt-5 max-md:max-w-full">
      {#each contributors as contributor}
        <GitContributors {contributor} {totalCommits} />
      {/each}
    </div>
  </div>
</div> -->

<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import GitContributors from '$lib/GitContributors.svelte';
  import { page } from '$app/stores';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Card } from '$lib/components/ui/card';
  import { ChevronLeft, Search } from 'lucide-react';
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

  $: totalCommits = contributors.reduce((prev, curr) => prev + curr.contributions, 0);

  onMount(async () => {
    contributors = await fetchContribs();
  });
</script>

<div class="relative inline-flex flex-col items-start justify-start w-full h-full gap-9">
  <button 
    variant="outline" 
    class="inline-flex items-center justify-start py-2 pl-1 pr-4 bg-transparent border-2 rounded-full border-olive-700 hover:bg-olive-50" 
    on:click={goBack}
  >
  <Icon icon="material-symbols-light:chevron-left" class="text-2xl" />
    <span class="text-xs font-bold text-center text-olive-700">Back</span>
</button>
  
  <div class="flex flex-col items-start justify-start w-full gap-5">
    <div class="flex items-center justify-between w-full">
      <div class="text-xl font-semibold text-black">
        All Github Contributors
      </div>
    
      <div class="flex items-center gap-2">
        <div class="relative flex items-center w-72"> 
          <Input
            type="text"
            placeholder="Search Contributors"
            class="w-full h-10 pl-4 pr-12 text-sm text-gray-600 border border-gray-300 rounded-full"
          />
          <Icon icon="mdi:search" class="absolute text-2xl text-gray-500 right-3" />
        </div>
      </div>
    </div>

    
    <Card class="w-full p-0 mt-5 border-0 shadow-none">
      <div class="grid items-start w-full grid-cols-2 gap-4 max-md:max-w-full">
        {#each contributors as contributor}
          <GitContributors {contributor} {totalCommits} />
        {/each}
      </div>
    </Card>
  </div>
</div>
