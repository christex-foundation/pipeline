<script>
  import { goto } from '$app/navigation';
  import { countries } from 'countries-list';
  import { toast } from 'svelte-sonner';

  export let id;
  let loading = false;
  let interest = '';
  let resourceType = '';
  let resourceTitle = '';
  let resourceLink = '';
  let country = '';

  const categories = [
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
        toast.success('Application submitted successfully!');
        goto(`/project/${id}`);
      } else {
        toast.error(`Error: ${response.statusText}`);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      loading = false;
    }
  };
</script>

<form on:submit|preventDefault={handleApplySubmit} class="mx-auto w-full max-w-6xl px-6 py-12">
  <div class="mb-12 flex flex-wrap items-center justify-end">
    <label for="category" class="mb-4 w-full text-xl md:mb-0 md:w-1/3 md:pr-8">
      Type of resource
    </label>
    <div class="w-full md:w-2/3">
      <select
        id="category"
        bind:value={resourceType}
        class="w-full rounded-[25px] border-2 border-[#0b383c] px-6 py-4 text-lg transition-colors duration-200 focus:border-[#0b383c] focus:outline-none"
        aria-label="Select the resource type"
      >
        <option value="">Select resource type</option>
        {#each categories as category}
          <option value={category.value}>{category.label}</option>
        {/each}
      </select>
    </div>
  </div>

  <div class="mb-12 flex flex-wrap items-center justify-end">
    <label for="resourceTitle" class="mb-4 w-full text-xl md:mb-0 md:w-1/3 md:pr-8">
      Resource Title
    </label>
    <div class="w-full md:w-2/3">
      <input
        id="resourceTitle"
        bind:value={resourceTitle}
        type="text"
        class="w-full rounded-[25px] border-2 border-lime-800 px-6 py-4 text-lg transition-colors duration-200 focus:border-[#0b383c] focus:outline-none"
        aria-label="Enter the resource title"
      />
    </div>
  </div>

  <div class="mb-12 flex flex-wrap items-center justify-end">
    <label for="resourceLink" class="mb-4 w-full text-xl md:mb-0 md:w-1/3 md:pr-8">
      Resource Link
    </label>
    <div class="w-full md:w-2/3">
      <input
        id="resourceLink"
        bind:value={resourceLink}
        type="text"
        class="w-full rounded-[25px] border-2 border-lime-800 px-6 py-4 text-lg transition-colors duration-200 focus:border-[#0b383c] focus:outline-none"
        aria-label="Enter the resource link"
      />
    </div>
  </div>

  <div class="mb-12 flex flex-wrap items-center justify-end">
    <label for="country" class="mb-4 w-full text-xl md:mb-0 md:w-1/3 md:pr-8"> Country </label>
    <div class="w-full md:w-2/3">
      <select
        id="country"
        bind:value={country}
        class="w-full rounded-[25px] border-2 border-lime-800 px-6 py-4 text-lg transition-colors duration-200 focus:border-[#0b383c] focus:outline-none"
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
  <div class="mb-12 flex flex-wrap items-start justify-end">
    <label for="interest" class="mb-4 w-full text-xl md:mb-0 md:w-1/3 md:pr-8"> Comment </label>
    <div class="w-full md:w-2/3">
      <textarea
        id="interest"
        bind:value={interest}
        class="min-h-[150px] w-full rounded-[25px] border-2 border-lime-800 px-6 py-4 text-lg transition-colors duration-200 focus:border-[#0b383c] focus:outline-none"
        placeholder="Comment"
      ></textarea>
    </div>
  </div>

  <!-- Submit Button -->
  <div class="mt-12 flex w-full justify-end">
    <button
      type="submit"
      class="w-[20%] rounded-[40px] bg-teal-900 px-4 py-4 text-lg font-medium text-gray-200 transition-colors duration-300 hover:bg-teal-800 disabled:bg-gray-500"
      disabled={loading}
    >
      {loading ? 'SUBMITTING...' : 'SUBMIT'}
    </button>
  </div>
</form>
