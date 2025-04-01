<script>
  import * as FormPrimitive from 'formsnap';
  import { cn } from '$lib/utils.js';

  let className = undefined;
  export { className as class };
</script>

<FormPrimitive.Field {form} {name} let:constraints let:errors let:tainted let:value>
  <div class={cn('space-y-2', className)}>
    <slot {constraints} {errors} {tainted} {value} />
  </div>
</FormPrimitive.Field>
