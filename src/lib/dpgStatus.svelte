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
  console.log('project/dpgstatus', project);
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
              <div class="pointer-events-none flex">
                <Checkbox
                  checked={item.overallScore === 1 || checkedItems.has(item.name)}
                  class={item.overallScore === 1
                    ? 'bg-lime-00 border-green-500 data-[state=checked]:border-green-500 data-[state=checked]:bg-green-500'
                    : 'border-gray-400 bg-white data-[state=checked]:border-gray-400 data-[state=checked]:bg-white'}
                >
                  {#if item.overallScore === 1 || checkedItems.has(item.name)}
                    <Check class="h-4 w-4 text-white" />
                  {/if}
                </Checkbox>
              </div>
              <div class="font-['Inter'] text-lg font-semibold text-black">{item.name}</div>
            </div>
          </AccordionTrigger>
          <AccordionContent class="p-4 pt-0 text-black">
            <div class="mb-2 flex items-center gap-1">
              <div class="font-['Inter'] text-sm leading-normal font-semibold text-[#8a8a8a]">
                Verdict
              </div>
              <Icon icon="mage:stars-b" class="text-2xl" />
            </div>
            <p>{item.explanation || 'Evaluating...'}</p>
          </AccordionContent>
        </AccordionItem>
      {/each}
      <div class="mt-4 rounded-md border border-[#c9c9c9] p-4">
        <div class="mb-3 flex items-center gap-2">
          <Icon icon="mdi:star-check" class="text-xl text-green-500"></Icon>
          <h3 class="font-['Inter'] text-lg font-semibold text-black">Final Recommendation</h3>
        </div>

        <div class="rounded-md bg-gray-50 p-3">
          <p class="font-['Inter'] text-sm leading-relaxed text-black">
            {project.dpgStatus.final_recommendation}
          </p>
        </div>
      </div>
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
