<script>
  import Icon from '@iconify/svelte';

  export let project;
</script>

<!-- dpgStatuses -->
<section class="mx-auto mt-8 flex w-full max-w-[1000px] flex-col text-black">
  <h2 class="mb-6 ml-4 text-2xl font-semibold">DPG Registry Status: {project.dpgCount}/9</h2>
  <ul class="flex w-full flex-col text-lg">
    {#each project.dpgStatuses as dpg}
      <li
        class="mb-3 flex w-full items-center rounded-3xl border-2 border-solid border-stone-300 px-6 py-4"
      >
        <Icon icon="tabler:checkbox" class="text-2xl" />
        <label for="sdg" class="ml-2 flex-grow">{dpg.name}</label>
      </li>
    {/each}
  </ul>
</section>
