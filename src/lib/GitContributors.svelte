
<script>
  export let name;
  export let githubLink;
  export let commits;
  export let avatarUrl;
  export let totalCommits; 
</script>


<div class="relative flex items-center gap-3 text-[#0B383C] border border-gray-200 shadow-lg p-6 bg-white rounded-2xl">

  <img src={avatarUrl} alt="Avatar" class="border-2 border-[#0B383C] rounded-full shadow-md w-16 h-16" />


  <div class="flex flex-col w-full ml-4">

    <a href={githubLink} target="_blank" class="flex items-center gap-2 text-lg font-semibold text-[#0B383C] hover:underline">
      {name}
      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 ml-auto text-[#0B383C]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M14 3h7v7"></path>
        <path d="M10 14 21 3"></path>
        <path d="M21 21H3V3"></path>
      </svg>
    </a>


    <div class="flex items-center gap-2 mt-1 text-sm">
      <span class="px-3 py-1 text-xs font-medium text-white bg-[#0B383C] rounded-lg">Commits: {commits}</span>
    </div>


    <div class="w-full h-2 mt-2 bg-[#e9f5d3] rounded-full border-1 border-[#bde25b]">
      <div class="h-2 transition-all duration-500 bg-[#bde25b] rounded-full" style="width: {Math.min(commits / totalCommits * 100, 100)}%"></div>
    </div>
  </div>
</div>


