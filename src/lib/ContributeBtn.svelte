<script>
  import { createEventDispatcher } from 'svelte';

  export let buttons = [
    { label: 'Funding', active: true, href: '/contribute' },
    { label: 'Resources', active: false, href: '/contribute' },
  ];
  export let activeColor = 'bg-cyan-950 text-lime-100';
  export let inactiveColor = 'text-neutral-400';
  export let borderColor = 'border-teal-950';

  const dispatch = createEventDispatcher();

  function handleClick(index) {
    buttons = buttons.map((button, i) => ({
      ...button,
      active: i === index,
    }));
    dispatch('buttonClick', { index, label: buttons[index].label, href: buttons[index].href });
  }
</script>

<div class="my-8 flex w-full justify-center">
  <div class="w-[15%] max-w-[800px] min-w-[300px]">
    <div
      class="flex flex-wrap items-center gap-5 border-[3px] border-solid p-2 text-center text-2xl leading-none font-semibold whitespace-nowrap {borderColor} rounded-[85px] max-md:text-3xl"
    >
      {#each buttons as button, index}
        <a
          href={button.href}
          class="my-auto min-w-[120px] flex-1 gap-1 self-stretch rounded-[63px] px-4 py-4 no-underline transition-colors duration-200 ease-in-out {button.active
            ? activeColor
            : inactiveColor}"
          on:click={() => handleClick(index)}
        >
          {button.label}
        </a>
      {/each}
    </div>
  </div>
</div>

<style>
  a {
    transition:
      background-color 0.3s,
      color 0.3s;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
</style>
