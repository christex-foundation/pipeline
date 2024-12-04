<script>
  import { fade } from 'svelte/transition';
  import { X } from 'lucide-svelte';

  export let message = '';
  export let type = 'success';
  export let onClose = () => {};

  $: txtColor = type === 'success' ? 'text-green-500' : 'text-red-500';
  $: shadowColor = type === 'success' ? 'text-green-500' : 'shadow-red-200';
</script>

{#if message}
  <div
    transition:fade
    class="fixed top-4 right-4 p-4 rounded-lg shadow-lg flex items-center justify-between bg-white border border-1 border-gray-200 w-auto max-w-[20rem] {shadowColor}"
  >
    <p class={txtColor}>{message}</p>
    <button on:click={onClose} class="ml-4 focus:outline-none {txtColor}">
      <X size={20} />
    </button>
  </div>
{/if}
