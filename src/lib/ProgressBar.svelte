<script>
  export let progress;
  export let total;

  $: percentage = (progress / total) * 100;
</script>

<div class="flex flex-col w-full mt-2 rounded-lg">
  <div
    class="flex flex-col items-start justify-center py-px border-2 rounded-lg bg-[#e9f5d3] border-[#bde25b] max-md:pr-5"
  >
    <div
      class="flex shrink-0 bg-[#bde25b] rounded-lg h-[11px]"
      style="width: {percentage}%"
      aria-valuenow={percentage}
      aria-valuemin="0"
      aria-valuemax="100"
      role="progressbar"
    />
  </div>
</div>
