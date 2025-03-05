<script>
  import { ChevronDown, ChevronUp, Check } from 'lucide-svelte';

  export let project;

  const dpgStatuses = project.dpgStatuses;

  let openItems = new Set();
  let checkedItems = new Set();

  function toggleOpen(title) {
    if (openItems.has(title)) {
      openItems.delete(title);
    } else {
      openItems.add(title);
    }
    openItems = openItems;
  }

  function toggleChecked(title) {
    if (checkedItems.has(title)) {
      checkedItems.delete(title);
    } else {
      checkedItems.add(title);
    }
    checkedItems = checkedItems;
  }
</script>

<div class="w-full space-y-2">
  <h2 class="mb-4 text-start font-['Inter'] text-2xl font-semibold text-black">
    DPG Standard Checklist - {project.dpgCount}/9
  </h2>

  {#each dpgStatuses as item}
    <div class="overflow-hidden rounded-md border border-[#c9c9c9]">
      <div
        on:click={() => toggleOpen(item.name)}
        class="flex items-center justify-between p-3 transition-colors cursor-pointer hover:bg-gray-50"
      >
        <div class="flex items-center gap-2">
          <div
            on:click|stopPropagation={() => toggleChecked(item.name)}
            class="h-5 w-5 border
							{item.score === 1
              ? 'border-green-500 bg-green-500'
              : checkedItems.has(item.name)
                ? 'border-gray-500 bg-gray-500'
                : 'border-gray-300'}
							flex items-center justify-center"
          >
            {#if checkedItems.has(item.name) || item.score === 1}
              <Check class="w-4 h-4 text-white" />
            {/if}
          </div>
          <div class="font-['Inter'] text-lg font-semibold text-black">{item.name}</div>
        </div>
        {#if openItems.has(item.name)}
          <ChevronUp class="text-gray-500" />
        {:else}
          <ChevronDown class="text-gray-500" />
        {/if}
      </div>
      {#if openItems.has(item.name)}
        <div class="p-4 text-black">
          <div class="flex items-center gap-1 mb-2">
            <div class="font-['Inter'] text-sm font-semibold leading-normal text-[#8a8a8a]">
              Verdict
            </div>
            <svg
              width="13"
              height="13"
              viewBox="0 0 13 13"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.66001 2.01074L8.57514 4.48385L11.0482 5.39898L8.57514 6.31411L7.66001 8.78721L6.74488 6.31411L4.27177 5.39898L6.74488 4.48385L7.66001 2.01074Z"
                stroke="#8A8A8A"
                stroke-width="0.75"
                stroke-linejoin="round"
              />
              <path
                d="M3.42471 7.6578L4.22413 8.83486L5.40118 9.63427L4.22413 10.4337L3.42471 11.6107L2.6253 10.4337L1.44824 9.63427L2.6253 8.83486L3.42471 7.6578Z"
                stroke="#8A8A8A"
                stroke-width="0.75"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <p>{item.explanation}</p>
        </div>
      {/if}
    </div>
  {:else}
    <div class="w-full space-y-2">
      <h2 class="text-start text-black text-2xl font-semibold font-['Inter'] mb-4">
        No DPG status found...
      </h2>

      <a
      href="/"
      class="flex items-center justify-center w-40 px-4 py-2 mx-auto mt-5 text-sm font-medium text-white transition border rounded-full border-teal-950 bg-cyan-950 hover:bg-cyan-900 font-[Inter]"
    >
      Evaluate Project
    </a>
    </div>



  
  {/each}
</div>
