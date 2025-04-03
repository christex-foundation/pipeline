<script>
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';

  export let label = '';
  export let value = '';
</script>

<div
  class="mt-4 flex w-full items-center justify-between whitespace-nowrap max-md:flex-col max-md:items-start max-md:gap-2"
>
  <Label
    for={label.toLowerCase()}
    class="max-md:items-left w-1/3 text-base font-semibold max-md:w-full"
  >
    {label}
  </Label>

  <Input
    type="text"
    id={label.toLowerCase()}
    bind:value
    class="min-h-[48px] w-2/3 max-w-lg rounded-full border border-solid border-lime-800 px-6 py-2 transition-colors duration-200 focus:border-[#0b383c] focus:outline-none max-md:w-[100%]"
    aria-label={label}
  />
</div>
