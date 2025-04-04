<script>
  import { Dialog as SheetPrimitive } from 'bits-ui';
  import X from 'lucide-svelte/icons/x';
  import { fly } from 'svelte/transition';
  import { cn } from '$lib/utils.js';

  let className = undefined;
  export let side = 'right';
  export { className as class };
  export let inTransition = fly;
  export let inTransitionConfig = sheetTransitions[side ?? 'right'].in;
  export let outTransition = fly;
  export let outTransitionConfig = sheetTransitions[side ?? 'right'].out;
</script>

<SheetPortal>
  <SheetOverlay />
  <SheetPrimitive.Content
    {inTransition}
    {inTransitionConfig}
    {outTransition}
    {outTransitionConfig}
    class={cn(sheetVariants({ side }), className)}
    {...$$restProps}
  >
    <slot />
    <SheetPrimitive.Close
      class="ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:pointer-events-none"
    >
      <X class="h-4 w-4" />
      <span class="sr-only">Close</span>
    </SheetPrimitive.Close>
  </SheetPrimitive.Content>
</SheetPortal>
