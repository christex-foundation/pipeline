<script>
  import * as FormPrimitive from 'formsnap';
  import { cn } from '$lib/utils.js';

  export let form;
  export let name;

  let className = undefined;
  export { className as class };
</script>

<FormPrimitive.ElementField {form} {name} let:constraints let:errors let:tainted let:value>
  <div class={cn('space-y-2', className)}>
    <slot {constraints} {errors} {tainted} {value} />
  </div>
</FormPrimitive.ElementField>
