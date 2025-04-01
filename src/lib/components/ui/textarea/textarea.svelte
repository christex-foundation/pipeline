<script>
  import { cn } from '$lib/utils.js';

  let className = undefined;
  export let value = undefined;
  export { className as class };

  export let readonly = undefined;
</script>

<textarea
  class={cn(
    'flex min-h-[80px] w-full rounded-[31px] border-2 border-lime-800 bg-background px-4 py-4 text-sm placeholder:text-muted-foreground  disabled:cursor-not-allowed disabled:opacity-50',
    className,
  )}
  bind:value
  {readonly}
  on:blur
  on:change
  on:click
  on:focus
  on:keydown
  on:keypress
  on:keyup
  on:mouseover
  on:mouseenter
  on:mouseleave
  on:paste
  on:input
  {...$$restProps}
></textarea>
