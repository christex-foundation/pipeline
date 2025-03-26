<!-- <script>
	import { Button as ButtonPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";
	import { buttonVariants } from "$lib/utils.js";


	let className = undefined;
	export let variant = "default";
	export let size = "default";
	export let builders = [];
	export { className as class };
	
</script>

<ButtonPrimitive.Root
	{builders}
	class={cn(buttonVariants({ variant, size, className }))}
	type="button"
	{...$$restProps}
	on:click
	on:keydown
>
	<slot />
</ButtonPrimitive.Root> -->


<!-- src/lib/components/ui/button/button.svelte -->
 <script>
	import { cva } from 'class-variance-authority';
	import { cn } from '$lib/utils';
	
	export let variant = "default";
	export let size = "default";
	export let type = "button";
	export let disabled = false;
	
	const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-light ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:bg-gray-500',
  {
    variants: {
      variant: {
        default: 'bg-teal-900 text-white hover:bg-teal-800',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-black bg-transparent hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'w-full py-3 mt-8', // Applied w-full, py-3, and mt-8 from your styles
        sm: 'h-9 rounded-full px-3',
        lg: 'h-11 rounded-full px-8 py-3',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

  </script>
  
  <button
	type={type}
	class={cn(buttonVariants({ variant, size }), $$props.class)}
	{disabled}
	{...$$restProps}
  >
	<slot />
  </button>