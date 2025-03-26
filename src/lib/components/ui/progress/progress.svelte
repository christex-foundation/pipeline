<!-- <script>
	import { Progress as ProgressPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";



	let className = undefined;
	export let max = 100;
	export let value = undefined;
	export { className as class };
	export function CustomProgress({ value = 0, max = 100, className, ...props }) {
  const percentage = (value / max) * 100;
	}
</script>

<ProgressPrimitive.Root
class={cn(
        "relative flex w-full flex-col rounded-lg border-2 border-[#bde25b] bg-[#e9f5d3] py-px",
        className
      )}
      {...props}
    >
      <div
        className="h-[11px] shrink-0 rounded-lg bg-[#bde25b] transition-all"
        style={{ width: `${percentage}%` }}
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        role="progressbar"
      />
</ProgressPrimitive.Root> -->


<script>
	import { Progress as ProgressPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";
	import { onMount } from "svelte";
  
	export let max = 100;
	export let value = 0;
	export let className = undefined;
	let percentage = (value / max) * 100;
  
	// Ensure reactivity when value changes
	$: percentage = (value / max) * 100;
  </script>
  
  <ProgressPrimitive.Root
	class={cn(
	  "relative flex w-full flex-col rounded-lg border-2 border-[#bde25b] bg-[#e9f5d3] py-px",
	  className
	)}
  >
	<div
	  class="h-[11px] shrink-0 rounded-lg bg-[#bde25b] transition-all"
	  style="width: {percentage}%"
	  aria-valuenow={percentage}
	  aria-valuemin="0"
	  aria-valuemax="100"
	  role="progressbar"
	/>
  </ProgressPrimitive.Root>
  