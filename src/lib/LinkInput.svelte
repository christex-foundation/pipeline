<script>
  export let label = "";
  export let value = "";
</script>

<div
  class="flex items-center justify-between w-full mt-9 whitespace-nowrap max-md:flex-col max-md:items-start max-md:gap-2"
>
  <label for={label.toLowerCase()} class="w-1/3 text-lg font-semibold"
    >{label}</label
  >

  <input
    type="text"
    id={label.toLowerCase()}
    bind:value
    class="border border-lime-800 border-solid rounded-full px-6 py-2 w-2/3 max-w-lg min-h-[48px] text-base focus:outline-none focus:border-[#0b383c] transition-colors duration-200 font-normal"
    aria-label={label}
  />
</div>
