<script>
  import Icon from '@iconify/svelte';

  export let project;
</script>

<!-- dpgStatuses -->
<section class="flex flex-col mt-8 w-full max-w-[1000px] mx-auto text-black">
  <h2 class="mb-6 ml-4 text-2xl font-semibold">DPG Registry Status: {project.dpgCount}/9</h2>
  <ul class="flex flex-col w-full text-lg">
    {#each project.dpgStatuses as dpg}
      <li
        class="flex items-center w-full px-6 py-4 mb-3 border-2 border-solid rounded-3xl border-stone-300"
      >
        <Icon icon="tabler:checkbox" class="text-2xl" />
        <label for="sdg" class="flex-grow ml-2">{dpg.name}</label>
      </li>
    {/each}
  </ul>
</section>
