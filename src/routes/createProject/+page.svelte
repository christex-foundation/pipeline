<script>
  import Nav from '../../lib/Nav.svelte';   
  import Footer from '../../lib/Footer.svelte';
  import ProjectBasics from '../../lib/ProjectBasics.svelte';
  import TeamForm from '../../lib/TeamForm.svelte';
  import { projectStore } from '../../stores/projectStore.js';
  import CreatorProfile from '../../lib/CreatorProfile.svelte';
  import { get } from 'svelte/store';
  import LinkInput from '../../lib/LinkInput.svelte';
  import UserNav from '../../lib/UserNav.svelte';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation'; 

  let loading = false;

  let activeNavItem = 'Basics';
  const navItems = [
    { id: 'Basics', label: 'Basics', width: '184px' },
    { id: 'Team', label: 'Team', width: '184px' },
    { id: 'Links', label: 'Links', width: '184px' },
    { id: 'Funding', label: 'Funding', width: '184px' }
  ];

  function handleNavChange(event) {
    activeNavItem = event.detail;
  }

  function navigateToPrevious() {
    const currentIndex = navItems.findIndex(item => item.id === activeNavItem);
    if (currentIndex > 0) {
      activeNavItem = navItems[currentIndex - 1].id;
    }
  }

  function navigateToNext() {
    const currentIndex = navItems.findIndex(item => item.id === activeNavItem);
    if (currentIndex < navItems.length - 1) {
      activeNavItem = navItems[currentIndex + 1].id;
    }
  }

  


  function sendInvitation() {
    console.log('Sending invitation...');
  }

  const saveProject = async (event) => {
    try {
      loading = true

      const projectData = get(projectStore);

      const response = await fetch('/api/projects/store', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(
            projectData
          )
        })

        const result = await response.json()

        if (response.ok) {
          alert('Project created successfully!');
          goto('/profile');
        } else {
          alert(`Project creation error: ${result.error}`);
        }

    } catch (error) {
      if (error instanceof Error) {
          alert(error.message)
        }
    }finally{
      loading = false
    }
  }

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
    projectStore.update(data => {
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
    img.src = "https://cdn.builder.io/api/v1/image/assets/TEMP/e31ab375db047d220f54398e16c4cc0f0001d612779f0974e0d8c39c0fea9107?placeholderIfAbsent=true&apiKey=567aaefef2da4f73a3149c6bc21f1ea8";
    img.onload = () => {
      imageLoaded = true;
    };
  });
</script>

<div class="w-full min-h-screen bg-white">
  <Nav />
    
  <section class="relative min-h-[417px] w-full">
    {#if imageLoaded}
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/e31ab375db047d220f54398e16c4cc0f0001d612779f0974e0d8c39c0fea9107?placeholderIfAbsent=true&apiKey=567aaefef2da4f73a3149c6bc21f1ea8"
        alt=""
        class="absolute inset-0 object-cover w-full h-full"
        aria-hidden="true"
      />
    {/if}
  </section>
  <div class="relative flex flex-col items-center justify-center gap-2 p-4 text-center text-black min-h-[217px]">
    <h1 class="text-8xl font-semibold leading-[99px] max-md:text-4xl max-md:leading-[49px]">
      Create a Project
    </h1>
  </div>

  <main class="flex flex-col justify-center items-center px-10 py-5 mt-5 bg-white rounded-[37px] max-md:px-5 max-md:mt-10 ">
    <UserNav {navItems} bind:activeItem={activeNavItem} on:navChange={handleNavChange} />
    
    <section class="flex overflow-hidden flex-col items-center mt-5 max-w-full w-[80%] max-md:mt-10">
      {#if activeNavItem === 'Basics'}
        <ProjectBasics />
      {:else if activeNavItem === 'Team'}
        <TeamForm />
      {:else if activeNavItem === 'Links'}
        <section class="flex flex-col justify-center mt-14 w-full text-3xl font-semibold max-w-[1038px] max-md:mt-10 max-md:max-w-full">
          <form>
            <LinkInput label="Email" bind:value={email} />
            <LinkInput label="Portfolio" bind:value={portfolio} />
            <LinkInput label="Github" bind:value={github} />
            <LinkInput label="LinkedIn" bind:value={linkedin} />
            <LinkInput label="X" bind:value={twitter} /> 
            <LinkInput label="Website" bind:value={website} />
            <LinkInput label="Others" bind:value={other} />
          </form>
        </section>
      {:else if activeNavItem === 'Funding'}
        <section class="flex flex-col justify-center w-[80%] ml-20 text-3xl font-semibold mt-14 max-md:mt-10 max-md:max-w-full">
          <form class="flex flex-col w-full max-md:max-w-full">
            <div class="flex flex-col w-full mt-11 max-md:mt-10 max-md:max-w-full">
              <label for="funding goal" class="max-md:max-w-full">Funding Goal</label>
              <input
                id="bankAccount"
                bind:value={funding_goal}
                on:change={updateStore}
                type="number"
                class="flex gap-2 mt-5 w-full border border-black border-solid min-h-[80px] rounded-[52px] max-md:max-w-full px-8"
                aria-label="Funding Goal"
              />
            </div>
            
            <div class="flex flex-col w-full mt-11 max-md:mt-10 max-md:max-w-full">
              <label for="bankAccount" class="max-md:max-w-full">Bank Account</label>
              <input
                id="bankAccount"
                bind:value={bank_acct}
                on:change={updateStore}
                type="text"
                class="flex gap-2 mt-5 w-full border border-black border-solid min-h-[80px] rounded-[52px] max-md:max-w-full px-8"
                aria-label="Bank Account"
              />
            </div>
            
            <div class="flex flex-wrap gap-3.5 justify-center items-center mt-11 w-full text-4xl leading-none whitespace-nowrap text-neutral-400 max-md:mt-10 max-md:max-w-full">
              <hr class="shrink-0 self-stretch my-auto h-0.5 border-2 border-solid border-zinc-300 w-[165px]" />
              <span class="self-stretch my-auto">or</span>
              <hr class="shrink-0 self-stretch my-auto h-0.5 border-2 border-solid border-zinc-300 w-[165px]" />
            </div>

            <div class="flex flex-col w-full mt-11 max-md:mt-10 max-md:max-w-full">
              <label for="walletAddress" class="max-md:max-w-full">Wallet Address</label>
              <input
                id="walletAddress"
                bind:value={wallet_address}
                on:change={updateStore}
                type="text"
                class="flex gap-2 mt-5 w-full border border-black border-solid min-h-[80px] rounded-[52px] max-md:max-w-full px-8"
                aria-label="Wallet Address"
              />
            </div>
          </form>
        </section>
      {/if}

      <div class="flex justify-between w-full mt-10">
        {#if activeNavItem !== 'Basics'}
          <button
            on:click={navigateToPrevious}
            class="px-[112px] py-8 text-2xl font-medium text-lime-800 bg-white border-2 border-lime-800 rounded-[82px] max-md:px-5"
          >
            Previous
          </button>
        {:else}
          <div></div>
        {/if}
        
        {#if activeNavItem !== 'Funding'}
          <button
            on:click={navigateToNext}
            class="px-[112px] py-8 text-2xl font-medium text-lime-100 bg-lime-800 rounded-[82px] max-md:px-5"
          >
            Next
          </button>
        {:else}
          <button
            on:click={saveProject}
            class="px-[112px] py-8 text-xl font-medium text-lime-100 bg-lime-800 rounded-[82px] max-md:px-5"
          >
          {loading ? 'Saving...' : 'Save'}
          </button>
        {/if}
      </div>
    </section>
  </main>

  <Footer />
</div>