<script>
  import { countries } from 'countries-list';

  export let id;
  let loading = false;
  let interest = '';
  let resourceType = '';
  let resourceTitle = '';
  let resourceLink = '';
  let country = '';

  const categories = [
    { value: 'code', label: 'Code' },
    { value: 'design', label: 'Design' },
    { value: 'research', label: 'Research Data' },
  ];

  const countryList = Object.entries(countries)
    .map(([code, data]) => ({
      code,
      name: data.name,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const handleApplySubmit = async () => {
    try {
      loading = true;
      const response = await fetch(`/api/projects/${id}/contribute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resourceType,
          resourceTitle,
          resourceLink,
          country,
          interest,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert('Application submitted successfully!');
        window.location.href = `/project/${id}`;
      } else {
        alert(`Error: ${response.statusText}`);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      loading = false;
    }
  };
</script>

<form on:submit|preventDefault={handleApplySubmit} class="w-full max-w-6xl px-6 py-12 mx-auto">
  <div class="flex flex-wrap items-center justify-end mb-12">
    <label for="category" class="w-full mb-4 text-xl md:w-1/3 md:mb-0 md:pr-8">
      Type of resource
    </label>
    <div class="w-full md:w-2/3">
      <select
        id="category"
        bind:value={resourceType}
        class="w-full border-2 border-[#0b383c] rounded-[25px] px-6 py-4 text-lg focus:outline-none focus:border-[#0b383c] transition-colors duration-200"
        aria-label="Select the resource type"
      >
        <option value="">Select resource type</option>
        {#each categories as category}
          <option value={category.value}>{category.label}</option>
        {/each}
      </select>
    </div>
  </div>

  <div class="flex flex-wrap items-center justify-end mb-12">
    <label for="resourceTitle" class="w-full mb-4 text-xl md:w-1/3 md:mb-0 md:pr-8">
      Resource Title
    </label>
    <div class="w-full md:w-2/3">
      <input
        id="resourceTitle"
        bind:value={resourceTitle}
        type="text"
        class="w-full border-2 border-lime-800 rounded-[25px] px-6 py-4 text-lg focus:outline-none focus:border-[#0b383c] transition-colors duration-200"
        aria-label="Enter the resource title"
      />
    </div>
  </div>

  <div class="flex flex-wrap items-center justify-end mb-12">
    <label for="resourceLink" class="w-full mb-4 text-xl md:w-1/3 md:mb-0 md:pr-8">
      Resource Link
    </label>
    <div class="w-full md:w-2/3">
      <input
        id="resourceLink"
        bind:value={resourceLink}
        type="text"
        class="w-full border-2 border-lime-800 rounded-[25px] px-6 py-4 text-lg focus:outline-none focus:border-[#0b383c] transition-colors duration-200"
        aria-label="Enter the resource link"
      />
    </div>
  </div>

  <div class="flex flex-wrap items-center justify-end mb-12">
    <label for="country" class="w-full mb-4 text-xl md:w-1/3 md:mb-0 md:pr-8"> Country </label>
    <div class="w-full md:w-2/3">
      <select
        id="country"
        bind:value={country}
        class="w-full border-2 border-lime-800 rounded-[25px] px-6 py-4 text-lg focus:outline-none focus:border-[#0b383c] transition-colors duration-200"
        aria-label="Select your country"
      >
        <option value="">Select your country</option>
        {#each countryList as countryItem}
          <option value={countryItem.code}>{countryItem.name}</option>
        {/each}
      </select>
    </div>
  </div>

  <!-- Interest Section -->
  <div class="flex flex-wrap items-start justify-end mb-12">
    <label for="interest" class="w-full mb-4 text-xl md:w-1/3 md:mb-0 md:pr-8"> Comment </label>
    <div class="w-full md:w-2/3">
      <textarea
        id="interest"
        bind:value={interest}
        class="w-full border-2 border-lime-800 rounded-[25px] px-6 py-4 text-lg min-h-[150px] focus:outline-none focus:border-[#0b383c] transition-colors duration-200"
        placeholder="Comment"
      ></textarea>
    </div>
  </div>

  <!-- Submit Button -->
  <div class="flex justify-end w-full mt-12">
    <button
      type="submit"
      class="w-[20%] px-4 py-4 bg-teal-900 text-gray-200 text-lg font-medium rounded-[40px] hover:bg-teal-800 transition-colors duration-300"
      disabled={loading}
    >
      {loading ? 'SUBMITTING...' : 'SUBMIT'}
    </button>
  </div>
</form>
