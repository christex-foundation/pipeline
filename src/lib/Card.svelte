<script>
  import ProgressBar from './ProgressBar.svelte';
  import ContributeButton from './ContributeButton.svelte';
  import CategoryTag from './CategoryTag.svelte';
  import DPGRating from './DPGRating.svelte';
  import { amountFormat } from '$lib/utils/amountFormat.js';
  

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

  onMount(() => {
    document.addEventListener('click', closeDropdown);
    return () => {
      document.removeEventListener('click', closeDropdown);
    };
  });
</script>


<div class="w-[328px] h-[583.26px] px-4 pt-4 pb-6 bg-[#eff5f5] rounded-[32px] flex-col justify-start items-center gap-4 inline-flex">
  <div class="self-stretch h-[280.26px] bg-white rounded-2xl border-2 border-neutral-200 justify-between items-center inline-flex">
      <img src="https://s3-alpha-sig.figma.com/img/b145/e71a/4f52857904881646898dd594ee6b92a5?Expires=1729468800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Tt2xMwhQvYmcWeuMlhHsbwmV3TbFYJJ~T1XJSGBNff-FoACYJarUQmb6a~Vmh81Jef1oqcYhZUmS7Nb4N~CXNLaTcCgn2prDFa7jcMD35Z-X2G7HTRh682o7iFRuZQ14vEtrwYrAcG6ScIKWMvAjcOL5J-rRzwGHWeAObM6bdtYfjACUy9Nu4vMucAP4SS0QwXbZ1nZcNHb6N0RYoJ8nLB6xZt-1fh3djQB4FBOR-jFl1rTYi2~q8LviNZjR5cHXRvpTmcHNigVfkgMvbkS4vx20NZ5~HCBAKk40SG4c1mu2c62qFZXf5jzhamYBs2~i8BC4fDczAduSeGu2ZG9lFw__" 
      class="relative h-[280.26px] w-full" alt="" loading="lazy"/>
        
  </div>
  <div class="self-stretch h-[152px] flex-col justify-start items-start gap-3 flex">

    <div class="self-stretch h-[116px] pl-0.5 flex-col justify-start items-start gap-2 flex">
      <div class="flex items-center self-stretch justify-between">
          <div class="text-[#203637] text-[23px] font-semibold font-['Inter'] leading-7 break-all">
              {project.title}
          </div>
          <div class="justify-start items-center gap-[5px] flex mb-2">
              <div class="relative w-4 h-4"></div>
              <div class="text-[#8c8c8c] text-base font-normal font-['Inter'] leading-tight">
                  <DPGRating rating={project.dpgStatusCount} />
              </div>
          </div>
      </div>
      <div class="self-stretch text-[#305661] text-base font-normal font-['Inter'] leading-tight tracking-tight">
         {project.bio}
      </div>
  </div>


      <div class="flex items-center gap-2">
        {#if project.tags.length > 0}
          <div class="flex flex-wrap gap-2 tags-container">
            {#each project.tags as tag}
              <CategoryTag {tag} />
            {/each}
          </div>
        {/if}
      </div>
      
  </div>
  <div class="inline-flex items-center self-stretch justify-start gap-4">
    <ProgressBar progress={project.current_funding} total={project.funding_goal} />
      <div class="flex items-center justify-start gap-1">
          <div class="text-[#203637] text-[13px] font-extrabold font-['Inter'] leading-[13px]">${amountFormat(project.current_funding || 0)}</div>
          <div class="text-[#a0a0a0] text-[13px] font-extrabold font-['Inter'] leading-[13px]">/</div>
          <div class="text-[#203637] text-[13px] font-extrabold font-['Inter'] leading-[13px]">${amountFormat(project.funding_goal || 0)}</div>
      </div>
  </div>
  <div class="self-stretch bg-[#19373b] rounded-[30.30px] border border-[#08292c] justify-center items-center inline-flex">
      <div class="px-[30.30px] py-4 rounded-[30.30px] justify-center items-center gap-[7.58px] flex">
          <div class="text-[#fafbfb] text-[15.15px] font-extrabold font-['Inter'] leading-[15.15px] tracking-tight">CONTRIBUTE</div>
      </div>
  </div>
</div>
