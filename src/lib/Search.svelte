<script>
  import { createEventDispatcher } from 'svelte';
  import { Label } from '$lib/components/ui/Label';
  import { Input } from '$lib/components/ui/input';

  const dispatch = createEventDispatcher();
  let searchTerm = '';

  function handleInput(event) {
    searchTerm = event.target.value;
    dispatch('search', { searchTerm });
  }
</script>

<div
  class="my-auto flex w-[805px] min-w-[240px] items-center rounded-[43px] border-[2px] border-solid border-[#97a07d] py-4 pl-6 pr-16 text-black max-md:max-w-full max-md:flex-nowrap max-md:px-5 max-sm:justify-between"
>
  <img
    loading="lazy"
    src="https://cdn.builder.io/api/v1/image/assets/TEMP/18369895e4db602dfeea407c51d752608ddfd4c412594f2f3a55fa96274df836?placeholderIfAbsent=true&apiKey=567aaefef2da4f73a3149c6bc21f1ea8"
    alt=""
    class="aspect-square w-[26px] shrink-0 object-contain max-sm:w-[15px]"
  />
  <Label for="searchInput" class="sr-only">Search</Label>
  <Input
    type="text"
    id="searchInput"
    placeholder="Search"
    class="ml-2 flex-grow border-none bg-transparent text-lg outline-none"
    on:input={handleInput}
  />
</div>
