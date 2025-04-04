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
  class="flex w-full flex-wrap items-center justify-between gap-10 text-3xl whitespace-nowrap max-md:max-w-full"
>
  {#each navSections as section (section.id)}
    <a
      href={section.href}
      class="my-auto flex w-[184px] flex-col items-center justify-center self-stretch"
      class:font-semibold={isActive(section.id)}
      on:click|preventDefault={() => handleClick(section)}
    >
      <div class="flex items-center gap-2">
        <img
          loading="lazy"
          src={section.icon}
          alt=""
          class="my-auto aspect-square w-10 shrink-0 self-stretch object-contain"
        />
        <span class="my-auto self-stretch">{section.label}</span>
      </div>
      {#if isActive(section.id)}
        <div
          class="mt-2.5 flex min-h-[7px] w-[184px] max-w-full rounded bg-lime-800"
          aria-hidden="true"
        ></div>
      {/if}
    </a>
  {/each}
</nav>
