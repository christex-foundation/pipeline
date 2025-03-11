<script>
  import Icon from '@iconify/svelte';

  export let rating;
</script>

<div class="flex items-center gap-3.5 self-start text-2xl leading-none text-neutral-400">
  <div class="my-auto flex items-center gap-1 self-stretch">
    <Icon icon="tabler:checkbox" class="text-2xl" />
    <div class="my-auto self-stretch">
      <span class="text-xl font-semibold text-neutral-400">{rating || 0} </span>
      <!-- <span class="text-base text-neutral-400">out of</span>
        <span class="text-base font-extrabold text-neutral-400"> {total}</span> -->
    </div>
  </div>
</div>
