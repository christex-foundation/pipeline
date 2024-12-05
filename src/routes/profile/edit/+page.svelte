<script>
  import ProfileForm from '../../../lib/ProfileForm.svelte';
  import ProfileLinks from '../../../lib/ProfileLinks.svelte';
  import Settings from '../../../lib/Settings.svelte';
  import Interests from '../../../lib/Interests.svelte';
  let selectedTechInterests = [];
  let selectedCreativeInterests = [];
  let selectedCommunityProjects = [];

  let activeNavItem = 'Profile';
  const navItems = [
    {
      id: 'Profile',
      label: 'Profile',
      width: '184px',
      icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/00eacd2e9203d40d579eb83c6c31b8c06134308627c218c88c9580bed4d5d7ef',
    },
    {
      id: 'Links',
      label: 'Links',
      width: '184px',
      icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/ff10f4c0c448ee5208fc4e0b90f38cc53d69a7eda9bd7dc84eb1e7c779e81c4b',
    },
    {
      id: 'Interests',
      label: 'Interests',
      width: '184px',
      icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/09ba2f33466a78bf2d1e32dc9330bb0cc72747f64701080ac91f542e8459d18f',
    },
    {
      id: 'Settings',
      label: 'Settings',
      width: '184px',
      icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/2ecfa6fbb29ac713eea63adc3b16821ea9f1a98b868badda74b6497e863f76db',
    },
  ];

  let techInterests = [
    'Education',
    'Food & Beverages',
    'Energy / Green tech',
    'Health / Fitness',
    'Tech Startups',
    'Artificial Intelligence & Machine Learning',
    'Robotics',
    'Blockchain & Cryptocurrencies',
    'Cybersecurity',
    'Augmented Reality (AR) & Virtual Reality (VR)',
  ];

  let creativeInterests = [
    'Graphic Design',
    'Photography',
    'Video Production',
    'Music Production',
    'Writing & Storytelling',
    'Digital Art',
    'Fashion Design',
    'Creative Coding',
    'Animation',
    'User Experience (UX) Design',
  ];

  let communityProjects = [
    'Social Impact Initiatives',
    'Environmental Sustainability',
    'Education',
    'Local Development',
    'Health and Wellness',
    'Public Art Projects',
    'Crisis Response',
    'Civic Engagement',
    'Cultural Events',
  ];

  function handleNavChange(event) {
    activeNavItem = event.detail;
  }
</script>

<main
  class="mb-5 flex flex-col items-center justify-center rounded-[37px] bg-white px-10 py-5 max-md:mt-10 max-md:px-5"
>
  <section
    class="mb-10 mt-20 flex w-full max-w-[1080px] flex-wrap justify-between gap-5 self-center max-md:mt-10 max-md:max-w-full"
  >
    <h1 class="ml-[11%] text-4xl font-semibold leading-none text-black max-md:text-4xl">
      Username
    </h1>
    <a
      href="/profile"
      class="mr-10 flex items-center justify-center gap-2.5 self-start rounded-[50px] border-2 border-solid border-lime-800 bg-lime-200 px-6 py-3.5 text-xl leading-none text-lime-800 max-md:px-5"
    >
      <img
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/64135a94b56ce48af9a1c4223db4ad995409393478b6a070980d63978b32c01e"
        alt=""
        class="my-auto aspect-square w-6 shrink-0 self-stretch object-contain"
      />
      <span class="my-auto self-stretch">View Profile</span>
    </a>
  </section>

  <section class="mb-12 w-full">
    <div
      class="mt-5 flex items-center justify-center space-x-24 rounded-[37px] bg-white px-10 py-5 max-md:mt-10 max-md:px-5"
    >
      {#each navItems as navItem}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div
          class="pb-02 mx-2 flex cursor-pointer items-center justify-center self-center transition-all duration-300 ease-in-out"
          class:selected={activeNavItem === navItem.id}
          class:border-b-4={activeNavItem === navItem.id}
          on:click={() => (activeNavItem = navItem.id)}
          style="min-width: 134px; border-color: #d1ea9a"
        >
          <img src={navItem.icon} alt={navItem.label} class="h-6 w-6" />
          <span class="text-center text-2xl">
            {navItem.label}
          </span>
        </div>
      {/each}
    </div>
  </section>

  <section class="mt-5 flex w-[82%] max-w-full flex-col items-center overflow-hidden max-md:mt-10">
    {#if activeNavItem === 'Profile'}
      <ProfileForm />
    {:else if activeNavItem === 'Links'}
      <ProfileLinks />
    {:else if activeNavItem === 'Interests'}
      <div class="w-[80%]">
        <h2 class="mb-4 text-xl text-black">Select 3 or more to continue</h2>

        <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-1">
          <div class="interests-section">
            <Interests
              title="Tech & Innovation"
              interests={techInterests}
              bind:selectedInterests={selectedTechInterests}
            />
          </div>

          <div class="interests-section">
            <Interests
              title="Creative Works"
              interests={creativeInterests}
              bind:selectedInterests={selectedCreativeInterests}
            />
          </div>

          <div class="interests-section">
            <Interests
              title="Community Projects"
              interests={communityProjects}
              bind:selectedInterests={selectedCommunityProjects}
              layout="grid"
            />
          </div>
        </div>
      </div>
      <button
        type="submit"
        class="ml-[10%] mt-8 self-end rounded-[127.56px] bg-[#516027] px-[29.89px] py-6 font-['Inter'] text-xl font-medium leading-[32.91px] text-[#ebebeb]"
      >
        save & continue
      </button>
    {:else if activeNavItem === 'Settings'}
      <Settings />
    {/if}
  </section>
</main>

<style>
  div.selected {
    transform: scale(1.1);
    font-weight: bold;
  }
</style>
