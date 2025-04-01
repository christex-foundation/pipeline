<script>
  import { cn } from '$lib/utils.js';

  export let for_id = undefined;
  export let className = undefined;

  export { default as Label } from './label.svelte';
</script>

<label
  for={for_id}
  class={cn(
    'flex items-center gap-2 text-sm font-medium leading-none text-black peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
    className,
  )}
  {...$$restProps}
>
  <slot />
</label>
