<script>
  import ProgressBar from './ProgressBar.svelte';
  import ContributeButton from './ContributeButton.svelte';
  import CategoryTag from './CategoryTag.svelte';
  import DPGRating from './DPGRating.svelte';
  import { amountFormat } from '$lib/utils/amountFormat.js';
  import { Card, CardHeader, CardContent, CardFooter } from '$lib/components/ui/card';
  import { Progress } from '$lib/components/ui/progress';

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

  function truncateText(text, maxLength = 20) {
    if (!text) return '';
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + '...';
    }
    return text;
  }
</script>

<Card class="flex flex-col h-full overflow-hidden bg-gray-200 rounded-3xl">
  <CardHeader class="relative p-0 pt-[75%]">
    <a href="/project/{project.id}" class="absolute inset-0 flex items-center justify-center">
      <div class="h-[90%] w-[95%] overflow-hidden rounded-3xl">
        <img
          loading="lazy"
          src={getImageLink()}
          alt={project.title}
          class="object-cover w-full h-full"
        />
      </div>
    </a>
  </CardHeader>

  <CardContent class="flex flex-col justify-between flex-grow p-4">
    <div>
      <div class="flex items-center justify-between gap-2 mb-2">
        <a href="/project/{project.id}">
          <h2 class="text-xl font-semibold text-black">{truncateText(project.title)}</h2>
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
    </div>

    <div class="mt-auto">
      <div>
        <span class="text-sm font-semibold">${amountFormat(project.current_funding || 0)}</span>
        raised of
        <span class="text-sm font-semibold">${amountFormat(project.funding_goal || 0)}</span>
      </div>
      <Progress value={(project.current_funding / project.funding_goal) * 100} class="h-2 mt-2" />
    </div>
  </CardContent>

  <CardFooter class="flex justify-center p-4">
    <ContributeButton {project} />
  </CardFooter>
</Card>
