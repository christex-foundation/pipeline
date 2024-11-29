<script>
  import Icon from '@iconify/svelte';

  export let rating;
</script>

<div class="flex gap-3.5 items-center self-start text-2xl leading-none text-neutral-400">
  <div class="flex items-center self-stretch gap-1 my-auto">
    <Icon icon="tabler:checkbox" class="text-2xl" />
    <div class="self-stretch my-auto">
      <span class="text-xl font-semibold text-neutral-400">{rating} </span>
      <!-- <span class="text-base text-neutral-400">out of</span>
        <span class="text-base font-extrabold text-neutral-400"> {total}</span> -->
    </div>
  </div>
</div>
