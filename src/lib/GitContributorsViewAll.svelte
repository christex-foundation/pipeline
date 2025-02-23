<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import GitContributors from '$lib/GitContributors.svelte';

  const dispatch = createEventDispatcher();

  function goBack() {
    dispatch('goBack');
  }


  let contributors = [
    {
      name: "Hawa Kallon",
      githubLink: "https://github.com/hawakallon",
      commits: 42,
      avatarUrl: "https://github.com/hawakallon.png"
    },
    {
      name: "Saidu Bundu-Kamara",
      githubLink: "https://github.com/saidubundukamara",
      commits: 80,
      avatarUrl: "https://github.com/saidubundukamara.png"
    },
    {
      name: "Sparrow",
      githubLink: "https://github.com/sparrowsl",
      commits: 80,
      avatarUrl: "https://github.com/sparrowsl.png"
    },
    {
      name: "Mitch",
      githubLink: "https://github.com/stElmitchay",
      commits: 80,
      avatarUrl: "https://github.com/stElmitchay.png"
    }
  ];

  let showDropdown = false;
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
      <!-- Title -->
      <div class="w-[258px] font-['Inter'] text-[23px] font-semibold leading-7 text-black">
        All Github Contributors
      </div>

      <!-- Search & Filter Container -->
      <div class="flex items-center gap-2">
        <!-- Search Input -->
        <div
          class="flex h-9 items-center justify-between rounded-[39.71px] border border-[#e2e2e2] py-2 pl-4 pr-3"
        >
          <input
            type="text"
            placeholder="Search Contributors"
            class="border-none text-center font-['Inter'] text-[13px] font-normal leading-tight tracking-tight text-[#a0a0a0]"
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

        <!-- Filter Button & Dropdown -->
        <div class="relative flex items-center gap-2">
          <!-- Filter Button -->
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

          <!-- Filter Dropdown -->
          {#if showDropdown}
            <div
              class="absolute right-0 top-full z-50 w-56 flex-col gap-2 rounded-xl border border-[#e2e2e2] bg-white p-3 shadow-lg"
            >
              <!-- No. of Commits -->
              <div class="flex flex-col gap-1">
                <span class="text-[11px] font-normal text-[#a0a0a0]">No. of commits</span>
                <div class="flex gap-1">
                  <input
                    type="number"
                    placeholder="Min"
                    class="h-9 w-full rounded-[39.71px] border border-[#dbdbdb] py-2 pl-3 text-[13px] leading-tight text-[#a0a0a0]"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    class="h-9 w-full rounded-[39.71px] border border-[#dbdbdb] py-2 pl-3 text-[13px] leading-tight text-[#a0a0a0]"
                  />
                </div>
              </div>

              <!-- Date Range -->
              <div class="flex flex-col gap-1">
                <span class="text-[11px] font-normal text-[#a0a0a0]">Date Range</span>
                <div class="flex gap-1">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    class="h-9 w-full rounded-[39.71px] border border-[#e2e2e2] py-2 pl-3 text-[13px] leading-tight text-[#a0a0a0]"
                  />
                  <input
                    type="text"
                    placeholder="MM/YY"
                    class="h-9 w-full rounded-[39.71px] border border-[#e2e2e2] py-2 pl-3 text-[13px] leading-tight text-[#a0a0a0]"
                  />
                </div>
              </div>
            </div>
          {/if}
        </div>
      </div>
    </div>

    <div class="grid items-start w-full grid-cols-2 gap-4 mt-5 max-md:max-w-full">
      {#each contributors as contributor}
        <GitContributors {...contributor} />
      {/each}
    </div>
  </div>
</div>
