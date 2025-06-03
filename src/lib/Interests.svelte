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

<div class="rounded-2xl border border-dashboard-gray-700 bg-dashboard-gray-900 p-6 shadow-card">
  <div class="mb-6">
    <h2 class="mb-2 text-heading-xl font-semibold text-white">{title}</h2>
    <p class="text-body-lg text-gray-300">Select your areas of interest and expertise</p>
  </div>

  <div class="flex flex-wrap gap-3">
    {#each interests as interest}
      <button
        type="button"
        class="rounded-xl border-2 border-dashboard-gray-600 bg-dashboard-gray-800 px-4 py-3 text-label-md font-medium transition-all duration-200 hover:border-dashboard-purple-500 hover:bg-dashboard-gray-700"
        class:!border-dashboard-purple-500={selectedInterests.includes(interest)}
        class:!bg-dashboard-purple-500={selectedInterests.includes(interest)}
        class:!text-white={selectedInterests.includes(interest)}
        class:text-gray-300={!selectedInterests.includes(interest)}
        on:click={() => toggleInterest(interest)}
      >
        {interest}
      </button>
    {/each}
  </div>
</div>

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
