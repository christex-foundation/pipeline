<script>
  import { goto } from '$app/navigation';
  function goToExplorePage(event) {
    event.preventDefault();
    goto('/explore');
  }
</script>

<form
  class="my-auto flex min-h-[33px] w-[238px] items-center justify-between gap-10 self-stretch rounded-3xl border border-solid border-lime-300 bg-lime-200 p-2 py-2 text-center text-xs leading-none text-lime-800"
>
  <label for="searchInput" class="sr-only">Search Projects</label>
  <input
    type="text"
    id="searchInput"
    placeholder="Search Projects"
    class="ml-2 border-none bg-transparent text-sm outline-none"
    on:click={goToExplorePage}
  />
  <button type="button" aria-label="Search" on:click={goToExplorePage}>
    <img
      loading="lazy"
      src="https://cdn.builder.io/api/v1/image/assets/TEMP/0cea00987cd5d34029b3f3529b7ac5f876b522a99547522c90064fae2fcdeb9d?placeholderIfAbsent=true&apiKey=567aaefef2da4f73a3149c6bc21f1ea8"
      alt="Search icon"
      class="my-auto aspect-square w-[18px] shrink-0 self-stretch object-contain"
    />
  </button>
</form>
