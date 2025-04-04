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

<nav
  class="flex w-full flex-wrap items-center justify-between gap-10 text-3xl leading-none whitespace-nowrap text-black max-md:max-w-full"
>
  {#each navSections as section (section.id)}
    <a
      href={section.href}
      class="flex w-[184px] flex-col items-center justify-center text-center"
      class:font-semibold={isActive(section.id)}
      on:click|preventDefault={() => handleClick(section)}
    >
      <div class="w-full">
        <slot name="item" {section}>
          {section.label}
        </slot>
      </div>
      {#if isActive(section.id)}
        <div class="mt-2.5 h-[7px] w-full max-w-[184px] rounded bg-lime-800"></div>
      {/if}
    </a>
  {/each}
</nav>
