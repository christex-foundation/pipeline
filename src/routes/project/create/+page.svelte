<script>
  import ProjectBasics from '$lib/ProjectBasics.svelte';
  import { projectStore } from '$stores/projectStore.js';
  import { get } from 'svelte/store';
  import LinkInput from '$lib/LinkInput.svelte';
  import UserNav from '$lib/UserNav.svelte';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  let loading = false;

  let activeNavItem = 'Basics';

  const navItems = [
    { id: 'Basics', label: 'Basics', width: '184px' },
    { id: 'Links', label: 'Links', width: '184px' },
    { id: 'Funding', label: 'Funding', width: '184px' },
  ];

  function handleNavChange(event) {
    activeNavItem = event.detail;
  }

  function navigateToPrevious() {
    const currentIndex = navItems.findIndex((item) => item.id === activeNavItem);
    if (currentIndex > 0) {
      activeNavItem = navItems[currentIndex - 1].id;
    }
  }

  function navigateToNext() {
    const currentIndex = navItems.findIndex((item) => item.id === activeNavItem);
    if (currentIndex < navItems.length - 1) {
      activeNavItem = navItems[currentIndex + 1].id;
    }
  }

  const saveProject = async (event) => {
    try {
      loading = true;

      const projectData = get(projectStore);

      const response = await fetch('/api/projects/store', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });

      const result = await response.json();

      if (response.ok) {
        alert('Project created successfully!');
        goto('/profile');
      } else {
        alert(`Project creation error: ${result.error}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    } finally {
      loading = false;
    }
  };

  let funding_goal = get(projectStore).funding_goal;
  let bank_acct = get(projectStore).bank_acct;
  let wallet_address = get(projectStore).wallet_address;
  let email = get(projectStore).email;
  let portfolio = get(projectStore).portfolio;
  let github = get(projectStore).github;
  let linkedin = get(projectStore).linkedin;
  let twitter = get(projectStore).twitter;
  let website = get(projectStore).website;
  let other = get(projectStore).other;

  function updateStore() {
    projectStore.update((data) => {
      data.email = email;
      data.portfolio = portfolio;
      data.github = github;
      data.linkedin = linkedin;
      data.twitter = twitter;
      data.website = website;
      data.other = other;
      data.funding_goal = funding_goal;
      data.bank_acct = bank_acct;
      data.wallet_address = wallet_address;
      return data;
    });
  }

  let imageLoaded = false;

  onMount(() => {
    const img = new Image();
    img.src =
      'https://cdn.builder.io/api/v1/image/assets/TEMP/e31ab375db047d220f54398e16c4cc0f0001d612779f0974e0d8c39c0fea9107?placeholderIfAbsent=true&apiKey=567aaefef2da4f73a3149c6bc21f1ea8';
    img.onload = () => {
      imageLoaded = true;
    };
  });
</script>

<div class="w-full bg-[#d1ea9a]/90 py-16">
  <div class="max-w-4xl mx-auto text-center">
    <h1 class="text-[#08292c] text-[45.43px] font-semibold font-['Inter'] leading-[54.51px]">
      Let's Build The Future Together
    </h1>
  </div>
</div>

<div
  class="relative flex flex-col items-left justify-left gap-2 p-4 text-left text-black min-h-[217px] ml-[365px]"
>
  <h1 class="text-4xl font-semibold leading-[99px] max-md:text-4xl max-md:leading-[49px]">
    Create a Project
  </h1>
</div>

<main
  class="flex flex-col justify-center items-center px-10 py-5 mt-5 bg-white rounded-[37px] max-md:px-5 max-md:mt-10"
>
  <UserNav {navItems} bind:activeItem={activeNavItem} on:navChange={handleNavChange} />

  <section class="flex overflow-hidden flex-col items-center mt-5 max-w-full w-[80%] max-md:mt-10">
    {#if activeNavItem === 'Basics'}
      <ProjectBasics />
    {:else if activeNavItem === 'Links'}
      <section
        class="flex flex-col justify-center mt-14 w-full text-3xl font-semibold max-w-[1038px] max-md:mt-10 max-md:max-w-full"
      >
        <form>
          <LinkInput label="Email" bind:value={email} on:change={updateStore} />
          <LinkInput label="Portfolio" bind:value={portfolio} on:change={updateStore} />
          <LinkInput label="Github" bind:value={github} on:change={updateStore} />
          <LinkInput label="LinkedIn" bind:value={linkedin} on:change={updateStore} />
          <LinkInput label="X" bind:value={twitter} on:change={updateStore} />
          <LinkInput label="Website" bind:value={website} on:change={updateStore} />
          <LinkInput label="Others" bind:value={other} on:change={updateStore} />
        </form>
      </section>
    {:else if activeNavItem === 'Funding'}
      <section class="w-full max-w-[1038px] mx-auto mt-10 text-black">
        <div class="flex flex-col mb-10">
          <h2 class="mb-6 text-2xl font-semibold">Payout Method</h2>

          <div class="flex items-center">
            <label for="fundingGoal" class="w-1/3 text-lg font-semibold">Funding Goal</label>
            <input
              id="fundingGoal"
              bind:value={funding_goal}
              on:change={updateStore}
              type="number"
              class="w-full border-2 border-lime-800 min-h-[70px] rounded-[75px] mt-2.5 px-4"
              aria-label="Funding Goal"
            />
          </div>

          <hr class="my-8 border-neutral-300" />

          <div class="flex items-center mt-10 mb-6">
            <label for="bankAccount" class="w-1/3 text-lg font-medium">Bank Account</label>
            <input
              id="bankAccount"
              bind:value={bank_acct}
              on:change={updateStore}
              type="text"
              class="w-full border-2 border-lime-800 min-h-[70px] rounded-[75px] mt-2.5 px-4"
              aria-label="Bank Account"
            />
          </div>

          <div class="flex items-center justify-center my-4 text-neutral-400">
            <hr class="flex-grow border-t-2 border-neutral-300" />
            <span class="px-4 text-lg font-medium">or</span>
            <hr class="flex-grow border-t-2 border-neutral-300" />
          </div>

          <div class="flex items-center mt-6">
            <label for="walletAddress" class="w-1/3 text-lg font-medium">Wallet Address</label>
            <input
              id="walletAddress"
              bind:value={wallet_address}
              on:change={updateStore}
              type="text"
              class="w-full border-2 border-lime-800 min-h-[70px] rounded-[75px] mt-2.5 px-4"
              aria-label="Wallet Address"
            />
          </div>
        </div>
      </section>
    {/if}

    <div class="flex justify-between w-full max-w-[1038px] mt-10">
      {#if activeNavItem !== 'Basics'}
        <button
          on:click={navigateToPrevious}
          class="px-[112px] py-4 text-xl font-medium text-lime-800 bg-white border-2 border-lime-800 rounded-[82px] max-md:px-5"
        >
          Previous
        </button>
      {:else}
        <div></div>
      {/if}

      {#if activeNavItem !== 'Funding'}
        <button
          on:click={navigateToNext}
          class="px-[112px] py-4 text-xl font-medium text-lime-100 bg-lime-800 rounded-[82px] max-md:px-5"
        >
          Next
        </button>
      {:else}
        <button
          on:click={saveProject}
          class="px-[112px] py-4 text-xl font-medium text-lime-100 bg-lime-800 rounded-[82px] max-md:px-5"
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
        <!-- <form method="POST" action="?/createProject">
          <input type="hidden" name="projectData" value={JSON.stringify(get(projectStore))} />
          <button
            on:click={saveProject}
            class="px-[112px] py-4 text-xl font-medium text-lime-100 bg-lime-800 rounded-[82px] max-md:px-5"
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
          </form> -->
      {/if}
    </div>
  </section>
</main>
