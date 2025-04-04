<script>
  import { cn } from '$lib/utils.js';

  let className = undefined;
  export let tag = 'h3';
  export { className as class };
</script>

<svelte:element
  this={tag}
  class={cn('text-lg leading-none font-semibold tracking-tight', className)}
  {...$$restProps}
>
  <slot />
</svelte:element>
