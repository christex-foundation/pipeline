<script>
  import Nav from "../../../../lib/Nav.svelte";
  import Footer from "../../../../lib/Footer.svelte";
  import ProjectBasics from "../../../../lib/ProjectBasics.svelte";
  import TeamForm from "../../../../lib/TeamForm.svelte";
  import { projectStore } from "../../../../stores/projectStore.js";
  import CreatorProfile from "../../../../lib/CreatorProfile.svelte";
  import { get } from "svelte/store";
  import { page } from "$app/stores";
  import LinkInput from "../../../../lib/LinkInput.svelte";
  import UserNav from "../../../../lib/UserNav.svelte";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";

  let id;
  $: id = $page.params.id;

  let loading = false;
  let project = {};

  let activeNavItem = "Basics";
  export let data;

  const navItems = [
    { id: "Basics", label: "Basics", width: "184px" },
    { id: "Links", label: "Links", width: "184px" },
    { id: "Funding", label: "Funding", width: "184px" },
  ];

  let funding_goal,
    bank_acct,
    wallet_address,
    email,
    portfolio,
    github,
    linkedin,
    twitter,
    website,
    other;

  function handleNavChange(event) {
    activeNavItem = event.detail;
  }

  function navigateToPrevious() {
    const currentIndex = navItems.findIndex(
      (item) => item.id === activeNavItem
    );
    if (currentIndex > 0) {
      activeNavItem = navItems[currentIndex - 1].id;
    }
  }

  function navigateToNext() {
    const currentIndex = navItems.findIndex(
      (item) => item.id === activeNavItem
    );
    if (currentIndex < navItems.length - 1) {
      activeNavItem = navItems[currentIndex + 1].id;
    }
  }

  async function getSingleProject() {
    try {
      loading = true;
      const response = await fetch(`/api/projects/singleProject/${id}`);
      if (!response.ok) throw new Error(response.statusText);

      const { project: fetchedProject } = await response.json();
      console.log(fetchedProject);
      projectStore.set(fetchedProject); // Initialize projectStore with data

      // Destructure to set local variables for form bindings
      ({
        funding_goal,
        bank_acct,
        wallet_address,
        email,
        portfolio,
        github,
        linkedin,
        twitter,
        website,
        other,
      } = fetchedProject);
    } catch (error) {
      alert(`Error loading project: ${error.message}`);
    } finally {
      loading = false;
    }
  }

  function updateStore() {
    projectStore.update((project) => ({
      ...project,
      funding_goal,
      bank_acct,
      wallet_address,
      email,
      portfolio,
      github,
      linkedin,
      twitter,
      website,
      other,
    }));
  }

  const updateProject = async (event) => {
    try {
      loading = true;

      const projectData = get(projectStore);

      const response = await fetch("/api/projects/store", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projectData),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Project updated successfully!");
        goto("/profile");
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

  let imageLoaded = false;

  onMount(async () => {
    getSingleProject();
    const img = new Image();
    img.src =
      "https://cdn.builder.io/api/v1/image/assets/TEMP/e31ab375db047d220f54398e16c4cc0f0001d612779f0974e0d8c39c0fea9107?placeholderIfAbsent=true&apiKey=567aaefef2da4f73a3149c6bc21f1ea8";
    img.onload = () => {
      imageLoaded = true;
    };
  });
</script>

<div class="w-full bg-[#d1ea9a]/90 py-16">
  <div class="max-w-4xl mx-auto text-center">
    <h1
      class="text-[#08292c] text-[45.43px] font-semibold font-['PP Mori'] leading-[54.51px]"
    >
      Let's Build The Future Together
    </h1>
  </div>
</div>

<div
  class="relative flex flex-col items-left justify-left gap-2 p-4 text-left text-black min-h-[217px] ml-[290px]"
>
  <h1
    class="text-4xl font-semibold leading-[99px] max-md:text-4xl max-md:leading-[49px]"
  >
    Edit Project -
  </h1>
</div>

<main
  class="flex flex-col justify-center items-center px-10 py-5 mt-5 bg-white rounded-[37px] max-md:px-5 max-md:mt-10"
>
  <UserNav
    {navItems}
    bind:activeItem={activeNavItem}
    on:navChange={handleNavChange}
  />

  <section
    class="flex overflow-hidden flex-col items-center mt-5 max-w-full w-[80%] max-md:mt-10"
  >
    {#if activeNavItem === "Basics"}
      <ProjectBasics />
    {:else if activeNavItem === "Links"}
      <section
        class="flex flex-col justify-center mt-14 w-full text-3xl font-semibold max-w-[1038px] max-md:mt-10 max-md:max-w-full"
      >
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
    {:else if activeNavItem === "Funding"}
      <section class="w-full max-w-[1038px] mx-auto mt-10 text-black">
        <div class="flex flex-col mb-10">
          <h2 class="mb-6 text-2xl font-semibold">Payout Method</h2>

          <div class="flex items-center">
            <label for="fundingGoal" class="w-1/3 text-lg font-semibold"
              >Funding Goal</label
            >
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
            <label for="bankAccount" class="w-1/3 text-lg font-medium"
              >Bank Account</label
            >
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
            <label for="walletAddress" class="w-1/3 text-lg font-medium"
              >Wallet Address</label
            >
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
      {#if activeNavItem !== "Basics"}
        <button
          on:click={navigateToPrevious}
          class="px-[112px] py-4 text-xl font-medium text-lime-800 bg-white border-2 border-lime-800 rounded-[82px] max-md:px-5"
        >
          Previous
        </button>
      {:else}
        <div></div>
      {/if}

      {#if activeNavItem !== "Funding"}
        <button
          on:click={navigateToNext}
          class="px-[112px] py-4 text-xl font-medium text-lime-100 bg-lime-800 rounded-[82px] max-md:px-5"
        >
          Next
        </button>
      {:else}
        <button
          on:click={updateProject}
          class="px-[112px] py-4 text-xl font-medium text-lime-100 bg-lime-800 rounded-[82px] max-md:px-5"
        >
          {loading ? "Updating..." : "Update"}
        </button>
      {/if}
    </div>
  </section>
</main>
