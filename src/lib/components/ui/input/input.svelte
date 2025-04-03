<script>
  import { cn } from '$lib/utils.js';

  export let value = undefined;
  export let className = undefined;
  export let readonly = undefined;

  export { default as Input } from './input.svelte';
</script>

<input
  class={cn(
    'w-full rounded-full border border-black bg-background px-4 py-2 ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-black focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
    className,
  )}
  bind:value
  {readonly}
  on:blur
  on:change
  on:click
  on:focus
  on:focusin
  on:focusout
  on:keydown
  on:keypress
  on:keyup
  on:mouseover
  on:mouseenter
  on:mouseleave
  on:mousemove
  on:paste
  on:input
  {...$$restProps}
/>
