<script>
  export let title = '';
  export let interests = [];
  export let selectedInterests = [];

  function toggleInterest(interest) {
    if (selectedInterests.includes(interest)) {
      selectedInterests = selectedInterests.filter((i) => i !== interest);
    } else {
      selectedInterests = [...selectedInterests, interest];
    }
  }
</script>

<section class="mt-10 flex w-full max-w-[400px] flex-col items-start rounded-[30px]">
  <h2 class="mb-6 text-4xl font-semibold text-black">{title}</h2>
  <div class="mt-4 flex flex-wrap gap-3 text-xl">
    {#each interests as interest}
      <button
        class="rounded-[30px] border-2 border-solid border-lime-800 px-5 py-4 text-base transition-colors duration-200 ease-in-out"
        class:bg-lime-800={selectedInterests.includes(interest)}
        class:text-white={selectedInterests.includes(interest)}
        on:click={() => toggleInterest(interest)}
      >
        {interest}
      </button>
    {/each}
  </div>
</section>

<style>
  button {
    white-space: nowrap;
    min-height: 44px;
  }

  @media (max-width: 640px) {
    section {
      max-width: 100%;
    }
  }
</style>
