<script>
  import { cn } from '$lib/utils';
  
  export let variant = 'default';
  export let size = 'default';
  export let type = 'button';
  export let disabled = false;
  
  // Define class variations
  const variants = {
    default: 'bg-teal-900 text-white hover:bg-teal-800',
    outline: 'border border-black bg-transparent hover:bg-accent',
    ghost: 'hover:bg-accent hover:text-accent-foreground'
  };
  
  const sizes = {
    default: 'w-full py-3 mt-8',
    sm: 'h-9 rounded-full px-3',
    lg: 'h-11 rounded-full px-8 py-3'
  };
  
  $: classes = cn(
    'inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-light disabled:pointer-events-none disabled:bg-gray-500',
    variants[variant],
    sizes[size],
    $$props.class
  );
</script>

<button {type} class={classes} {disabled} on:click {...$$restProps}>
  <slot />
</button>