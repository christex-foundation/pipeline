<script>
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
  <button class="inline-flex items-center justify-start gap-1 self-stretch" on:click={goBack}>
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
    <div class="flex items-center justify-between self-stretch">
      <!-- Title -->
      <div class="w-[258px] font-['Inter'] text-[23px] font-semibold leading-7 text-black">
        All Github Contributors
      </div>

      <!-- Search & Filter Container -->
      <div class="flex items-center gap-2">
        <!-- Search Input -->
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

    <div class="mt-5 grid w-full grid-cols-2 items-start gap-4 max-md:max-w-full">
      {#each contributors as contributor}
        <GitContributors {contributor} {totalCommits} />
      {/each}
    </div>
  </div>
</div>
