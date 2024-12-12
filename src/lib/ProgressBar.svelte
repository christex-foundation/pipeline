<script>
  export let progress;
  export let total;

  $: percentage = (progress / total) * 100;
</script>

<div class="mt-2 flex w-full flex-col rounded-lg">
  <div
    class="flex flex-col items-start justify-center rounded-lg border-2 border-[#bde25b] bg-[#e9f5d3] py-px max-md:pr-5"
  >
    <div
      class="flex h-[11px] shrink-0 rounded-lg bg-[#bde25b]"
      style="width: {percentage}%"
      aria-valuenow={percentage}
      aria-valuemin="0"
      aria-valuemax="100"
      role="progressbar"
    />
  </div>
</div>
