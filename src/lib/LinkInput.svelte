<script>
  export let label = "";
  export let value = "";
</script>

<div
  class="flex items-center justify-between w-full mt-4 whitespace-nowrap max-md:flex-col max-md:items-start max-md:gap-2"
>
  <label for={label.toLowerCase()} class="w-1/3 text-base font-semibold max-md:w-full max-md:items-left"
    >{label}</label
  >

  <input
    type="text"
    id={label.toLowerCase()}
    bind:value
    class="border border-lime-800 border-solid rounded-full px-6 py-2 w-2/3 max-w-lg min-h-[48px] focus:outline-none focus:border-[#0b383c] transition-colors duration-200 max-md:w-[100%]"
    aria-label={label}
  />
</div>
