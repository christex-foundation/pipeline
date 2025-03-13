<script>
  import { ChevronDown, ChevronUp, Check } from 'lucide-svelte';
  import Icon from "@iconify/svelte";

  export let project;
  export let user;

  $: dpgStatuses = project.dpgStatuses;

  let openItems = new Set();
  let checkedItems = new Set();
  let loading = false;
  let error = null;

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

  async function evaluateProject() {
    loading = true;
    error = null;

    try {
      const response = await fetch('/api/github', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: project.github }),
      });

      if (!response.ok) {
        throw new Error('Failed to evaluate project');
      }

      const data = await response.json();

      dpgStatuses = data.evaluations;
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }
</script>

<div class="w-full space-y-2">
  {#if dpgStatuses.length > 0}
    <h2 class="mb-4 text-start font-['Inter'] text-3xl font-semibold text-black max-md:text-xl">
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
              <Icon icon="mage:stars-b" class="text-2xl" />
            </div>
            <p>{item.explanation || 'Evaluating...'}</p>
          </div>
        {/if}
      </div>
    {/each}
  {:else}
    <div class="w-full space-y-2">
      <h2 class="text-start text-black text-xl font-semibold font-['Inter'] mb-4 max-md:text-sm">
        No DPG status found...
      </h2>

      <a
        href="/"
        class="flex items-center justify-center w-40 px-4 py-2 mx-auto mt-5 text-sm font-medium text-white transition border rounded-full border-teal-950 bg-cyan-950 hover:bg-cyan-900 font-[Inter]"
      >
        Evaluate Project
      </a>
    </div>
  {/if}
</div>