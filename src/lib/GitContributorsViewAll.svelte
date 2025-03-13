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

 <div class="relative inline-flex h-[1639.94px] flex-col items-start justify-start gap-9 max-md:w-full w-[70%]">
  <button class="inline-flex items-center gap-1" on:click={goBack}>
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
    <div class="flex items-center self-stretch justify-between max-md:flex-wrap">
      <div class="w-full font-['Inter'] text-[18px] md:text-[23px] font-semibold leading-7 text-black">
        All Github Contributors
      </div>

      <div class="flex items-center w-full gap-2 md:w-auto">
        <div
          class="flex h-9 items-center justify-between rounded-[39.71px] border border-[#e2e2e2] py-2 pl-4 pr-3 w-full md:w-[250px]"
        >
          <input
            type="text"
            placeholder="Search Contributors"
            class="border-none text-start font-['Inter'] text-[13px] font-normal leading-tight tracking-tight text-[#a0a0a0] w-full"
          />
          <Icon icon="mdi:search" class="text-2xl" />
        </div>
      </div>
    </div>

  <div class="relative z-0 grid w-full grid-cols-2 gap-4 mt-5 max-md:grid-cols-1 max-md:place-items-center">
    {#if contributors && contributors.length > 0}
    {#each contributors as contributor}
      <GitContributors {contributor} {totalCommits} />
    {/each}
  {:else}
    <div class="flex items-center justify-center w-full py-8">
      <p class="text-lg text-gray-500">No contributors found</p>
    </div>
  {/if}
  </div>
  </div>
</div>


