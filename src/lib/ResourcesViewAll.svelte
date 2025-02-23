<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import ResourceCard from './ResourceCard.svelte';
  import { countries } from 'countries-list';

  let country = '';

  const countryList = Object.entries(countries)
    .map(([code, data]) => ({
      code,
      name: data.name,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const dispatch = createEventDispatcher();

  function handleGoBack() {
    showUpdateDetail = false;
    selectedUpdate = null;
  }

  function goBack() {
    dispatch('goBack');
  }

  const resources = [
    {
      id: 1,
      title: 'Onboading Demo video',
      author: 'Joseph Kerr',
      category: 'Media',
      description:
        'Nulla sit obcaecati Nulla sit obcaecati Nulla sit obcaecati Nulla sit obcaecati Nulla sit obcaecati Nulla sit obcaecati',
      imageUrl:
        'https://cdn.builder.io/api/v1/image/assets/TEMP/580f77e5-d2eb-430b-8974-3ed3b77829c8?placeholderIfAbsent=true&apiKey=567aaefef2da4f73a3149c6bc21f1ea8',
    },
    {
      id: 2,
      title: 'Marketing Flyer Design',
      author: 'Joseph Kerr',
      category: 'Design',
      description:
        'Nulla sit obcaecati Nulla sit obcaecati Nulla sit obcaecati Nulla sit obcaecati Nulla sit obcaecati Nulla sit obcaecati',
      imageUrl:
        'https://cdn.builder.io/api/v1/image/assets/TEMP/b31f7283-74b4-4669-b0f7-1cf219d8ccad?placeholderIfAbsent=true&apiKey=567aaefef2da4f73a3149c6bc21f1ea8',
    },
    {
      id: 3,
      title: 'UI/UX Case Study',
      author: 'Joseph Kerr',
      category: 'Document',
      description:
        'Nulla sit obcaecati Nulla sit obcaecati Nulla sit obcaecati Nulla sit obcaecati Nulla sit obcaecati Nulla sit obcaecati',
      imageUrl:
        'https://cdn.builder.io/api/v1/image/assets/TEMP/79e93884-0a53-4158-8d0b-6f18819002ac?placeholderIfAbsent=true&apiKey=567aaefef2da4f73a3149c6bc21f1ea8',
    },
    {
      id: 4,
      title: 'Onboading Demo video',
      author: 'Joseph Kerr',
      category: 'Media',
      description:
        'Nulla sit obcaecati Nulla sit obcaecati Nulla sit obcaecati Nulla sit obcaecati Nulla sit obcaecati Nulla sit obcaecati',
      imageUrl:
        'https://cdn.builder.io/api/v1/image/assets/TEMP/3108468c-54ac-442b-a540-6bc12e0ded13?placeholderIfAbsent=true&apiKey=567aaefef2da4f73a3149c6bc21f1ea8',
    },
  ];

  let showDropdown = false;
  let searchTerm = '';
  let filteredResources = resources;

  $: filteredResources = resources.filter(
    (resource) =>
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.category.toLowerCase().includes(searchTerm.toLowerCase()),
  );
</script>

<div class="relative inline-flex h-[1639.94px] flex-col items-start justify-start gap-9">
  <button class="inline-flex items-center self-stretch justify-start gap-1" on:click={goBack}>
    <div
      class="flex items-center justify-center gap-1 rounded-[39.71px] border-2 border-[#516027] py-2 pl-1 pr-4"
    >
      <div data-svg-wrapper class="relative">
        <svg
          width="21"
          height="20"
          viewBox="0 0 21 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12.8903 14.1665L8.72363 9.99984L12.8903 5.83317"
            stroke="#516027"
            stroke-width="1.66667"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      <span class="text-center font-['Inter'] text-[13px] font-bold leading-[13px] text-[#516027]"
        >Back</span
      >
    </div>
  </button>

  <div class="flex h-[1567.94px] flex-col items-start justify-start gap-5 self-stretch">
    <div class="flex items-center self-stretch justify-between">
      <div class="w-[258px] font-['Inter'] text-[23px] font-semibold leading-7 text-black">
        All Project Resources
      </div>

      <div class="flex items-center gap-2">
        <div
          class="flex h-9 items-center justify-between rounded-[39.71px] border border-[#e2e2e2] py-2 pl-4 pr-3"
        >
          <input
            type="text"
            bind:value={searchTerm}
            placeholder="Search Resources"
            class="border-none text-start font-['Inter'] text-[13px] font-normal leading-tight tracking-tight text-[#a0a0a0]"
          />
          <div data-svg-wrapper class="relative">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.91667 2.5C9.35326 2.5 10.731 3.07068 11.7468 4.0865C12.7626 5.10233 13.3333 6.48008 13.3333 7.91667C13.3333 9.25833 12.8417 10.4917 12.0333 11.4417L12.2583 11.6667H12.9167L17.0833 15.8333L15.8333 17.0833L11.6667 12.9167V12.2583L11.4417 12.0333C10.4586 12.8721 9.20887 13.333 7.91667 13.3333C6.48008 13.3333 5.10233 12.7626 4.0865 11.7468C3.07068 10.731 2.5 9.35326 2.5 7.91667C2.5 6.48008 3.07068 5.10233 4.0865 4.0865C5.10233 3.07068 6.48008 2.5 7.91667 2.5ZM7.91667 4.16667C5.83333 4.16667 4.16667 5.83333 4.16667 7.91667C4.16667 10 5.83333 11.6667 7.91667 11.6667C10 11.6667 11.6667 10 11.6667 7.91667C11.6667 5.83333 10 4.16667 7.91667 4.16667Z"
                fill="#C9C9C9"
              />
            </svg>
          </div>
        </div>

        <div class="relative flex items-center gap-2">
          <div
            on:click={() => (showDropdown = !showDropdown)}
            class="flex cursor-pointer items-center gap-2 rounded-[39.71px] border-2 border-[#c9d89f] bg-white py-2 pl-3 pr-6 shadow-[0px_1px_4px_0px_rgba(12,12,13,0.05)]"
          >
            <div data-svg-wrapper class="relative">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.38429 10.0002H14.6151M3.33301 5.8335H16.6663M8.46121 14.1668H11.5381"
                  stroke="#A0A0A0"
                  stroke-width="1.33"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            <div
              class="text-center font-['Jost'] text-sm font-normal leading-[14px] text-[#0f1e12]"
            >
              Filter
            </div>
          </div>

          {#if showDropdown}
            <div
              class="absolute right-0 top-full z-50 flex w-56 flex-col gap-3 rounded-xl border border-[#e2e2e2] bg-white p-3 shadow-lg"
            >
              <div class="flex flex-col gap-2">
                <span class="text-xs font-medium text-[#a0a0a0]">Resource Type</span>
                <div class="flex flex-col gap-2">
                  <label class="flex items-center gap-2 text-[13px] text-[#0f1e12]">
                    <input
                      type="radio"
                      name="resourceType"
                      value="document"
                      class="h-2 w-2 border-[#dbdbdb]"
                    />
                    Document
                  </label>
                  <label class="flex items-center gap-2 text-[13px] text-[#0f1e12]">
                    <input
                      type="radio"
                      name="resourceType"
                      value="media"
                      class="h-2 w-2 border-[#dbdbdb]"
                    />
                    Media
                  </label>
                  <label class="flex items-center gap-2 text-[13px] text-[#0f1e12]">
                    <input
                      type="radio"
                      name="resourceType"
                      value="design"
                      class="h-2 w-2 border-[#dbdbdb]"
                    />
                    Design
                  </label>
                </div>
              </div>

              <div class="flex flex-col gap-2">
                <span class="text-xs font-medium text-[#a0a0a0]">From</span>
                <div class="relative">
                  <select
                    id="country"
                    bind:value={country}
                    class="inline-flex h-10 w-full items-center justify-between rounded-[39.71px] border border-[#e2e2e2] p-2 text-sm"
                    aria-label="Country"
                  >
                    <option value="">Country</option>
                    {#each countryList as countryItem}
                      <option value={countryItem.code}>{countryItem.name}</option>
                    {/each}
                  </select>
                </div>
              </div>
            </div>
          {/if}
        </div>
      </div>
    </div>

    <div class="flex flex-wrap items-start w-full gap-4 mt-5 max-md:max-w-full">
      {#each filteredResources as resource (resource.id)}
        <ResourceCard {...resource} />
      {/each}
    </div>
  </div>
</div>
