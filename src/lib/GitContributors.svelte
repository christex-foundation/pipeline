<script>
  import Icon from '@iconify/svelte';

  export let contributor;
  export let totalCommits = 0;
</script>

<div
  class="relative z-10 flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-6 text-[#0B383C] shadow-lg"
>
  <img
    src={contributor.avatar_url}
    alt="{contributor.login}'s avatar"
    class="h-16 w-16 rounded-full border-2 border-[#0B383C] shadow-md"
  />

  <div class="ml-4 flex w-full flex-col">
    <a
      href={contributor.html_url}
      target="_blank"
      class="flex items-center gap-2 text-lg font-semibold text-[#0B383C] hover:underline"
    >
      {contributor?.login}
      <Icon icon="ion:arrow-up-right-box-outline" class="text-2xl" />
    </a>

    <div class="mt-1 flex items-center gap-2 text-sm">
      <span class="rounded-lg bg-[#0B383C] px-3 py-1 text-xs font-medium text-white"
        >Commits: {contributor?.contributions}</span
      >
    </div>

    <div class="border-1 mt-2 h-2 w-full rounded-full border-[#bde25b] bg-[#e9f5d3]">
      <div
        class="h-2 rounded-full bg-[#bde25b] transition-all duration-500"
        style="width: {Math.min((contributor?.contributions / totalCommits) * 100, 100)}%"
      ></div>
    </div>
  </div>
</div>
