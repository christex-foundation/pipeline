<script>
  import { Avatar as AvatarPrimitive } from 'bits-ui';
  import { cn } from '$lib/utils.js';

  let className = undefined;
  export let src = undefined;
  export let alt = undefined;
  export { className as class };
</script>

<AvatarPrimitive.Image
  {src}
  {alt}
  class={cn('aspect-square h-full w-full', className)}
  {...$$restProps}
/>
