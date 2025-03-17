<script>
  import { modalOpen } from './modalStore.js';

  function closeModal() {
    modalOpen.set(false);
  }
</script>

<section
  class="relative flex max-w-[678px] flex-col items-center overflow-hidden rounded-[53px] bg-teal-600 px-20 pt-24 pb-14 text-center leading-none font-semibold text-white max-md:px-5"
>
  <button
    on:click={closeModal}
    class="absolute top-4 right-4 text-2xl text-white hover:text-gray-200">&times;</button
  >

  <img
    loading="lazy"
    src="https://cdn.builder.io/api/v1/image/assets/TEMP/37fdd80cf276a36769f1558ad7c5b5a5a72b870fcf8df808b02f069f5e5d61e1?placeholderIfAbsent=true&apiKey=567aaefef2da4f73a3149c6bc21f1ea8"
    alt="Donation success illustration"
    class="aspect-[1.05] w-[310px] max-w-full object-contain"
  />
  <h1 class="mt-8 self-stretch text-5xl max-md:max-w-full max-md:text-4xl">Donation Successful</h1>
  <p class="mt-2 text-lg leading-5">
    Your contribution will help bring this project to life.<br />
    You've earned 5 points in the leaderboard.
  </p>
  <a href="/explore">
    <button
      class="mt-5 w-[411px] max-w-full gap-1 self-stretch rounded-3xl bg-teal-950 px-5 py-5 text-sm text-lime-100 hover:bg-teal-900"
    >
      Explore other projects
    </button>
  </a>
</section>
