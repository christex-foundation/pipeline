<script>
    import { createEventDispatcher } from 'svelte';
    import { goto } from '$app/navigation';
  
    export let navSections = [];
    export let currentSection = navSections[0]?.id || '';
  
    const dispatch = createEventDispatcher();
  
    function isActive(sectionId) {
      return currentSection === sectionId;
    }
  
    function handleClick(section) {
      currentSection = section.id;
      dispatch('navigate', { href: section.href, id: section.id });
    }
  </script>
  
  <nav class="flex flex-wrap items-center justify-between w-full gap-10 text-3xl whitespace-nowrap max-md:max-w-full">
    {#each navSections as section (section.id)}
      <a 
        href={section.href} 
        class="flex flex-col justify-center items-center self-stretch my-auto w-[184px]"
        class:font-semibold={isActive(section.id)}
        on:click|preventDefault={() => handleClick(section)}
      >
        <div class="flex items-center gap-2">
          <img loading="lazy" src={section.icon} alt="" class="self-stretch object-contain w-10 my-auto shrink-0 aspect-square" />
          <span class="self-stretch my-auto">{section.label}</span>
        </div>
        {#if isActive(section.id)}
          <div class="flex mt-2.5 max-w-full bg-lime-800 rounded min-h-[7px] w-[184px]" aria-hidden="true"></div>
        {/if}
      </a>
    {/each}
  </nav>