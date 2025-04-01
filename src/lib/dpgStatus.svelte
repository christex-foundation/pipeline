<script>
  import { Check } from 'lucide-svelte';
  import Icon from '@iconify/svelte';
  import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from '$lib/components/ui/accordion';
  import { Checkbox } from '$lib/components/ui/checkbox';

  export let project;
  $: dpgStatuses = project.dpgStatus?.status;

  let checkedItems = new Set();
</script>

<div class="w-full space-y-2">
  {#if dpgStatuses != null}
    <h2 class="mb-4 text-start font-['Inter'] text-2xl font-semibold text-black">
      DPG Standard Checklist - {project.dpgCount}/9
    </h2>

    <Accordion type="multiple" class="w-full">
      {#each dpgStatuses as item}
        <AccordionItem
          value={item.name}
          class="mb-2 overflow-hidden rounded-md border border-[#c9c9c9]"
        >
          <AccordionTrigger class="px-3 py-3 hover:bg-gray-50 hover:no-underline">
            <div class="flex items-center gap-2">
              <div class="flex pointer-events-none">
                <Checkbox
                  checked={item.overallScore === 1 || checkedItems.has(item.name)}
                  class={item.overallScore === 1
                    ? 'border-green-500 bg-green-500 data-[state=checked]:border-green-500 data-[state=checked]:bg-green-500'
                    : 'border-gray-400 bg-white data-[state=checked]:border-gray-400 data-[state=checked]:bg-white'}
                >
                  {#if item.overallScore === 1 || checkedItems.has(item.name)}
                    <Check class="w-4 h-4 text-white" />
                  {/if}
                </Checkbox>
              </div>
              <div class="font-['Inter'] text-lg font-semibold text-black">{item.name}</div>
            </div>
          </AccordionTrigger>
          <AccordionContent class="p-4 pt-0 text-black">
            <div class="flex items-center gap-1 mb-2">
              <div class="font-['Inter'] text-sm font-semibold leading-normal text-[#8a8a8a]">
                Verdict
              </div>
              <Icon icon="mage:stars-b" class="text-2xl" />
            </div>
            <p>{item.explanation || 'Evaluating...'}</p>
          </AccordionContent>
        </AccordionItem>
      {/each}
      <p>{project.dpgStatus.final_recommendation}</p>
    </Accordion>
  {:else}
    <h2 class="mb-4 text-start font-['Inter'] text-2xl font-semibold text-black">
      DPG Standard Checklist
    </h2>
    <div class="flex flex-col items-center gap-4">
      <p class="text-center font-['Inter'] text-lg font-semibold text-[#8a8a8a]">
        DPG Standard Checklist evaluating...
      </p>
    </div>
  {/if}
</div>
