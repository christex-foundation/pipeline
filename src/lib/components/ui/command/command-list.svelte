<script>
  import { Command as CommandPrimitive } from 'cmdk-sv';
  import { cn } from '$lib/utils.js';

  let className = undefined;
  export { className as class };
</script>

<CommandPrimitive.List
  class={cn('max-h-[300px] overflow-x-hidden overflow-y-auto', className)}
  {...$$restProps}
>
  <slot />
</CommandPrimitive.List>
