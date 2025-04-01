<script>
  export let navItems = [];
  export let activeItem = '';

  function handleClick(item) {
    activeItem = item.id;
    if (item.onClick) item.onClick();
  }
</script>

<nav
  class="flex flex-wrap items-start justify-center gap-5 text-center text-2xl font-semibold leading-none text-lime-800 max-md:w-[100%] max-md:gap-4 max-md:text-sm"
>
  {#each navItems as item}
    <div class="flex flex-col items-center justify-center" style="width: {item.width};">
      <button
        on:click={() => handleClick(item)}
        class="gap-2.5 self-stretch whitespace-nowrap text-base"
      >
        {item.label}
      </button>
      {#if item.id === activeItem}
        <div
          class="mt-3.5 flex min-h-[6px] max-w-full rounded bg-lime-300"
          style="width: 100%;"
          aria-hidden="true"
        ></div>
      {/if}
    </div>
  {/each}
</nav>
