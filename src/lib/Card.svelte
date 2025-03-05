<script>
  import ProgressBar from './ProgressBar.svelte';
  import ContributeButton from './ContributeButton.svelte';
  import CategoryTag from './CategoryTag.svelte';
  import DPGRating from './DPGRating.svelte';
  import { amountFormat } from '$lib/utils/amountFormat.js';

  import { onMount } from 'svelte';
  let isOpen = false;

  function toggleDropdown() {
    isOpen = !isOpen;
  }

  function closeDropdown(event) {
    if (event.target.closest('.dropdown-container')) return;
    isOpen = false;
  }

  export let project;

  const getImageLink = () => {
    return project.banner_image
      ? project.banner_image
      : 'https://zyfpmpmcpzmickajgkwp.supabase.co/storage/v1/object/public/pipeline-images/defaults/banner.png?t=2024-11-20T15%3A45%3A51.937Z';
  };

  onMount(() => {
    document.addEventListener('click', closeDropdown);
    return () => {
      document.removeEventListener('click', closeDropdown);
    };
  });
</script>

<div class="flex flex-col overflow-hidden bg-gray-200 rounded-3xl">
  <header class="relative pt-[75%]">
    <a href="/project/{project.id}" class="absolute inset-0 flex items-center justify-center">
      <div class="h-[90%] w-[95%] overflow-hidden rounded-3xl">
        <img loading="lazy" src={getImageLink()} alt="" class="object-cover w-full h-full" />
      </div>
    </a>
  </header>

  <div class="p-4 mt-auto">
    <div class="flex items-center justify-between mb-2">
      <a href="/project/{project.id}">
        <h2 class="text-xl font-semibold text-black">{project.title}</h2>
      </a>
      <p class="text-xs text-neutral-400">
        <DPGRating rating={project.dpgStatusCount} />
      </p>
    </div>

    <div class="mb-4 ml-[-2px] flex gap-2">
      {#each project?.tags || [] as tag}
        <CategoryTag {tag} />
      {/each}
    </div>

    <div>
      <span class="text-sm font-semibold">${amountFormat(project.current_funding || 0)}</span>
      raised of
      <span class="text-sm font-semibold">${amountFormat(project.funding_goal || 0)}</span>
    </div>
    <ProgressBar progress={project.current_funding} total={project.funding_goal} />
    <ContributeButton {project} />
  </div>
</div>
