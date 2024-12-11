<script>
  export let project;
  import { timeAgo } from '$lib/utils/dateTimeFormat.js';
  let date;

  $: date = timeAgo(project.updated_at);
</script>

<article class="flex flex-col w-full mb-10">
  <div class="flex justify-between">
    <h2 class="text-2xl font-semibold leading-none text-black max-md:max-w-full">About Project</h2>
    <p>Last modified: {date}</p>
  </div>
  <p class="mt-3 text-base leading-7 text-neutral-700 max-md:max-w-full">
    {project.details || 'Project bio'}
  </p>
</article>
